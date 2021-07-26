import jwt from 'jsonwebtoken';
import userRepository from '../data/repositories/user.repository.js';

export default (socket, rooms, checkUserInRoom) => {
  socket.on("react:detail-room", async (token) => {
    if (!token) return;
    // Identify and get info user by token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const id = decoded.user.id;
    const user = await userRepository.getUserById(id);
    const username = user.username;

    if (username && checkUserInRoom && checkUserInRoom[username]) {
      const roomId = checkUserInRoom[username];
      socket.emit("server:detail-room", rooms[roomId]);
    }
  })
}