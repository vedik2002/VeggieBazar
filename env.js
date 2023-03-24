require('dotenv').config()
const env = process.env

module.export = {
    database:{
        host:env.DB_URL
    },
    jwt:{
        secret: env.JW_KEY_VALUE,
    },
}