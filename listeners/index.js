import reactRemoveRoom from "./react.remove-room.js";
import reactCreateRoom from "./react.create-room.js";
import reactGetListRoom from "./react.get-list-room.js";
import reactConnectServer from "./react.connect-server.js";
import reactDisconnectServer from "./react.disconnect-server.js";
import reactGetListOnlinePlayers from "./react.get-list-online-players.js";
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
  maxPlayerInRoom,
  numberOfPlayersInRoom,
  fullnameOfHost,
  usernameOfHost,
  totalCharacter,
  wolf,
  mage,
  guard,
  hunter 
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
    maxPlayerInRoom,
    numberOfPlayersInRoom,
    fullnameOfHost,
    usernameOfHost,
    totalCharacter,
    wolf,
    mage,
    guard,
    hunter
  }
}
</value>
*/
const rooms = {};

export default io => {
  io.on("connection", socket => {
    reactGetListRoom(socket, listRoom);
    reactRemoveRoom(io, socket, listRoom, rooms);
    reactCreateRoom(io, socket, listRoom, rooms);
    reactGetListOnlinePlayers(socket, listOnlinePlayers);
    reactConnectServer(io, socket, listOnlinePlayers, checkOnlineUsers);
    reactDisconnectServer(io, socket, listOnlinePlayers, checkOnlineUsers);
  })
}