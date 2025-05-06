const { DataTypes } = require("sequelize");
const { v4: uuidv4 } = require("uuid");

module.exports = (sequelize) => {
    const JobResult = sequelize.define(
        "scraping_job_results",
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: uuidv4,
                primaryKey: true,
            },
            result: {
                type: DataTypes.JSON, // ou JSON
                allowNull: false,
            },
        },
        {
            tableName: "scraping_job_results",
            timestamps: true, // createdAt et updatedAt
        }
    );

    JobResult.associate = (models) => {
        JobResult.belongsTo(models.scraping_jobs, {
            foreignKey: "id", // identique à la PK
            as: "scraping_job",
            onDelete: "CASCADE",
        });
    };

    return JobResult;
};
