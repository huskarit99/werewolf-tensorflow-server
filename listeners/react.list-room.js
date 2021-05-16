export default (socket, listRoom) => {
  socket.on("react:list-room", () => {
    socket.emit("server:list-room", listRoom);
  })
}