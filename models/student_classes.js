const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../db/sequelize");

const StudentClasses = sequelize.define(
  "StudentClasses",
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    student_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    class_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    is_active: {
      type: DataTypes.INTEGER,
      allowNull: false,
      default: 1,
      defaultValue: 1,
    },
  },
  {
    tableName: "student_class_master",
  }
);
/*StudentsClasses.addHook("beforeSave", async (user) => {
  if (user.changed("password")) {
    user.password = await bcrypt.hash(user.password, 10);
  }
  return;
});*/
StudentClasses.sync().then(() => {});

module.exports = StudentClasses;
