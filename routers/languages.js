const express = require("express");
const Languages = require("../models/languages");
const auth = require("../controller/protect");
const router = new express.Router();

router.get("/languages", auth, (req, res) =>
  Languages.findAll({
    attributes: ["language_id", "language_name", "language_short_name"],
    where: { is_active: 1 },
  })
    .then((languages) => {
      if (languages.length > 0) {
        res.status(200).json({
          code: 200,
          message: "languages",
          data: languages,
        });
      } else {
        res.status(200).json({
          code: 200,
          message: "no languages found",
          data: languages,
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
