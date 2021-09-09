const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../db/sequelize");

const TeacherAvailability = sequelize.define(
  "TeacherAvailability",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    teacher_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    slot_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    class_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    subject_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    available_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    day_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "teacher_availability",
  }
);

TeacherAvailability.sync().then(() => {});

module.exports = TeacherAvailability;
