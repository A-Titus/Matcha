var express = require("express");
var session = require("express-session");
var bodyParser = require('body-parser');
//var io = require("socket.io");
var app = express();

// const server = require('http').createServer(app);
// const io = require('socket.io')(server);
var con = require("./config/connection");

app.set("view engine", "ejs");

app.listen(3000);

var registration = require('./src/registration');
var login = require('./src/login');
var setProfile = require('./src/set_profile');
var upload = require('./src/upload');
var profile = require('./src/profile');
var updateProfile = require('./src/update_profile');
var confirm = require('./src/confirm');
var resetPassword = require('./src/reset_password');
var location = require('./src/location');
var agegap = require('./src/age_gap');
var age26_30 = require('./src/age26_30');
var interest = require('./src/interest');
var age31 = require('./src/age31');
var age41 = require('./src/age41');
var age51 = require('./src/age51');
var search_user = require('./src/search_user');
var connect = require('./src/connect');
var likes = require('./src/likes');
var report = require('./src/report');
//var chat = require('./src/chat');

// app.get("*", function (req, res) {
//   res.render("error");
// });
app.use(express.static(__dirname + '/public'));

app.use(session({
  secret: 'matcha12345',
  resave: false,
  saveUninitialized: true
})) 

app.use('/registration', registration);
app.use('/login', login); 
app.use('/setProfile', setProfile); 
app.use('/uploads', upload); 
app.use('/profile', profile); 
app.use('/updateProfile', updateProfile); 
app.use('/confirm', confirm); 
app.use('/resetPassword', resetPassword);
app.use('/location', location);
app.use('/age51', age51)
app.use('/age41', age41)
app.use('/age31', age31)
app.use('/age2630', age26_30)
app.use('/interest', interest);
app.use('/agegap', agegap);
app.use('/search_user', search_user);
app.use('/connect',connect);
app.use('/likes',likes);
app.use('/report',report);
//app.use('/chat', chat);

app.get("/", function (req, res) {
  res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
  if(!req.session.user){
    res.render('registration', {msg: "Please register"});
  }
  else
     if(!req.session.profile)
     res.redirect("/setProfile");
      else{
        con.query("SELECT * FROM `user_profile` WHERE username != ?",[req.session.user], function (err, users, fields) {
          if (err) throw err;
          //console.log(users);
          res.render("home", {userData: null} );
        });
      }
     
  });

  app.get("/logout", function (req, res) {
    var dateUser = new Date().toUTCString();
    console.log("Logout time : " |+dateUser);
    con.query("UPDATE user_profile SET last_seen = (?) WHERE username = (?)", [dateUser,req.session.user]);
      req.session.destroy();
      res.redirect("/login");
    });

///////////////////

// app.get('/chat', function(req, res) {
//   res.render("chat");
// });


// app.use(function (request, result, next) {
// 	result.setHeader("Access-Control-Allow-Origin", "*");
// 	next();
// });

// app.post("/get_messages", function (request, result) {
// 	connection.query("SELECT * FROM messages WHERE (sender = '" + request.body.sender + "' AND receiver = '" + request.body.receiver + "') OR (sender = '" + request.body.receiver + "' AND receiver = '" + request.body.sender + "')", function (error, messages) {
// 		result.end(JSON.stringify(messages));
// 	});
// });

// app.get("/", function (request, result) {
// 	result.end("Hello world !");
// });

// var users = [];

// io.on("connection", function (socket) {
// 	console.log("User connected: ",  socket.id);

// 	socket.on("user_connected", function (username) {
// 		users[username] = socket.id;
// 		io.emit("user_connected", username);
// 	});

// 	socket.on("send_message", function (data) {
// 		var socketId = users[data.receiver];
// 		socket.to(socketId).emit("message_received", data);

// 		connection.query("INSERT INTO messages (sender, receiver, message) VALUES ('" + data.sender + "', '" + data.receiver + "', '" + data.message + "')", function (error, result) {
// 			//
// 		});
// 	});
// });