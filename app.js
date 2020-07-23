var express = require("express");
var session = require("express-session");
var bodyParser = require('body-parser');
//var io = require("socket.io");
var app = express();

const server = require('http').createServer(app);
 const io = require('socket.io')(server);
var con = require("./config/connection");

app.set("view engine", "ejs");

server.listen(3000);

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
var block = require('./src/block');
var filter = require('./src/filter');
var chat = require('./src/chat')[0];
var chatjs = require('./src/chat')[1];
var sort = require('./src/sort');

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
app.use('/block',block);
app.use('/filter',filter);
app.use('/chat', chat);
app.use('/sort', sort);
chatjs(io);


app.get("/", function (req, res) {
  res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
  if(!req.session.user){
    res.render('registration', {msg: "Please register"});
  }
  else
     if(!req.session.profile)
     res.redirect("/setProfile");
      else{
        req.session.gender = null;
        req.session.minage = null;
        req.session.maxage = null;
        con.query("SELECT * FROM `user_profile` WHERE username = ?",[req.session.user], function (err, usersInfo, fields) {
          if (err) throw err;
          ageAbove= usersInfo[0].age + 5;
          ageBelow= usersInfo[0].age - 5;
          if(usersInfo[0].pref_gender == "bisexual"){
            con.query("SELECT * FROM `user_filter` WHERE `username` != ? AND `age` BETWEEN ? AND ? AND `username` IN (SELECT `username` FROM `interests` WHERE `interests` IN (SELECT `interests` FROM `interests` WHERE `username` = ?))", [req.session.user, ageBelow, ageAbove, req.session.user], function (err, results, fields) {
              if (err) throw err;
              res.render("home", {userData: results, user: req.session.user});
          })
          }else{
            con.query("SELECT * FROM `user_filter` WHERE `username` != ? AND `gender` = ? AND `age` BETWEEN ? AND ? AND `username` IN (SELECT `username` FROM `interests` WHERE `interests` IN (SELECT `interests` FROM `interests` WHERE `username` = ?))", [req.session.user, usersInfo[0].pref_gender, ageBelow, ageAbove, req.session.user], function (err, results, fields) {
              if (err) throw err;
              res.render("home", {userData: results, user: req.session.user});
          })
          }
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

app.use(function (request, result, next) {
	result.setHeader("Access-Control-Allow-Origin", "*");
	next();
});

app.post("/get_messages", function (request, result) {
	connection.query("SELECT * FROM messages WHERE (sender = '" + request.body.sender + "' AND receiver = '" + request.body.receiver + "') OR (sender = '" + request.body.receiver + "' AND receiver = '" + request.body.sender + "')", function (error, messages) {
		result.end(JSON.stringify(messages));
	});
});

app.get("/", function (request, result) {
	result.end("Hello world !");
});

var users = [];