export default (socket, rooms) => {
  socket.on("react:detail-room", (id) => {
    socket.emit("server:detail-room", rooms[id]);
  })
}