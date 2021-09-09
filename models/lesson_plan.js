const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("./../db/sequelize");

const Lesson_Plan = sequelize.define(
  "Lesson_Plan",
  {
    course_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    plan_no: {
      type: DataTypes.INTEGER,
      allowNull: false,
      default: 1,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    is_active: {
      type: DataTypes.INTEGER,
      allowNull: false,
      default: 1,
      defaultValue: 1,
    },
  },
  {
    tableName: "lesson_plan_master",
  }
);

Lesson_Plan.sync().then(() => {});

module.exports = Lesson_Plan;
