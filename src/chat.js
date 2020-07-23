
var bodyParser = require("body-parser");
var mysql = require("mysql");
//var io = require('socket.io');
const express = require('express');
var router = express.Router();

users = [];
connections = [];
let chating = function (io) {
io.on('connection', function (socket) {
    connections.push(socket);
    console.log('connected: %s socket connected', connections.length);

    //Disconnect
    socket.on('disconnect', function (data) {

        users.splice(users.indexOf(socket.username), 1);
        updateUsernames();
        connections.splice(connections.indexOf(socket), 1);
        console.log('connected: %s socket connected', connections.length);

    });
    //send message
    socket.on('send_message', function (data) {
        console.log("listening from send endpoint");
        io.sockets.emit('new_message', { msg: data, user: socket.username });
    });

    socket.on('new user', function (data, callback) {
        callback(true);
        socket.username = data;
        users.push(socket.username);
        updateUsernames();
    });

    function updateUsernames() {
        io.sockets.emit('get_users', users)
    }
});

router.get('/', function (req, res) {
     res.render('chat', {username: req.session.user});
 });
};
module.exports = [ router, chating ];




















// const express = require('express');
// const app = express();
// const http = require('http').Server(app);
// var router = express.Router();
// const io = require('socket.io')(http);

// router.get('/chat', function(req, res) {
//     res.render('chat');
// });

// io.sockets.on('connection', function(socket) {
//     socket.on('username', function(username) {
//         socket.username = username;
//         io.emit('is_online', '<i>' + socket.username + ' join the chat..</i>');
//     });

//     socket.on('disconnect', function(username) {
//         io.emit('is_online', '<i>' + socket.username + ' left the chat..</i>');
//     })

//     socket.on('chat_message', function(message) {
//         io.emit('chat_message', '<strong>' + socket.username + '</strong>: ' + message);
//     });

// });

// module.exports = router;

