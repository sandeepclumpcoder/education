const { Sequelize } = require("sequelize");
const dotenv = require("dotenv");
dotenv.config({ path: `${__dirname}/../config.env` });

const sequelize = new Sequelize(
  process.env.DATABASE_NAME,
  process.env.DATABASE_USER,
  process.env.DATABASE_PASSWORD,
  {
    host: process.env.DATABASE_HOST,
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
