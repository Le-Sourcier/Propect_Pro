const { DataTypes } = require("sequelize");
const { v4: uuidv4 } = require("uuid");

module.exports = (sequelize) => {
    const ScrapingJobs = sequelize.define(
        "scraping_jobs",
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: uuidv4,
                primaryKey: true,
            },
            user_id: {
                type: DataTypes.UUID,
                allowNull: false,
                references: {
                    model: "Users",
                    key: "id",
                },
            },
            source: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            query: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    len: [1, 255],
                },
            },
            location: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            results: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 10,
            },
            limite: {
                type: DataTypes.INTEGER,
                allowNull: true,
                defaultValue: 0,
            },
            status: {
                type: DataTypes.ENUM(
                    "pending",
                    "running",
                    "completed",
                    "failed"
                ),
                allowNull: false,
                defaultValue: "pending",
            },
        },
        {
            tableName: "scraping_jobs",
            timestamps: true, // createdAt et updatedAt
        }
    );

    ScrapingJobs.associate = (models) => {
        ScrapingJobs.belongsTo(models.Users, {
            foreignKey: "user_id",
            as: "user",
            onDelete: "CASCADE",
        });
    };

    return ScrapingJobs;
};
