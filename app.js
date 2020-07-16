var express = require("express");
var session = require("express-session");
var app = express();



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
var agegap = require('./src/age_gap');
var age26_30 = require('./src/age26_30');
var interest = require('./src/interest');
var age31 = require('./src/age31');
var age41 = require('./src/age41');
var age51 = require('./src/age51');

// app.get("*", function (req, res) {
//   res.render("error");
// });
app.use(express.static(__dirname + '/public'));

app.use(session({
  secret: 'matcha12345',
  resave: false,
  saveUninitialized: true
})) 

app.use('/age51', age51)
app.use('/age41', age41)
app.use('/age31', age31)
app.use('/age2630', age26_30)
app.use('/interest', interest);
app.use('/agegap', agegap);
app.use('/registration', registration);
app.use('/login', login); 
app.use('/setProfile', setProfile); 
app.use('/uploads', upload); 
app.use('/profile', profile); 
app.use('/updateProfile', updateProfile); 
app.use('/confirm', confirm); 
app.use('/resetPassword', resetPassword);

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


