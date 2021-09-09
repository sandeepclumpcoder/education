const express = require("express");
const Subjects = require("../models/subjects");
const auth = require("../controller/protect");
const db = require("../db/sequelize");
const { QueryTypes } = require("sequelize");
const router = new express.Router();

router.get("/subjects", auth, (req, res) =>
  Subjects.findAll({
    attributes: ["subject_id", "subject_name"],
    where: { is_active: 1 },
  })
    .then((subjects) => {
      if (subjects.length > 0) {
        res.status(200).json({
          code: 200,
          message: "subjects",
          data: subjects,
        });
      } else {
        res.status(200).json({
          code: 200,
          message: "no subjects found",
          data: subjects,
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

router.get("/subject/details/:subject_id", auth, (req, res) =>
  Subjects.findOne({
    attributes: ["subject_name", "description", "img_url"],
    where: { is_active: 1, subject_id: req.params.subject_id },
  })
    .then((subjects) => {
      if (subjects.length > 0) {
        res.status(200).json({
          code: 200,
          message: "subjects",
          data: subjects,
        });
      } else {
        res.status(200).json({
          code: 200,
          message: "no subjects found",
          data: subjects,
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

router.get("/subjects/:class_id", auth, async (req, res) => {
  try {
    const subjects = await db.query(
      `SELECT a.subject_id,a.subject_name FROM subject_master as a, subject_details as b where a.subject_id = b.subject_id and b.class_id = ${req.params.class_id} group by a.subject_id`,
      { type: QueryTypes.SELECT }
    );
    console.log(subjects);
    if (subjects.length > 0) {
      res.status(200).json({
        code: 200,
        message: "subjects",
        data: subjects,
      });
    } else {
      res.status(200).json({
        code: 200,
        message: "no subjects found",
        data: subjects,
      });
    }
  } catch (ex) {
    res.status(401).json({
      code: 401,
      message: "Something went wrong! Please try again.",
      data: [],
    });
  }
});

module.exports = router;
