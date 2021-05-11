export default (io, socket, listOnlinePlayers, checkOnlineUsers) => {
  socket.on("disconnect", async () => {
    const username = checkOnlineUsers[socket.id];
    if (!listOnlinePlayers || !username || listOnlinePlayers.length === 0 || username === "")
      return;
    const index = listOnlinePlayers.findIndex(player => player.username === username);
    listOnlinePlayers.splice(index, 1);
    io.emit("server:list-online-players", listOnlinePlayers);
    checkOnlineUsers[username] = null;
  })
  socket.on("react:disconnect-server", async () => {
    const username = checkOnlineUsers[socket.id];
    const index = listOnlinePlayers.findIndex(player => player.username === username);
    listOnlinePlayers.splice(index, 1);
    io.emit("server:list-online-players", listOnlinePlayers);
    checkOnlineUsers[username] = null;
  })
}