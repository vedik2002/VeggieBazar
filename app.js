const express = require('express')
const userRoute = require('./routes/user_route')
require('./DB/mongo')
const app = express()
const dotenv = require('dotenv')
dotenv.config();

const port = 3000;

app.use(express.json())

app.use(userRoute)

app.listen(port,()=>{
    console.log('Server is running on port ' + port)
})