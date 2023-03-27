const express = require('express')
const User = require('../DB/user')
const jwt = require('jsonwebtoken')
//const auth = require('../middleware/auth')
require('dotenv').config()

const router = new express.Router()

////// Create user .//////////////


router.post('/user', async (req, res) => {

    const user = new User(req.body)
    try {

        const token = await user.generateToken()
        res.cookie('token', token, { httpOnly: true });
        res.status(201).send(user);
    } catch (e) {
        res.status(400).send(e)
    }
})

//// Login User ///////////

router.post('/user/login', async (req, res) => {
    try {  
    const user = await User.findCredentials(req.body.name, req.body.password)
    const token = await user.generateToken()
    res.cookie('token', token, { httpOnly: true });
    res.status(201).send(user);
    } catch (e) {
        res.status(400).send('cant login')
    }
})

router.post('/user/location',auth,async(req,res)=>
{
    const is
    const{lat,long} = 
})

////// Logout User ////////

router.post('/user/logout', async (req, res) => {
    try {
  
      console.log('HERE')
      console.log(req.cookies)
      const token = req.cookies.token;
      console.log(token)
      if (!token) {
        return res.status(401).send('Error');
      }
  
      const decoded = jwt.verify(token, process.env.JW_KEY_VALUE);
      const user = await User.findOne({ _id: decoded._id, 'tokens.token': token });
  
      if (!user) {
        return res.status(401).send('Error');
      }
  
      user.tokens = user.tokens.filter((t) => t.token !== token);
      await user.save();
  
      res.clearCookie('token');
      res.send('Logged out successfully');
    } catch (e) {
      res.status(500).send();
    }
  });

module.exports = router


