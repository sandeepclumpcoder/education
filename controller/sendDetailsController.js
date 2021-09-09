const { QueryTypes } = require("sequelize");
const sequelize = require("../db/sequelize");
const Countries = require("../models/countries");
const Languages = require("../models/languages");
const Teachers = require("../models/teachers");
const AppError = require("../utils/appError");
const Async = require("async");

exports.get_Countries_name = async (req, res, next) => {
  try {
    const details = await Countries.findAll({
      attributes: ["country_id", "country_name"],
      where: {
        is_active: 1,
      },
    });

    if (!details) return next(new AppError(400, "unable to reterive countries name"));
    res.status(200).json({
      status: "Success",
      names: details,
    });
  } catch (err) {
    return next(new AppError(500, "Something went wrong"));
  }
};

exports.get_languages = async (req, res, next) => {
  try {
    const details = await Languages.findAll({
      attributes: ["language_id", "language_name"],
      where: {
        is_active: 1,
      },
    });

    if (!details) return next(new AppError(400, "unable to reterive languages"));
    res.status(200).json({
      status: "Success",
      names: details,
    });
  } catch (err) {
    return next(new AppError(500, "Something went wrong"));
  }
};

exports.get_subject_by_class_id = async (req, res, next) => {
  try {
    let subjects_name = await sequelize.query(
      `select subject_name, subject_id from subject_master where subject_id in (select subject_id from subject_details where class_id=${req.params.class_id})`,
      { type: QueryTypes.SELECT }
    );

    if (!subjects_name) return next(new AppError(400, "unable to retrive subjects name"));
    res.status(200).json({
      status: "Success",
      names: subjects_name,
    });
  } catch (err) {
    return next(new AppError(500, "Something went wrong"));
  }
};

exports.get_days_and_slots = async (req, res, next) => {
  try {
    const days = await sequelize.query(`select day, day_id from classes_day`, {
      type: QueryTypes.SELECT,
    });

    const slots = await sequelize.query(`select slot, slot_id from slot_master`, {
      type: QueryTypes.SELECT,
    });

    if (!days || !slots) return next(new AppError(400, "unable to retrive availability"));
    res.status(200).json({
      status: "Success",
      days,
      slots,
    });
  } catch (err) {
    console.log(err);
    return next(new AppError(500, "Something went wrong"));
  }
};

exports.get_subject_by_class_and_tecaher_id = async (req, res, next) => {
  try {
    let subjects_name = await sequelize.query(
      `select subject_name,subject_id from subject_master where subject_id in (select subject_id from teacher_class_master where class_id=${req.params.class_id} and teacher_id = ${req.user.teacher_id})`,
      { type: QueryTypes.SELECT }
    );

    if (!subjects_name) return next(new AppError(400, "unable to retrive subjects name"));
    res.status(200).json({
      status: "Success",
      names_and_id: subjects_name,
    });
  } catch (err) {
    return next(new AppError(500, "Something went wrong"));
  }
};

exports.get_classes_by_teacher_id = async (req, res, next) => {
  try {
    let class_name = await sequelize.query(
      `select class_name,class_id from class_master where class_id in (select class_id from teacher_class_master where teacher_id=${req.user.teacher_id})`,
      { type: QueryTypes.SELECT }
    );

    if (!class_name) return next(new AppError(400, "unable to retrive subjects name"));
    res.status(200).json({
      status: "Success",
      names_and_id: class_name,
    });
  } catch (err) {
    console.log(err);
    return next(new AppError(500, "Something went wrong"));
  }
};

exports.get_course_and_description_by_teacher_id = async (req, res, next) => {
  try {
    let course_details = await sequelize.query(
      `select subject_id,class_id, title, description from course_master where teacher_id=${req.user.teacher_id} and is_active=1 and is_approved=1 and course_id=${req.params.course_id}`,
      { type: QueryTypes.SELECT }
    );

    if (!course_details) return next(new AppError(400, "unable to retrive courses name"));
    if (course_details.length === 0)
      return res.status(200).json({
        status: "Success",
        message: "Course is not approved yet or no course is added",
      });
    res.status(200).json({
      status: "Success",
      course_details: course_details,
    });
  } catch (err) {
    console.log(err);
    return next(new AppError(500, "Something went wrong"));
  }
};

exports.profile_details = async (req, res, next) => {
  try {
    teacher_id = req.user.teacher_id || req.params.teacher_id;

    const teacher = await Teachers.findOne({ where: { teacher_id: teacher_id } });

    if (teacher != null) {
      Async.parallel(
        [
          //for teacher details
          function (callback) {
            sequelize
              .query(
                `select email,honorific,name,mobile,dob,profile_img,experience,hr_rate,resume from teacher_master as a where a.teacher_id = ${teacher_id};`,
                { type: QueryTypes.SELECT }
              )
              .then((details) => {
                callback(null, details);
              });
          },

          //for country name
          function (callback) {
            sequelize
              .query(
                `select country_name from country_master where country_id  = (${`select country_id from teacher_master where teacher_id=${teacher_id}`})`,
                { type: QueryTypes.SELECT }
              )
              .then((details) => {
                callback(null, details);
              });
          },

          //for languages
          function (callback) {
            sequelize
              .query(
                `select a.language_name from language_master as a, teacher_language_master as b where a.is_active = 1 and b.teacher_id=${teacher_id} and a.language_id=b.language_id;`,
                { type: QueryTypes.SELECT }
              )
              .then((languages) => {
                callback(null, languages);
              });
          },

          //for subjects
          function (callback) {
            sequelize
              .query(
                `select c.subject_name ,a.class_name from class_master as a,subject_master as c, teacher_class_master as b where a.class_id = b.class_id and c.subject_id = b.subject_id and b.is_active = 1 and c.is_active=1 and b.teacher_id = ${teacher_id} group by c.subject_id ;`,
                { type: QueryTypes.SELECT }
              )
              .then((classes) => {
                callback(null, classes);
              });
          },

          //for certificates
          function (callback) {
            sequelize
              .query(
                `select a.description, a.grade, a.certificate_img,a.year_of_certification, c.subject_name from teacher_certifications as a, teacher_master as b, subject_master as c where b.teacher_id = ${teacher_id} and b.is_active =1 and a.teacher_id = b.teacher_id and a.certified_subject = c.subject_id`,
                //`select c.subject_name,d.class_name,a.id,a.description,a.year_of_certification,a.certified_subject,a.grade,a.certificate_img from teacher_certifications as a, teacher_master as b,subject_master as c,class_master as d where a.teacher_id = b.teacher_id and a.certified_subject = c.subject_id and a.grade = d.class_id and a.is_active = 1 and b.teacher_id = ${req.params.teacher_id};`,
                { type: QueryTypes.SELECT }
              )
              .then((certificates) => {
                callback(null, certificates);
              });
          },

          //for availability
          function (callback) {
            sequelize
              .query(
                `select e.day, b.subject_name, d.slot, c.available_date from teacher_master as a, subject_master as b, teacher_availability as c, slot_master as d, classes_day as e where a.teacher_id = ${teacher_id} and a.is_active = 1 and c.teacher_id = a.teacher_id and c.slot_id = d.slot_id and e.day_id = c.day_id`,
                //`select c.subject_name,d.class_name,a.id,a.description,a.year_of_certification,a.certified_subject,a.grade,a.certificate_img from teacher_certifications as a, teacher_master as b,subject_master as c,class_master as d where a.teacher_id = b.teacher_id and a.certified_subject = c.subject_id and a.grade = d.class_id and a.is_active = 1 and b.teacher_id = ${req.params.teacher_id};`,
                { type: QueryTypes.SELECT }
              )
              .then((certificates) => {
                callback(null, certificates);
              });
          },
        ],
        function (err, result) {
          res.status(200).json({
            status: "success",
            message: "Teacher details.",
            data: {
              details: result[0],
              country_name: result[1],
              languages: result[2],
              subjects: result[3],
              certificates: result[4],
              availability: result[5],
            },
          });
        }
      );
    } else {
      return next(new AppError(400, "Teacher not found"));
    }
  } catch (e) {
    console.log(e);
    return next(new AppError(500, "Something went wrong"));
  }
};
