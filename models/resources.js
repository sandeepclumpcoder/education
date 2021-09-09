const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../db/sequelize");

const Resources = sequelize.define(
  "Resources",
  {
    resource_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    resource_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    resource_url: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    course_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    class_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    teacher_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    is_active: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
  },
  {
    tableName: "resource_master",
  }
);

Resources.sync();

module.exports = Resources;
