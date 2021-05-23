export default (socket, mappingUnity) => {
  socket.on("unity:connect-server", async ({ username }) => {
    mappingUnity[username] = socket.id;
    mappingUnity[socket.id] = username;
  });
};
