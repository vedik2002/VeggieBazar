const express = require('express')
const userRoute = require('./routes/user_route')
const venderRoute = require('./routes/vender_route')
const app = express()
const cookieParser = require('cookie-parser');

require('./DB/mongo')
require('dotenv').config();

const port = 3000;

app.use(express.json())
app.use(cookieParser());
app.use(userRoute)
app.use(venderRoute)

app.listen(port,()=>{
    console.log('Server is running on port ' + port)
})