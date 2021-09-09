const express = require("express");
const sendDetailsController = require("./../controller/sendDetailsController");
const auth = require("./../controller/protect");

const router = express();

router.route("/teacher/get_Countries_name").get(sendDetailsController.get_Countries_name);
router.route("/teacher/get_languages").get(sendDetailsController.get_languages);
router
  .route("/teacher/get_subjects_by_class_id/:class_id")
  .get(auth, sendDetailsController.get_subject_by_class_id);

router.route("/teacher/get_days_and_slots").get(auth, sendDetailsController.get_days_and_slots);

router
  .route("/teacher/get_subject_by_class_and_tecaher_id/:class_id")
  .get(auth, sendDetailsController.get_subject_by_class_and_tecaher_id);

router
  .route("/teacher/get_classes_by_teacher_id")
  .get(auth, sendDetailsController.get_classes_by_teacher_id);

router
  .route("/teacher/get_course_and_description_by_teacher_id/:course_id")
  .get(auth, sendDetailsController.get_course_and_description_by_teacher_id);

router.get("/teacher/profile_details/", auth, sendDetailsController.profile_details);
router.get("/admin/profile_details/:teacher_id", auth, sendDetailsController.profile_details);

module.exports = router;
