const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../db/sequelize");

const Paintings = sequelize.define(
  "Paintings",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    painting_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    artist_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    date: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    time: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    rate: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    materials_required: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    description: {
      type: DataTypes.INTEGER,
      allowNull: true,
      default: 1,
    },
    terms_condition: {
      type: DataTypes.INTEGER,
      allowNull: true,
      default: 1,
    },
    image: {
      type: DataTypes.INTEGER,
      allowNull: true,
      default: 1,
    },
  },
  {
    tableName: "paintings",
  }
);

Paintings.sync().then(() => {});

module.exports = Paintings;
