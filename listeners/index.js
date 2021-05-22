import reactListRoom from "./react.list-room.js";
import reactJoinRoom from "./react.join-room.js";
import reactLeaveRoom from "./react.leave-room.js";
import reactUpdateRule from "./react.update-rule.js";
import reactDetailRoom from "./react.detail-room.js";
import reactCreateRoom from "./react.create-room.js";
import reactSendMessage from "./react.send-message.js";
import reactConnectServer from "./react.connect-server.js";
import reactDisconnectServer from "./react.disconnect-server.js";
import reactListOnlinePlayers from "./react.list-online-players.js";
import reactHostForceLeaveRoom from "./react.host-force-leave-room.js";
/*
<summary>List Online Players to render in Clinet-side</summary>
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
<summary>Mapping from roomId to the detail room and Save messages of member in Room</summary>
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
      isOnline
    }],
    messages: [{
      username,
      message
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

export default (io) => {
  io.on("connection", (socket) => {
    reactUpdateRule(socket, rooms);
    reactListRoom(socket, listRoom);
    reactDetailRoom(socket, rooms, checkUserInRoom);
    reactSendMessage(socket, rooms, checkUserInRoom);
    reactListOnlinePlayers(socket, listOnlinePlayers);
    reactJoinRoom(io, socket, listRoom, rooms, checkUserInRoom);
    reactLeaveRoom(io, socket, listRoom, rooms, checkUserInRoom);
    reactCreateRoom(io, socket, listRoom, rooms, checkUserInRoom);
    reactHostForceLeaveRoom(
      io,
      socket,
      listRoom,
      rooms,
      checkUserInRoom,
      checkOnlineUsers
    );
    reactConnectServer(
      io,
      socket,
      listOnlinePlayers,
      checkOnlineUsers,
      rooms,
      checkUserInRoom
    );
    reactDisconnectServer(
      io,
      socket,
      listOnlinePlayers,
      checkOnlineUsers,
      listRoom,
      rooms,
      checkUserInRoom
    );
  });
};
