'use strict'

const express = require("express")
const router = express.Router()
const userProfileModel = require('../model/user_profile')

router.get('/', (req, res) => {
    console.log(req.session)

    res.render('user_profile')
})

router.post('/', (req, res) => {
    const body = {
        user: req.session.user,
        lat: req.body.lat,
        lng: req.body.lng
    }

    if(!body.lat || !body.lng)
        res.json('Missing input(s)')
    else
        userProfileModel.updateUserProfile(body).then((result) => {
            res.json(result)
        })
})

module.exports = router