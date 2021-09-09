const express = require("express");
const Resources = require("../models/resources");
const auth = require("../controller/protect");
const router = new express.Router();

router.get("/resources", auth, (req, res) => {
  Resources.findAll({
    attributes: ["resource_id", "resource_name", "resource_url"],
    where: {
      is_active: 1,
    },
  })
    .then((resources) => {
      if (resources.length > 0) {
        res.status(200).json({
          code: 200,
          message: "resources",
          data: resources,
        });
      } else {
        res.status(200).json({
          code: 200,
          message: "no resources found",
          data: resources,
        });
      }
    })
    .catch((err) =>
      res.status(401).json({
        code: 401,
        message: "Something went wrong! Please try again.",
        data: [],
      })
    );
});

router.get("/resource/details/:resource_id", auth, (req, res) => {
  Resources.findAll({
    attributes: ["resource_id", "resource_name", "resource_url"],
    where: {
      is_active: 1,
      resource_id: req.params.resource_id,
    },
  })
    .then((resources) => {
      if (resources.length > 0) {
        res.status(200).json({
          code: 200,
          message: "resource details",
          data: resources,
        });
      } else {
        res.status(200).json({
          code: 200,
          message: "no resources found",
          data: resources,
        });
      }
    })
    .catch((err) =>
      res.status(401).json({
        code: 401,
        message: "Something went wrong! Please try again.",
        data: [],
      })
    );
});

router.get("/resources/:class_id/:subject_id", auth, (req, res) => {
  console.log(req.params.subject_id, req.params.class_id);
  Resources.findAll({
    attributes: ["resource_id", "resource_name", "resource_url"],
    where: {
      is_active: 1,
      subject_id: req.params.subject_id,
      class_id: req.params.class_id,
    },
  })
    .then((resources) => {
      if (resources.length > 0) {
        res.status(200).json({
          code: 200,
          message: "resources",
          data: resources,
        });
      } else {
        res.status(200).json({
          code: 200,
          message: "no resources found",
          data: resources,
        });
      }
    })
    .catch((err) =>
      res.status(401).json({
        code: 401,
        message: "Something went wrong! Please try again.",
        data: [],
      })
    );
});

module.exports = router;
