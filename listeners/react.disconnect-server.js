export default (io, socket, listOnlinePlayers, checkOnlineUsers, listRoom, rooms, checkUserInRoom) => {
  socket.on("disconnect", async () => {
    const username = checkOnlineUsers[socket.id];
    if (!listOnlinePlayers || !username || listOnlinePlayers.length === 0 || username === "")
      return;
    const index = listOnlinePlayers.findIndex(player => player.username === username);
    listOnlinePlayers.splice(index, 1);
    io.emit("server:list-online-players", listOnlinePlayers);
    checkOnlineUsers[username] = null;

    if (checkUserInRoom[username]) {
      const roomId = checkUserInRoom[username];
      checkUserInRoom[username] = null;
      if (rooms[roomId].member[0].username === usernameOfPlayer) {
        socket.to(roomId).emit("server:force-get-out-room");
        listRoom.splice(indexRoom, 1);
        rooms[roomId] = null;
      } else {
        const indexPlayerinRoom = rooms[roomId].member.findIndex(player => player.usernamer === usernameOfPlayer);
        rooms[roomId].member.splice(indexPlayerinRoom, 1);
        socket.to(roomId).emit("server:update-room", rooms);
      }
      io.emit("server:list-room", listRoom);
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

    if (checkUserInRoom[username]) {
      const roomId = checkUserInRoom[username];
      checkUserInRoom[username] = null;
      if (rooms[roomId].member[0].username === usernameOfPlayer) {
        socket.to(roomId).emit("server:force-get-out-room");
        listRoom.splice(indexRoom, 1);
        rooms[roomId] = null;
      } else {
        const indexPlayerinRoom = rooms[roomId].member.findIndex(player => player.usernamer === usernameOfPlayer);
        rooms[roomId].member.splice(indexPlayerinRoom, 1);
        socket.to(roomId).emit("server:update-room", rooms);
      }
      io.emit("server:list-room", listRoom);
    }
  })
}