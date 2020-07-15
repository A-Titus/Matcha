var express = require("express");
var mysql = require("mysql");
var con = require("../config/connection");
var session = require("express-session");
var bodyParser = require("body-parser");
var router = express.Router();
var urlencodedParser = bodyParser.urlencoded({ extended: false });
var bcrypt = require("bcrypt");
var con = require("../config/connection");

router.get("/", function (req, res) {
  console.log("Current user : " , req.session.user)
  con.query("INSERT INTO user_invite(username,requ_user) VALUES(?,?) ", [req.session.user,req.session.connect_invite], function (err, result) {
      console.log('Invites send to ' + req.session.connect_invite);
    })
});
    module.exports = router;