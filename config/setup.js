function database() {
  var mysql = require("mysql");
  var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
  });
  con.connect(function (err) {
    if (err) throw err;
    console.log("Connected!");
    con.query("CREATE DATABASE IF NOT EXISTS matcha", function (err, result) {
      if (err) throw err;
      console.log("Database created!");
    });
  });
}

 function table() {
  var mysql = require("mysql");
  var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "matcha",
  });
    con.connect(function (err) {
    if (err) throw err;
    console.log("Connected");
    var sql =
      "CREATE TABLE IF NOT EXISTS user(id int AUTO_INCREMENT PRIMARY KEY , name varchar(255),surname varchar(255),username varchar(255),email varchar(255),password varchar(255), verified boolean, setup boolean)";
    con.query(sql, function (err, result) {
      if (err) throw err;
      console.log("user Table created");
    });

    var sql = "CREATE TABLE IF NOT EXISTS images (img_id int(11) AUTO_INCREMENT PRIMARY KEY, image_name varchar(255) , image_path varchar(255) , username varchar(255), profile_pic boolean)";
    con.query(sql, function (err, result) {
      if (err) throw err;
      console.log("image Table created");
    });
    
    var sql = "CREATE TABLE IF NOT EXISTS user_profile (id int AUTO_INCREMENT PRIMARY KEY, gender varchar(255) , pref_gender varchar(255) , bio varchar(255), age int(11), username varchar(255), last_seen varchar(255),connect_user varchar(255))";
      con.query(sql, function (err, result) {
        if (err) throw err;
        console.log("user_profile Table created");
      });

      var sql = "CREATE TABLE IF NOT EXISTS user_invite (id int AUTO_INCREMENT PRIMARY KEY, username varchar(255) , requ_user varchar(255))";
      con.query(sql, function (err, result) {
        if (err) throw err;
        console.log("user_invite Table created");
      });


  });

}
database();
setTimeout(table, 3500);
