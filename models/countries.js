const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../db/sequelize");

const Countries = sequelize.define(
  "Countries",
  {
    country_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    country_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    country_short_name: {
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
    tableName: "country_master",
  }
);

Countries.sync().then(() => {});

module.exports = Countries;
