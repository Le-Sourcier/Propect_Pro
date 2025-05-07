const cron = require("node-cron");
const { exec } = require("child_process");
const path = require("path");
const fs = require("fs");
const config = require("../config");

const BACKUP_DIR = path.join(__dirname, "../backups");

if (!fs.existsSync(BACKUP_DIR)) {
    fs.mkdirSync(BACKUP_DIR);
}

const DB_NAME = config.database;
const DB_USER = config.username;
const DB_PASSWORD = config.password;
const DB_HOST = config.host;
const DB_PORT = 5432;

// Fonction de suppression des fichiers plus vieux que 7 jours
const cleanupOldBackups = () => {
    const now = Date.now();
    const retentionPeriod = 7 * 24 * 60 * 60 * 1000; // 7 jours en millisecondes

    fs.readdirSync(BACKUP_DIR).forEach((file) => {
        const filePath = path.join(BACKUP_DIR, file);
        const stat = fs.statSync(filePath);

        if (now - stat.mtimeMs > retentionPeriod) {
            fs.unlink(filePath, (err) => {
                if (err) {
                    console.error(
                        `❌ Erreur suppression ${file}:`,
                        err.message
                    );
                } else {
                    console.log(`🗑️ Ancien backup supprimé: ${file}`);
                }
            });
        }
    });
};

// cron.schedule("*/1 * * * *", () => {
cron.schedule("0 0 * * *", () => {
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const backupFile = path.join(BACKUP_DIR, `backup_${timestamp}.sql`);

    const cmd = `PGPASSWORD=${DB_PASSWORD} pg_dump -U ${DB_USER} -h ${DB_HOST} -p ${DB_PORT} -F p ${DB_NAME} > ${backupFile}`;

    console.log(`📦 Lancement du backup PostgreSQL: ${backupFile}`);

    exec(cmd, (err, stdout, stderr) => {
        if (err) {
            console.error("❌ Erreur durant le backup:", err.message);
        } else {
            console.log(
                `✅ Backup PostgreSQL terminé avec succès: ${backupFile}`
            );
            cleanupOldBackups(); // Appelle la suppression après le backup
        }
    });
});
