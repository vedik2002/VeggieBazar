const jwt = require('jsonwebtoken')
const User = require("../DB/user")
const ven = require("../DB/vendor")
const dotenv = require('dotenv');
const env =- require('../env');
dotenv.config();

const auth_user = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer', '')
        const decoded = jwt.verify(token, env.jwt.secret)
        const user = await User.findOne({ _id: decoded._id, 'tokens.token': token })

        if (!user) {
            throw new Error()
        }

        req.token = token
        req.user = user
        next()
    } catch (e) {
        res.status(401).send({ error: 'Please authenticate.' })
    }
}

const auth_ven = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer', '')
        const decoded = jwt.verify(token, env.jwt.secret)
        const vend = await ven.findOne({ _id: decoded._id, 'tokens.token': token })

        if (!vend) {
            throw new Error()
        }

        req.token = token
        req.user = vend
        next()
    } catch (e) {
        res.status(401).send({ error: 'Please authenticate.' })
    }
}

module.exports = auth_user
module.exports = auth_ven