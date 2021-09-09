const express = require("express");
const router = express.Router({ mergeParams: true });
const adminController = require("./../controller/adminController");
const auth = require("./../controller/protect");

router.route("/admin").post(adminController.login);
router
  .route("/admin/get_teachers_request/:is_global")
  .get(auth, adminController.get_teachers_request);
router.route("/admin/get_teachers/:is_global").get(auth, adminController.get_teachers);

router.route("/admin/approve_teacher").patch(auth, adminController.approve_Teacher);

router.route("/admin/get_courses_request").get(auth, adminController.get_courses_request);
router.route("/admin/approve_course").patch(auth, adminController.approve_Course);

/*const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_KEY,
});

const storage = multer.memoryStorage({
  destination: function (req, file, callback) {
    callback(null, "");
  },
});

const upload = multer({ storage }).single("resource");

router.post("/admin/login", );

router.post("/admin/update_password", async (req, res) => {
  try {
    Admin.findOne({
      attributes: ["admin_id"],
      where: {
        email: req.body.email,
        is_active: 1,
      },
    })
      .then(async (admin) => {
        if (admin.admin_id != undefined) {
          let hash = await bcrypt.hash(req.body.password, 8);
          Admin.update({ password: hash }, { where: { email: req.body.email } })
            .then((result) => {
              res.status(200).json({
                code: 200,
                message: "Password updated successfully.",
                data: {},
              });
            })
            .catch((err) => {
              console.log(err);
              res.status(200).json({
                code: 200,
                message: "Error while updating password.",
                data: {},
              });
            });
        } else {
          res.status(401).json({
            code: 401,
            message: "No user found with this email",
            data: {},
          });
        }
      })
      .catch((err) => {
        console.log(err);
        res.status(401).json({
          code: 401,
          message: "Something went wrong.",
          data: {},
        });
      });
  } catch (e) {
    console.error(e);
    res.status(500).send({
      code: 500,
      message: "Something went wrong.",
      data: {},
    });
  }
});

router.post("/admin/add_resource", auth, upload, async (req, res, next) => {
  try {
    const data = {
      resource_name: req.body.resource_name,
      subject_id: req.body.subject_id,
      class_id: req.body.class_id,
    };
    let myFile = req.file.originalname.split(".");
    const fileType = myFile[myFile.length - 1];

    const params = {
      Bucket: process.env.AWS_BUCKET,
      Key: `${uuidv4()}.${fileType}`,
      Body: req.file.buffer,
    };

    s3.upload(params, async (error, locationData) => {
      if (error) {
        return next(new AppError(500, "Something went wrong while uploading resouce."));
      } else {
        data.resource_url = locationData.Location;
        console.log(locationData);
        const resource = await Resources.create(data);
        if (!resource) return next(new AppError(500, "Error while uploading resource."));
        res.status(200).json({
          status: "Success",
          message: "Resource updated successfully.",
        });
      }
    });
  } catch (e) {
    return next(new AppError(500, "Something went wrong."));
  }
});
*/
module.exports = router;
