export default (socket, mappingUnity, checkUserInRoom, rooms) => {
  socket.on("unity:connect-server", async (data) => {
    if (!data) return;
    const user = JSON.parse(data);
    if (!user || !user.Username) return;
    mappingUnity[user.Username] = socket.id;
    mappingUnity[socket.id] = user.Username;
    if (!checkUserInRoom[user.Username]) return;
    const roomId = checkUserInRoom[user.Username];
    const room = rooms[roomId];
    const detailRoom = {
      Id: roomId,
      Name: room.name,
      Wolf: room.wolf,
      Witch: room.witch,
      Guard: room.guard,
      Hunter: room.hunter,
      Member: room.member,
    };
    socket.emit("server:detail-room", detailRoom);
  });
};
