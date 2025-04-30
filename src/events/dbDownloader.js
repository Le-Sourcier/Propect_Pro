const cron = require("node-cron");
const { exec } = require("child_process");
const path = require("path");
const fs = require("fs");
const config = require("./../config");

const BACKUP_DIR = path.join(__dirname, "../backups");

if (!fs.existsSync(BACKUP_DIR)) {
  fs.mkdirSync(BACKUP_DIR);
}

const DB_NAME = config.database;
const DB_USER = config.username;
const DB_PASSWORD = config.password;
const DB_HOST = config.host; // ou IP serveur
const DB_PORT = 5432;

cron.schedule("*/1 * * * *", () => {
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const backupFile = path.join(BACKUP_DIR, `backup_${timestamp}.sql`);

  // Injecte le mot de passe temporairement pour pg_dump
  const cmd = `PGPASSWORD=${DB_PASSWORD} pg_dump -U ${DB_USER} -h ${DB_HOST} -p ${DB_PORT} -F p ${DB_NAME} > ${backupFile}`;

  console.log(`📦 Lancement du backup PostgreSQL: ${backupFile}`);

  exec(cmd, (err, stdout, stderr) => {
    if (err) {
      console.error("❌ Erreur durant le backup:", err.message);
    } else {
      console.log(`✅ Backup PostgreSQL terminé avec succès: ${backupFile}`);
    }
  });
});
