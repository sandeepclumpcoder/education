const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const Students = require("../models/students");
const Teachers = require("../models/teachers");
const Admin = require("../models/admin");
const AppError = require("../utils/appError");

dotenv.config({ path: "./config.env" });

//protect function helps to verify the token and it insures user is logged in.
const protect = async (req, res, next) => {
  try {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    } //else if (req.cookie.jwt) token = req.cookie.jwt;
    if (!token) return next(new AppError(401, "Please login to get access"));

    const decoded = await jwt.verify(token, process.env.JWT_SECRET_KEY);
    let type = decoded.sign_obj.type;
    let user;
    if (type == "admin") {
      user = await Admin.findOne({
        where: { admin_id: decoded.sign_obj.admin_id },
      });
    } else if (type == "teacher") {
      user = await Teachers.findOne({
        where: { teacher_id: decoded.sign_obj.teacher_id },
      });
    }
    if (!user) return next(new AppError(400, "User not exist"));
    req.user = user;
    next();
  } catch (e) {
    return next(new AppError(401, "Authentication failed. Please login."));
  }
};

module.exports = protect;
