const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("./../db/sequelize");

const Courses = sequelize.define(
  "Courses",
  {
    course_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      default: 1,
    },
    title: {
      type: DataTypes.STRING,
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
    teacher_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    duration: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    class_type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    no_of_classes: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    class_fee_individual: {
      type: DataTypes.INTEGER,
      allowNull: false,
      default: 0,
      defaultValue: 0,
    },
    class_fee_group: {
      type: DataTypes.INTEGER,
      allowNull: false,
      default: 0,
      defaultValue: 0,
    },
    minimum_students: {
      type: DataTypes.INTEGER,
      allowNull: false,
      default: 1,
      defaultValue: 1,
    },
    start_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    is_approved: {
      type: DataTypes.INTEGER,
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
    tableName: "course_master",
  }
);

Courses.sync().then(() => {});

module.exports = Courses;
