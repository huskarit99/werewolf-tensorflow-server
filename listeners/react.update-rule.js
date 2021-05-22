export default (socket, rooms) => {
  socket.on("react:update-rule", ({ id, wolf, witch, hunter, shield }) => {
    if (rooms && rooms[id]) {
      rooms[id].wolf = wolf;
      rooms[id].witch = witch;
      rooms[id].guard = shield;
      rooms[id].hunter = hunter;
      socket.to(id).emit("server:update-room", rooms[id]);
      socket.emit("server:update-room", rooms[id]);
      socket.emit("server:response-result-update", { isSuccess: true });
    } else {
      socket.emit("server:response-result-update", { isSuccess: false });
    }
  });
};
