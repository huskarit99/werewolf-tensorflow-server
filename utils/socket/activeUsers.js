const { getRoomById } = require("./rooms");
const users = [];

const addUser = ({ id, name }) => {
  // Check exist
  const exitingUser = getUserByName(name);
  if (exitingUser) return { error: `User ${name} is exist` };
  const user = { id, name: name, status: null, room: null, rank: 1 };
  users.push(user);
  return { user };
};

const removeUser = ({ id, name }) => {
  let index;
  if (id) {
    index = users.findIndex((user) => user.id === id);
  } else if (name) {
    index = users.findIndex((user) => user.name === name);
  } else return;

  if (index === -1) {
    return { error: "This room is not exist." };
  } else {
    // Remove user
    return users.splice(index, 1)[0];
  }
};

const getUsers = () => {
  return users;
};

const getUserById = (id) => users.find((user) => user.id === id);

const getUserByName = (name) => users.find((user) => user.name === name);

const setUserInRoom = ({ id, room }) => {
  try {
    if (!room) return { error: "roomCode is required." };
    if (!id) return { error: "UserId is required." };
    const existingRoom = getRoomById(room);
    if(existingRoom.block)
    { 
      const index = existingRoom.block.find((player)=>player.name==user.name);
      if(index)
      {
        return { error:"You are not allowed to join this room!"}
      }
    }
    const user = getUserById(id);
    if (user) {
      user.room = room;
    }
    // Calculate role
    if (existingRoom) {
      if (existingRoom.numOfPlayers-1 === existingRoom.numOfWaiting) {
        existingRoom.status = "full";  
      } 
        if (!existingRoom.players.find((player) => player.id === user.id))
          {
            existingRoom.players.push(user);
            existingRoom.numOfWaiting+=1;
          }

        else return { error: "Player already exists in room!" };
      
    }
    if (user && existingRoom) return { user, room: existingRoom };
  } catch (error) {
    return { error };
  }

  return { error: "User is not exist." };
};

module.exports = {
  addUser,
  getUsers,
  removeUser,
  getUserById,
  setUserInRoom,
  getUserByName,
};
