export default (io, socket, listRoom, rooms) => {
  socket.on("react:create-room",
    ({ id,
      name,
      maxPlayerInRoom,
      numberOfPlayersInRoom,
      fullnameOfHost,
      usernameOfHost,
      totalCharacter,
    }) => {
      listRoom.push({
        id: id,
        name: name,
        maxPlayerInRoom: maxPlayerInRoom,
        numberOfPlayersInRoom: numberOfPlayersInRoom,
        fullnameOfHost: fullnameOfHost,
        usernameOfHost: usernameOfHost,
        totalCharacter: totalCharacter,
        wolf: 1,
        mage: 1,
        guard: 1,
        hunter: 1
      });
      rooms[id] = {
        name: name,
        maxPlayerInRoom: maxPlayerInRoom,
        numberOfPlayersInRoom: numberOfPlayersInRoom,
        totalCharacter: totalCharacter,
        wolf: 1,
        mage: 1,
        guard: 1,
        hunter: 1,
        member: [{
          username: usernameOfHost,
          fullname: fullnameOfHost,
        }]
      }
      io.emit("server:list-room", listRoom);
    })
}