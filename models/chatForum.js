const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("./../db/sequelize");

const ChatForum = sequelize.define(
  "ChatForum",
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    time: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    message: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    expireDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    tableName: "chat_forum_master",
  }
);

ChatForum.sync().then(() => {});

module.exports = ChatForum;
