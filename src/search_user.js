var express = require("express");
var mysql = require("mysql");
var bodyParser = require("body-parser");
let x = {};
table_images = {};


var urlencodedParser = bodyParser.urlencoded({ extended: false });
var router = express.Router();
var bcrypt = require("bcrypt");
var con = require("../config/connection");
const session = require("express-session");
const { json, query } = require("express");

con.connect(function (err) {
  if (err) {
    console.log("Unable to connect to the database");
  } else {
    console.log("Got into data!");
  }
});

router.get("/", function (req, res) {
  res.render("search_user",{data:{x,table_images}});
  x = {};
  table_images = {};
});

router.post("/", urlencodedParser, function (req, res) {
  var output1 = req.body.search_user_match;
  if (!output1) {
    res.render("search_user",{data:{x,table_images}});
  }
  else {
  con.query("SELECT * FROM images WHERE username =(?);", [output1], function (err, result) {
    table_images = result;
    for (j in table_images)
    console.log(table_images[j].image_path);
  });
   query_results = con.query("SELECT * FROM user_profile WHERE username =(?);", [output1], function (err, result) {
      x = result;
      if (!result[0])
      console.log("No user has been found!");
      for (k in result)
      console.log(result[k].username +'\n'+ result[k].age);
    });
    req.session.connect_invite = query_results.values;
    res.redirect("/search_user")
  }

});
module.exports = router;