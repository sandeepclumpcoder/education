const express = require("express");
const Countries = require("../models/countries");
const auth = require("../controller/protect");
const router = new express.Router();

router.get("/countries", auth, (req, res) =>
  Countries.findAll({
    attributes: ["country_id", "country_name", "country_short_name"],
    where: { is_active: 1 },
  })
    .then((countries) => {
      if (countries.length > 0) {
        res.status(200).json({
          code: 200,
          message: "countries",
          data: countries,
        });
      } else {
        res.status(200).json({
          code: 200,
          message: "no countries found",
          data: countries,
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
