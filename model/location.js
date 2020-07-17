'use strict'

var con = require("../config/connection");

exports.updateLocation = (body) => {
  /**
   * body.user
   * body.lat
   * body.lng
   */

  return new Promise((resolve) => {
      const query = 'UPDATE user_profile SET latitude = ?, longitute = ? WHERE username = ?'
      con.query(query, [body.lat, body.lng, body.user], (err) => {
          if(err) throw err.message
          resolve('User Profile Updated.')
      })
  })
}