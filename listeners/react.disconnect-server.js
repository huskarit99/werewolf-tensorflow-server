export default (io, socket, listOnlinePlayers, checkOnlineUsers, listRoom, rooms, checkUserInRoom) => {
  socket.on("disconnect", async () => {
    // Conditional: User turn off tag
    // Mapping from socket.id to username of player
    const username = checkOnlineUsers[socket.id];
    if (!listOnlinePlayers || !username || listOnlinePlayers.length === 0 || username === "")
      return;
    // Remove player in list online players
    const index = listOnlinePlayers.findIndex(player => player.username === username);
    listOnlinePlayers.splice(index, 1);
    // Notify all
    io.emit("server:list-online-players", listOnlinePlayers);
    // Unmark player is onine
    checkOnlineUsers[username] = null;
    checkOnlineUsers[socket.id] = null;
    // Check Whether user is in room or not
    if (checkUserInRoom[username]) {
      const roomId = checkUserInRoom[username];
      const indexPlayerinRoom = rooms[roomId].member.findIndex(player => player.username === username);
      // Mark offline this player in room
      rooms[roomId].member[indexPlayerinRoom].isOnline = false;
      // Notify player in the same room that this player is offline
      // This player is still in room, just only host remove or room was removed
      socket.to(roomId).emit("server:update-room", rooms[roomId]);
    }
  })
  socket.on("react:disconnect-server", async () => {
    // Conditional: User log out
    // Mapping from socket.id to username of player
    const username = checkOnlineUsers[socket.id];
    if (!listOnlinePlayers || !username || listOnlinePlayers.length === 0 || username === "")
      return;
    // Remove player in list online players
    const index = listOnlinePlayers.findIndex(player => player.username === username);
    listOnlinePlayers.splice(index, 1);
    io.emit("server:list-online-players", listOnlinePlayers);
    // Notify all
    checkOnlineUsers[username] = null;
    checkOnlineUsers[socket.id] = null;
    // Check Whether user is in room or not
    if (checkUserInRoom[username]) {
      const roomId = checkUserInRoom[username];
      // Check this room is available
      if (rooms[roomId]) {
        checkUserInRoom[username] = null;
        // Find index of room in list room
        const indexRoom = listRoom.findIndex(room => room.id === roomId);
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
    } else {
      checkUserInRoom[user.username] = null;
      socket.to(roomId).emit("server:force-get-out-room");
      socket.emit("server:force-get-out-room");
    }
  })
}