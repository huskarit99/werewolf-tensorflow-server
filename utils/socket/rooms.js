const { groupByKey, groupBy } = require("../list");
const { addUser, getUsers, removeUser, getUserById, setUserInRoom } = require('./activeUsers');

rooms = [];

const getRooms = () => rooms; 
const updaWaitRoom = (id)=>{
  rooms.find((room)=>{
    if(room.id===id){
      if(room.numOfWaiting<room.numOfPlayers)
        {
          room.numOfWaiting+=1;
        }
      else
        {
          return false;
        }
    }
  })
}

const addRoom = ({ id, room, name, numOfPlayers, host, players=[], status = "waiting", numOfWaiting }) => {
  // Id is unique because it is mapped with socket id of room creator
  // Check exist
  const exitingRoom = getRoomById(room);
  if (exitingRoom) return { error: `Room ${name} is exist` };

  const newRoom = { id: room, name, numOfPlayers, host: host, players, status, numOfWaiting};

  rooms.push(newRoom);

  console.log(`Room ${name} is created.`)

  return { user: host, room: newRoom };
};

const getRoomById = (id) => rooms.find((room) => room.id === id);

const removeRoom = ({ id }) => {
  const index = rooms.findIndex((room) => room.id === id);

  if (index === -1) return { error: "This room is not exist."};

  if (index !== -1) {
    console.log(`Room [${id}] has removed.`);
    return rooms.splice(index, 1)[0];
  }
};

const getQuickRooms = () => rooms.filter((item) => item.status === "quickly");

module.exports = { getRooms, addRoom, removeRoom, getRoomById, getQuickRooms, updaWaitRoom };
