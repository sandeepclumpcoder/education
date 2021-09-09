const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../db/sequelize");

const Slots = sequelize.define(
  "Slots",
  {
    slot_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    slot: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    is_active: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
  },
  {
    tableName: "slot_master",
  }
);

Slots.sync().then(() => {});

module.exports = Slots;
