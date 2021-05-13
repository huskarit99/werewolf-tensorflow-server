export default (io, socket, listRoom) => {
  socket.on("react:create-room", async ({ id }) => {
    const index = listRoom.findIndex(room => room.id === id);
    listRoom.splice(index, 1);
    io.emit("server:list-room", listRoom);
  })
}