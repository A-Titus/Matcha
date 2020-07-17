var express = require("express");
var session = require("express-session");
var bodyParser = require('body-parser');
//var io = require("socket.io");
var app = express();

const server = require('http').createServer(app);
const io = require('socket.io')(server);

app.set("view engine", "ejs");

app.listen(3000);

var registration = require('./src/registration');
var login = require('./src/login');
var setProfile = require('./src/set_profile');
var upload = require('./src/upload');
var profile = require('./src/profile');
var updateProfile = require('./src/update_profile');
<<<<<<< HEAD
var location = require('./src/location');
=======
var confirm = require('./src/confirm');
var resetPassword = require('./src/reset_password');
var location = require('./src/location');
//var chat = require('./src/chat');
>>>>>>> c2be5ca1a09b5c1177300ffc574d1a8b86c25fa7

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
<<<<<<< HEAD
app.use('./location', location);
=======
app.use('/confirm', confirm); 
app.use('/resetPassword', resetPassword);
app.use('/location', location);
//app.use('/chat', chat);
>>>>>>> c2be5ca1a09b5c1177300ffc574d1a8b86c25fa7

app.get("/", function (req, res) {
  res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
  if(!req.session.user){
    res.render('registration', {msg: "Please register"});
  }
  else
     if(!req.session.profile)
     res.redirect("/setProfile");
      else
      res.render("home");
     
  });

  app.get("/logout", function (req, res) {
      req.session.destroy();
      res.redirect("/login");
    });


