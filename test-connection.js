const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASS,
    {
        host: process.env.DB_HOST,
        dialect: "postgres",
        dialectOptions: {
            ssl: {
                require: false,
                rejectUnauthorized: false,
            },
        },
        logging: false,
    }
);

(async () => {
    try {
        await sequelize.authenticate();
        console.log("✅ Connexion à la DB OK");
    } catch (err) {
        console.error("❌ Erreur connexion DB :", err);
    } finally {
        await sequelize.close();
    }
})();
