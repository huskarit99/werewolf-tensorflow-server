import User from "../../models/User.js";
import operatorType from '../../utils/enums/operatorType.js';

const userRepository = {
  //CREATE
  addUser(fullname, username, password) {
    const user = new User(fullname, username, password);
    return user.save().catch(() =>
      operatorType.FAIL.CREATE
    );
  },

  //READ
  getUsers() {
    return User.find({}).catch(() =>
      operatorType.FAIL.READ
    );
  },
  getUserById(id) {
    return User.findById(id).catch(() =>
      operatorType.FAIL.READ
    );
  },
  getUserByUsername(username) {
    return User.findOne({ username }).catch(() =>
      operatorType.FAIL.READ
    );
  },

  //UPDATE
  updateUser() {

  },

  //DELETE
  deleteUser() {

  }
}

export default userRepository;