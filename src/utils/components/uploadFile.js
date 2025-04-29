const path = require("path");
const fs = require("fs");
const { stringify } = require("csv-stringify/sync");
const { enrichCompany } = require("../utils/enrichment");
const csv = require("csv-parser");
const xlsx = require("xlsx");

function _parseFile(filePath, originalName = "") {
  return new Promise((resolve, reject) => {
    const ext = path.extname(originalName || filePath).toLowerCase();
    const rows = [];

    if (ext === ".csv") {
      fs.createReadStream(filePath)
        .pipe(csv())
        .on("data", (data) => {
          if (Object.keys(data).length > 0) rows.push(data);
        })
        .on("end", () => resolve(rows));
    } else if (ext === ".xlsx" || ext === ".xls") {
      const workbook = xlsx.readFile(filePath);
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = xlsx.utils.sheet_to_json(sheet);
      resolve(jsonData);
    } else {
      reject(new Error("Unsupported file format"));
    }
  });
}

module.exports = async function uploadFile(req, res) {
  const filePath = req.file.path;
  const originalName = req.file.originalname;
  const data = await _parseFile(filePath, originalName);

  const enrichedData = [];

  for (const row of data) {
    const enriched = await enrichCompany(row);
    enrichedData.push(enriched);
  }

  const csvOutput = stringify(enrichedData, { header: true });
  const outputFileName = `enriched_${Date.now()}.csv`;
  const outputPath = path.join(__dirname, "../enriched", outputFileName);

  fs.writeFileSync(outputPath, csvOutput);

  res.download(outputPath, outputFileName);
};
