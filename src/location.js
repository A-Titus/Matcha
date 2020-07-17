var express = require("express");
var mysql = require("mysql");
var bodyParser = require("body-parser");
const multer = require('multer');
const path = require('path');
const router = express.Router()
<<<<<<< HEAD
const locationModel = require("../model/location");

router.get("/", function (req, res) {
  console.log(req.session)


  res.render('setProfile')
});

router.post('/', (req, res) => {
=======
//const locationModel = require("../model/location");

var con = require("../config/connection");

var urlencodedParser = bodyParser.urlencoded({ extended: false });

// router.get("/", function (req, res) {
//   console.log(req.session)


//   res.render('setProfile')
// });

router.post('/', urlencodedParser, (req, res) => {
>>>>>>> c2be5ca1a09b5c1177300ffc574d1a8b86c25fa7
  const body = {
    user: req.session.user,
    lat: req.body.lat,
    lng: req.body.lng
  }

<<<<<<< HEAD
  //console.log(req.body.lng);
  //console.log(req.body.lat);
  if (!body.lat || !body.lng)
    res.json("Missing inputs")
  else {
    locationModel.updateLocation(body).then((result) => {
      res.json(result)
  })
  };
});
=======
  console.log(req.body.lng);
  console.log(req.body.lat);
  if (!body.lat || !body.lng)
    req.session.Msg = "Couldnt get location please try again";
  else {
      const query = 'UPDATE user_profile SET latitude = ?, longitude = ? WHERE username = ?' 
      con.query(query, [body.lat, body.lng, body.user], (err, result) => {
        if (err) {
          status = "Unable to submit data";
          console.log(status);
          console.log(err);
          if (req.session.profile == "done") 
            res.redirect("/updateProfile");
          else 
            res.redirect("/setprofile");
        } else { 
          console.log("location uploaded succesfully") ;
          req.session.Msg = null;
          if (req.session.profile == "done") 
            res.redirect("/updateProfile");
          else 
            res.redirect("/setprofile");
        }
      })
    }
})

>>>>>>> c2be5ca1a09b5c1177300ffc574d1a8b86c25fa7

/**
 * return new Promise((resolve) => {
      const query = 'UPDATE user_profile SET latitude = ?, longitute = ? WHERE username = ?' 
      con.query(query, [body.lat, body.lng, body.user], (err, result) => {
        if (err) {
          status = "Unable to submit data";
          console.log(status);
          console.log(err);
          res.redirect("/setProfile");
        } else { 
          console.log("data uploaded succesfully") ;
          res.redirect("/setProfile");
        }
      })
    }); 
 */

module.exports = router;