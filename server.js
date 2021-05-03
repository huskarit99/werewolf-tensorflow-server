import http from 'http';
import cors from 'cors';
import express from 'express';
import passport from 'passport';

import connectDB from "./config/db.js";
import httpStatusCode from './utils/enums/httpStatusCode.js';
import publicController from './api/controllers/public.controller.js';
import privateController from './api/controllers/private.controller.js';

// Init server
const app = express();
app.use(cors());
const server = http.createServer(app);

// Connect DB
connectDB();

// Init middleware
app.use(express.json());

app.use((req, res, next) => {
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
app.use('/api/public-controller', publicController);
app.use('/api/private-controller', privateController);

app.use((req, res, next) => {
  const error = new Error("Not found");
  error.status = httpStatusCode.CLIENT_ERRORS.BAD_REQUEST;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || httpStatusCode.SERVER_ERRORS.INTERNAL_SERVER_ERROR).send({
    error: {
      status: error.status || httpStatusCode.SERVER_ERRORS.INTERNAL_SERVER_ERROR,
      message: error.message || "Internal Server Error",
    },
  });
});


// Connect socket.io
import { Server } from 'socket.io';
const io = new Server(server);
// import { initSocket } from './utils/socket';

// initSocket({ io });

server.listen(process.env.PORT || 5000, () =>
  console.log(`Server has started.`)
);