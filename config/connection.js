var mysql = require('mysql');
var con = mysql.createConnection(
{
    host: "localhost",
    user : "root",
    password: "mludakriss5128",
    database: "matcha",
}
);
module.exports = con;