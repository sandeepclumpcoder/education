const ChatForum = require("./../models/chatForum");
const { QueryTypes } = require("sequelize");
const sequelize = require("./../db/sequelize");

exports.socket_example = async (socket, next) => {
  res.sendFile(__dirname + "/index.html");
  io.on("connect", (socket) => {
    console.log("herein socket");
    socket.on("chat message", async (data) => {
      //saving data to database

      let table_name, user_id, type;
      if (req.teacher_id) {
        table_name = "teacher_master";
        user_id = "teacher_id";
        type = "Teacher";
      } else if (req.user.student_id) {
        table_name = "student_master";
        user_id = "student_id";
        type = "Student";
      } else if (req.user.parent_id) {
        table_name = "parent_master";
        user_id = "parent_id";
        type = "Parent";
      }
      const user_name = await sequelize.query(
        `select name from ${table_name} where ${user_id} = ${data.id} and is_active=1`,
        {
          type: QueryTypes.SELECT,
        }
      );
      if (user_name) {
        io.emit(
          "chat message",
          JSON.stringify({
            name: data.name,
            message: data.value,
            current_time: new Date().toLocaleString(),
          })
        );
      }
      const details = {
        name: user_name[0].name,
        type: type,
        message: data.value,
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString(),
        expireDate: Date.now() + 24 * 60 * 60 * 1000,
      };
      const is_saved = await ChatForum.create(details);
    });
  });
};
