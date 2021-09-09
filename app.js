//requiring packages
const dotenv = require("dotenv");
const express = require("express");
const adminRouter = require("./routers/admin");
const studentRouter = require("./routers/students");
const teacherRouter = require("./routers/teachers");
const classRouter = require("./routers/classes");
const countryRouter = require("./routers/countries");
const languageRouter = require("./routers/languages");
const slotsRouter = require("./routers/slots");
const subjectRouter = require("./routers/subjects");
const resourceRouter = require("./routers/resources");
const webRouter = require("./routers/web");
const sendDetails = require("./routers/sendDetails");
const chatForum = require("./utils/chatForum");

const globalErrorHandler = require("./utils/globalErrorHandler");
//const cookieParser = require("cookie-parser");
//creating app
const app = express();

//setting path for env file
dotenv.config({ path: __dirname + "/config.env" });

var cors = require("cors");
const ChatForum = require("./models/chatForum");
app.use(cors());
app.options("*", cors());

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "PUT, GET, POST, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});
app.use(express.json());
//app.use(cookieParser());

app.use(adminRouter);
app.use(studentRouter);
app.use(teacherRouter);
app.use(classRouter);
app.use(countryRouter);
app.use(languageRouter);
app.use(slotsRouter);
app.use(subjectRouter);
app.use(resourceRouter);
app.use("/V1", webRouter);
app.use(sendDetails);
app.use(globalErrorHandler);

module.exports = app;
