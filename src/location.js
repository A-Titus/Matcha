var express = require("express");
var mysql = require("mysql");
var bodyParser = require("body-parser");
const multer = require('multer');
const path = require('path');
const router = express.Router()
const locationModel = require("../model/location");

router.get("/", function (req, res) {
  console.log(req.session)


  res.render('setProfile')
});

router.post('/', (req, res) => {
  const body = {
    user: req.session.user,
    lat: req.body.lat,
    lng: req.body.lng
  }

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