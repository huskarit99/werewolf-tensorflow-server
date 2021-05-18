export default (io, socket, listRoom, rooms, checkUserInRoom) => {
  socket.on("react:join-room",
    ({ id, usernameOfPlayer, fullnameOfPlayer }) => {
      if (rooms && rooms[id] && rooms[id].member.length < 5) {
        checkUserInRoom[usernameOfPlayer] = id;
        rooms[id].member.push({
          username: usernameOfPlayer,
          fullname: fullnameOfPlayer,
          isOnline: true,
        });
        const index = listRoom.findIndex((room) => room.id === id);
        listRoom[index].numberOfPlayersInRoom = rooms[id].member.length;
        io.emit("server:list-room", listRoom);
        socket.emit("server:get-in-room", rooms[id]);
        socket.to(id).emit("server:update-room", rooms[id]);
      } else {
        socket.emit("server:error-join-room", {
          isSuccess: false
        })
      }
    })
}