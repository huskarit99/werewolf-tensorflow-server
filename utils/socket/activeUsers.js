const users = [];

const addUser = ({ id, name }) => {
    // Check exist
    const exitingUser = getUserByName(name);
    if (exitingUser) return { error: `User ${name} is exist` };
    const user = { id, name: name, status: null, room: null };
    users.push(user);
    return { user };
};

const removeUser = ({ id, name }) => {
    const index;
    if (id) {
        index = users.findIndex((user) => user.id === id);
    } else if (name) {
        index = users.findIndex((user) => user.name === user.name);
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
}

const getUserById = (id) => users.find((user) => user.id === id);

const getUserByName = (name) => users.find((user) => user.name === name);

modulde.exports = { addUser, removeUser, getUsers, getUserById, getUserByName };