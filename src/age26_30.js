var express = require("express");
var mysql = require("mysql");
var bodyParser = require("body-parser");
const multer = require("multer");
const path = require("path");

var urlencodedParser = bodyParser.urlencoded({ extended: false });

var router = express.Router();
var con = require("../config/connection");

router.get('/', (req, res)=>{

    if(!req.session.user){
        res.render("login", { msg: "Please logIn"});
    }else{
        console.log(req.session.user)
        con.query("SELECT age, username FROM user_profile WHERE age IN (26, 27, 28, 29, 30) AND username != ?",[req.session.user],function(err, results, fields){
            if(err){
               console.log(err);
               res.json({"error": true});
            }else{
               console.log(results);
               res.json(results)
               res.render('../views/home');
            }
        });
    }    
});

module.exports = router;