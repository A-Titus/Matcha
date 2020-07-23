var express = require("express");
var mysql = require("mysql");
var bodyParser = require("body-parser");
const multer = require("multer");
const path = require("path");

var urlencodedParser = bodyParser.urlencoded({ extended: false });

var router = express.Router();
var con = require("../config/connection");

router.get("/age", (req, res) => {
  if (
    !req.session.gender &&
    !req.session.maxage &&
    !req.session.minage &&
    !req.session.rating
  ) {
    //for home page
    con.query(
      "SELECT * FROM `user_profile` WHERE username = ?",
      [req.session.user],
      function (err, usersInfo, fields) {
        if (err) throw err;
        ageAbove = usersInfo[0].age + 5;
        ageBelow = usersInfo[0].age - 5;
        if (usersInfo[0].pref_gender == "bisexual") {
          con.query(
            "SELECT * FROM `user_filter` WHERE `username` != ? AND `age` BETWEEN ? AND ? AND `username` IN (SELECT `username` FROM `interests` WHERE `interests` IN (SELECT `interests` FROM `interests` WHERE `username` = ?)) ORDER BY `age` ASC",
            [req.session.user, ageBelow, ageAbove, req.session.user],
            function (err, users, fields) {
              if (err) throw err;
              res.render("home", { userData: users, user: req.session.user });
            }
          );
        } else {
          con.query(
            "SELECT * FROM `user_filter` WHERE `username` != ? AND `gender` = ? AND `age` BETWEEN ? AND ? AND `username` IN (SELECT `username` FROM `interests` WHERE `interests` IN (SELECT `interests` FROM `interests` WHERE `username` = ?)) ORDER BY `age` ASC",
            [
              req.session.user,
              usersInfo[0].pref_gender,
              ageBelow,
              ageAbove,
              req.session.user,
            ],
            function (err, users, fields) {
              if (err) throw err;
              console.log("in home sort");
              //console.log(users)
              res.render("home", { userData: users, user: req.session.user });
            }
          );
        }
      }
    );
  } else {
    // for filter page
    con.query("SELECT COUNT (*) AS count FROM user", function (
      err,
      user_count
    ) {
      if (err) throw err;
      if (!req.session.rating) {
        con.query("SELECT count(*) as total FROM filter_tags", function (
          err,
          results,
          fields
        ) {
          if (err) throw err;
          if (results[0].total == 0) {
            con.query(
              "SELECT * FROM `user_filter` WHERE `username` != ? AND `gender` = ? AND `age` BETWEEN ? AND ? ORDER BY `age` ASC ",
              [
                req.session.user,
                req.session.gender,
                req.session.minage,
                req.session.maxage,
              ],
              function (err, usesNoTags, field) {
                res.render("home", {
                  userData: usesNoTags,
                  user: req.session.user,
                });
              }
            );
          } else {
            con.query(
              "SELECT * FROM `user_filter` WHERE `username` != ? AND `gender` = ? AND `age` BETWEEN ? AND ? AND `username` IN (SELECT `username` FROM `interests` WHERE `interests` IN (SELECT `interests` FROM `filter_tags`)) ORDER BY `age` ASC ",
              [
                req.session.user,
                req.session.gender,
                req.session.minage,
                req.session.maxage,
              ],
              function (err, results, fields) {
                if (err) throw err;
                res.render("home", {
                  userData: results,
                  user: req.session.user,
                });
              }
            );
          }
        });
      } else {
        var ratingNo = Math.round(
          req.session.rating * 0.2 * user_count[0].count
        );
        con.query("SELECT count(*) as total FROM filter_tags", function (
          err,
          results,
          fields
        ) {
          if (err) throw err;
          if (results[0].total == 0) {
            con.query(
              "SELECT * FROM `user_filter` WHERE `username` != ? AND `gender` = ? AND `age` BETWEEN ? AND ? AND `likes` >= ? ORDER BY `age` ASC ",
              [
                req.session.user,
                req.session.gender,
                req.session.minage,
                req.session.maxage,
                ratingNo,
              ],
              function (err, usesNoTags, field) {
                res.render("home", {
                  userData: usesNoTags,
                  user: req.session.user,
                });
              }
            );
          } else {
            con.query(
              "SELECT * FROM `user_filter` WHERE `username` != ? AND `gender` = ? AND `age` BETWEEN ? AND ? AND `likes` >= ? AND `username` IN (SELECT `username` FROM `interests` WHERE `interests` IN (SELECT `interests` FROM `filter_tags`)) ORDER BY `age` ASC ",
              [
                req.session.user,
                req.session.gender,
                req.session.minage,
                req.session.maxage,
                ratingNo,
              ],
              function (err, results, fields) {
                if (err) throw err;
                console.log("results");
                console.log(results);
                //render home with results
                res.render("home", {
                  userData: results,
                  user: req.session.user,
                });
              }
            );
          }
        });
      }
    });
  }
});

router.get("/ageDesc", (req, res) => {
  if (
    !req.session.gender &&
    !req.session.maxage &&
    !req.session.minage &&
    !req.session.rating
  ) {
    //for home page
    con.query(
      "SELECT * FROM `user_profile` WHERE username = ?",
      [req.session.user],
      function (err, usersInfo, fields) {
        if (err) throw err;
        ageAbove = usersInfo[0].age + 5;
        ageBelow = usersInfo[0].age - 5;
        if (usersInfo[0].pref_gender == "bisexual") {
          con.query(
            "SELECT * FROM `user_filter` WHERE `username` != ? AND `age` BETWEEN ? AND ? AND `username` IN (SELECT `username` FROM `interests` WHERE `interests` IN (SELECT `interests` FROM `interests` WHERE `username` = ?)) ORDER BY `age` DESC",
            [req.session.user, ageBelow, ageAbove, req.session.user],
            function (err, users, fields) {
              if (err) throw err;
              res.render("home", { userData: users, user: req.session.user });
            }
          );
        } else {
          con.query(
            "SELECT * FROM `user_filter` WHERE `username` != ? AND `gender` = ? AND `age` BETWEEN ? AND ? AND `username` IN (SELECT `username` FROM `interests` WHERE `interests` IN (SELECT `interests` FROM `interests` WHERE `username` = ?)) ORDER BY `age` DESC",
            [
              req.session.user,
              usersInfo[0].pref_gender,
              ageBelow,
              ageAbove,
              req.session.user,
            ],
            function (err, users, fields) {
              if (err) throw err;
              res.render("home", { userData: users, user: req.session.user });
            }
          );
        }
      }
    );
  } else {
    // for filter page
    con.query("SELECT COUNT (*) AS count FROM user", function (
      err,
      user_count
    ) {
      if (err) throw err;
      if (!req.session.rating) {
        con.query("SELECT count(*) as total FROM filter_tags", function (
          err,
          results,
          fields
        ) {
          if (err) throw err;
          if (results[0].total == 0) {
            con.query(
              "SELECT * FROM `user_filter` WHERE `username` != ? AND `gender` = ? AND `age` BETWEEN ? AND ? ORDER BY `age` DESC ",
              [
                req.session.user,
                req.session.gender,
                req.session.minage,
                req.session.maxage,
              ],
              function (err, usesNoTags, field) {
                res.render("home", {
                  userData: usesNoTags,
                  user: req.session.user,
                });
              }
            );
          } else {
            con.query(
              "SELECT * FROM `user_filter` WHERE `username` != ? AND `gender` = ? AND `age` BETWEEN ? AND ? AND `username` IN (SELECT `username` FROM `interests` WHERE `interests` IN (SELECT `interests` FROM `filter_tags`)) ORDER BY `age` DESC ",
              [
                req.session.user,
                req.session.gender,
                req.session.minage,
                req.session.maxage,
              ],
              function (err, results, fields) {
                if (err) throw err;
                res.render("home", {
                  userData: results,
                  user: req.session.user,
                });
              }
            );
          }
        });
      } else {
        var ratingNo = Math.round(
          req.session.rating * 0.2 * user_count[0].count
        );
        con.query("SELECT count(*) as total FROM filter_tags", function (
          err,
          results,
          fields
        ) {
          if (err) throw err;
          if (results[0].total == 0) {
            con.query(
              "SELECT * FROM `user_filter` WHERE `username` != ? AND `gender` = ? AND `age` BETWEEN ? AND ? AND `likes` >= ? ORDER BY `age` DESC ",
              [
                req.session.user,
                req.session.gender,
                req.session.minage,
                req.session.maxage,
                ratingNo,
              ],
              function (err, usesNoTags, field) {
                res.render("home", {
                  userData: usesNoTags,
                  user: req.session.user,
                });
              }
            );
          } else {
            con.query(
              "SELECT * FROM `user_filter` WHERE `username` != ? AND `gender` = ? AND `age` BETWEEN ? AND ? AND `likes` >= ? AND `username` IN (SELECT `username` FROM `interests` WHERE `interests` IN (SELECT `interests` FROM `filter_tags`)) ORDER BY `age` DESC ",
              [
                req.session.user,
                req.session.gender,
                req.session.minage,
                req.session.maxage,
                ratingNo,
              ],
              function (err, results, fields) {
                if (err) throw err;
                console.log("results");
                console.log(results);
                //render home with results
                res.render("home", {
                  userData: results,
                  user: req.session.user,
                });
              }
            );
          }
        });
      }
    });
  }
});

router.get("/popularity", (req, res) => {
  if (
    !req.session.gender &&
    !req.session.maxage &&
    !req.session.minage &&
    !req.session.rating
  ) {
    //for home page
    con.query(
      "SELECT * FROM `user_profile` WHERE username = ?",
      [req.session.user],
      function (err, usersInfo, fields) {
        if (err) throw err;
        ageAbove = usersInfo[0].age + 5;
        ageBelow = usersInfo[0].age - 5;
        if (usersInfo[0].pref_gender == "bisexual") {
          con.query(
            "SELECT * FROM `user_filter` WHERE `username` != ? AND `age` BETWEEN ? AND ? AND `username` IN (SELECT `username` FROM `interests` WHERE `interests` IN (SELECT `interests` FROM `interests` WHERE `username` = ?)) ORDER BY `likes` ASC",
            [req.session.user, ageBelow, ageAbove, req.session.user],
            function (err, users, fields) {
              if (err) throw err;
              res.render("home", { userData: users, user: req.session.user });
            }
          );
        } else {
          con.query(
            "SELECT * FROM `user_filter` WHERE `username` != ? AND `gender` = ? AND `age` BETWEEN ? AND ? AND `username` IN (SELECT `username` FROM `interests` WHERE `interests` IN (SELECT `interests` FROM `interests` WHERE `username` = ?)) ORDER BY `likes` ASC",
            [
              req.session.user,
              usersInfo[0].pref_gender,
              ageBelow,
              ageAbove,
              req.session.user,
            ],
            function (err, users, fields) {
              if (err) throw err;
              console.log("in home sort");
              //console.log(users)
              res.render("home", { userData: users, user: req.session.user });
            }
          );
        }
      }
    );
  } else {
    // for filter page
    con.query("SELECT COUNT (*) AS count FROM user", function (
      err,
      user_count
    ) {
      if (err) throw err;
      if (!req.session.rating) {
        con.query("SELECT count(*) as total FROM filter_tags", function (
          err,
          results,
          fields
        ) {
          if (err) throw err;
          if (results[0].total == 0) {
            con.query(
              "SELECT * FROM `user_filter` WHERE `username` != ? AND `gender` = ? AND `age` BETWEEN ? AND ? ORDER BY `likes` ASC ",
              [
                req.session.user,
                req.session.gender,
                req.session.minage,
                req.session.maxage,
              ],
              function (err, usesNoTags, field) {
                res.render("home", {
                  userData: usesNoTags,
                  user: req.session.user,
                });
              }
            );
          } else {
            con.query(
              "SELECT * FROM `user_filter` WHERE `username` != ? AND `gender` = ? AND `age` BETWEEN ? AND ? AND `username` IN (SELECT `username` FROM `interests` WHERE `interests` IN (SELECT `interests` FROM `filter_tags`)) ORDER BY `likes` ASC ",
              [
                req.session.user,
                req.session.gender,
                req.session.minage,
                req.session.maxage,
              ],
              function (err, results, fields) {
                if (err) throw err;
                res.render("home", {
                  userData: results,
                  user: req.session.user,
                });
              }
            );
          }
        });
      } else {
        var ratingNo = Math.round(
          req.session.rating * 0.2 * user_count[0].count
        );
        con.query("SELECT count(*) as total FROM filter_tags", function (
          err,
          results,
          fields
        ) {
          if (err) throw err;
          if (results[0].total == 0) {
            con.query(
              "SELECT * FROM `user_filter` WHERE `username` != ? AND `gender` = ? AND `age` BETWEEN ? AND ? AND `likes` >= ? ORDER BY `likes` ASC ",
              [
                req.session.user,
                req.session.gender,
                req.session.minage,
                req.session.maxage,
                ratingNo,
              ],
              function (err, usesNoTags, field) {
                res.render("home", {
                  userData: usesNoTags,
                  user: req.session.user,
                });
              }
            );
          } else {
            con.query(
              "SELECT * FROM `user_filter` WHERE `username` != ? AND `gender` = ? AND `age` BETWEEN ? AND ? AND `likes` >= ? AND `username` IN (SELECT `username` FROM `interests` WHERE `interests` IN (SELECT `interests` FROM `filter_tags`)) ORDER BY `likes` ASC ",
              [
                req.session.user,
                req.session.gender,
                req.session.minage,
                req.session.maxage,
                ratingNo,
              ],
              function (err, results, fields) {
                if (err) throw err;
                console.log("results");
                console.log(results);
                //render home with results
                res.render("home", {
                  userData: results,
                  user: req.session.user,
                });
              }
            );
          }
        });
      }
    });
  }
});

router.get("/popularityDesc", (req, res) => {
  if (
    !req.session.gender &&
    !req.session.maxage &&
    !req.session.minage &&
    !req.session.rating
  ) {
    //for home page
    con.query(
      "SELECT * FROM `user_profile` WHERE username = ?",
      [req.session.user],
      function (err, usersInfo, fields) {
        if (err) throw err;
        ageAbove = usersInfo[0].age + 5;
        ageBelow = usersInfo[0].age - 5;
        if (usersInfo[0].pref_gender == "bisexual") {
          con.query(
            "SELECT * FROM `user_filter` WHERE `username` != ? AND `age` BETWEEN ? AND ? AND `username` IN (SELECT `username` FROM `interests` WHERE `interests` IN (SELECT `interests` FROM `interests` WHERE `username` = ?)) ORDER BY `likes` DESC",
            [req.session.user, ageBelow, ageAbove, req.session.user],
            function (err, users, fields) {
              if (err) throw err;
              res.render("home", { userData: users, user: req.session.user });
            }
          );
        } else {
          con.query(
            "SELECT * FROM `user_filter` WHERE `username` != ? AND `gender` = ? AND `age` BETWEEN ? AND ? AND `username` IN (SELECT `username` FROM `interests` WHERE `interests` IN (SELECT `interests` FROM `interests` WHERE `username` = ?)) ORDER BY `likes` DESC",
            [
              req.session.user,
              usersInfo[0].pref_gender,
              ageBelow,
              ageAbove,
              req.session.user,
            ],
            function (err, users, fields) {
              if (err) throw err;
              console.log("in home sort");
              //console.log(users)
              res.render("home", { userData: users, user: req.session.user });
            }
          );
        }
      }
    );
  } else {
    // for filter page
    con.query("SELECT COUNT (*) AS count FROM user", function (
      err,
      user_count
    ) {
      if (err) throw err;
      if (!req.session.rating) {
        con.query("SELECT count(*) as total FROM filter_tags", function (
          err,
          results,
          fields
        ) {
          if (err) throw err;
          if (results[0].total == 0) {
            con.query(
              "SELECT * FROM `user_filter` WHERE `username` != ? AND `gender` = ? AND `age` BETWEEN ? AND ? ORDER BY `likes` DESC ",
              [
                req.session.user,
                req.session.gender,
                req.session.minage,
                req.session.maxage,
              ],
              function (err, usesNoTags, field) {
                res.render("home", {
                  userData: usesNoTags,
                  user: req.session.user,
                });
              }
            );
          } else {
            con.query(
              "SELECT * FROM `user_filter` WHERE `username` != ? AND `gender` = ? AND `age` BETWEEN ? AND ? AND `username` IN (SELECT `username` FROM `interests` WHERE `interests` IN (SELECT `interests` FROM `filter_tags`)) ORDER BY `likes` DESC ",
              [
                req.session.user,
                req.session.gender,
                req.session.minage,
                req.session.maxage,
              ],
              function (err, results, fields) {
                if (err) throw err;
                res.render("home", {
                  userData: results,
                  user: req.session.user,
                });
              }
            );
          }
        });
      } else {
        var ratingNo = Math.round(
          req.session.rating * 0.2 * user_count[0].count
        );
        con.query("SELECT count(*) as total FROM filter_tags", function (
          err,
          results,
          fields
        ) {
          if (err) throw err;
          if (results[0].total == 0) {
            con.query(
              "SELECT * FROM `user_filter` WHERE `username` != ? AND `gender` = ? AND `age` BETWEEN ? AND ? AND `likes` >= ? ORDER BY `likes` DESC ",
              [
                req.session.user,
                req.session.gender,
                req.session.minage,
                req.session.maxage,
                ratingNo,
              ],
              function (err, usesNoTags, field) {
                res.render("home", {
                  userData: usesNoTags,
                  user: req.session.user,
                });
              }
            );
          } else {
            con.query(
              "SELECT * FROM `user_filter` WHERE `username` != ? AND `gender` = ? AND `age` BETWEEN ? AND ? AND `likes` >= ? AND `username` IN (SELECT `username` FROM `interests` WHERE `interests` IN (SELECT `interests` FROM `filter_tags`)) ORDER BY `likes` DESC ",
              [
                req.session.user,
                req.session.gender,
                req.session.minage,
                req.session.maxage,
                ratingNo,
              ],
              function (err, results, fields) {
                if (err) throw err;
                console.log("results");
                console.log(results);
                //render home with results
                res.render("home", {
                  userData: results,
                  user: req.session.user,
                });
              }
            );
          }
        });
      }
    });
  }
});

router.get("/location", (req, res) => {
  console.log(req.session.gender);
  //res.render("filter", {username: req.session.user, tag: null});
});

router.get("/locationDesc", (req, res) => {
  console.log(req.session.gender);
  //res.render("filter", {username: req.session.user, tag: null});
});

module.exports = router;
