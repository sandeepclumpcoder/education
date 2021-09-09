const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../db/sequelize");

const Courses_Review = sequelize.define(
  "Courses_Review",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      default: 1,
    },
    course_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    student_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    review: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 0,
      default: 0,
    },
    is_active: {
      type: DataTypes.INTEGER,
      allowNull: false,
      default: 1,
      defaultValue: 1,
    },
  },
  {
    tableName: "courses_review_master",
  }
);

Courses_Review.sync().then(() => {});

module.exports = Courses_Review;
