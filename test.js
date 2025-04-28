import express from "express";
import multer from "multer";
import csvParser from "csv-parser";
import fs from "fs";
import XLSX from "xlsx";
import axios from "axios";
import { Sequelize, Model } from "sequelize";
import dotenv from "dotenv";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

// Google Maps API helper
// temp: import.meta.env.VITE_GOOGLE_API_KEY;
// const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
const GOOGLE_API_KEY = "AIzaSyDDja3goRFzGC3AsUXM8ZB3ksYSmqvDDtA";

async function geocodeAddress(address) {
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
    address
  )}&key=${GOOGLE_API_KEY}`;
  const { data } = await axios.get(url);
  if (data.status === "OK") {
    const loc = data.results[0].geometry.location;
    return { lat: loc.lat, lng: loc.lng };
  }
  return null;
}

async function reverseGeocode(lat, lng) {
  const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${GOOGLE_API_KEY}`;
  const { data } = await axios.get(url);
  if (data.status === "OK") {
    return data.results[0].formatted_address;
  }
  return null;
}

async function enrichRow(row) {
  // Example: enrich missing phone via DB lookup by email
  //   if (!row.phone && row.email) {
  //     const user = await User.findOne({ where: { email: row.email } });
  //     if (user) row.phone = user.phone;
  //   }

  // Enrich geolocation if missing
  if (!row.lat || !row.lng) {
    if (row.address) {
      const coords = await geocodeAddress(row.address);
      if (coords) {
        row.lat = coords.lat;
        row.lng = coords.lng;
      }
    }
  }

  // Enrich address if missing but lat/lng present
  if (!row.address && row.lat && row.lng) {
    const address = await reverseGeocode(row.lat, row.lng);
    if (address) row.address = address;
  }

  return row;
}

// Route to upload and process file
router.post("/import", upload.single("file"), async (req, res) => {
  const file = req.file;
  const ext = file.originalname.split(".").pop().toLowerCase();

  let rows = [];

  // Parse CSV
  if (ext === "csv") {
    await new Promise((resolve, reject) => {
      fs.createReadStream(file.path)
        .pipe(csvParser())
        .on("data", (data) => rows.push(data))
        .on("end", () => resolve())
        .on("error", reject);
    });
  }
  // Parse XLSX
  else if (["xls", "xlsx"].includes(ext)) {
    const workbook = XLSX.readFile(file.path);
    const sheetName = workbook.SheetNames[0];
    rows = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
  } else {
    return res.status(400).send("Unsupported file type");
  }

  // Enrich rows sequentially (or with Promise.all for concurrency)
  for (let i = 0; i < rows.length; i++) {
    rows[i] = await enrichRow(rows[i]);
  }

  // Generate enriched workbook
  const newWorkbook = XLSX.utils.book_new();
  const newSheet = XLSX.utils.json_to_sheet(rows);
  XLSX.utils.book_append_sheet(newWorkbook, newSheet, "Enriched");

  const outputPath = `uploads/enriched_${Date.now()}.xlsx`;
  XLSX.writeFile(newWorkbook, outputPath);

  // Send file
  res.download(outputPath, "enriched.xlsx", (err) => {
    fs.unlinkSync(file.path);
    fs.unlinkSync(outputPath);
  });
});

export default router;
