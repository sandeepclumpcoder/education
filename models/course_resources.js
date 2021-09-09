const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../db/sequelize");

const CourseResources = sequelize.define(
  "SubjectsResources",
  {
    course_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    is_active: {
      type: DataTypes.INTEGER,
      allowNull: false,
      default: 1,
    },
    resource_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    tableName: "course_resource",
  }
);

CourseResources.sync().then(() => {});

module.exports = CourseResources;
