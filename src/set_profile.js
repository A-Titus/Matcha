var express = require("express");
var mysql = require("mysql");
var bodyParser = require("body-parser");
const multer = require('multer');
const path = require('path');


var urlencodedParser = bodyParser.urlencoded({ extended: false });

var router = express.Router();
var con = require("../config/connection");

con.connect(function (err) {
  if (err) {
    console.log("Unable to connect to the database");
  } else {
    console.log("Connection to the database successful");
  }
});


router.get("/", function (req, res) {
  res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
  if(!req.session.user){
    res.render("login",{msg: "Please log in"});
      }
      else{
        con.query("SELECT * FROM `images` WHERE `username` = ?", req.session.user ,function (err, result, fields) {
          if (err) throw err;
          console.log(result);
          res.render("set_profile", {username: req.session.user, photos: result});
        });
      }
  });

  
  router.post('/',urlencodedParser, function (req, res) {
    var gender = req.body.gender;
    var pref_gender = req.body.pref_gender;
    var bio = req.body.bio;
    var age = req.body.age;

    console.log(gender);
    console.log(pref_gender);
    console.log(bio);
    console.log(age);

    var record = {
      gender: gender,
      pref_gender: pref_gender,
      bio: bio,
      age: age,
      username: req.session.user
    };

    con.query("INSERT INTO user_profile SET?", record, function (err, result) {
      if (err) {
        status = "Unable to submit data";
        console.log(status);
        console.log(err);
        res.redirect("/setProfile");
      } else { 
        console.log("data uploaded succesfully") ;
        res.redirect("/setProfile");
      }
    });
  })

  router.post('/interests',urlencodedParser, function (req, res) {
    var interests = req.body.interests;
    console.log(interests);
  });


  
  module.exports = router;

  
