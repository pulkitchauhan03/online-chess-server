const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
// const authController = require('../controllers/auth');

function authRoute(io) {
    router.post('/signup', async (req, res) => {
        try {
            // Hash the user's password
            if(req.body.password.length == 0) return res.status(400).json({ error: "Password cannot be empty" });

            const hash = await bcrypt.hash(req.body.password, 10);

            const userJSON = {
                username: req.body.username,
                password: hash
            }

            if(req.body?.name) userJSON.name = req.body.name;

            // Create a new user document
            const user = new User(userJSON);

            // Save the user to the database
            await user.save()

            // Generate a JWT and return it to the client
            const token = jwt.sign({ username: user.username, id: user._id }, process.env.JWT_KEY, { expiresIn: "10h" });

            io.emit('updateScore', 'Update Score');

            return res.status(201).json({
                message: 'User created!',
                token: token,
                username: user.username
            });

        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

    router.post('/login', async (req, res) => {
        try {
            const user = await User.findOne({ username: req.body.username });
            if (user.length < 1) {
                return res.status(401).json({
                    message: 'Auth failed'
                });
            }

            const result = await bcrypt.compare(req.body.password, user.password)
            if (!result) {
                return res.status(401).json({
                    message: 'Auth failed'
                });
            }

            const token = jwt.sign({ username: user.username, id: user._id }, process.env.JWT_KEY, { expiresIn: "10h" });
            return res.status(200).json({
                message: 'User logged in!',
                token: token,
                username: user.username
            });

        } catch (error) {
            res.status(500).json({ error: "internal server error" });
        }
    });

    return router;
}

module.exports = authRoute;