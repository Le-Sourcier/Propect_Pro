const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const EnrichJob = sequelize.define(
    "enrich_jobs",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
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
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: [1, 255],
        },
      },
      sources: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: false,
      },
      records: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      enriched: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      link: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      status: {
        type: DataTypes.ENUM("in_progress", "queued", "completed", "failed"),
        allowNull: false,
        defaultValue: "in_progress",
      },
    },
    {
      tableName: "enrich_jobs",
      timestamps: true,
    }
  );

  EnrichJob.associate = (models) => {
    EnrichJob.belongsTo(models.Users, {
      foreignKey: "user_id",
      as: "user",
      onDelete: "CASCADE",
    });
  };

  return EnrichJob;
};
