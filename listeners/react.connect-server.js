import jwt from "jsonwebtoken";
import userRepository from "../data/repositories/user.repository.js";

export default (
  io,
  socket,
  listOnlinePlayers,
  checkOnlineUsers,
  rooms,
  checkUserInRoom
) => {
  socket.on("react:connect-server", async ({ token }) => {
    // Identify and get info user by token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const id = decoded.user.id;
    const user = await userRepository.getUserById(id);
    // Mark user is online
    if (!checkOnlineUsers || !checkOnlineUsers[user.username])
      listOnlinePlayers.push({
        username: user.username,
        fullname: user.fullname,
      });
    // Notify all
    io.emit("server:list-online-players", listOnlinePlayers);
    checkOnlineUsers[user.username] = socket.id;
    checkOnlineUsers[socket.id] = user.username;
    // Check Whether user is in room or not
    const roomId = checkUserInRoom[user.username];
    if (roomId) {
      socket.join(roomId);
      // Check this room is available
      if (rooms[roomId]) {
        rooms[roomId].messages.push({
          username: "admin",
          message: user.username + " reconnected",
        });
        const indexPlayerinRoom = rooms[roomId].member.findIndex(
          (player) => player.username === user.username
        );
        // Mark offline this player in room
        rooms[roomId].member[indexPlayerinRoom].isOnline = true;
        // Notify player in the same room that this player is offline
        // This player is still in room, just only host remove or room was removed
        socket.to(roomId).emit("server:update-room", rooms[roomId]);
        socket.emit("server:update-room", rooms[roomId]);
      } else {
        checkUserInRoom[user.username] = null;
        socket.to(roomId).emit("server:force-get-out-room");
        socket.emit("server:force-get-out-room");
      }
    }
  });
};
