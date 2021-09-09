const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../db/sequelize");

const TeacherCertifications = sequelize.define(
  "TeacherCertifications",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    teacher_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    certified_subject: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    grade: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    year_of_certification: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    certificate_img: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    is_active: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
    },
  },
  {
    tableName: "teacher_certifications",
  }
);

TeacherCertifications.sync().then(() => {});

module.exports = TeacherCertifications;
