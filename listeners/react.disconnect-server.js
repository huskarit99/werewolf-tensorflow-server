import jwt from 'jsonwebtoken';
import userRepository from '../data/repositories/user.repository.js';

export default (io, socket, listOnlinePlayers, checkOnlineUsers) => {
  socket.on("react:disconnect-server", async ({ token }) => {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const id = decoded.user.id;
    const user = await userRepository.getUserById(id);

    io.emit("listOnlinePlayersFromServer", listOnlinePlayers);
    checkOnlineUsers[user.username] = null;
  })
}