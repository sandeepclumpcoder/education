const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../db/sequelize");

const TeacherClasses = sequelize.define(
  "TeacherClasses",
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    teacher_id: {
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
    is_active: {
      type: DataTypes.INTEGER,
      allowNull: false,
      default: 1,
      defaultValue: 1,
    },
  },
  {
    tableName: "teacher_class_master",
  }
);

TeacherClasses.sync().then(() => {});

module.exports = TeacherClasses;
