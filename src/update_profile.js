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
            if(!req.session.profile){
                res.render("set_profile", {username: req.session.user, photos: result});
            }else
                 res.render("update_profile", {username: req.session.user, photos: result});
            })
      }
  });
  module.exports = router;