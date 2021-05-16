import reactListRoom from "./react.list-room.js";
import reactJoinRoom from "./react.join-room.js";
import reactLeaveRoom from "./react.leave-room.js";
import reactCreateRoom from "./react.create-room.js";
import reactConnectServer from "./react.connect-server.js";
import reactDisconnectServer from "./react.disconnect-server.js";
import reactListOnlinePlayers from "./react.list-online-players.js";
/*
<summary> List Online Players to render in Clinet-side  </summary>
<value>
[{
  username,
  fullname
}]
</value>
*/
const listOnlinePlayers = [];

/*
<summary>Check whether user is online or not</summary>
<value>
mapping from socket.id -> username
mapping from username -> socket.id
</value>
*/
const checkOnlineUsers = {};

/*
<summary>List Room to render in Client-side</summary>
<value>
[{
  id,
  name,
  numberOfPlayersInRoom,
  usernameOfHost,
}]
</value>
*/
const listRoom = [];

/*
<summary>Mapping from roomId to the detail room</summary>
<value>
{
  roomId -> {
    name,
    wolf,
    mage,
    guard,
    hunter,
    member: [{
      username,
      fullname,
    }]
  }
}
</value>
*/
const rooms = {};

/*
<summary>Check whether user stayed in any room or not</summary>
<value>
  mapping from username to roomId
</value>
*/
const checkUserInRoom = {};

export default io => {
  io.on("connection", socket => {
    reactListRoom(socket, listRoom);
    reactJoinRoom(io, socket, listRoom, rooms);
    reactLeaveRoom(io, socket, listRoom, rooms);
    reactCreateRoom(io, socket, listRoom, rooms, checkUserInRoom);
    reactListOnlinePlayers(socket, listOnlinePlayers);
    reactConnectServer(io, socket, listOnlinePlayers, checkOnlineUsers);
    reactDisconnectServer(io, socket, listOnlinePlayers, checkOnlineUsers, listRoom, rooms, checkUserInRoom);
  })
}