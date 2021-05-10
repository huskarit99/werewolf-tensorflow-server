import jwt from 'jsonwebtoken';
import userRepository from '../data/repositories/user.repository.js';

const listOnlinePlayers = [];
export default (io, socket) => {
  socket.on("react:connectServer", ({ token }) => {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const id = decoded.user.id;
    const user = userRepository.getUserById(id);
    console.log(user);
  })
}