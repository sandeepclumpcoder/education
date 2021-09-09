const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../db/sequelize");

const Students = sequelize.define(
  "Parents",
  {
    parent_id : {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
    first_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    last_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    name: {
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
    is_active: {
      type: DataTypes.INTEGER,
      allowNull: true,
      default: 1,
    },
  },
  {
    tableName: "parent_master",
  }
);

Students.sync().then(() => {});

module.exports = Students;
