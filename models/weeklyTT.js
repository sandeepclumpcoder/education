const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("./../db/sequelize");

const WeeklyTT = sequelize.define(
  "WeeklyTT",
  {
    course_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    day_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    slot_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    class_type: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    is_active: {
      type: DataTypes.INTEGER,
      allowNull: false,
      default: 1,
      defaultValue: 1,
    },
  },
  {
    tableName: "weekly_time_table",
  }
);

WeeklyTT.sync().then(() => {});

module.exports = WeeklyTT;
