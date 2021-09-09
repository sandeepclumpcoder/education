const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../db/sequelize");

const Day = sequelize.define(
  "Day",
  {
    day_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    day: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "classes_day",
  }
);

Day.sync().then(() => {});

module.exports = Day;
