export default (socket, listRoom) => {
  socket.on("react:get-list-room", () => {
    socket.emit("server:list-room", listRoom);
  })
}