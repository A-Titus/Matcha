var express = require("express");
var session = require("express-session");
var app = express();
var con = require("./config/connection");

con.connect(function (err) {
  if (err) {
    console.log("Unable to connect to the database");
  } else {
    console.log("Got into data!");
  }
});


app.set("view engine", "ejs");

app.listen(3000);

var registration = require('./src/registration');
var login = require('./src/login');
var setProfile = require('./src/set_profile');
var upload = require('./src/upload');
var profile = require('./src/profile');
var updateProfile = require('./src/update_profile');
var search_user = require('./src/search_user');
var connect = require('./src/connect');
var likes = require('./src/likes');
var report = require('./src/report');

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
app.use('/search_user', search_user);
app.use('/connect',connect);
app.use('/likes',likes);
app.use('/report',report);

app.get("/", function (req, res) {
  res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
  if(!req.session.user){
    res.render('registration', {msg: "Please register"});
  }
  else
     if(req.session.profile == 'done')
      res.render("home");
      else
      res.render("set_profile", {photos: null, profile_pic: null})
  });

  app.get("/logout", function (req, res) {
    console.log(req.session.user);
    var dateUser = new Date().toUTCString();
    console.log("Logout time : " |+dateUser);
    con.query("UPDATE user_profile SET last_seen = (?) WHERE username = (?)", [dateUser,req.session.user]);
      req.session.destroy();
      res.redirect("/login");
    });