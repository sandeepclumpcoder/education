const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../db/sequelize");

const Courses_Store = sequelize.define(
  "Courses_Store",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      default: 1,
    },
    course_id: {
      type: DataTypes.INTEGER,
      unique: true,
      allowNull: false,
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    teacher_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    image_url: {
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
    tableName: "courses_store_master",
  }
);

Courses_Store.sync().then(() => {});

module.exports = Courses_Store;
