export default (io, socket, listRoom, rooms) => {
  socket.on("react:leave-room", ({ id, usernameOfPlayer }) => {
    const indexRoom = listRoom.findIndex(room => room.id === id);
    if (rooms[id].member[0].username === usernameOfPlayer) {
      socket.to(id).emit("server:force-get-out-room");
      listRoom.splice(indexRoom, 1);
      rooms[id] = null;
    } else {
      const indexPlayerinRoom = rooms[id].member.findIndex(player => player.usernamer === usernameOfPlayer);
      rooms[id].member.splice(indexPlayerinRoom, 1);
      socket.to(id).emit("server:update-room", rooms);
    }
    socket.emit("server:force-get-out-room");
    io.emit("server:list-room", listRoom);
  })
}