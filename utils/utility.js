/* this file contains 
1. createAndSendToken function whch is used to create and send token in cookie
2. Node mailer used to mail 
*/

const AWS = require("aws-sdk");
const multer = require("multer");
const nodemailer = require("nodemailer");
const { v4: uuidv4 } = require("uuid");
const sequelize = require("../db/sequelize");
const Resources = require("../models/resources");
const Teachers = require("../models/teachers");
const AppError = require("./appError");
const { QueryTypes } = require("sequelize");
const TeacherCertifications = require("../models/teacher_certificaitons");
const Courses_Store = require("../models/courses_store");

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  auth: {
    user: process.env.smtp_username,
    pass: process.env.smtp_password,
  },
});

/*********************************************************************/
//To upload documents on aws

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_KEY,
});

const storage = multer.memoryStorage({
  destination: function (req, file, callback) {
    callback(null, "");
  },
});

exports.upload = multer({ storage }).single("resource");
/************************************************************************/

const get_filename_and_extension = function (req) {
  let myFile = req.file.originalname.split(".");
  const fileType = myFile[myFile.length - 1];

  const params = {
    Bucket: process.env.AWS_BUCKET,
    Key: `${uuidv4()}.${fileType}`,
    Body: req.file.buffer,
  };
  return params;
};

exports.upload_profile_image = async (req, res, next) => {
  try {
    console.log("hii");
    console.log(req.file);
    const extension = req.file.mimetype.split("/");
    if (extension[0] != "image") return next(new AppError(400, "Please enter image only"));

    const params = get_filename_and_extension(req);

    s3.upload(params, async (error, data) => {
      if (error) {
        return next(new AppError(500, "Something went wrong while uploading imgae."));
      } else {
        const updated_teacher = await Teachers.update(
          { profile_img: data.Location },
          { where: { teacher_id: req.user.teacher_id } }
        );

        const teacher = await sequelize.query(
          `select profile_img from teacher_master where teacher_id = ${req.user.teacher_id}`,
          {
            type: QueryTypes.SELECT,
          }
        );
        if (!teacher) return next(new AppError(500, "Error while uploading image."));
        res.status(200).json({
          status: "success",
          message: "Image updated successfully.",
          image_url: teacher[0].profile_img,
        });
      }
    });
  } catch (e) {
    console.log(e);
    return next(new AppError(500, "Something went wrong"));
  }
};

exports.add_resources = async (req, res, next) => {
  try {
    const data = {
      resource_name: req.body.resource_name,
      course_id: req.body.course_id,
      class_id: req.body.class_id,
      teacher_id: req.user.teacher_id,
    };
    const extension = req.file.mimetype.split("/");
    if (extension[1] != "pdf") return next(new AppError(400, "Please enter pdf only"));
    const params = get_filename_and_extension(req);

    s3.upload(params, async (error, locationData) => {
      if (error) {
        return next(new AppError(500, "Something went wrong while uploading resouce."));
      } else {
        data.resource_url = locationData.Location;
        const resource = await Resources.create(data);
        console.log("hii");
        if (!resource) return next(new AppError(500, "Error while uploading resource."));
        res.status(200).json({
          status: "Success",
          message: "Resource added successfully.",
          resource_id: resource.resource_id,
        });
      }
    });
  } catch (e) {
    return next(new AppError(500, "Something went wrong."));
  }
};

exports.upload_resume = async (req, res, next) => {
  try {
    const extension = req.file.mimetype.split("/");
    if (extension[1] != "pdf") return next(new AppError(400, "Please enter pdf only"));
    const params = get_filename_and_extension(req);
    s3.upload(params, async (error, locationData) => {
      if (error) {
        return next(new AppError(500, "Something went wrong while uploading resume."));
      } else {
        const resume = await Teachers.update(
          { resume: locationData.Location },
          { where: { teacher_id: req.user.teacher_id } }
        );
        if (!resume) return next(new AppError(500, "Error while uploading resume."));
        res.status(200).json({
          status: "Success",
          message: "Resume added successfully.",
        });
      }
    });
  } catch (e) {
    return next(new AppError(500, "Something went wrong."));
  }
};

exports.upload_video = async (req, res, next) => {
  try {
    const extension = req.file.mimetype.split("/");
    if (extension[1] != "mp4") return next(new AppError(400, "Please enter mp4 video only"));
    const params = get_filename_and_extension(req);
    s3.upload(params, async (error, locationData) => {
      if (error) {
        return next(new AppError(500, "Something went wrong while uploading video."));
      } else {
        const resume = await Teachers.update(
          { video_url: locationData.Location },
          { where: { teacher_id: req.user.teacher_id } }
        );
        if (!resume) return next(new AppError(500, "Error while uploading video."));
        res.status(200).json({
          status: "Success",
          message: "video added successfully.",
        });
      }
    });
  } catch (e) {
    return next(new AppError(500, "Something went wrong."));
  }
};

exports.add_certification = async (req, res, next) => {
  try {
    const data = {
      teacher_id: req.user.teacher_id,
      certificate_name: req.body.certificate_name,
      description: req.body.description,
      grade: req.body.grade,
      year_of_certification: req.body.year_of_certification,
    };

    const subject_id = await sequelize.query(
      `SELECT subject_id from subject_master where subject_name = ${req.body.subject_name}`,
      { type: QueryTypes.SELECT }
    );
    if (!subject_id) return next(new AppError(400, "Subject not exist"));
    data.certified_subject = subject_id[0].subject_id;
    const new_teacher = await TeacherCertifications.create(data);
    if (!new_teacher) return next(new AppError(400, "Error while adding certification."));

    if (!req.file) return next(new AppError(400, "Please select certificate"));

    const extension = req.file.mimetype.split("/");

    if (extension[1] != "pdf") return next(new AppError(400, "Please enter pdf file only"));

    const params = get_filename_and_extension(req);
    s3.upload(params, async (error, locationData) => {
      if (error) {
        return next(new AppError(500, "Something went wrong while uploading video."));
      } else {
        const certi = await TeacherCertifications.update(
          { certificate_img: locationData.Location },
          { where: { teacher_id: req.user.teacher_id } }
        );
        if (!certi) return next(new AppError(500, "Error while uploading video."));
        res.status(200).json({
          status: "Success",
          message: "data added successfully.",
        });
      }
    });
  } catch (e) {
    console.log(e);
    return next(new AppError(500, "Something went wrong"));
  }
};

exports.upload_material_on_store = async (req, res, next) => {
  //1.send courses title and description to teacher using route /get_course_and_description_by_teacher_id
  //2. add to the store
  try {
    const data = {
      course_id: req.body.course_id,
      price: req.body.price,
      teacher_id: req.user.teacher_id,
    };
    const course_details = await Courses_Store.create(data);
    if (!course_details) return next(new AppError(401, "Error while adding course to store"));
    if (course_details.is_approved === 0) {
      return res.status(200).json({
        status: "success",
        message: "Courses not approved yet",
      });
    }
    const extension = req.file.mimetype.split("/");
    if (extension[0] != "image") return next(new AppError(400, "Please select an Image"));

    const params = get_filename_and_extension(req);

    s3.upload(params, async (error, data) => {
      if (error) {
        return next(new AppError(500, "Something went wrong while uploading image."));
      } else {
        const image = await Courses_Store.update(
          { image_url: data.Location },
          { where: { teacher_id: req.user.teacher_id } }
        );
        if (!image) return next(new AppError(500, "Error while uploading image."));
      }
    });
    res.status(200).json({
      status: "success",
      message: "Course added to store",
    });
  } catch (err) {
    console.log(err);
    return next(new AppError(500, "Something went wrong"));
  }
};
