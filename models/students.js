const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("./../db/sequelize");

const Students = sequelize.define(
  "Students",
  {
    student_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    first_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    last_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    profile_img: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    gender: {
      type: DataTypes.STRING,
      allowNull: false
    },
    contact: {
      type: DataTypes.STRING,
      allowNull: false
    },
    dob: { 
      type: DataTypes.STRING,
      allowNull: false
    },
    level: {
      type: DataTypes.STRING,
      allowNull: false
    },
    is_active: {
      type: DataTypes.INTEGER,
      allowNull: true,
      default: 1,
    },
  },
  {
    tableName: "student_master",
  }
);

Students.sync({}).then(() => { });

module.exports = Students;
