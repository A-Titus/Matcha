'use strict'

const db = require('../config/connection')

exports.updateUserProfile = (body) => {
    /**
     * body.user
     * body.lat
     * body.lng
     */

    return new Promise((resolve) => {
        const query = "UPDATE user_profile SET age = 28, latitude = ?, longitude = ? WHERE username = ?"
        db.query(query, [body.lat, body.lng, body.user], (err) => {
            if(err) throw err.message
            resolve('User Profile Updated.')
        })
    })
}