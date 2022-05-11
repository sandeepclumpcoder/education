const { Sequelize } = require("sequelize");
const dotenv = require("dotenv");
dotenv.config({ path: `${__dirname}/../config.env` });

const sequelize = new Sequelize(
  "education",
  "root",
  "",
  {
    host: "localhost",
    dialect: "mysql",
    logging: false,
  }
);
sequelize
  .authenticate()
  .then((con) => {
    console.log("Database is connected now...");
  })
  .catch((err) => {
    console.log(err);
  });
module.exports = sequelize;
