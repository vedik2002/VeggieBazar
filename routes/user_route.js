const express = require('express')
const User = require('../DB/user')
const ven = require('../DB/vendor')
const jwt = require('jsonwebtoken')
const  calculateDistance = require('../distance_calculator/distance')
const bodyParser = require('body-parser')
//const auth = require('../middleware/auth')
require('dotenv').config()

const router = new express.Router()

router.use(bodyParser.json())

////// Create user .//////////////

router.get('/',async (req,res) => {
  res.sendFile('index.html', { root: path.join(__dirname, '/public') })
})

router.post('/user', async (req, res) => {
  const data = req.body;
  const user = new User(data)
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


router.post('/user/order', async (req, res) => {

  const token = req.cookies.token;
  console.log(token)
  const order  = req.body;

  if (!token) {
    return res.status(401).send('Error');
  }

  const decoded = jwt.verify(token, process.env.JW_KEY_VALUE);
  
  const user = await User.findOne({ _id: decoded._id, 'tokens.token': token });
  
  const order_name = order.name;
  const quant = order.quantity;

  

  user.orders.order.push(order_name);
  user.orders.quantity.push(quant);
  await user.save()

 
    const vendors = await ven.find({
      "inventory.item": order_name,
      "inventory.quantity": { $gte: quant }
    });

    const vendorsWithDistance = vendors.map(vendor => {
    
      const distance = calculateDistance(user.location.coordinates[1], user.location.coordinates[0], vendor.location.coordinates[1], vendor.location.coordinates[0]);
      console.log(`distance between user and vendor ${vendor.name} is ${distance}`);
      return { ...vendor.toObject(), distance };
    });
  
    // Sort vendors by rating (highest first)
    const vendorsWithDistanceAndRating = vendorsWithDistance.sort((a, b) => b.rating - a.rating);
  
    // Sort vendors by distance (closest first)
    const vendorsSorted = vendorsWithDistanceAndRating.sort((a, b) => a.distance - b.distance);
  
    console.log(vendorsSorted);
  
    // Add a command to delete the order once the request is complete, so no need to maintain status
  
    res.status(201).send(vendorsSorted);

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


