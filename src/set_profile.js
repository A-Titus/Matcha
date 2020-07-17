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
          
          con.query("SELECT * FROM `images` WHERE `username` = ? AND  `profile_pic` = 1", req.session.user ,function (err, profile_picture, fields) {
            if (err) throw err;
            if(profile_picture.length){
              console.log("here");
              res.render("set_profile", {username: req.session.user, photos: result, profile_picture: profile_picture[0].image_path});
               
            }
            else{
              console.log("no here");
              res.render("set_profile", {username: req.session.user, photos: result, profile_picture: "https://az-pe.com/wp-content/uploads/2018/05/kemptons-blank-profile-picture.jpg"});
            }
            
        });
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

    con.query("UPDATE user_profile SET gender = ?, pref_gender = ?, bio = ?, age = ? WHERE username = ?", [gender, pref_gender, bio, age, req.session.user], function (err, result) {
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
    var interests = [];
    interests.push(req.body.interests);

    console.log(interests);

    //insert an array with dummy data eg ["test","test", ...]
    //then update each index as tags are inserted have a limit.
    //get array from db and update each time
    //check for duplicate tags

  });

  router.post('/complete',urlencodedParser, function (req, res){
    con.query("SELECT * FROM user_profile WHERE username = ?", [req.session.user], function (err, result) {
      if (err) {
        console.log(err);
      } 
      else {
        var gender = result[0].gender;
        var pref_gender =  result[0].pref_gender;
        var bio =  result[0].bio;
        var age =  result[0].age;

        if(gender == null || pref_gender == null || bio == null || age == null){
          console.log("fields missing please enter all the correct values");
          res.redirect("/setProfile");
        }else{
          con.query("UPDATE user SET setup = '1' WHERE username = ?", req.session.user, function (err, result) {
            if (err) {
              console.log(err);
              res.redirect("/setProfile");
            } else { 
              console.log("profile uploaded succesfully");
              req.session.profile = "done";
              res.redirect("/");
            }
          })
        }
      }
    })
  })

  router.post('/profilePic',urlencodedParser, function (req, res) {
    var profilePic = req.body.profilePic;
    con.query("SELECT * FROM images WHERE username = ? AND profile_pic = 1", [req.session.user], function (err, result) {
      if (err) {
        console.log(err);
      }                                                             ////////////check the existing profile pic and set to 0 and the set new one to 1/////////////////
      else {
        if(result.length){
          var pic_id = result[0].img_id;
          con.query("UPDATE images SET profile_pic = '0' WHERE username = ? AND img_id = ?", [req.session.user, pic_id], function (err, result) {
            if (err) {
              console.log(err);
            }
          });
        }
      }
    })

    con.query("UPDATE images SET profile_pic = '1' WHERE username = ? AND img_id = ?", [req.session.user, profilePic], function (err, result) {
      if (err) {
        console.log(err);
        res.redirect("/setProfile");
      } else { 
        console.log("Profile Pic updated succesfully");
        res.redirect("/setProfile");
      }
    })
    
  });

  router.post('/delete',urlencodedParser, function (req, res) {
    var picId = req.body.deletebtn;
    var user = req.session.user;

    con.query("DELETE from `images` WHERE username = ? AND img_id = ?", [user, picId], function (err, result) {
      if (err) {
        console.log(err);
        res.redirect("/setProfile");
      } else { 
        console.log(" Pic deleted succesfully");
        res.redirect("/setProfile");
      }
    })

  });

  module.exports = router;

  
