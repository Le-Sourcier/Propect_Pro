const fs = require("fs");
const path = require("path");
const cron = require("node-cron");
const { enrich_jobs: EnrichJobs } = require("../models");

const cleanupMappedFolder = async () => {
  const mappedDir = path.join(__dirname, "../uploads/mapped");

  if (!fs.existsSync(mappedDir)) return;

  const files = fs.readdirSync(mappedDir);

  for (const file of files) {
    const match = file.match(
      /([a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12})/
    );
    if (!match) continue;

    const fileId = match[1];

    const job = await EnrichJobs.findByPk(fileId);

    const shouldDelete = !job || job.status === "completed";

    if (shouldDelete) {
      const filePath = path.join(mappedDir, file);
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error(`❌ Erreur suppression ${file}:`, err.message);
        } else {
          console.log(`🗑️ Fichier supprimé: ${file}`);
        }
      });
    }
  }
};

// 🔁 Exécute tous les jours à minuit (modifiable)
cron.schedule("0 0 * * *", () => {
  // cron.schedule("*/1 * * * *", () => {
  console.log("🕛 Cron Job: Nettoyage des fichiers mapped...");
  cleanupMappedFolder();
});
