const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../db/sequelize");

const Languages = sequelize.define(
  "Languages",
  {
    language_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    language_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    language_short_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    is_active: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
  },
  {
    tableName: "language_master",
  }
);

Languages.sync().then(() => {});

module.exports = Languages;
