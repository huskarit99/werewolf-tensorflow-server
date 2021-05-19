export default (io, socket, listRoom, rooms, checkUserInRoom) => {
  socket.on("react:create-room",
    ({ id,
      name,
      fullnameOfHost,
      usernameOfHost,
    }) => {
      rooms[id] = {
        id: id,
        name: name,
        wolf: 1,
        mage: 0,
        guard: 0,
        hunter: 0,
        member: [{
          username: usernameOfHost,
          fullname: fullnameOfHost,
          isOnline: true
        }]
      };
      listRoom.push({
        id: id,
        name: name,
        numberOfPlayersInRoom: rooms[id].member.length,
        usernameOfHost: usernameOfHost,
      });
      io.emit("server:list-room", listRoom);
      socket.emit("server:get-in-room", rooms[id]);
      socket.join(id);
      checkUserInRoom[usernameOfHost] = id;
    }
  )
}