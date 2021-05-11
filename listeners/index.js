import reactConnectServer from "./react.connect-server.js";
import reactDisconnectServer from "./react.disconnect-server.js";
import reactGetListOnlinePlayers from "./react.get-list-online-players.js";
// List Online Players 
const listOnlinePlayers = [];

// Check whether user is online or not
const checkOnlineUsers = {};
export default io => {
  io.on("connection", socket => {
    reactConnectServer(io, socket, listOnlinePlayers, checkOnlineUsers);
    reactDisconnectServer(io, socket, listOnlinePlayers, checkOnlineUsers);
    reactGetListOnlinePlayers(socket, listOnlinePlayers);
  })
}