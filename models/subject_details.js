const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../db/sequelize");

const SubjectsDetails = sequelize.define(
  "SubjectsDetails",
  {
    subject_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    class_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      default: 1,
    },
    is_active: {
      type: DataTypes.INTEGER,
      allowNull: false,
      default: 1,
    },
  },
  {
    tableName: "subject_details",
  }
);

Subjects.sync().then(() => {});

module.exports = SubjectsDetails;
