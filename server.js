const app = require("./app");
const express = require("express");

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log("Server is up on port " + port);
});
/*
io.on("connect", (socket) => {
  socket.on("join", ({ name, room }, callback) => {
    var a = addUser({ id: socket.id, name, room });
    console.log("a", a);
    const { error, user } = a;
    if (error) return callback(error);
    socket.join(user.room);
    //socket.emit('message', { user: 'admin', text: `${user.name}, welcome to room ${user.room}.`});
    //socket.broadcast.to(user.room).emit('message', { user: 'admin', text: `${user.name} has joined!` });
    io.to(user.room).emit("roomData", { room: user.room, users: getUsersInRoom(user.room) });
    callback();
  });

  socket.on("sendMessage", (message, callback) => {
    const user = getUser(socket.id);
    if (user) {
      io.to(user.room).emit("message", { user: user.name, text: message });

      pool1.getConnection(function (err, connection) {
        if (err) {
          console.log(err);
          //connection.release();
          throw err;
        }

        var users = {
          sender: user.name,
          message: message,
          room: user.room,
        };
        if (user.room !== undefined || user.room !== "undefined") {
          connection.query(
            "INSERT INTO chat_messages SET ?",
            users,
            function (error, results, fields) {
              console.log("msg saved");
            }
          );
        }
      });
      console.log("message", user);
    }

    callback();
  });

  socket.on("disconnect", () => {
    const user = removeUser(socket.id);

    console.log("removed user", user);

    if (user) {
      //io.to(user.room).emit('message', { user: 'Admin', text: `${user.name} has left.` });
      io.to(user.room).emit("roomData", { room: user.room, users: getUsersInRoom(user.room) });
    }
  });
});
*/
