const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../db/sequelize");

const TeacherLanguages = sequelize.define(
  "TeacherLanguages",
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
    language_id: {
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
    tableName: "teacher_language_master",
  }
);

TeacherLanguages.sync().then(() => {});

module.exports = TeacherLanguages;
