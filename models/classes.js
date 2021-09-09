const { Sequelize, DataTypes } = require("sequelize");

const sequelize = require("../db/sequelize");

const Classes = sequelize.define(
  "Classes",
  {
    class_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    class_name: {
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
    tableName: "class_master",
  }
);

Classes.sync().then(() => {});

module.exports = Classes;
