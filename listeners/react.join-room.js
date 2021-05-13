export default (io, socket, listRoom, rooms) => {
	socket.on("react:create-room",
		({ id, usernameOfPlayer, fullnameOfPlayer }) => {
			if (rooms && rooms[id] && rooms[id].member.length < room[id].maxPlayerInRoom) {
				rooms[id].member.push({
					username: usernameOfPlayer,
					fullname: fullnameOfPlayer
				});
				const index = listRoom.findIndex((room) => room.id === id);
				listRoom[index].maxPlayerInRoom = rooms[id].member.length;
				io.emit("server:list-room", listRoom);
				socket.emit("server:get-in-room", rooms);
			} else {
				socket.emit("server:error-join-room", {
					isSuccess: false
				})
			}
		})
}