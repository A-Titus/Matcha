function database() {
  var mysql = require("mysql");
  var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "mludakriss5128",
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
    password: "mludakriss5128",
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

    var sql = "CREATE TABLE IF NOT EXISTS images (image_id int(11) AUTO_INCREMENT PRIMARY KEY, image_name varchar(255) , image_path varchar(255) , username varchar(255), profile_pic boolean)";
    con.query(sql, function (err, result) {
      if (err) throw err;
      console.log("image Table created");
    });
    
    var sql = "CREATE TABLE IF NOT EXISTS user_profile (id int AUTO_INCREMENT PRIMARY KEY, gender varchar(255) , pref_gender varchar(255) , bio varchar(255), age int(11), username varchar(255))";
      con.query(sql, function (err, result) {
        if (err) throw err;
        console.log("user_profile Table created");
      });

      var sql = "CREATE TABLE IF NOT EXIST messages (id int AUTO_INCREMENT PRIMARY KEY , sender TEXT NOT NULL , receiver TEXT NOT NULL , message TEXT NOT NULL)";
      con.query(sql, function (err, result) {
        if (err) throw err;
        console.log("message Table created");
      });

      var sql = " CREATE TABLE IF NOT EXISTS  faker_users (img_id int(11) AUTO_INCREMENT PRIMARY KEY , images varchar(255) , name VARCHAR(255), surname VARCHAR(255) , username varchar(255) , email varchar(255))";
      con.query(sql, function (err, result) {
        if (err) throw err;
        console.log("Table created");
});

  });

}
database();
setTimeout(table, 3500);
