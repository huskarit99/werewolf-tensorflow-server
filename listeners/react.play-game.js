export default (io, socket, rooms, listRoom) => {
  socket.on("react:play-game", async ({ id }) => {
    if (!rooms[id]) return;
    rooms[id].isPlaying = 1;
    rooms[id].messages.push({
      username: "admin",
      message: "Game is starting !!!",
    });
    socket.emit("server:update-room", rooms[id]);
    socket.to(id).emit("server:update-room", rooms[id]);
    const index = listRoom.findIndex((room) => room.id === id);
    listRoom[index].isPlaying = 1;
    io.emit("server:list-room", listRoom);
  });
};
