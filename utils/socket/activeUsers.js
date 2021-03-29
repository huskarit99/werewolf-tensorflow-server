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
    if (!room) return { error: "room is required." };
    if (!id) return { error: "UserId is required." };
    const user = getUserById(id);

    if (user) {
      user.room = room;
    }

    // Calculate role
    const exitingRoom = getRoomById(room);
    if (exitingRoom) {
      if (exitingRoom.numOfPlayers === exitingRoom.numOfWaiting) {
        exitingRoom.status = "playing";
      } else {
        if (!exitingRoom.players.find((player) => player.id === user.id))
          exitingRoom.players.push(user);
        else return { error: "Player already exists in room!" };
      }
    }
    console.log(exitingRoom.players);
    if (user && exitingRoom) return { user, room: exitingRoom };
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
