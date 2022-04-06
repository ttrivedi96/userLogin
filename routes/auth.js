const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { body, validationResult } = require('express-validator');
const bcrypt = require("bcryptjs");
var jwt = require('jsonwebtoken');
var fetchuser = require('../middleware/fetchuser');

//JWT SIGNATURE 
const JWT_SECRET = 'thi$I$$ecret$ignature';



// ROUTE 1: Create a User using: POST "/api/auth/register". 
router.post('/register',
    //Code to Validate User using Express-Validator
    [
        body('name', 'Enter Valid Name').isLength({ min: 3 }),
        body('email', 'Enter Valid E-mail').isEmail(),
        body('password', 'Password must be at least 5 character').isLength({ min: 5 }),
    ],
    async (req, res) => {
        let success = false;
        // Finds the validation errors in this request
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            //Check if user email already registered
            let user = await User.findOne({ email: req.body.email });
            if (user) {
                // return req.status(400).json({ success, error: "Sorry User with this Email already exist" });
                return res.status(400).json({ success, error: "Sorry User with this Email already exist" });
            }
            const salt = await bcrypt.genSalt(10);
            const secPwd = await bcrypt.hash(req.body.password, salt);

            //Create a new User
            user = await User.create({
                name: req.body.name,
                email: req.body.email,
                password: secPwd
            })

            const data = {
                user: {
                    id: user.id
                }
            }
            const authToken = jwt.sign(data, JWT_SECRET);

            success = true;
            res.json({ success, authToken });

        } catch (error) {
            console.error(error.message);
            res.status(500).send("Internal Server Error");
        }

    });

// ROUTE 2: Authenticate a User using: POST "/api/auth/login".
router.post('/login',
    //Code to Validate User using Express-Validator
    [
        body('email', 'Enter a valid email').isEmail(),
        body('password', 'Password cannot be blank').exists(),
    ],
    async (req, res) => {
        let success = false;
        // If there are errors, return Bad request and the errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { email, password } = req.body;

        try {
            //Check wheather user exist or not
            let user = await User.findOne({ email });
            if (!user) {
                return res.status(400).json({ success, error: "Try Login with correct credentials" });
            }

            //comparing entered password with stored password
            const passwordCompare = await bcrypt.compare(password, user.password);
            if (!passwordCompare) {
                return res.status(400).json({ success, error: "Try Login with correct credentials" });
            }
            const data = {
                user: {
                    id: user.id
                }
            }
            const authToken = jwt.sign(data, JWT_SECRET);
            success = true;
            res.json({ success, authToken });

        } catch (error) {
            console.error(error.message);
            res.status(500).send("Internal Server Error");
        }
    });

// ROUTE 3: Get logged in user's details using: POST "/api/auth/getuser". login required
router.get('/getuser', fetchuser, async (req, res) => {

    try {
        let userId = req.user.id;
        const user = await User.findById(userId).select("-password")
        res.send(user)
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});



module.exports = router;