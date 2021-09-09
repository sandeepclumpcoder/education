const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../db/sequelize");

const TeacherSubjects = sequelize.define(
  "TeacherSubjects",
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    teacher_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    subject_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    experience: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    hr_rate: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    level: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "teacher_subject_master",
  }
);

TeacherSubjects.sync().then(() => {});

module.exports = TeacherSubjects;
