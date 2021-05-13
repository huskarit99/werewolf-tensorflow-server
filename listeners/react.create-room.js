export default (io, socket, listRoom, rooms) => {
  socket.on("react:create-room",
    ({ id,
      name,
      maxPlayerInRoom,
      fullnameOfHost,
      usernameOfHost,
      totalCharacter,
    }) => {
      rooms[id] = {
        name: name,
        maxPlayerInRoom: maxPlayerInRoom,
        totalCharacter: totalCharacter,
        wolf: 1,
        mage: 1,
        guard: 1,
        hunter: 1,
        member: [{
          username: usernameOfHost,
          fullname: fullnameOfHost,
        }]
      };
      listRoom.push({
        id: id,
        name: name,
        maxPlayerInRoom: maxPlayerInRoom,
        numberOfPlayersInRoom: rooms[id].member.length,
        fullnameOfHost: fullnameOfHost,
        usernameOfHost: usernameOfHost,
        totalCharacter: totalCharacter,
        wolf: 1,
        mage: 1,
        guard: 1,
        hunter: 1
      });
      io.emit("server:list-room", listRoom);
      socket.emit("server:get-in-room", rooms);
    })
}