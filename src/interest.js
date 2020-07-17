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
        con.query("SELECT username FROM interests WHERE username != ? AND sports = 1 OR gym = 1 OR fashion = 1 ",[req.session.user],function(err, results, fields){
            if(err){
               console.log(err);
               res.json({"error": true});
            }else{
               console.log(results);
               res.json(results)
            //    res.render('../views/home');
            }
        });
    }    
});

module.exports = router;