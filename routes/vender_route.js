const express = require('express')
const Ven = require('../DB/vendor')
const jwt = require('jsonwebtoken')
//const auth = require('../middleware/auth')
require('dotenv').config()

const router = new express.Router()

////// Create user .//////////////


router.post('/vendor', async (req, res) => {

    const user = new Ven(req.body)
    try {

        const token = await user.generateToken()
        res.cookie('token', token, { httpOnly: true });
        res.status(201).send(user);
    } catch (e) {
        res.status(400).send(e)
    }
})

//// Login User ///////////

router.post('/vendor/login', async (req, res) => {
    try {
        console.log(req.body.name)
        console.log(req.body.password)
        const user = await Ven.findCredentials(req.body.name, req.body.password)
        const token = await user.generateToken()
        res.cookie('token', token, { httpOnly: true });
        res.status(201).send(user);
    } catch (e) {
        res.status(400).send('cant login')
    }
})


//make a route to add things in inventory

router.post('/vendor/inven', async (req, res) => {
    try {


        const items = req.body;
      
        const token = req.cookies.token;
        const itemNames = items.itemNames
        const itemQuantities = items.itemQuantities 
        const itemprice = items.itemprice
    

        if (!token) {
            return res.status(401).send('Please Login');
        }

        const decoded = jwt.verify(token, process.env.JW_KEY_VALUE);
        const user = await Ven.findOne({ _id: decoded._id, 'tokens.token': token });

        if (!user) {
            return res.status(401).send('Error');
        }

        user.inventory.item = [...user.inventory.item, ...itemNames];
        user.inventory.quantity = [...user.inventory.quantity, ...itemQuantities];
        user.inventory.price = [...user.inventory.price, ...itemprice];
        
        await user.save()

        res.status(201).send(user)

    } catch (e) {
        res.status(500).send()
    }
})

////// Logout User ////////

router.post('/vendor/logout', async (req, res) => {
    try {


        const token = req.cookies.token;

        if (!token) {
            return res.status(401).send('Error');
        }

        const decoded = jwt.verify(token, process.env.JW_KEY_VALUE);
        const user = await Ven.findOne({ _id: decoded._id, 'tokens.token': token });

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


