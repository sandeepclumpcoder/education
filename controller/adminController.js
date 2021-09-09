const express = require("express");
const bcrypt = require("bcryptjs");
const multer = require("multer");
const AWS = require("aws-sdk");
const { v4: uuidv4 } = require("uuid");
const jwt = require("jsonwebtoken");

const Admin = require("../models/admin");
const Resources = require("../models/resources");
const router = new express.Router();

const auth = require("../controller/protect");
const AppError = require("../utils/appError");
const { localeData } = require("moment");
const Teachers = require("./../models/teachers");
const sequelize = require("../db/sequelize");
const { QueryTypes } = require("sequelize");

const createAndSendToken = (sign_obj, res, key) => {
  const token = jwt.sign({ sign_obj }, key);
  res.cookie("jwt", token, {
    //secure: true,
    httpOnly: true,
  });
};

const iscorrectPassword = async function (currentPassword, savedPasswod) {
  return await bcrypt.compare(currentPassword, savedPasswod);
};

exports.login = async (req, res, next) => {
  try {
    const admin = await Admin.findOne({
      attributes: ["admin_id", "name", "profile_img", "password"],
      where: {
        email: req.body.email,
        is_active: 1,
      },
    });
    if (!admin) return next(new AppError(401, "user not exist"));
    const is_match = await iscorrectPassword(req.body.password, admin.password);
    if (!is_match) return next(new AppError(401, "Invalid email or password"));
    const type = { type: "admin" };
    const sign_obj = { ...admin.dataValues, ...type };
    createAndSendToken(sign_obj, res, process.env.JWT_SECRET_KEY);
    res.status(200).json({
      status: "success",
      data: admin,
    });
  } catch (e) {
    console.log(e);
    return next(new AppError(500, "Something went wrong"));
  }
};

exports.get_teachers_request = async (req, res, next) => {
  try {
    let teacher = await sequelize.query(
      `select name, experience, teacher_id from teacher_master where is_active=1 and is_global=${req.params.is_global} and is_approved=0`,
      {
        type: QueryTypes.SELECT,
      }
    );
    if (!teacher) return next(new AppError(401, "Unable to get data"));
    if (teacher.length === 0) {
      return res.status(200).json({
        status: "success",
        message: "No pending request",
      });
    }

    for (temp = 0; temp < teacher.length; temp++) {
      const details = await sequelize.query(
        `select cm.class_name, sm.subject_name from teacher_class_master as tcm, subject_master as sm, class_master as cm where tcm.teacher_id=${teacher[temp].teacher_id} and cm.class_id = tcm.class_id and sm.subject_id=tcm.subject_id`,
        {
          type: QueryTypes.SELECT,
        }
      );
      if (!details) return next(new AppError(401, "Unable to get data"));
      teacher[temp].details = details;
    }

    res.status(200).json({
      status: "Success",
      results: teacher.length,
      teacher_details: teacher,
    });
  } catch (err) {
    return next(new AppError(500, "Something went wrong"));
  }
};

exports.get_teachers = async (req, res, next) => {
  try {
    let teacher = await sequelize.query(
      `select name, experience, teacher_id from teacher_master where is_active=1 and is_global=${req.params.is_global} and is_approved=1`,
      {
        type: QueryTypes.SELECT,
      }
    );
    if (!teacher) return next(new AppError(401, "Unable to get data"));
    if (teacher.length === 0) {
      return res.status(200).json({
        status: "success",
        message: "No teacher is approved",
      });
    }
    for (temp = 0; temp < teacher.length; temp++) {
      const details = await sequelize.query(
        `select cm.class_name, sm.subject_name from teacher_class_master as tcm, subject_master as sm, class_master as cm where tcm.teacher_id=${teacher[temp].teacher_id} and cm.class_id = tcm.class_id and sm.subject_id=tcm.subject_id`,
        {
          type: QueryTypes.SELECT,
        }
      );
      if (!details) return next(new AppError(401, "Unable to get data"));
      teacher[temp].details = details;
    }

    res.status(200).json({
      status: "Success",
      results: teacher.length,
      teacher_details: teacher,
    });
  } catch (err) {
    return next(new AppError(500, "Something went wrong"));
  }
};

exports.approve_Teacher = async (req, res, next) => {
  try {
    if (!req.body.teacher_id) return next(new AppError(400, "Please send teacher id"));
    const update = await sequelize.query(
      `update teacher_master set is_approved =1 where teacher_id=${req.body.teacher_id}`,
      {
        type: QueryTypes.UPDATE,
      }
    );
    if (!update) return next(new AppError(401, "Unable to approve"));
    res.status(200).json({
      statis: "success",
      message: "Teacher is approved now",
    });
  } catch (err) {
    return next(new AppError(500, "Something went wrong"));
  }
};

exports.get_courses_request = async (req, res, next) => {
  try {
    let courses = await sequelize.query(
      `select cm.course_id,cm.title, tm.name from teacher_master as tm, course_master as cm where cm.is_active=1 and cm.is_approved=0 and tm.teacher_id = cm.teacher_id`,
      {
        type: QueryTypes.SELECT,
      }
    );
    if (!courses) return next(new AppError(401, "Unable to get data"));
    if (courses.length === 0) {
      return res.status(200).json({
        status: "success",
        message: "No pending request",
      });
    }
    res.status(200).json({
      status: "Success",
      results: courses.length,
      courses_details: courses,
    });
  } catch (err) {
    console.log(err);
    return next(new AppError(500, "Something went wrong"));
  }
};

exports.approve_Course = async (req, res, next) => {
  try {
    if (!req.body.course_id) return next(new AppError(400, "Please send course id"));
    const update = await sequelize.query(
      `update course_master set is_approved =1 where course_id=${req.body.course_id}`,
      {
        type: QueryTypes.UPDATE,
      }
    );
    if (!update) return next(new AppError(401, "Unable to approve"));
    res.status(200).json({
      statis: "success",
      message: "Course is approved now",
    });
  } catch (err) {
    return next(new AppError(500, "Something went wrong"));
  }
};

// exports.get_all_pending_instructor_request = async (req,res,next)=>
// {
//     const data = {
//         is_approved:0
//     }
//     const teachers = await Teachers.findAll({
//         attributes:["teacher_id", "name", "profile_img", "password", "is_global", "is_active"],
//         where:data
//     })
// }
