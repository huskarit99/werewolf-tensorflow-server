export default (
  io,
  socket,
  listRoom,
  rooms,
  checkUserInRoom,
  checkOnlineUsers
) => {
  socket.on("react:host-force-leave-room", ({ id, usernameOfPlayer }) => {
    // Conditional: User is forced to leave room by Host
    // Find index of room in list room
    const indexRoom = listRoom.findIndex((room) => room.id === id);
    // Remove this player from room
    const indexPlayerinRoom = rooms[id].member.findIndex(
      (player) => player.username === usernameOfPlayer
    );
    rooms[id].member.splice(indexPlayerinRoom, 1);
    rooms[id].messages.push({
      username: "admin",
      message: usernameOfPlayer + " was kick out room by host",
    });
    // Notify all players in the same room
    socket.to(id).emit("server:update-room", rooms[id]);
    socket.emit("server:update-room", rooms[id]);
    // Update number of players in room
    listRoom[indexRoom].numberOfPlayersInRoom = rooms[id].member.length;
    const socketId = checkOnlineUsers[usernameOfPlayer];
    io.to(socketId).emit("server:force-get-out-room");
    // Notify all
    io.emit("server:list-room", listRoom);
    checkUserInRoom[usernameOfPlayer] = null;
  });
};
