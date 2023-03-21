const mongoose = require('mongoose')
const validator = require('validator')
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs')
dotenv.config();


const vendor = new mongoose.Schema({
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
    type:{
      type: String,
      default: null,
      required: true  
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

vendor.method.generateToken = async function () {
    const user = this
    const token = jwt.sign({ _id: user._id.toString() }, process.env.JW_KEY_VALUE)
    user.token = user.token.concat({ token })
    await user.save()
    return token
}

/// Checking the database ///// 

vendor.statics.findCredentials = async (name, password) => {
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

vendor.pre('save', async function (next) {
    const user = this

    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }

    next()
})

const ven = mongoose.model('ven', vendor)

module.exports = ven
