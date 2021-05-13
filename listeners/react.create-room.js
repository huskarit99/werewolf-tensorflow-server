export default (io, socket, listRoom, rooms) => {
  socket.on("react:create-room", async ({
    id,
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
      fullnameOfHost: fullnameOfHost,
      usernameOfHost: usernameOfHost,
      totalCharacter: totalCharacter,
      wolf: 1,
      mage: 1,
      guard: 1,
      hunter: 1
    }
    io.emit("server:list-room", listRoom);
  })
}