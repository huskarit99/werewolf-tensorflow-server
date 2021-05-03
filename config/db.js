//DB config
import dotenv from 'dotenv';
dotenv.config();
import config from 'config';
import mongoose from 'mongoose';


const DB = config
  .get("mongoURI")
  .replace("<dbname>", process.env.DATABASE_NAME)
  .replace("<password>", process.env.DATABASE_PASSWORD);
//Connect to Mongo
const connectDB = async () => {
  try {
    await mongoose.connect(DB, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
    });
    console.log("DB connection successful");
  } catch (err) {
    console.log("Can't connect to MongoDB");
    console.error(err.message);
    process.exit(1);
  }
};

console.log(connectDB);

export default connectDB;