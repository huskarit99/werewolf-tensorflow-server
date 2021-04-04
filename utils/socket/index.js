const { addUser, getUsers, removeUser, getUserById, setUserInRoom } = require('./activeUsers');
const { addRoom, getRooms, removeRoom, getRoomById, getQuickRooms, updaWaitRoom } = require('./rooms');

const initSocket = ({ io }) => {
    io.on('connection', (socket) => {
        console.log(`[${socket.id}] Client has connected to Socket.IO.`);

        // Send online list to all connected clients
        socket.on('getOnlineUsers',()=>{
            io.emit('getOnlineUsers', { user: getUsers() });
        })
        

        // Client is online
        socket.on('setOnlineStatus', ({ name }) => {
            const { user, error } = addUser({ id: socket.id, name });
            if (error) return error;

            io.emit('getOnlineUsers', { users: getUsers() });
            console.log(`User ${name} has online.`);
        });

        // Client is offline
        socket.on('removeOnlineStatus', ({ name }) => {
          console.log(name);
            removeUser({ name: name });
            io.emit('getOnlineUsers', { users: getUsers() });
            console.log(`User ${name} has offline.`);
        });

      
        // Client is disconnected

        socket.on('disconnected', () => {
            removeUser({ id: socket.id });
            io.emit('getOnlineUsers', { users: getUsers() });
            console.log("[${socket.id}] Client has disconnected to Socket.IO.")
        });

        // Reload list
        socket.on('reloadOnlineUsers', () => {
            io.emit('getOnlineUsers', { users: getUsers() });
        });

        // Reload room list
    io.emit('getRooms', { rooms: getRooms() });
    // Load room for socket
    socket.on('reloadRooms', () => {
      socket.emit('getRooms', { rooms: getRooms() });
    });
    // Set game room 
    socket.on("joinRoom", ({ roomId, roomName, numOfPlayers }) => {
      
      let host = getUserById(socket.id);
      // Add a room to room list if this room is not available
      addRoom({room: roomId, name: roomName, numOfPlayers: numOfPlayers, host: host, numOfWaiting: 0 });

      const { user, room, error } = setUserInRoom({ id: socket.id, room: roomId });
      if (error) {
        socket.emit('roomBlock',{error});
        return {error};
      }

      // Join room by socket
      socket.join(roomId);
      
      io.in(roomId).emit('gameInfo',{room, error});
      // Broadcast to all user about room info
      io.emit('getRooms', { rooms: getRooms()});

      // Send message to chat box
      socket.emit('message', { user: 'admin', text: `${user.name}, welcome to room ${roomName}.` });
      socket.broadcast.to(user.room).emit('message', { user: 'admin', text: `${user.name} has joined!` });
      //setting room
      socket.on('gameSetting',({gameSetting, roomId})=>{
        const room = getRoomById(roomId);
        if(room){
          room.gameSetting = gameSetting;
          io.in(roomId).emit('gameInfo',{room, error});
        }
      })
      //exit room
      socket.on('exitRoom', ({host,roomId})=>{
        const room = getRoomById(roomId);
        if (room) {
          socket.leave(roomId);
          if (socket.id == host.id) {
            if (room.players.length > 1) {
              room.players.splice(0,1);
              room.host = room.players[0];
              
            } else {
              removeRoom(roomId);
            }

          } else {
            const index = room.players.findIndex((x) => x.id == socket.id);
            if (index > -1) {
              room.players.splice(index, 1);
              room.players[index].status = null;
            }
          }
          room.numOfWaiting--;
          room.status = 'waiting';
          io.in(roomId).emit("gameInfo", { room, error });
            socket.broadcast
              .to(user.room)
              .emit("message", { user: "", text: `${user.name} has left!` });
          io.emit("getRooms", { rooms: getRooms() });
          socket.on('reloadRooms', () => {
            socket.emit('getRooms', { rooms: getRooms() });
          });
        }
      })

      //kick player in room
      socket.on('kickPlayer',player=>{
        room.block.push(player);
        
        const index = room.players.findIndex((x) => x.name == player.name);
        if (index > -1) {
          room.players.splice(index, 1);
        }
        room.numOfWaiting--;
        room.status = "waiting";
        
        io.in(roomId).emit("gameInfo", { room, error });
        socket.broadcast
          .to(user.room)
          .emit("message", { user: "", text: `${player.name} was kicked!` }); 
        io.emit("getRooms", { rooms: getRooms() });
        io.to(player.id).emit('isKicked');
      });
      //set player is ready
      socket.on('setReady', ()=>{
        const index = room.players.findIndex((player)=>player.id===socket.id);
        room.players[index].status = 'ready';
        io.in(roomId).emit("gameInfo", { room, error });

      });
      // set player is unready
      socket.on('setUnReady', ()=>{
        const index = room.players.findIndex((player)=>player.id===socket.id);
        room.players[index].status = 'waiting';
        io.in(roomId).emit("gameInfo", { room, error });
      })
    });

    // When someone send message
    socket.on('sendMessage', (message, callback) => {
      const user = getUserById(socket.id);
      io.to(user.room).emit('message', { user: `${user.name}`, text: message });
      callback();
    });

    // When someone send match info
    socket.on('sendMatchInfo', (params, callback) => {
      const user = getUserById(socket.id);
      //const room = getRoomById(user.room)
      socket.broadcast.to(user.room).emit('matchInfo', { user: `${user.name}`, data: params });

      callback();
    });

    //Requet quick game
    socket.on('requestQuickGame', () => {
      // all rooms -> find rooms with status = "quickly"
      // if exist -> join first item
      // else -> create a room with status = "quickly"
      // notes: this room is hide in room list screen
      const items = getQuickRooms();
      let quickRoom;

      if (items.length > 0) {
        quickRoom = items[0];
        quickRoom.player2 = getUserById(socket.id);

        items[0].status = "playing";
        io.emit('getRooms', { rooms: getRooms() });
      } else {
        const host = getUserById(socket.id);
        // Add a room to room list if this room is not available
        const res = addRoom({ room: socket.id, name: socket.id, level: 3, player2: null, host, status: "quickly" });
        quickRoom = res.room;

      }

      socket.join(quickRoom.id);

      console.log(quickRoom);
      io.to(quickRoom.id).emit('quickRoom', { room: quickRoom });
    });

    //Request join room with code
    socket.on('requestJoinRoomByCode', (roomId)=>{
      const room = getRooms().find((room)=> room.id == roomId);
      io.to(socket.id).emit('joinRoomByCode',{room:room});
    })

    })

    
}

module.exports = { initSocket };