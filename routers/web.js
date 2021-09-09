const express = require("express");
const bcrypt = require("bcryptjs");
const paypal = require("paypal-rest-sdk");
const jwt = require("jsonwebtoken");

paypal.configure({
  mode: "sandbox", //sandbox or live
  client_id: process.env.paypal_client_id,
  client_secret: process.env.paypal_client_secret,
});

const Teachers = require("../models/teachers");
const Students = require("../models/students");
const Paintings = require("../models/paintings");
const Cart = require("../models/cart");
const Payment = require("../models/payment");
const Parents = require("../models/parents");
const sequelize = require("../db/sequelize");
const router = new express.Router();

const { QueryTypes, Op } = require("sequelize");

const auth = require("../controller/protect");
const AppError = require("../utils/appError");

const createAndSendToken = (sign_obj, res, key) => {
  const token = jwt.sign({ sign_obj }, key);
  return token;
  /*res.cookie("jwt", token, {
    //secure: true,
    httpOnly: true,
  });*/
};

router.post("/login", async (req, res, next) => {
  try {
    if (req.body.designation == 1) {
      Teachers.findOne({
        attributes: ["teacher_id", "name", "profile_img", "password", "is_global"],
        where: {
          email: req.body.email,
          is_active: 1,
        },
      })
        .then(async (teacher) => {
          if (teacher && teacher.teacher_id != undefined) {
            let is_match = await bcrypt.compare(req.body.password, teacher.password);

            if (!is_match) {
              return next(new AppError(401, "Invalid email or password"));
            }
            delete teacher.dataValues.password;

            let type = { type: "teacher" };
            let sign_obj = { ...teacher.dataValues, ...type };
            const token = createAndSendToken(sign_obj, res, process.env.JWT_SECRET_KEY);
            res.status(200).json({
              code: 200,
              message: "Logged in successfully.",
              data: {
                id: teacher.teacher_id,
                name: teacher.name,
                type: "teacher",
                designation: 1,
                token,
              },
            });
          } else {
            return next(new AppError(401, "Invalid email or password"));
          }
        })
        .catch((err) => {
          return next(new AppError(401, "Something went wrong."));
        });
    } else if (req.body.designation == 2) {
      Students.findOne({
        attributes: ["student_id", "name", "password"],
        where: {
          email: req.body.email,
          is_active: 1,
        },
      })
        .then(async (teacher) => {
          console.log(teacher);
          if (teacher && teacher.student_id != undefined) {
            let is_match = await bcrypt.compare(req.body.password, teacher.password);

            if (!is_match) {
              return next(new AppError(401, "Invalid email or password"));
            }

            delete teacher.dataValues.password;

            let type = { type: "student" };
            let sign_obj = { ...teacher.dataValues, ...type };
            const token = createAndSendToken(sign_obj, res, process.env.JWT_SECRET_KEY);
            res.status(200).json({
              code: 200,
              message: "Logged in successfully.",
              data: {
                id: teacher.student_id,
                name: teacher.name,
                type: "student",
                designation: 2,
                token,
              },
            });
          } else {
            return next(new AppError(401, "Invalid email or password"));
          }
        })
        .catch((err) => {
          return next(new AppError(401, "Something went wrong."));
        });
    } else if (req.body.designation == 3) {
      Parents.findOne({
        attributes: ["parent_id", "name", "password"],
        where: {
          email: req.body.email,
          is_active: 1,
        },
      })
        .then(async (teacher) => {
          console.log(teacher);
          if (teacher && teacher.parent_id != undefined) {
            let is_match = await bcrypt.compare(req.body.password, teacher.password);

            if (!is_match) {
              return next(new AppError(401, "Invalid email or password"));
            }

            delete teacher.dataValues.password;

            let type = { type: "parent_id" };
            let sign_obj = { ...teacher.dataValues, ...type };
            const token = createAndSendToken(sign_obj, res, process.env.JWT_SECRET_KEY);

            res.status(200).json({
              code: 200,
              message: "Logged in successfully.",
              data: {
                id: teacher.parent_id,
                name: teacher.name,
                type: "parent_id",
                designation: 3,
                token,
              },
            });
          } else {
            return next(new AppError(401, "Invalid email or password"));
          }
        })
        .catch((err) => {
          return next(new AppError(401, "Something went wrong."));
        });
    } else {
      return next(new AppError(401, "Missing parameters"));
    }
  } catch (e) {
    return next(new AppError(401, "Something went wrong."));
  }
});

router.post("/signup", async (req, res, next) => {
  try {
    if (req.body.designation == 1) {
      let { name, mobile, email, dob, is_global } = req.body;
      let password = await bcrypt.hash(req.body.password, 8);
      let teacher_exists = await Teachers.findAll({ where: { email } });

      if (teacher_exists.length > 0) {
        return next(new AppError(401, "This email is already registered with us."));
      }

      Teachers.create({ name, mobile, email, dob, password, is_global })
        .then(async (teacher) => {
          let _teacher = await Teachers.findOne({
            attributes: ["teacher_id", "name", "profile_img"],
            where: { teacher_id: teacher.teacher_id },
          });

          let type = { type: "teacher" };
          let sign_obj = { ..._teacher.dataValues, ...type };
          console.log(_teacher);
          const token = createAndSendToken(sign_obj, res, process.env.JWT_SECRET_KEY);
          res.status(201).json({
            code: 201,
            message: "Signup successfull.",
            data: {
              id: _teacher.teacher_id,
              name: _teacher.name,
              type: "teacher",
              designation: 1,
              token,
            },
          });
        })
        .catch((err) => {
          return next(new AppError(401, "Something went wrong"));
        });
    } else if (req.body.designation == 2) {
      let { name, mobile, email, dob } = req.body;
      let password = await bcrypt.hash(req.body.password, 8);

      let teacher_exists = await Students.findAll({ where: { email } });

      if (teacher_exists.length > 0) {
        return next(new AppError(400, "This email is already registered with us."));
      }

      Students.create({ name, mobile, email, dob, password })
        .then(async (teacher) => {
          let _teacher = await Students.findOne({
            attributes: ["student_id", "name", "profile_img"],
            where: { student_id: teacher.student_id },
          });

          let type = { type: "student" };
          let sign_obj = { ..._teacher.dataValues, ...type };
          const token = createAndSendToken(sign_obj, res, process.env.JWT_SECRET_KEY);

          res.status(201).json({
            code: 201,
            message: "Signup successfull.",
            data: {
              id: _teacher.student_id,
              name: _teacher.name,
              type: "student",
              designation: 2,
              token,
            },
          });
        })
        .catch((err) => {
          return next(new AppError(401, "Something went wrong"));
        });
    } else if (req.body.designation == 3) {
      let { name, mobile, email, dob } = req.body;
      let password = await bcrypt.hash(req.body.password, 8);

      let teacher_exists = await Parents.findAll({ where: { email } });

      if (teacher_exists.length > 0) {
        return next(new AppError(401, "This email is already registered with us."));
      }

      Parents.create({ name, mobile, email, dob, password })
        .then(async (teacher) => {
          let _teacher = await Parents.findOne({
            attributes: ["parent_id", "name", "profile_img"],
            where: { parent_id: teacher.parent_id },
          });

          let type = { type: "parent_id" };
          let sign_obj = { ..._teacher.dataValues, ...type };
          const token = createAndSendToken(sign_obj, res, process.env.JWT_SECRET_KEY);
          res.status(201).json({
            code: 201,
            message: "Signup successfull.",
            data: { id: _teacher.parent_id, name: _teacher.name, type: "parent", designation: 3 },
            token,
          });
        })
        .catch((err) => {
          return next(new AppError(401, "Something went wrong"));
        });
    } else {
      return next(new AppError(401, "Something went wrong"));
    }
  } catch (e) {
    return next(new AppError(401, "Something went wrong"));
  }
});

router.get("/paintings", auth, (req, res, next) =>
  Paintings.findAll({
    attributes: ["id", "painting_name", "date", "time", "description", "image"],
  })
    .then((paintings) => {
      if (paintings.length > 0) {
        res.status(200).json({
          code: 200,
          message: "paintings",
          data: paintings,
        });
      } else {
        res.status(200).json({
          code: 200,
          message: "no paintings found",
          data: paintings,
        });
      }
    })
    .catch((err) => next(new AppError(401, "Something went wrong! Please try again.")))
);

router.get("/other_paintings/:id", auth, (req, res, next) => {
  console.log("req.params.id", req.params.id);
  Paintings.findAll({
    attributes: ["id", "painting_name", "date", "time", "description", "image"],
    where: { id: { [Op.ne]: req.params.id } },
    raw: true,
  })
    .then((paintings) => {
      if (paintings.length > 0) {
        res.status(200).json({
          code: 200,
          message: "paintings",
          data: paintings,
        });
      } else {
        res.status(200).json({
          code: 200,
          message: "no paintings found",
          data: paintings,
        });
      }
    })
    .catch((err) => next(new AppError(401, "Something went wrong! Please try again.")));
});

router.get("/paintings/:id", auth, (req, res, next) =>
  Paintings.findAll({
    attributes: [
      "id",
      "painting_name",
      "image",
      "artist_name",
      "date",
      "time",
      "rate",
      "materials_required",
      "description",
      "terms_condition",
    ],
    where: { id: req.params.id },
  })
    .then((paintings) => {
      if (paintings.length > 0) {
        res.status(200).json({
          code: 200,
          message: "paintings",
          data: paintings,
        });
      } else {
        res.status(200).json({
          code: 200,
          message: "no paintings found",
          data: paintings,
        });
      }
    })
    .catch((err) => next(new AppError(401, "Something went wrong! Please try again.")))
);

router.post("/addCart", auth, async (req, res, next) => {
  try {
    Paintings.findOne({
      attributes: ["id"],
      where: {
        id: req.body.painting_id,
      },
    })
      .then(async (painting) => {
        if (painting.id != undefined) {
          if (req.body.designation == 1) {
            Teachers.findOne({
              attributes: ["teacher_id"],
              where: {
                teacher_id: req.body.user_id,
              },
            })
              .then(async (teacher) => {
                if (teacher && teacher.teacher_id != undefined) {
                  Cart.findOne({
                    attributes: ["id"],
                    where: {
                      painting_id: req.body.painting_id,
                      user_id: req.body.user_id,
                      designation: req.body.designation,
                    },
                  })
                    .then(async (cart) => {
                      if (cart && cart.id != undefined) {
                        res.status(401).json({
                          code: 200,
                          message: "You have already this in your cart!",
                          data: {},
                        });
                      } else {
                        let { painting_id, user_id, designation } = req.body;

                        Cart.create({
                          painting_id,
                          user_id,
                          designation,
                        })
                          .then((cartadd) => {
                            res.status(201).json({
                              code: 201,
                              message: "Successfully added in your cart.",
                              data: [],
                            });
                          })
                          .catch((err) => {
                            return next(new AppError(401, "Error, while adding in your cart."));
                          });
                      }
                    })
                    .catch((err) => {
                      return next(new AppError(401, "Something went wrong"));
                    });
                } else {
                  return next(new AppError(401, "Invalid details"));
                }
              })
              .catch((err) => {
                return next(new AppError(401, "Something went wrong"));
              });
          } else if (req.body.designation == 2) {
            Students.findOne({
              attributes: ["student_id"],
              where: {
                student_id: req.body.user_id,
              },
            })
              .then(async (students) => {
                if (students && students.student_id != undefined) {
                  Cart.findOne({
                    attributes: ["id"],
                    where: {
                      painting_id: req.body.painting_id,
                      user_id: req.body.user_id,
                      designation: req.body.designation,
                    },
                  })
                    .then(async (cart) => {
                      if (cart && cart.id != undefined) {
                        return next(new AppError(401, "This item is already in your cart!"));
                      } else {
                        let { painting_id, user_id, designation } = req.body;

                        Cart.create({
                          painting_id,
                          user_id,
                          designation,
                        })
                          .then((cartadd) => {
                            res.status(201).json({
                              code: 201,
                              message: "Successfully added in your cart.",
                              data: [],
                            });
                          })
                          .catch((err) => {
                            return next(new AppError(401, "Error while adding in your cart."));
                          });
                      }
                    })
                    .catch((err) => {
                      return next(new AppError(401, "Something went wrong"));
                    });
                } else {
                  return next(new AppError(401, "Invalid details"));
                }
              })
              .catch((err) => {
                return next(new AppError(401, "Something went wrong"));
              });
          } else if (req.body.designation == 3) {
            Parents.findOne({
              attributes: ["parent_id"],
              where: {
                parent_id: req.body.user_id,
              },
            })
              .then(async (parents) => {
                if (parents && parents.parent_id != undefined) {
                  Cart.findOne({
                    attributes: ["id"],
                    where: {
                      painting_id: req.body.painting_id,
                      user_id: req.body.user_id,
                      designation: req.body.designation,
                    },
                  })
                    .then(async (cart) => {
                      if (cart && cart.id != undefined) {
                        res.status(401).json({
                          code: 200,
                          message: "You have already this in your cart!",
                          data: {},
                        });
                      } else {
                        let { painting_id, user_id, designation } = req.body;

                        Cart.create({
                          painting_id,
                          user_id,
                          designation,
                        })
                          .then((cartadd) => {
                            res.status(201).json({
                              code: 201,
                              message: "Successfully added in your cart.",
                              data: [],
                            });
                          })
                          .catch((err) => {
                            return next(new AppError(401, "Error while adding in your cart."));
                          });
                      }
                    })
                    .catch((err) => {
                      return next(new AppError(401, "Something went wrong"));
                    });
                } else {
                  return next(new AppError(401, "Invalid details"));
                }
              })
              .catch((err) => {
                return next(new AppError(401, "Something went wrong"));
              });
          } else {
            return next(new AppError(401, "Designation is missing!"));
          }
        } else {
          return next(new AppError(401, "Invalid details"));
        }
      })
      .catch((err) => {
        return next(new AppError(401, "Something went wrong"));
      });
  } catch (e) {
    return next(new AppError(401, "Something went wrong"));
  }
});

router.post("/cartDetails", auth, async (req, res, next) => {
  try {
    var userExist = false;
    if (req.body.designation == 1) {
      const teacher = await Teachers.findOne({ where: { teacher_id: req.body.user_id } });

      if (teacher != null) {
        userExist = true;
      } else {
        return next(new AppError(403, "Teacher not found."));
      }
    } else if (req.body.designation == 2) {
      const student = await Students.findOne({ where: { student_id: req.body.user_id } });

      if (student != null) {
        userExist = true;
      } else {
        return next(new AppError(403, "Student not found."));
      }
    } else if (req.body.designation == 3) {
      const parent = await Parents.findOne({ where: { parent_id: req.body.user_id } });

      if (parent != null) {
        userExist = true;
      } else {
        return next(new AppError(403, "Parent not found."));
      }
    } else {
      return next(new AppError(403, "Designation is missing."));
    }

    if (userExist) {
      let cartDetails = await sequelize.query(
        `SELECT * FROM cart, paintings where cart.user_id=${req.body.user_id} and cart.designation=${req.body.designation} and cart.painting_id=paintings.id;`,
        { type: QueryTypes.SELECT }
      );

      res.status(200).json({
        code: 200,
        message: "cartDetails",
        data: cartDetails,
      });
    } else {
      return next(new AppError(403, "Invalid details"));
    }
  } catch (e) {
    return next(new AppError(403, "Something went wrong"));
  }
});

router.post("/removeFromcartDetails", auth, async (req, res, next) => {
  try {
    var userExist = false;
    if (req.body.designation == 1) {
      const teacher = await Teachers.findOne({ where: { teacher_id: req.body.user_id } });

      if (teacher != null) {
        userExist = true;
      } else {
        return next(new AppError(403, "Teacher not found"));
      }
    } else if (req.body.designation == 2) {
      const student = await Students.findOne({ where: { student_id: req.body.user_id } });

      if (student != null) {
        userExist = true;
      } else {
        return next(new AppError(403, "Student not found"));
      }
    } else if (req.body.designation == 3) {
      const parent = await Parents.findOne({ where: { parent_id: req.body.user_id } });

      if (parent != null) {
        userExist = true;
      } else {
        return next(new AppError(403, "Parent not found"));
      }
    } else {
      return next(new AppError(403, "Designation is missing"));
    }

    if (userExist) {
      Cart.destroy({
        where: {
          user_id: req.body.user_id,
          designation: req.body.designation,
          painting_id: req.body.painting_id,
        },
      })
        .then((cartremove) => {
          sequelize
            .query(
              `SELECT * FROM cart, paintings where cart.user_id=${req.body.user_id} and cart.designation=${req.body.designation} and cart.painting_id=paintings.id;`,
              { type: QueryTypes.SELECT }
            )
            .then((cart) => {
              res.status(200).json({
                code: 200,
                message: "updated cartDetails",
                data: cart,
              });
            });
        })
        .catch((err) => {
          return next(new AppError(403, "Error, while removing from your cart."));
        });
    } else {
      return next(new AppError(403, "Invalid details"));
    }
  } catch (e) {
    return next(new AppError(403, "Something went wrong."));
  }
});

router.post("/pay", auth, async (req, res, next) => {
  b = JSON.parse(JSON.stringify(req.body.items));

  b.forEach((entry) => {
    console.log(entry);
    delete entry.painting_id;
  });

  const create_payment_json = {
    intent: "sale",
    payer: {
      payment_method: req.body.payment_method,
    },
    redirect_urls: {
      return_url: req.body.return_url,
      cancel_url: req.body.cancel_url,
    },
    transactions: [
      {
        item_list: {
          items: b,
        },
        amount: req.body.amount,
        description: "Purchasing Painting",
      },
    ],
  };
  // console.log("create_payment_json", create_payment_json);
  // console.log("bs", b);
  // console.log("req.body.items", req.body.items);return false;
  paypal.payment.create(create_payment_json, function (error, payment) {
    if (error) {
      throw error;
    } else {
      console.log("payment", payment.id);
      try {
        if (req.body.designation == 1) {
          Teachers.findOne({
            attributes: ["teacher_id"],
            where: {
              teacher_id: req.body.user_id,
            },
          })
            .then(async (teacher) => {
              if (teacher && teacher.teacher_id != undefined) {
                let { items } = req.body;

                var arr = [];

                await items.forEach((single) => {
                  arr.push({
                    payment_method: req.body.payment_method,
                    paymentId: payment.id,
                    amount: single.price,
                    user_id: req.body.user_id,
                    designation: req.body.designation,
                    painting_id: single.painting_id,
                    currency: single.currency,
                  });
                });

                Payment.bulkCreate(arr)
                  .then((createpayment) => {
                    for (let i = 0; i < payment.links.length; i++) {
                      if (payment.links[i].rel === "approval_url") {
                        console.log("approval_url", payment.links[i].href);

                        //res.redirect(payment.links[i].href);
                        res.status(200).json({
                          code: 200,
                          message: "Payment url.",
                          data: [{ payment_url: payment.links[i].href }],
                        });
                        return false;
                      }
                    }
                  })
                  .catch((err) => {
                    return next(new AppError(401, "Error"));
                  });
              } else {
                return next(new AppError(401, "Invalid details"));
              }
            })
            .catch((err) => {
              return next(new AppError(401, "Something went wrong."));
            });
        } else if (req.body.designation == 2) {
          Students.findOne({
            attributes: ["student_id"],
            where: {
              student_id: req.body.user_id,
            },
          })
            .then(async (students) => {
              if (students && students.student_id != undefined) {
                let { items } = req.body;

                var arr = [];

                await items.forEach((single) => {
                  arr.push({
                    payment_method: req.body.payment_method,
                    paymentId: payment.id,
                    amount: single.price,
                    user_id: req.body.user_id,
                    designation: req.body.designation,
                    painting_id: single.painting_id,
                    currency: single.currency,
                  });
                });

                Payment.bulkCreate(arr)
                  .then((createpayment) => {
                    for (let i = 0; i < payment.links.length; i++) {
                      if (payment.links[i].rel === "approval_url") {
                        console.log("approval_url", payment.links[i].href);

                        //res.redirect(payment.links[i].href);
                        res.status(200).json({
                          code: 200,
                          message: "Payment url.",
                          data: [{ payment_url: payment.links[i].href }],
                        });
                        return false;
                      }
                    }
                  })
                  .catch((err) => {
                    return next(new AppError(401, "Error"));
                  });
              } else {
                return next(new AppError(401, "Invalid details."));
              }
            })
            .catch((err) => {
              return next(new AppError(401, "Something went wrong"));
            });
        } else if (req.body.designation == 3) {
          Parents.findOne({
            attributes: ["parent_id"],
            where: {
              parent_id: req.body.user_id,
            },
          })
            .then(async (parents) => {
              if (parents && parents.parent_id != undefined) {
                let { items } = req.body;

                var arr = [];

                await items.forEach((single) => {
                  arr.push({
                    payment_method: req.body.payment_method,
                    paymentId: payment.id,
                    amount: single.price,
                    user_id: req.body.user_id,
                    designation: req.body.designation,
                    painting_id: single.painting_id,
                    currency: single.currency,
                  });
                });

                Payment.bulkCreate(arr)
                  .then((createpayment) => {
                    for (let i = 0; i < payment.links.length; i++) {
                      if (payment.links[i].rel === "approval_url") {
                        console.log("approval_url", payment.links[i].href);

                        //res.redirect(payment.links[i].href);
                        res.status(200).json({
                          code: 200,
                          message: "Payment url.",
                          data: [{ payment_url: payment.links[i].href }],
                        });
                        return false;
                      }
                    }
                  })
                  .catch((err) => {
                    return next(new AppError(401, "Error"));
                  });
              } else {
                return next(new AppError(401, "Invalid details"));
              }
            })
            .catch((err) => {
              return next(new AppError(401, "Something went wrong"));
            });
        } else {
          return next(new AppError(401, "Designation is missing!"));
        }
      } catch (e) {
        return next(new AppError(500, "Something went wrong"));
      }
    }
  });
});

router.post("/executePayment", auth, async (req, res, next) => {
  const payerId = req.body.PayerID;
  const paymentId = req.body.paymentId;

  Payment.findAll({
    attributes: ["currency", [sequelize.fn("sum", sequelize.col("amount")), "total"]],
    group: ["paymentId"],
    raw: true,
    where: {
      paymentId: paymentId,
    },
  })
    .then(async (paymentinfo) => {
      console.log("paymentinfo", paymentinfo);
      console.log("paymentinfo.total", paymentinfo.total);
      if (paymentinfo && paymentinfo[0].total != null && paymentinfo[0].total != undefined) {
        const execute_payment_json = {
          payer_id: payerId,
          transactions: [
            {
              amount: paymentinfo[0],
            },
          ],
        };

        paypal.payment.execute(paymentId, execute_payment_json, function (error, payment) {
          if (error) {
            console.log(error.response);
            throw error;
          } else {
            //console.log(JSON.stringify(payment));
            if (payment.httpStatusCode == 200) {
              Payment.update({ PayerID: payerId, status: 1 }, { where: { paymentId: paymentId } })
                .then((result) => {
                  res.status(200).json({
                    code: 200,
                    message: "Payment is successfully done.",
                    data: {},
                  });
                })
                .catch((err) => {
                  return next(new AppError(401, "Error while executing payment"));
                });
            } else {
              return next(new AppError(401, "Error while executing payment"));
            }
          }
        });
      } else {
        return next(new AppError(401, "Something went wrong"));
      }
    })
    .catch((err) => {
      return next(new AppError(401, "Something went wrong"));
    });
});

module.exports = router;
