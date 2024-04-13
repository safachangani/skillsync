require('dotenv').config()
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
const  { Signup, PostRequestOffer } = require('../controller/controller');
const saltRounds = 10;
router.post('/user-signup', async (req, res) => {
    console.log('hi');
    console.log(req.body.Name);
    try {
        // Check if the email already exists
        const existingUser = await Signup.findOne({ Email: req.body.Email });
        if (existingUser) {
            // If a user with the same email exists, respond with an error message
            return res.status(400).json({ message: 'Email already exists' });
        }

        // If the email is unique, proceed with user creation
        const salt = await bcrypt.genSalt(saltRounds);
        const hash = await bcrypt.hash(req.body.Password, salt);
        if (!hash) {
            // Handle the case where the hash is empty (typically due to an issue with bcrypt)
            throw new Error('Password hashing failed');
        }

        const signup = new Signup({
            Name: req.body.Name,
            Email: req.body.Email,
            Password: hash
        });

        await signup.save();
        res.status(200).json({ message: 'Account created successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


router.post('/user-login', async (req, res) => {
    // console.log('hauisdoi');
    // console.log('hi', req.body);
    try {
        const Email = req.body.Email;
        const Password = req.body.Password;
        const user = await Signup.findOne({ Email });

        if (user) {
            console.log('hi',user);
            bcrypt.compare(Password, user.Password).then(function (result) {
                if (result) {
                    const accessToken = jwt.sign(user.toJSON(), process.env.SECRET_KEY);
                    res.json({ accessToken: accessToken, message: 'successfully logged in' });
                } else {
                    res.json({ message: 'incorrect password' });
                }
            });
        } else {
            res.json({ message: 'user not found' });
        }
    } catch (err) {
        res.json({ message: err.message });
    }
});

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token === null) return res.sendStatus(401);
    jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
}

router.get('/get-email', authenticateToken, (req, res) => {
    // If the token is successfully verified, the user details should be available in req.user
    const userName = req.user.Name;
    console.log(req.user);
    // You can then use the userEmail to fetch the email from your database or use it directly
    // For demonstration purposes, let's send back the email in the response
    res.json({ Name: userName });
});
router.post('/post-requst-offer',authenticateToken,(req,res)=>{
    console.log(req.user);

      // Create a new instance of the model with validated data
      const postRequestOffer = new PostRequestOffer({
        tab: req.body.tab,
        heading: req.body.heading,
        description: req.body.description,
        userId:req.user._id
    });

    // Save the data to the database
    postRequestOffer.save()
        .then(savedData => {
            // Data saved successfully
            console.log(savedData);
            res.status(200).send('Request successfully saved');
        })
        .catch(err => {
            // Error occurred while saving
            console.error(err);
            res.status(500).send('Internal Server Error');
        });
})

router.get('/get-updates',authenticateToken,async(req,res)=>{
    try {
        // Find all documents in the collection
        const postRequestOffers = await PostRequestOffer.find({ userId: req.user._id }).exec();
        console.log(postRequestOffers);
        // Return the retrieved post request offers
        res.status(200).json(postRequestOffers);
    } catch (error) {
        console.error('Error retrieving post request offers:', error);
        res.status(500).send('Internal Server Error');
    }
})
module.exports = router;
