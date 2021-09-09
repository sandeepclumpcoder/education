const express = require("express");
const Classes = require("../models/classes");
const auth = require("../controller/protect");
const classController = require("../controller/classController");

const router = new express.Router();

router.route("/class/create_individual_class").post(auth, classController.setIndividualClass);
router.route("/class/create_group_class").post(auth, classController.setGroupClass);
router.route("/class/create_both_class").post(auth, classController.setBothClass);
router.route("/class/get_all_classes").get(auth, classController.get_All_classes);
router.route("/class/get_individual_classes").get(auth, classController.get_Individual_Classes);
router.route("/class/get_both_classes").get(auth, classController.get_Both_Classes);

router.route("/class/get_Class_Details").post(classController.get_Class_Details);

router.get("/classes", (req, res) =>
  Classes.findAll({
    attributes: ["class_id", "class_name"],
    where: { is_active: 1 },
  })
    .then((classes) => {
      if (classes.length > 0) {
        res.status(200).json({
          code: 200,
          message: "classes",
          data: classes,
        });
      } else {
        res.status(200).json({
          code: 200,
          message: "no class found",
          data: classes,
        });
      }
    })
    .catch((err) =>
      res.status(401).json({
        code: 401,
        message: "Something went wrong! Please try again.",
        data: [],
      })
    )
);

module.exports = router;
