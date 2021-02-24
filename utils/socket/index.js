const { addUser, removeUser, getUsers, getUserById, getUserByName } = require('./activeUsers');

const initSocket = ({ io }) => {
    io.on('connection', (socket) => {
        console.log(`[${socket.id}] Client has connected to Socket.IO.`);

        // Send online list to all connected clients
        io.emit('getOnlineUsers', { user: getUsers() });

        // Client is online
        socket.on('setOnlineStatus', ({ name }) => {
            const { user, error } = addUser({ id: socket.id, name });
            if (error) return error;

            io.emit('getOnlineUsers', { users: getUsers() });
            console.log(`User ${name} has online.`);
        });

        // Client is offline
        socket.on('removeOnlineStatus', ({ name }) => {
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
    })
}

module.exports = { initSocket };