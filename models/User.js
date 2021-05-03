import mongoose from 'mongoose';

const UserSchema = mongoose.Schema({
  fullname: {
    type: String,
    required: true,
  },
  photo: {
    type: String,
  },
  username: {
    type: String,
    unique: true,
  },
  password: {
    type: String,
  },
  token: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const User = mongoose.model("user", UserSchema);
export default User;