export default (io, socket, mappingUnity) => {
  socket.on("react:detect-finger", async ({ username, resultDetect }) => {
    if (!mappingUnity || !mappingUnity[username]) return;
    io.to(mappingUnity[username]).emit("server:detect-finger", {
      Username: username,
      ResultDetect: resultDetect,
    });
  });
};
