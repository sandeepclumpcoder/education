const { QueryTypes } = require("sequelize");
const sequelize = require("../db/sequelize");
const Courses = require("../models/courses");
const Lesson_Plan = require("../models/lesson_plan");
const WeeklyTT = require("../models/weeklyTT");
const AppError = require("../utils/appError");

/****************************************CREATE COURSES/NEW CLASS SECTION*************************************************** */

exports.setIndividualClass = async (req, res, next) => {
  try {
    const data = {
      title: req.body.title,
      class_id: req.body.class_id,
      subject_id: req.body.subject_id,
      teacher_id: req.user.teacher_id,
      description: req.body.description,
      duration: req.body.duration,
      class_type: "individual",
      no_of_classes: req.body.no_of_classes,
      class_fee_individual: req.body.class_fee_individual,
      start_date: req.body.start_date,
      minimum_students: 1,
    };

    const course = await Courses.create(data);

    if (!course) return next(new AppError(400, "unable to create class"));

    req.body.slots.forEach(async (el) => {
      let slots = await WeeklyTT.create({
        course_id: course.course_id,
        day_id: el.day_id,
        slot_id: el.slot_id,
        class_type: "individual",
      });
      if (!slots) return next(new AppError(401, "Error while adding slots"));
    });

    if (!(req.body.lesson_plan.length === req.body.no_of_classes))
      return next(new AppError(400, "You should enter lesson plan for each class"));

    req.body.lesson_plan.forEach(async (el, index) => {
      const data = {
        course_id: course.course_id,
        plan_no: index,
        description: el,
      };
      let lesson_plan = await Lesson_Plan.create(data);
      if (!lesson_plan) return next(new AppError(401, "Error while adding lesson plan"));
    });

    res.status(200).json({
      status: "success",
      data: "New individual class is created and send for approval",
    });
  } catch (err) {
    return next(new AppError(500, "Something went wrong"));
  }
};

exports.setGroupClass = async (req, res, next) => {
  try {
    const data = {
      title: req.body.title,
      class_id: req.body.class_id,
      subject_id: req.body.subject_id,
      teacher_id: req.user.teacher_id,
      description: req.body.description,
      duration: req.body.duration,
      class_type: "group",
      no_of_classes: req.body.no_of_classes,
      class_fee_group: req.body.class_fee_group,
      start_date: req.body.start_date,
      minimum_students: req.body.minimum_students,
    };

    const course = await Courses.create(data);

    if (!course) return next(new AppError(400, "unable to create class"));

    req.body.slots.forEach(async (el) => {
      let slots = await WeeklyTT.create({
        course_id: course.course_id,
        day_id: el.day_id,
        slot_id: el.slot_id,
        class_type: "group",
      });
      if (!slots) return next(new AppError(401, "Error while adding slots"));
    });

    if (!(req.body.lesson_plan.length === req.body.no_of_classes))
      return next(new AppError(400, "You should enter lesson plan for each class"));

    req.body.lesson_plan.forEach(async (el, index) => {
      const data = {
        course_id: course.course_id,
        plan_no: index,
        description: el,
      };
      let lesson_plan = await Lesson_Plan.create(data);
      if (!lesson_plan) return next(new AppError(401, "Error while adding lesson plan"));
    });

    res.status(200).json({
      status: "success",
      data: "New group class is created and send for approval",
    });
  } catch (err) {
    return next(new AppError(500, "Something went wrong"));
  }
};

exports.setGroupClasses = async (req, res, next) => {
  try {
    const data = {
      courseTitle: req.body.courseTitle,
      description: req.body.description,
      duration: req.body.duration,
      classType: "group",
      groupFee: req.body.groupFee,
      minimumStudent: req.body.minimumStudent,
      numOfClasses: req.body.numOfClasses,
      startDate: req.body.startDate,
      weeklyTT: req.body.weeklyTT,
      lessonPlan: req.body.lessonPlan,
    };
    const updated = await Classes.create(data);
    req.user.classes.push(updated._id);
    await req.user.save();
    res.status(200).json({
      status: "success",
      data: updated,
    });
  } catch (err) {
    return next(new AppError(500, "SOmething went wrong"));
  }
};

exports.setBothClass = async (req, res, next) => {
  try {
    const data = {
      title: req.body.title,
      class_id: req.body.class_id,
      subject_id: req.body.subject_id,
      teacher_id: req.user.teacher_id,
      description: req.body.description,
      duration: req.body.duration,
      class_type: "both",
      no_of_classes: req.body.no_of_classes,
      class_fee_group: req.body.class_fee_group,
      class_fee_group: req.body.class_fee_group,
      start_date: req.body.start_date,
      minimum_students: req.body.minimum_students,
    };

    const course = await Courses.create(data);

    if (!course) return next(new AppError(400, "unable to create class"));

    req.body.slots1.forEach(async (el) => {
      let slots = await WeeklyTT.create({
        course_id: course.course_id,
        day_id: el.day_id,
        slot_id: el.slot_id,
        class_type: "individual",
      });
      if (!slots) return next(new AppError(401, "Error while adding slots"));
    });

    req.body.slots2.forEach(async (el) => {
      let slots = await WeeklyTT.create({
        course_id: course.course_id,
        day_id: el.day_id,
        slot_id: el.slot_id,
        class_type: "group",
      });
      if (!slots) return next(new AppError(401, "Error while adding slots"));
    });

    if (!(req.body.lesson_plan.length === req.body.no_of_classes))
      return next(new AppError(400, "You should enter lesson plan for each class"));

    req.body.lesson_plan.forEach(async (el, index) => {
      const data = {
        course_id: course.course_id,
        plan_no: index,
        description: el,
      };
      let lesson_plan = await Lesson_Plan.create(data);
      if (!lesson_plan) return next(new AppError(401, "Error while adding lesson plan"));
    });

    res.status(200).json({
      status: "success",
      data: "New class for individual and both is created",
    });
  } catch (err) {
    return next(new AppError(500, "Something went wrong"));
  }
};
/********************************************************************************************************/

/******************************************GET COURSES SECTION**************************************************************/
exports.get_All_classes = async (req, res, next) => {
  try {
    let data = await sequelize.query(
      `select cm.course_id,cm.title,cm.description,cm.class_type,cm.minimum_students from course_master as cm where cm.is_active=1 and cm.is_approved=1 and cm.teacher_id = ${req.user.teacher_id}`,
      {
        type: QueryTypes.SELECT,
      }
    );
    temp = 0;
    let slots = [];

    if (data.length === 0) {
      return res.status(200).json({
        status: "success",
        message: "you have not created any course or course is still under approval.",
      });
    }
    while (temp < data.length) {
      slots[temp] = await sequelize.query(
        `select day,slot,wtt.class_type from weekly_time_table as wtt, slot_master as sm, classes_day as cd where course_id = ${data[temp].course_id} and wtt.day_id = cd.day_id and wtt.slot_id= sm.slot_id`,
        {
          type: QueryTypes.SELECT,
        }
      );
      data[temp].slots = slots[temp];
      temp++;
    }

    if (!data) return next(new AppError(401, "unable to reterive data"));
    res.status(200).json({
      status: "success",
      data,
    });
  } catch (err) {
    return next(new AppError(500, "Something went wrong"));
  }
};

exports.get_Individual_Classes = async (req, res, next) => {
  try {
    let data = await sequelize.query(
      `select cm.course_id,cm.title,cm.description,cm.class_type,cm.minimum_students from course_master as cm where cm.is_active=1 and cm.class_type='individual' and cm.teacher_id = ${req.user.teacher_id}`,
      {
        type: QueryTypes.SELECT,
      }
    );
    if (data.length === 0) {
      return res.status(200).json({
        status: "success",
        message: "you have not created any course or course is still under approval.",
      });
    }
    temp = 0;
    let slots = [];
    while (temp < data.length) {
      slots[temp] = await sequelize.query(
        `select day,slot from weekly_time_table as wtt, slot_master as sm, classes_day as cd where course_id = ${data[temp].course_id} and wtt.day_id = cd.day_id and wtt.slot_id= sm.slot_id`,
        {
          type: QueryTypes.SELECT,
        }
      );
      data[temp].slots = slots[temp];
      temp++;
    }

    if (!data) return next(new AppError(401, "unable to reterive data"));
    res.status(200).json({
      status: "success",
      data,
    });
  } catch (err) {
    return next(new AppError(500, "Something went wrong"));
  }
};

exports.get_Both_Classes = async (req, res, next) => {
  try {
    let data = await sequelize.query(
      `select cm.course_id,cm.title,cm.description,cm.class_type,cm.minimum_students from course_master as cm where cm.is_active=1 and cm.class_type='both' and cm.teacher_id = ${req.user.teacher_id}`,
      {
        type: QueryTypes.SELECT,
      }
    );

    if (data.length === 0) {
      return res.status(200).json({
        status: "success",
        message: "you have not created any course or course is still under approval.",
      });
    }
    temp = 0;
    let slots = [];
    while (temp < data.length) {
      slots[temp] = await sequelize.query(
        `select day,slot, wtt.class_type from weekly_time_table as wtt, slot_master as sm, classes_day as cd where course_id = ${data[temp].course_id} and wtt.day_id = cd.day_id and wtt.slot_id= sm.slot_id`,
        {
          type: QueryTypes.SELECT,
        }
      );
      data[temp].slots = slots[temp];
      temp++;
    }

    if (!data) return next(new AppError(401, "unable to reterive data"));
    res.status(200).json({
      status: "success",
      data,
    });
  } catch (err) {
    return next(new AppError(500, "Something went wrong"));
  }
};

exports.get_Class_Details = async (req, res, next) => {
  try {
    const details = await sequelize.query(
      `SELECT * from course_master where class_id = ${req.body.class_id} and subject_id = ${req.body.subject_id}`,
      { type: QueryTypes.SELECT }
    );
    res.status(200).json({
      status: "success",
      result: details,
    });
  } catch (err) {
    return next(new AppError(500, "Something went wrong"));
  }
};

exports.getClasses = async (req, res, next) => {
  try {
    let data = [];
    for (temp of req.user.classes) {
      data.push(await Classes.findOne(temp._id));
    }

    res.status(200).json({
      status: "success",
      result: data.length,
      data,
    });
  } catch (err) {
    return next(new AppError(500, "SOmething went wrong"));
  }
};
