export default (io, socket, listRoom, rooms, checkUserInRoom) => {
  socket.on(
    "react:create-room",
    ({ id, name, fullnameOfHost, usernameOfHost }) => {
      rooms[id] = {
        id: id,
        name: name,
        wolf: 1,
        witch: 0,
        guard: 0,
        hunter: 0,
        isPlaying: 0,
        member: [
          {
            username: usernameOfHost,
            fullname: fullnameOfHost,
            isOnline: true,
          },
        ],
        messages: [],
      };
      rooms[id].messages.push({
        username: "admin",
        message:
          usernameOfHost + ", You created the room. Now, you are the host",
      });
      listRoom.push({
        id: id,
        name: name,
        isPlaying: 0,
        numberOfPlayersInRoom: rooms[id].member.length,
        usernameOfHost: usernameOfHost,
      });
      io.emit("server:list-room", listRoom);
      socket.emit("server:get-in-room", rooms[id]);
      socket.join(id);
      checkUserInRoom[usernameOfHost] = id;
    }
  );
};
