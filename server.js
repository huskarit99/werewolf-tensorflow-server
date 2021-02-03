const http = require('http');
const express = require('express');
const cors = require('cors');
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

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Credentials", "true");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin,X-Requested-With,Content-Type,Accept,Authorization"
    );
    res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");

    next();
});
app.use(passport.initialize());

//Define routes
app.use("/api/users", require("./routes/users"));

server.listen(process.env.PORT || 5000, () =>
    console.log(`Server has started.`)
);