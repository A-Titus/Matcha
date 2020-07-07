var express = require("express");
var mysql = require("mysql");
var bodyParser = require("body-parser");
const multer = require('multer');
const path = require('path');


var urlencodedParser = bodyParser.urlencoded({ extended: false });

var router = express.Router();
var con = require("../config/connection");

// con.connect(function (err) {
//   if (err) {
//     console.log("Unable to connect to the database");
//   } else {
//     console.log("Connection to the database successful");
//   }
// });


router.get("/", function (req, res) {
  res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
  if(!req.session.user){
    res.render("login",{msg: "Please log in"});
      }
      else{
        con.query("SELECT * FROM `images` WHERE `username` = ?", req.session.user, function (err, result, fields) {
          if (err) throw err;
          con.query("SELECT * FROM `images` WHERE `username` = ? AND  `profile_pic` = 1", req.session.user, function (err, profile_picture, fields) {
              if (err) throw err;
              con.query("SELECT * FROM `interests` WHERE `username` = ?", req.session.user, function(err, tags, fields){
                  if (err) throw err;
                      if (profile_picture.length && tags.length) {
                          res.render("set_profile", {username: req.session.user, photos: result, profile_picture: profile_picture[0].image_path, tags: tags});
                      }else if(!profile_picture.length && tags.length){
                          res.render("set_profile", {username: req.session.user, photos: result, profile_picture: "https://az-pe.com/wp-content/uploads/2018/05/kemptons-blank-profile-picture.jpg",tags: tags});
                      }else if(profile_picture.length && !tags.length){
                          res.render("set_profile", {username: req.session.user, photos: result, profile_picture: profile_picture[0].image_path,tags: null});
                      }else{
                          res.render("set_profile", {username: req.session.user, photos: result, profile_picture: "https://az-pe.com/wp-content/uploads/2018/05/kemptons-blank-profile-picture.jpg",tags: null});
                      }
              })
                 
            }
          );
        }
      );
    }
  });

  
  router.post('/',urlencodedParser, function (req, res) {
    var gender = req.body.gender;
    var pref_gender = req.body.pref_gender;
    var bio = req.body.bio;
    var age = req.body.age;

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
    var interests = req.body.interests;
    if(interests.startsWith("#", 0)){
      interests = interests.replace(/\s+/g, '');
    }
    else{
      interests = "#" + interests;
      interests = interests.replace(/\s+/g, '');
    }
    
    var interests_record = {
      interests: interests,
      username: req.session.user
    };

    var sql ="SELECT count(*) as total FROM interests WHERE username = ?";
    con.query(sql, req.session.user, function (err, result) {
    if (result[0].total >= 6) {
      console.log("Max tag limit reached");
      res.redirect("/setProfile");
      return;
    } else {
      con.query("INSERT INTO interests SET?", interests_record, function (err, result) {
        if (err) {
          status = "Unable to add interests";
          console.log(status);
          console.log(err);
          res.redirect("/setProfile");
        }else{
          console.log("interest successfully added");
          res.redirect("/setProfile");
        }
        })  
      }
    })
  });

  router.post('/complete',urlencodedParser, function (req, res){
    con.query("SELECT * FROM user_profile WHERE username = ?", [req.session.user], function (err, result) {
      if (err) throw err;
        con.query("SELECT count(*) as total FROM interests WHERE username = ?", [req.session.user], function (err, interests) {
          if (err) throw err;
            con.query("SELECT count(*) as total FROM images WHERE username = ?", [req.session.user], function (err, images) {
              if (err) throw err;
                con.query("SELECT * FROM images WHERE username = ? AND profile_pic = 1", [req.session.user], function (err, profile_pic) {
                  if (err) throw err;

              if(result.length){
                var gender = result[0].gender;
                var pref_gender =  result[0].pref_gender;
                var bio =  result[0].bio;
                var age =  result[0].age;
  
              if(gender == null || pref_gender == null || bio == null || age == null){
                  console.log("Gender, prefered Gender, age or bio is missing please fill in all values");
                  var checkProfile = 0;
                }
                else
                  checkProfile = 1;
              }

              if(interests.length){
                if(interests[0].total < 1){
                 console.log("You need to add atleast one interest");
                 var checkInterest = 0;
                }else
                checkInterest = 1;
              }

            if(images.length){
              if(images[0].total < 1){
                console.log("You need to add atleast one image");
                var checkImages = 0;
              }else
              checkImages = 1;
            }

            if(!profile_pic.length){
              console.log("You need to add a profile image");
              var checkprofilePic = 0;
            }else
            checkprofilePic = 1;
              
              if(!checkProfile || !checkInterest || !checkImages || !checkprofilePic){
                console.log("fields have not been completed");
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
            })
            })
      })
  })
})

  router.post('/profilePic',urlencodedParser, function (req, res) {
    var profilePic = req.body.profilePic;
    con.query("SELECT * FROM images WHERE username = ? AND profile_pic = 1", [req.session.user], function (err, result) {
      if (err) {
        console.log(err);
      }                                                        ////////////check the existing profile pic and set to 0 and the set new one to 1/////////////////
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

  router.post('/deleteInterest',urlencodedParser, function (req, res) {
    var tagId = req.body.deleteTag;
    var user = req.session.user;

    con.query("DELETE from `interests` WHERE username = ? AND id = ?", [user, tagId], function (err, result) {
      if (err) {
        console.log(err);
        res.redirect("/setProfile");
      } else { 
        console.log(" Tag deleted succesfully");
        res.redirect("/setProfile");
      }
    })

  });

  module.exports = router;

  
