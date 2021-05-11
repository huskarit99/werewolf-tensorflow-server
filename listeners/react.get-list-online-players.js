export default (socket, listOnlinePlayers) => {
  socket.on("react:get-list-online-players", () => {
    socket.emit("server:list-online-players", listOnlinePlayers);
  })
}