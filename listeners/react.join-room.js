export default (io, socket, listRoom, rooms, checkUserInRoom) => {
  socket.on("react:join-room",
    ({ id, usernameOfPlayer, fullnameOfPlayer }) => {
      // Conditional: User join room
      // Check room exist and slot in room is available
      if (rooms && rooms[id] && rooms[id].member.length < 5) {
        // Add player into room
        rooms[id].member.push({
          username: usernameOfPlayer,
          fullname: fullnameOfPlayer,
          isOnline: true,
        });
        // Update number of players in room
        const index = listRoom.findIndex((room) => room.id === id);
        listRoom[index].numberOfPlayersInRoom = rooms[id].member.length;
        // Notify all
        io.emit("server:list-room", listRoom);
        // Player is allowed to get in room
        socket.emit("server:get-in-room", rooms[id]);
        socket.join(id);
        // Notify all players in the same room
        socket.to(id).emit("server:update-room", rooms[id]);
        checkUserInRoom[usernameOfPlayer] = id;
      } else {
        socket.emit("server:error-join-room");
      }
    })
}