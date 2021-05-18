export default (io, socket, listOnlinePlayers, checkOnlineUsers, listRoom, rooms, checkUserInRoom) => {
  socket.on("disconnect", async () => {
    const username = checkOnlineUsers[socket.id];
    if (!listOnlinePlayers || !username || listOnlinePlayers.length === 0 || username === "")
      return;
    const index = listOnlinePlayers.findIndex(player => player.username === username);
    listOnlinePlayers.splice(index, 1);
    io.emit("server:list-online-players", listOnlinePlayers);
    checkOnlineUsers[username] = null;
    checkOnlineUsers[socket.id] = null;
    if (checkUserInRoom[username]) {
      const roomId = checkUserInRoom[username];
      const indexPlayerinRoom = rooms[roomId].member.findIndex(player => player.username === username);
      rooms[roomId].member[indexPlayerinRoom].isOnline = false;
      socket.to(roomId).emit("server:update-room", rooms[roomId]);
    }
  })
  socket.on("react:disconnect-server", async () => {
    const username = checkOnlineUsers[socket.id];
    if (!listOnlinePlayers || !username || listOnlinePlayers.length === 0 || username === "")
      return;
    const index = listOnlinePlayers.findIndex(player => player.username === username);
    listOnlinePlayers.splice(index, 1);
    io.emit("server:list-online-players", listOnlinePlayers);
    checkOnlineUsers[username] = null;
    checkOnlineUsers[socket.id] = null;

    if (checkUserInRoom[username]) {
      const roomId = checkUserInRoom[username];
      checkUserInRoom[username] = null;
      if (rooms[roomId].member[0].username === username) {
        socket.to(roomId).emit("server:force-get-out-room");
        listRoom.splice(indexRoom, 1);
        rooms[roomId] = null;
      } else {
        const indexPlayerinRoom = rooms[roomId].member.findIndex(player => player.username === username);
        rooms[roomId].member.splice(indexPlayerinRoom, 1);
        socket.to(roomId).emit("server:update-room", rooms[roomId]);
      }
      io.emit("server:list-room", listRoom);
    }
  })
}