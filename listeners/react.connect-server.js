import jwt from 'jsonwebtoken';
import userRepository from '../data/repositories/user.repository.js';

export default (io, socket, listOnlinePlayers, checkOnlineUsers, rooms, checkUserInRoom) => {
  socket.on("react:connect-server", async ({ token }) => {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const id = decoded.user.id;
    const user = await userRepository.getUserById(id);
    if (!checkOnlineUsers || !checkOnlineUsers[user.username])
      listOnlinePlayers.push({
        username: user.username,
        fullname: user.fullname
      });
    io.emit("server:list-online-players", listOnlinePlayers);
    checkOnlineUsers[user.username] = socket.id;
    checkOnlineUsers[socket.id] = user.username;

    const roomId = checkUserInRoom[user.username];
    if (roomId) {
      socket.join(roomId);
      const indexPlayerinRoom = rooms[roomId].member.findIndex(player => player.username === user.username);
      rooms[roomId].member[indexPlayerinRoom].isOnline = true;
      socket.to(roomId).emit("server:update-room", rooms[roomId]);
      socket.emit("server:update-room", rooms[roomId]);
    }
  })
}