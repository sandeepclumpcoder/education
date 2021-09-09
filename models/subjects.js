const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../db/sequelize");

const Subjects = sequelize.define(
  "Subjects",
  {
    subject_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    subject_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    img_url: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    is_active: {
      type: DataTypes.INTEGER,
      allowNull: false,
      default: 1,
    },
  },
  {
    tableName: "subject_master",
  }
);

Subjects.sync().then(() => {});

module.exports = Subjects;
