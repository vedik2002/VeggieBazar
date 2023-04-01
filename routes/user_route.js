const express = require('express')
const User = require('../DB/user')
const ven = require('../DB/vendor')
const jwt = require('jsonwebtoken')
const dist = require('../distance_calculator/distance')
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

/// placing order ///////


router.post('/user/order',async(req,res)=>
{

    const token = req.cookies.token;
    //const order  = req.body;
    
    if (!token) {
      return res.status(401).send('Error');
    }

    const decoded = jwt.verify(token, process.env.JW_KEY_VALUE);
    const user = await User.findOne({ _id: decoded._id, 'tokens.token': token });

    /*const order_name = order.name;
    const quant = order.quantity;
    
    console.log( user.orders.order )
    console.log(user.orders.quantity)

    user.orders.order = [...user.orders.order, ...order_name];
    user.orders.quantity = [...user.orders.quantity, ...quant];

    await user.save()*/

    const ven = dist(user.location.coordinates,user.orders.order,user.orders.quantity)

    console.log(ven)

    res.status(201).send(ven)

    // add a commond to delete the order once the request is complete in that way no need to maontain status
})






////// Logout User ////////

router.post('/user/logout', async (req, res) => {
    try {
      const token = req.cookies.token;
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


