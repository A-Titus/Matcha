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

const PATH = './public/uploads';


  const storage = multer.diskStorage({
      destination: (req, file, cb) => {
          cb(null, PATH);
      },
      filename: (req, file, cb) => {
          const fileName = file.originalname.toLowerCase().split(' ').join('-');
          cb(null, fileName)
      }
  });
  
  
  const upload = multer({
      storage: storage,
      fileFilter: (req, file, cb) => {
          if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg" || file.mimetype == "image/gif") {
              cb(null, true);
          } else {
              cb(null, false);
              return cb(new Error('Allowed only .png, .jpg, .jpeg and .gif'));
          }
      }
  });
  
  router.post('/', upload.single('image'), (req, res, next) => {
      if(!req.file.filename || !req.file.path)
      res.redirect("/setProfile");
    var image_name = req.file.filename;
    var image_path = req.file.path;

    var new_path = image_path.replace("public/", "");

    var record = {
      image_name: image_name,
      image_path: new_path,
      username: req.session.user,
    };
    console.log(new_path);

    con.query("INSERT INTO images SET?", record, function (err, result) {
      if (err) {
        status = "Unable to upload image";
        console.log(status);
        console.log(err);
        res.redirect("/setProfile");
      } else { 
        console.log("image added successfully") ;
        
      }
    });
    // con.query(" SELECT `image_path` FROM `images` WHERE `username` = ?", req.session.user, function (err, result, fields) {
    //   if (err) throw err;
    //   console.log(result);

    // });

    con.query("SELECT * FROM user WHERE username = ?", [req.session.user], function (err, result) {
      if (err) {
        console.log(err);
      } 
      else {
        var setup = result[0].setup;
        if(setup == 1)
          res.redirect("/updateProfile");                //check if profile is already set up and redirec accordingly  
        else
          res.redirect("/setprofile");
      }
    });

   
  
})




module.exports = router;