const http = require('http');
const cors = require('cors');
const express = require('express');
const passport = require('passport');
const connectDB = require('./config/db');

// Init server
const app = express();
app.use(cors());
const server = http.createServer(app);

// Connect DB
connectDB();

// Init middleware
app.use(express.json());

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin,X-Requested-With,Content-Type,Accept,Authorization'
  );
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');

  next();
});
app.use(passport.initialize());

//Define routes
app.use('/api/public-controller', require('./routes/publicController'));
app.use('/api/private-controller', require('./routes/privateController'));

// Connect socket.io
const socketio = require('socket.io');
const options = { /*... */ };
const io = socketio(server, options);
const { initSocket } = require('./utils/socket');

initSocket({ io });

server.listen(process.env.PORT || 5000, () =>
  console.log(`Server has started.`)
);