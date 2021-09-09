const express = require("express");
const teacherController = require("./../controller/teacherController");

const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require("uuid");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const Async = require("async");

const AppError = require("../utils/appError");
const Teachers = require("../models/teachers");
const TeacherLanguages = require("../models/teacher_languages");
const TeacherClasses = require("../models/teacher_classes");
const TeacherCertifications = require("../models/teacher_certificaitons");
const SubjectsResources = require("../models/course_resources");

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

//for teacher sign up
//parametrs is_global:0 tk, is_global:1 global
router.post("/teacher/signup", teacherController.signUp);

//for login
//email password and is_global
router.post("/teacher/login", teacherController.login);

//personal details
router.post("/teacher/additional_details", auth, teacherController.additional_details);

//update password
router.post("/teacher/update_password", teacherController.update_password);

//upload profileimage at time of sign up
router.post("/teacher/upload_profile_img", auth, utility.upload, utility.upload_profile_image);

//upload resume  at time of sign up
router.post("/teacher/upload_resume", auth, utility.upload, utility.upload_resume);

//upload video at time of sign up
router.post("/teacher/upload_video", auth, utility.upload, utility.upload_video);

//upload certification details  at time of sign up
router.post("/teacher/add_certification", auth, utility.upload, utility.add_certification);

//upload materail on store if you have some courses
router.post(
  "/teacher/upload_material_on_store",
  auth,
  utility.upload,
  utility.upload_material_on_store
);

//get all courses to user in the store
router.get("/teacher/get_all_courses_for_store", auth, teacherController.get_all_courses_for_store);

//get course detail  when user click on course for store
router.get(
  "/teacher/get_course_details_for_store/:course_id",
  auth,
  teacherController.get_course_details_for_store
);

//techers upload study materrials
router.post("/teacher/add_resources", auth, utility.upload, utility.add_resources);

//tecahers add availabiloty  at time of sign up
router.post("/teacher/add_availability", auth, teacherController.add_availability);

//This route is going to forward the resources of a specific subjects to students.
//need subject id from frontend
//tecaher must be login
router.post("/teacher/forward_resources", auth, teacherController.forward_resources);

//This route is going to give resources of specific subject in gui
//need subject id from frontend
//tecaher must be login
router.post(
  "/teacher/get_resources_by_teacher_and_course_id",
  auth,
  teacherController.get_resources_by_teacher_and_course_id
);

//This route is going to give all the resouces uploaded by specific teacher
//tecaher must be login
router.get("/teacher/get_resources_by_id", auth, teacherController.get_resources_by_id);

//This route is going to post assignments for specific subjects and specific teacher based on id
//need resource id, if resource is uploaded, before calling this, insure resouce is uploaded.
//tecaher must be login
router.post("/teacher/post_assignment", auth, teacherController.post_assignment);

//This route is going to get all the assignmnets for a teacher and subjects
//need subject id,
//tecaher must be login
router.post(
  "/teacher/get_all_assignment_by_course_and_teacher_id",
  auth,
  teacherController.get_all_assignment_by_course_and_teacher_id
);

//This route is going to get assignment details
//need resource id, assignmnet id, subject_id
//tecaher must be login
router.post(
  "/teacher/get_assignment_by_course_and_teacher_id",
  auth,
  teacherController.get_assignment_by_course_and_teacher_id
);

router.post("/teacher/why_join_us", auth, async (req, res, next) => {
  try {
    const data = req.body.why_join_us;
    if (!data) return next(new AppError(400, "Please write something"));

    const teacher = await Teachers.update(
      { why_join_us: req.body.why_join_us },
      { where: { teacher_id: req.user.teacher_id } }
    );
    if (!teacher) return next(new AppError(400, "Error while adding review"));
    res.status(200).json({
      status: "success",
      message: "Review added succesfully",
    });
  } catch (err) {
    return next(new AppError(500, "Something went wrong"));
  }
});

router.post("/teacher/classes", auth, async (req, res) => {
  try {
    const teacher = await Teachers.findOne({ where: { teacher_id: req.body.teacher_id } });

    if (teacher != null && req.body.teacher_id != undefined) {
      let classes = await sequelize.query(
        `SELECT a.class_name,a.class_id FROM class_master as a,teacher_availability as b WHERE a.class_id = b.class_id AND b.class_id = ${req.body.teacher_id} GROUP BY class_id `,
        { type: QueryTypes.SELECT }
      );

      res.status(200).json({
        code: 200,
        message: "Available classes",
        data: classes,
      });
    } else {
      res.status(403).json({
        code: 403,
        message: "Teacher not found.",
        data: [],
      });
    }
  } catch (e) {
    res.status(500).json({
      code: 500,
      message: "Something went wrong.",
      data: [],
    });
  }
});

router.post("/teacher/verify_otp", async (req, res) => {
  try {
    const teacher = await Teachers.findOne({ where: { email: req.body.email } });
    if (teacher != null) {
      if (teacher.dataValues.otp == req.body.otp) {
        res.status(200).json({
          code: 200,
          message: "OTP verified",
          data: [],
        });
      } else {
        res.status(401).json({
          code: 401,
          message: "OTP does not match",
          data: [],
        });
      }
    } else {
      res.status(401).json({
        code: 401,
        message: "This email is not registered with us.",
        data: [],
      });
    }
  } catch (e) {
    res.status(500).json({
      code: 500,
      message: "Something went wrong.",
      data: [],
    });
  }
});

router.post("/teacher/send_otp_mail", async (req, res) => {
  try {
    const teacher = await Teachers.findOne({ where: { email: req.body.email } });
    if (teacher != null) {
      let otp = Math.floor(100000 + Math.random() * 900000);
      await Teachers.update({ otp }, { where: { email: req.body.email } });

      transporter.sendMail(
        {
          from: "testsmtp.10001@gmail.com",
          to: req.body.email,
          subject: "OTP to reset password",
          text: "OTP",
          html: `OTP: ${otp}`,
        },
        (err, info) => {
          if (err) {
            res.status(403).json({
              code: 403,
              message: "Could not send email. Please try again.",
              data: [],
            });
          } else {
            res.status(200).json({
              code: 200,
              message: "Email sent successfully.",
              data: [],
            });
          }
        }
      );
    } else {
      res.status(401).json({
        code: 401,
        message: "This email is not registered with us.",
        data: [],
      });
    }
  } catch (e) {
    res.status(500).json({
      code: 500,
      message: "Something went wrong.",
      data: [],
    });
  }
});

router.put("/teacher/update_profile", auth, async (req, res, next) => {
  try {
    let { details, subjects, languages, certificates, teacher_id } = req.body;

    await Teachers.update(details, { where: { teacher_id } });

    const old_subjects = subjects.filter((subject) => subject["id"]);
    const new_subjects = subjects.filter((subject) => !subject["id"]);

    const old_languages = languages.filter((language) => language["id"]);
    const new_languages = languages.filter((language) => !language["id"]);

    const old_certificates = certificates.filter((certificate) => certificate["id"]);
    const new_certificates = certificates.filter((certificate) => !certificate["id"]);

    let update_sub = "";
    let update_lang = "";
    let update_cert = "";

    old_subjects.forEach((s) => {
      if (s.deleted === 1) {
        update_sub = update_sub + s.id + ",";
      }
    });

    old_languages.forEach(async (l) => {
      if (l.deleted === 1) {
        update_lang = update_lang + l.id + ",";
      } else {
        await sequelize.query(
          `UPDATE teacher_language_master SET language_level = '${l.language_level}' WHERE id = ${l.id}`
        );
      }
    });

    old_certificates.forEach(async (c) => {
      if (c.deleted === 1) {
        update_cert = update_cert + c.id + ",";
      } else {
        console.log(
          `UPDATE teacher_certifications SET certified_subject = ${c.certified_subject},description = '${c.description}', grade = ${c.grade}, year_of_certification = '${c.year_of_certification}',certificate_img = '${c.certificate_img}' WHERE id = ${c.id}`
        );
        await sequelize.query(
          `UPDATE teacher_certifications SET certified_subject = ${c.certified_subject},description = '${c.description}', grade = ${c.grade}, year_of_certification = '${c.year_of_certification}',certificate_img = '${c.certificate_img}' WHERE id = ${c.id}`
        );
      }
    });

    new_subjects.forEach((s) => {
      s.teacher_id = teacher_id;
    });

    new_languages.forEach((l) => {
      l.teacher_id = teacher_id;
    });

    new_certificates.forEach((c) => {
      c.teacher_id = teacher_id;
    });

    if (update_sub !== "") {
      update_sub = update_sub.substring(0, update_sub.length - 1);
      await sequelize.query(
        `UPDATE teacher_class_master SET is_active = 0 WHERE teacher_id = ${teacher_id} AND id IN (${update_sub})`
      );
    }

    if (update_lang !== "") {
      update_lang = update_lang.substring(0, update_lang.length - 1);
      await sequelize.query(
        `UPDATE teacher_language_master SET is_active = 0 WHERE teacher_id = ${teacher_id} AND id IN (${update_lang})`
      );
    }

    if (update_cert !== "") {
      update_cert = update_cert.substring(0, update_cert.length - 1);
      await sequelize.query(
        `UPDATE teacher_certifications SET is_active = 0 WHERE teacher_id = ${teacher_id} AND id IN (${update_cert})`
      );
    }

    await TeacherClasses.bulkCreate(new_subjects);
    await TeacherLanguages.bulkCreate(new_languages);
    await TeacherCertifications.bulkCreate(new_certificates);

    res.status(200).json({
      code: 200,
      message: "Details updated.",
      data: [],
    });
  } catch (e) {
    if (e.errors != undefined && e.errors[0].path == "class_ukey") {
      res.status(401).json({
        code: 401,
        message: "Same class or subject added twice.",
        data: [],
      });
    } else if (e.errors != undefined && e.errors[0].path == "language_ukey") {
      res.status(401).json({
        code: 401,
        message: "Same language added twice.",
        data: [],
      });
    } else {
      res.status(500).json({
        code: 500,
        message: "Something went wrong.",
        data: [],
      });
    }
  }
});

router.post("/teacher/change_password", auth, async (req, res) => {
  try {
    Teachers.findOne({
      attributes: ["teacher_id", "password"],
      where: {
        teacher_id: req.body.teacher_id,
        is_active: 1,
      },
    })
      .then(async (teacher) => {
        if (teacher.teacher_id != undefined) {
          let is_match = await bcrypt.compare(req.body.old_password, teacher.password);

          if (!is_match) {
            res.status(401).json({
              code: 401,
              message: "previous password does not match.",
              data: {},
            });
          } else {
            let hash = await bcrypt.hash(req.body.new_password, 8);
            Teachers.update({ password: hash }, { where: { teacher_id: req.body.teacher_id } })
              .then((result) => {
                res.status(200).json({
                  code: 200,
                  message: "Password updated successfully.",
                  data: {},
                });
              })
              .catch((err) => {
                res.status(200).json({
                  code: 200,
                  message: "Error while updating password.",
                  data: {},
                });
              });
          }
        } else {
          res.status(401).json({
            code: 401,
            message: "No user found with this email",
            data: {},
          });
        }
      })
      .catch((err) => {
        res.status(401).json({
          code: 401,
          message: "Something went wrong.",
          data: {},
        });
      });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      code: 500,
      message: "Something went wrong.",
      data: {},
    });
  }
});

module.exports = router;
