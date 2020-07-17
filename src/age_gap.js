var express = require("express");
var mysql = require("mysql");
var bodyParser = require("body-parser");
const multer = require("multer");
const path = require("path");

var urlencodedParser = bodyParser.urlencoded({ extended: false });

var router = express.Router();
var con = require("../config/connection");

router.get('/', (req, res)=>{

    // res.setHeader('Content-Type', 'text/plain')

    if(!req.session.user){
        res.render("login", { msg: "Please logIn"});
    }else{
        console.log(req.session.user)
        con.query("SELECT age, username FROM user_profile WHERE age IN (18, 20, 21, 22, 23, 24, 25 ) AND username != ?",[req.session.user],function(err, results, fields){
            if(err){
               console.log(err);
               res.json({"error": true});
            }else{
               console.log(results);
               results.forEach(function(e){
                console.log(e['username'])
            })
               res.json(results)
               //res.render('../views/home');
            }
            // res.writeHead(200);
            // res.write(JSON.stringify(results));
            // res.end();
            // return 
        });
    }    
});

module.exports = router;