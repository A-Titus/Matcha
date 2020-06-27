var express = require("express");
var session = require("express-session");
var app = express();



app.set("view engine", "ejs");

app.listen(3000);

var registration = require('./src/registration');
var login = require('./src/login');
var setProfile = require('./src/set_profile');
var upload = require('./src/upload');

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

app.get("/", function (req, res) {
  if(!req.session.user){
    res.render('registration', {msg: "Please register"});
  }
  else
    res.render("home");
  });

  app.get("/logout", function (req, res) {
      req.session.destroy();
      res.redirect("/login");
    });


