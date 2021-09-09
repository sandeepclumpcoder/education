const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../db/sequelize");

const Assignments = sequelize.define(
  "Assignments",
  {
    assignment_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    maximum_score: {
      type: DataTypes.STRING,
      defaultValue: 10,
    },
    instructions: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    upload_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    due_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    resource_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    course_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    teacher_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    is_active: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
    },
  },
  {
    tableName: "assignment_master",
  }
);

Assignments.sync();

module.exports = Assignments;
