var express = require("express");
var bodyParser = require("body-parser");
let x = {};
table_images = {};
var urlencodedParser = bodyParser.urlencoded({ extended: false });
var router = express.Router();
var con = require("../config/connection");
const session = require("express-session");

router.get("/", function (req, res) {
  // res.end();
  //router.reload();
  res.render("search_user",{data:{x,table_images}});
  x = {};
  table_images = {};
  return false;
});

router.post("/", urlencodedParser, function (req, res) {
  var output1 = req.body.search_user_match;
  if (!output1) {
    res.render("search_user",{data:{x,table_images}});
  }
  else {
  con.query("SELECT * FROM images WHERE username =(?);", [output1], function (err, result) {
    table_images = result;
  });
   query_results = con.query("SELECT * FROM user_profile WHERE username =(?);", [output1], function (err, result) {
      x = result;
    });
    req.session.connect_invite = query_results.values;
    res.redirect("/search_user");
    return false;
  }

});
module.exports = router;