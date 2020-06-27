var express = require("express");
var mysql = require("mysql");
var bodyParser = require("body-parser");
var nodemailer = require("nodemailer");


var urlencodedParser = bodyParser.urlencoded({ extended: false });

var router = express.Router();
var bcrypt = require("bcrypt");
var con = require("../config/connection");

con.connect(function (err) {
  if (err) {
    console.log("Unable to connect to the database");
  } else {
    console.log("Connection to the database successful");
  }
});

router.get("/", function (req, res) {
  res.render("login", {msg: "Please log in"});
});

router.post("/", urlencodedParser, (req, res) => {
  var username = req.body.username;
  var password = req.body.password;

  con.query("SELECT * FROM user WHERE username = ?", [username], function (
    err,
    result
  ) {
    if (err) {
      console.log(err);
    } else if (result.length) {
      var db_user = result[0].username;
      var db_pass = result[0].password;

      if (username == db_user) {
        bcrypt.compare(password, db_pass, function (err, result) {
          if (result == true) {
            console.log("successfully logged in");
            req.session.user = username;            //set user session//
            res.redirect("/setProfile");
          } else {
            console.log("Incorrect password");
            res.render("login", {msg: "Incorrect Password"});
          }
        });
      } else {
        console.log("user does not exist");
        res.render("login", {msg: "user does not exist"});
      }
    } else {
      console.log("user doesnt exist.");
      res.render("login", {msg: "user does not exist"});
    }
  });
});

module.exports = router;
