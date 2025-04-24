const { DataTypes } = require("sequelize");
const { v4: uuidv4 } = require("uuid");

module.exports = (sequelize) => {
  const ScrapingJobs = sequelize.define(
    "ScrapingJobs",
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
      max_results: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 10,
        validate: {
          min: 1,
          max: 1000,
        },
      },
      use_proxy: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      proxy_urls: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: true,
      },
    },
    {
      tableName: "ScrapingJobs",
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
