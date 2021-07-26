export default (socket, listOnlinePlayers) => {
  socket.on("react:list-online-players", () => {
    socket.emit("server:list-online-players", listOnlinePlayers);
  })
}