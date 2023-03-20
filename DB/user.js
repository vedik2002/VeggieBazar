const mongoose = require('mongoose')
const validator = require('validator')
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs')
dotenv.config();


const account = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid')
            }
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
    googleId: {
        type: String,
        default: null
    },
    googleAccessToken: {
        type: String,
        default: null
    },
    location: {
        type: {
            type: String,
            enum: ['Point'],
            required: true,
            default: null
        },
        coordinates: {
            type: [Number],
            required: true,
            default: null
        }
    }
})

// JWT AUTHENTICATION ////

account.method.generateToken = async function () {
    const user = this
    const token = jwt.sign({ _id: user._id.toString() }, process.env.JW_KEY_VALUE)
    user.token = user.token.concat({ token })
    await user.save()
    return token
}

/// Checking the database ///// 

account.statics.findCredentials = async (name, password) => {
    const user = await User.findOne({ name })

    if (!user) {
        throw new Error('unable to login')
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
        throw new Error('Unable to login')
    }

    return user
}

// Hashing the password

account.pre('save', async function (next) {
    const user = this

    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }

    next()
})


const User = mongoose.model('User', account)

module.exports = User