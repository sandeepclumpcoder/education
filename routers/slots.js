const express = require("express");
const Slots = require("../models/slots");
const auth = require("../controller/protect");
const router = new express.Router();

router.get("/slots", auth, (req, res) =>
  Slots.findAll({
    attributes: ["slot_id", "slot"],
    where: { is_active: 1 },
  })
    .then((slots) => {
      if (slots.length > 0) {
        res.status(200).json({
          code: 200,
          message: "slots",
          data: slots,
        });
      } else {
        res.status(200).json({
          code: 200,
          message: "no class found",
          data: slots,
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
