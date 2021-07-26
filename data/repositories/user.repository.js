import User from "../../models/User.js";
import operatorType from '../../utils/enums/operatorType.js';

const userRepository = {
  //CREATE
  addUser(user) {
    return user.save().catch(() =>
      operatorType.FAIL.CREATE
    );
  },

  //READ
  getUsers() {
    return User.find().catch(() =>
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
  updateUser(user) {
    return user.save().catch(() =>
      operatorType.FAIL.UPDATE
    );
  },

  //DELETE
  deleteUser(username) {
    return User.deleteOne({ username: username }).catch(() =>
      operatorType.FAIL.DELETE
    );
  }
}

export default userRepository;