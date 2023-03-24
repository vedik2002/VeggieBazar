const express = require('express')
const User = require('../DB/user')
const jwt = require('jsonwebtoken')
const auth = require('../middleware/auth')
const dotenv = require('dotenv')
dotenv.config();

const router = new express.Router()

////// Create user .//////////////


router.post('/user', async (req, res) => {

    const user = new User(req.body)
    console.log(user)
    try {

        const token = user.generateToken()

        res.status(200).send({ user, token })
    } catch (e) {
        res.status(400).send(e)
    }
})

//// Login User ///////////

router.post('/user/login', async (req, res) => {
    try {

        const user = await User.findCredentials(req.body.name, req.body.password)

        const token = await user.generateToken()

        res.send({ user, token })
    } catch (e) {
        res.status(400).send('cant login')
    }
})

module.exports = router


