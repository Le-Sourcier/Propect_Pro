const db = require("./src/models");

(async () => {
    try {
        await db.sequelize.sync({ force: false });
        console.log("Database synced");
    } catch (error) {
        console.error("Error syncing database:", error);
    }
})();
