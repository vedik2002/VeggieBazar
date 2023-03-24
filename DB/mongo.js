const mongoose = require('mongoose')
const dotenv = require('dotenv')
const env = require('../env')
dotenv.config()


mongoose.set("strictQuery",false);
mongoose.connect('mongodb://127.0.0.1:27017/veggies',{ useNewUrlParser: true, useUnifiedTopology: true });

