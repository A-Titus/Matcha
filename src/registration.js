var express = require("express");
var mysql = require("mysql");
var bodyParser = require("body-parser");
var nodemailer = require('nodemailer');


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
  res.render("registration");
});

router.post("/", urlencodedParser, function (req, res) {
  var name = req.body.name;
  var surname = req.body.surname;
  var username = req.body.username;
  var email = req.body.email;
  var password = req.body.password;
  var conf_password = req.body.conf_password;

  if (!name || !surname || !username || !email || !password || !conf_password) {
    console.log("all fields must be completed");
    res.render("registration");
    return;
  }

  //DO VALIDATIONS FOR NAME AND SURNAME

  if (
    !req.body.email.match(
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    )
  ) {
    console.log("The format of the email address is incorrect");
    res.render("registration");
    return;
  }

  if (!req.body.password.match(/^[A-Za-z]\w{7,}$/)) {
    console.log(
      "Password must be atleast 8 characters long containing an uppercase character, lowecase character and a number "
    );
    res.render("registration");
    return;
  }

  if (req.body.password !== req.body.conf_password) {
    console.log("Passswords do not match");
    res.render("registration");
    return;
  } else {
    var hashed_pass = bcrypt.hashSync(password, 15);
    console.log(hashed_pass);
  }

  //check if username already exists.
  var sql =
    "SELECT count(*) as total FROM user WHERE username = ? OR email = ?";
  var query = con.query(sql, [username, email], function (err, result) {
    console.log("Total Records:- " + result[0].total);
    if (result[0].total >= 1) {
      console.log("username or email already in use");
      res.render("registration");
      return;
    } else {
      var record = {
        name: name,
        surname: surname,
        username: username,
        email: email,
        password: hashed_pass,
      };

      con.query("INSERT INTO user SET?", record, function (err, result) {
        if (err) {
          status = "Unable to create this user";
          console.log(status);
          console.log(err);
          res.render("registration");
        } else {
            // var transporter = nodemailer.createTransport({
            //     service: 'gmail',
            //     auth: {
            //       user: 'abdussamadtitus@gmail.com',
            //       pass: 'Titusat@2000'
            //     },
            //     tls: { rejectUnauthorized: false }
            //   });
              
            //   var mailOptions = {
            //     from: 'youremail@gmail.com',
            //     to: 'waliwir382@vewku.com',
            //     subject: 'Sending Email using Node.js',
            //     text: 'That was easy!'
            //   };
              
            //   transporter.sendMail(mailOptions, function(error, info){
            //     if (error) {
            //       console.log(error);
            //     } else {
            //       console.log('Email sent: ' + info.response);
            //     }
            //   });  

          res.redirect("/login");
        }
      });
    }
  });
});

module.exports = router;
