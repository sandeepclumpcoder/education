const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../db/sequelize");
const bcrypt = require("bcryptjs");

const Teachers = sequelize.define(
  "Teachers",
  {
    teacher_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    honorific: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    mobile: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    dob: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    country_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    profile_img: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    experience: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    hr_rate: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    resume: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    video_url: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    why_join_us: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    is_active: {
      type: DataTypes.INTEGER,
      default: 1,
      defaultValue: 1,
    },
    is_verified: {
      type: DataTypes.INTEGER,
      default: 0,
      defaultValue: 0,
    },
    is_global: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      default: 0,
    },
    is_approved: {
      type: DataTypes.INTEGER,
      allowNull: false,
      default: 0,
      defaultValue: 0,
    },
    otp: {
      type: DataTypes.INTEGER,
      default: null,
    },
  },
  {
    tableName: "teacher_master",
  }
);

Teachers.sync();
Teachers.addHook("beforeSave", async (user) => {
  if (user.changed("password")) {
    user.password = await bcrypt.hash(user.password, 10);
  }
  return;
});

module.exports = Teachers;
