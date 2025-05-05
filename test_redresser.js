const fs = require("fs");
const path = require("path");
const iconv = require("iconv-lite");
const csvWriter = require("csv-writer").createObjectCsvWriter;

const inputFile = path.join(__dirname, "contact766.txt");
const outputFile = path.join(__dirname, "contact766.csv");

// Préparation du writer CSV
const writer = csvWriter({
    path: outputFile,
    header: [
        { id: "nom", title: "nom" },
        { id: "valeur", title: "valeur du bien" },
        { id: "type", title: "type de bien" },
        { id: "lieu", title: "lieu" },
        { id: "tel", title: "telephone" },
        { id: "email", title: "email" },
    ],
});

// Lecture du fichier avec gestion de l'encodage correct
const buffer = fs.readFileSync(inputFile);
const content = iconv.decode(buffer, "latin1");

// Séparation ligne par ligne (filtrage des vides)
const lines = content
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

const results = [];
for (let i = 0; i < lines.length; i += 6) {
    const nom = lines[i] || "";
    const valeur = lines[i + 1]?.replace(/[^\d]/g, "") || "";
    const type = lines[i + 2]?.replace(/^Type\s*:\s*/i, "").trim() || "";
    const lieu = lines[i + 3]?.replace(/^Lieu\s*:\s*/i, "").trim() || "";
    const tel = lines[i + 4]?.replace(/^Tel\s*:\s*/i, "").trim() || "";
    const email = lines[i + 5]?.replace(/^Email\s*:\s*/i, "").trim() || "";

    results.push({ nom, valeur, type, lieu, tel, email });
}

// Écriture du fichier CSV
writer
    .writeRecords(results)
    .then(() => console.log("✅ contact766.csv généré avec succès"))
    .catch((err) => console.error("❌ Erreur lors de l’écriture :", err));
