const express = require("express");
const bcrypt = require("bcryptjs");
const multer = require("multer");
const AWS = require("aws-sdk");
const { v4: uuidv4 } = require("uuid");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const moment = require("moment");
const Async = require("async");

const AppError = require("../utils/appError");
const Teachers = require("../models/teachers");
const TeacherLanguages = require("../models/teacher_languages");
const TeacherClasses = require("../models/teacher_classes");
const TeacherCertifications = require("../models/teacher_certificaitons");
const TeacherAvailability = require("../models/teacher_availability");
const Resources = require("../models/resources");
const CourseResources = require("../models/course_resources");
const Day = require("./../models/day");
const Courses_Review = require("./../models/course_review");

const utility = require("./../utils/utility");

const sequelize = require("../db/sequelize");
const router = express.Router({ mergeParams: true });

const { QueryTypes } = require("sequelize");

const auth = require("../controller/protect");
const Assignments = require("../models/assignments");
const Courses_Store = require("../models/courses_store");

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  auth: {
    user: process.env.smtp_username,
    pass: process.env.smtp_password,
  },
});

const createAndSendToken = (sign_obj, res, key) => {
  const token = jwt.sign({ sign_obj }, key);
  res.cookie("jwt", token, {
    //secure: true,
    httpOnly: true,
  });
  //return `Bearer ${token}`;
};

const iscorrectPassword = async function (currentPassword, savedPassword) {
  return await bcrypt.compare(currentPassword, savedPasswod);
};

const check_is_global = function (req, user, next) {
  if (req.body.is_global === 1 || req.body.is_global === 0) {
    if (!(req.body.is_global === user.is_global))
      return next(new AppError(400, "Invalid credentials"));
  }
};

exports.signUp = async (req, res, next) => {
  try {
    const data = {
      honorific: req.body.honorific,
      name: req.body.name,
      mobile: req.body.mobile,
      email: req.body.email,
      dob: req.body.dob,
      password: req.body.password,
      is_global: req.body.is_global,
    };
    let teacher_exists = await Teachers.findAll({ where: { email: data.email } });
    if (teacher_exists.length) {
      return next(new AppError(400, "This email is already registered with us."));
    }
    const teacher = await Teachers.create(data);
    if (!teacher) {
      return next(new AppError(401, res, "Something went wrong."));
    }
    const sign_obj = {
      email: teacher.dataValues.email,
      name: teacher.dataValues.name,
      teacher_id: teacher.dataValues.teacher_id,
      type: "teacher",
    };
    createAndSendToken(sign_obj, res, process.env.JWT_SECRET_KEY);
    res.status(201).json({
      message: "Signup successfull.",
    });
  } catch (e) {
    res.status(500).json({
      status: "fail",
      message: e,
    });
    //return next(new AppError(500, "Something went wrong"));
  }
};

exports.login = async (req, res, next) => {
  try {
    const data = {
      email: req.body.email,
    };
    const teacher = await Teachers.findOne({
      attributes: [
        "teacher_id",
        "name",
        "profile_img",
        "password",
        "is_global",
        "is_active",
        "is_approved",
      ],
      where: data,
    });
    if (!teacher || !(await bcrypt.compare(req.body.password, teacher.password)))
      return next(new AppError(400, "Invalid email or password."));

    if (!teacher.dataValues.is_active) return next(new AppError(400, "user is not exist"));
    console.log(teacher);
    if (!teacher.dataValues.is_approved)
      return res.status(200).json({
        status: "success",
        message: "Your request is still pending, please wait for some time.",
      });
    check_is_global(req, teacher, next);
    const sign_obj = {
      email: teacher.dataValues.email,
      name: teacher.dataValues.name,
      teacher_id: teacher.dataValues.teacher_id,
      type: "teacher",
    };
    delete teacher.dataValues.password;
    createAndSendToken(sign_obj, res, process.env.JWT_SECRET_KEY);
    res.status(200).json({
      message: "Logged in successfully.",
      data: teacher,
    });
  } catch (e) {
    console.log(e);
    return next(new AppError(500, "Something went wrong."));
  }
};

exports.additional_details = async (req, res, next) => {
  const temp = await sequelize.transaction();
  try {
    const data = {
      country_id: req.body.country_id,
      languages: req.body.languages,
      classes: req.body.classes,
      experience: req.body.experience,
      hr_rate: req.body.hr_rate,
      teacher_id: req.user.teacher_id,
    };
    data.classes.forEach((el) => {
      el.teacher_id = req.user.teacher_id;
    });
    data.languages.forEach((el) => {
      el.teacher_id = req.user.teacher_id;
    });

    await Teachers.update(
      { country_id: data.country_id, experience: data.experience, hr_rate: data.hr_rate },
      { where: { teacher_id: data.teacher_id } }
    );
    await TeacherLanguages.bulkCreate(data.languages);
    await TeacherClasses.bulkCreate(data.classes);
    await temp.commit();

    res.status(200).json({
      code: 200,
      message: "Updated successfully.",
    });
  } catch (e) {
    if (e.errors != undefined && e.errors[0].path == "class_ukey") {
      return next(new AppError(401, "Same class or subject added twice."));
    } else if (e.errors != undefined && e.errors[0].path == "language_ukey") {
      return next(new AppError(401, "Same language added twice."));
    } else {
      return next(new AppError(500, "Something went wrong"));
    }
  }
};

exports.update_password = async (req, res, next) => {
  try {
    const data = {
      email: req.body.email,
    };
    const teacher = await Teachers.findOne({
      attributes: ["teacher_id", "password"],
      where: data,
    });

    if (!teacher || !teacher.is_active) return next(new AppError("invalid user"));
    if (!iscorrectPassword(req.body.currentPassword, teacher.password))
      return next(new AppError("Invalid password"));

    let hash = await bcrypt.hash(req.body.password, 10);
    const updated = await Teachers.update({ password: hash }, { where: data });
    if (!updated) return next(new AppError(401, "Error while updating password."));
    res.status(200).json({
      message: "Password updated successfully.",
    });
  } catch (e) {
    return next(new AppError(500, "Something went wrong"));
  }
};

exports.get_all_courses_for_store = async (req, res, next) => {
  try {
    console.log(req.user);
    const data = await sequelize.query(
      `select csm.price,cm.title,sm.subject_name from subject_master as sm, course_master as cm, courses_store_master as csm where cm.is_active = 1 and cm.is_approved=1 and csm.is_active=1 and cm.course_id = csm.course_id and cm.subject_id = sm.subject_id`,
      {
        type: QueryTypes.SELECT,
      }
    );
    if (!data) return next(new AppError(401, "Error while retrieving data."));
    if (data.length === 0)
      return res.status(200).json({
        status: "success",
        message: "No courses are uploaded yet",
      });
    res.status(200).json({
      status: "success",
      data,
    });
  } catch (e) {
    return next(new AppError(500, "Something went wrong"));
  }
};

exports.get_course_details_for_store = async (req, res, next) => {
  try {
    if (!req.params.course_id) return next(new AppError(400, "Please give course_id"));
    Async.parallel(
      [
        function (callback) {
          sequelize
            .query(
              `select tm.name, csm.price,cm.title,sm.subject_name, cm.description from teacher_master as tm, subject_master as sm, course_master as cm, courses_store_master as csm  where cm.is_active = 1 and cm.is_approved=1 and csm.course_id = ${req.params.course_id} and csm.is_active=1 and cm.course_id = csm.course_id and cm.subject_id = sm.subject_id and tm.teacher_id = ${req.user.teacher_id}`,
              { type: QueryTypes.SELECT }
            )
            .then((details) => {
              callback(null, details);
            });
        },

        function (callback) {
          sequelize
            .query(
              `select avg(review) as Average, count(review) as Total from courses_review_master as crm, course_master as cm where crm.course_id= ${req.params.course_id} and cm.is_approved=1`,
              { type: QueryTypes.SELECT }
            )
            .then((details) => {
              callback(null, details);
            });
        },
      ],
      function (err, result) {
        if (err) return next(new AppError(401, "Unable to get data"));
        if (result[0].length === 0) {
          return res.status(200).json({
            status: "success",
            message: "No course is added by teacher",
          });
        }
        res.status(200).json({
          status: "success",
          message: "Course details.",
          data: {
            course_details: result[0],
            review: result[1],
          },
        });
      }
    );
  } catch (e) {
    return next(new AppError(500, "Something went wrong"));
  }
};

exports.add_availability = async (req, res, next) => {
  try {
    req.body.slots.forEach((el) => {
      el.teacher_id = req.user.teacher_id;
    });
    const slots = await TeacherAvailability.bulkCreate(req.body.slots);
    if (!slots) return next(new AppError(401, "Error while adding slots"));

    res.status(201).json({
      status: "success",
      message: "Slots added successfully.",
    });
  } catch (e) {
    return next(new AppError(500, "Something went wrong"));
  }
};

exports.forward_resources = async (req, res, next) => {
  try {
    const is_course_present = await sequelize.query(
      `select course_id from course_master where course_id =${req.body.course_id}`,
      {
        type: QueryTypes.SELECT,
      }
    );

    if (!is_course_present.length) return next(new AppError(400, "Course is not registered"));

    const resource_id = await sequelize.query(
      `select rm.resource_id from resource_master as rm, course_master as cm where cm.course_id=${req.body.course_id} and rm.teacher_id = cm.teacher_id and cm.is_approved=1 and cm.is_active=1`,
      { type: QueryTypes.SELECT }
    );
    resource_id.forEach(async (el) => {
      await CourseResources.create({
        course_id: req.body.course_id,
        resource_id: el.resource_id,
        is_active: 1,
      });
    });
    res.status(200).json({
      status: "success",
      message: "Resource forwarded successfully",
    });
  } catch (e) {
    console.log(e);
    return next(new AppError("500, Something went wrong during forwarding resources"));
  }
};

exports.get_resources_by_teacher_and_course_id = async (req, res, next) => {
  try {
    const teacher = await Teachers.findOne({
      where: { teacher_id: req.user.teacher_id },
    });
    if (!teacher) return next(new AppError(400, "Teacher not found"));
    //let resources = await sequelize.query(`SELECT b.resource_id,b.resource_name,b.resource_url,b.subject_id,e.subject_name,b.class_id,f.class_name FROM teacher_master AS a, resource_master AS b, teacher_class_master AS c, teacher_availability as d, subject_master AS e, class_master AS f  WHERE b.class_id = c.class_id AND d.class_id = ${req.body.class_id} AND b.subject_id = e.subject_id AND a.teacher_id = 1 AND b.class_id = ${req.body.class_id}  AND a.is_verified = 1 AND d.subject_id = b.subject_id AND b.class_id = f.class_id AND d.class_id = ${req.body.class_id} AND DATEDIFF(d.available_date, "${today}") <= 1 GROUP BY resource_id`,{ type: QueryTypes.SELECT });

    let resources = await sequelize.query(
      `select * from resource_master as rm, course_master as cm where rm.teacher_id=${req.user.teacher_id} and cm.teacher_id = rm.teacher_id and course_id =${req.body.course_id}`,
      { type: QueryTypes.SELECT }
    );

    res.status(200).json({
      message: "Success",
      result: resources.length,
      data: resources,
    });
  } catch (e) {
    console.log(e);
    return next(new AppError(500, "Something went wrong"));
  }
};

exports.get_resources_by_id = async (req, res, next) => {
  try {
    const teacher = await Teachers.findOne({ where: { teacher_id: req.user.teacher_id } });
    if (!teacher) return next(new AppError(400, "Teacher not found"));
    //let resources = await sequelize.query(`SELECT b.resource_id,b.resource_name,b.resource_url,b.subject_id,e.subject_name,b.class_id,f.class_name FROM teacher_master AS a, resource_master AS b, teacher_class_master AS c, teacher_availability as d, subject_master AS e, class_master AS f  WHERE b.class_id = c.class_id AND d.class_id = ${req.body.class_id} AND b.subject_id = e.subject_id AND a.teacher_id = 1 AND b.class_id = ${req.body.class_id}  AND a.is_verified = 1 AND d.subject_id = b.subject_id AND b.class_id = f.class_id AND d.class_id = ${req.body.class_id} AND DATEDIFF(d.available_date, "${today}") <= 1 GROUP BY resource_id`,{ type: QueryTypes.SELECT });
    let resources = await sequelize.query(
      `select * from resource_master where teacher_id=${req.user.teacher_id}`,
      { type: QueryTypes.SELECT }
    );
    res.status(200).json({
      message: "Success",
      result: resources.length,
      data: resources,
    });
  } catch (e) {
    return next(new AppError(500, "Something went wrong"));
  }
};

exports.post_assignment = async (req, res, next) => {
  try {
    const data = {
      title: req.body.title,
      instructions: req.body.instructions,
      upload_date: Date.now(),
      due_date: req.body.due_date,
      teacher_id: req.user.teacher_id,
      course_id: req.body.course_id,
    };
    if (req.body.resource_id) {
      data.resource_id = req.body.resource_id;
    }

    const assignment = await Assignments.create(data);
    if (!assignment) return next(new AppError(400, "unable to post assignment"));
    res.status(200).json({
      message: "Success",
      data: "Your assignment has been posted successfully",
    });
  } catch (e) {
    return next(new AppError(500, "Something went wrong"));
  }
};

exports.get_all_assignment_by_course_and_teacher_id = async (req, res, next) => {
  try {
    const data = {
      teacher_id: req.user.teacher_id,
      course_id: req.body.course_id,
    };

    const assignments = await sequelize.query(
      `select assignment_id, title, upload_date,due_date from assignment_master where teacher_id=${req.user.teacher_id} and course_id=${req.body.course_id}`,
      { type: QueryTypes.SELECT }
    );

    if (!assignments) return next(new AppError(400, "unable to get assignment"));

    res.status(200).json({
      message: "Success",
      course_id: req.body.course_id,
      data: `Your assignments`,
      assignments,
    });
  } catch (e) {
    return next(new AppError(500, "Something went wrong"));
  }
};

exports.get_assignment_by_course_and_teacher_id = async (req, res, next) => {
  try {
    const data = {
      course_id: req.body.course_id,
      teacher_id: req.user.teacher_id,
      assignment_id: req.body.assignment_id,
    };
    console.log(data);
    let assignment = await Assignments.findOne({
      attributes: ["title", "upload_date", "due_date", "maximum_score", "resource_id"],
      where: data,
    });
    if (!assignment) return next(new AppError(400, "unable to get assignment"));
    let temp;
    if (assignment.resource_id) {
      temp = await sequelize.query(
        `select resource_url from resource_master where resource_id = ${assignment.resource_id}`,
        { type: QueryTypes.SELECT }
      );
    }
    assignment.resource_id = undefined;
    assignment.resource_url = temp[0];

    res.status(200).json({
      message: "Success",

      data: `Your assignments`,
      assignment,
      resource_url: assignment.resource_url,
    });
  } catch (e) {
    return next(new AppError(500, "Something went wrong"));
  }
};
