export default (io, socket, listRoom, rooms, checkUserInRoom) => {
  socket.on("react:leave-room", ({ id, usernameOfPlayer }) => {
    // Conditional: User leave room
    // Find index of room in list room
    const indexRoom = listRoom.findIndex(room => room.id === id);
    // Check whether user who leaves room is host or not 
    if (rooms[id].member[0].username === usernameOfPlayer) {
      // If user is host, room is going to be removed and 
      socket.to(id).emit("server:force-get-out-room");
      listRoom.splice(indexRoom, 1);
      rooms[id] = null;
    } else {
      // Remove this player from room
      const indexPlayerinRoom = rooms[id].member.findIndex(player => player.usernamer === usernameOfPlayer);
      rooms[id].member.splice(indexPlayerinRoom, 1);
      // Notify all players in the same room
      socket.to(id).emit("server:update-room", rooms);
      // Update number of players in room
      const index = listRoom.findIndex((room) => room.id === id);
      listRoom[index].numberOfPlayersInRoom = rooms[id].member.length;
      // Notify all
      io.emit("server:list-room", listRoom);
    }
    socket.emit("server:force-get-out-room");
    io.emit("server:list-room", listRoom);
    checkUserInRoom[usernameOfPlayer] = null;
  })
}