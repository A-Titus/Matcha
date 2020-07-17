var express = require("express");
var session = require("express-session");
var mysql = require("mysql");
var bodyParser = require("body-parser");
var nodemailer = require('nodemailer');
var app = express();
var io = require("socket.io");
var router = express.Router();


var router = express.Router();
var con = require("../config/connection");

//enable headers required for POST requests
app.use(function (request, results, next){
    result.setHeader("Access-Control-Allow-Origin", "*");
    next();
});

// API to return all messages
app.post("/get_messages", function(request, result){
//get all messages from DB
    con.query("SELECT * FROM messages WHERE (sender = '" + request.body.receiver + "' AND receiver = '"+ request.body.sender +"')", function (error, messages){
        //response in JSON
        result.end(JSON.stringify(messages));
    });
});

app.get('/chat', function (req, res) {
    res.send('GET request to the homepage')
  });

//enable URL encoded for POST request 
app.use(bodyParser.urlencoded());

var users =[];
io.on("connection", function (socket){
    console.log("User connected", socket.id);

    socket.on("user_connected", function (username){
        /******save in a form of array******/
        /******it will send using the id which is your username to individual******/
        users[username] = socket.id;

        /******notify users******/
        io.emit("start chat", username);
    });

    /******listen from client******/
    socket.on("send_message", function (data){
        /******send event to receiver******/
        var socketId = users[data.receiver];

        io.to(socketId).emit("new_message", data);

        con.query("INSER INTO messages (sender, receiver, message) VALUE ('" + data.sender +"', '"+ data.receiver +"', '"+ data.message +"')", function(error, results){
            //
        });
    });
});