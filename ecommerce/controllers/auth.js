const User = require("../models/user");
const jwt = require("jsonwebtoken"); 
const {errorHandler} = require("../helpers/dbErrorHandler"); 
// const expressJwt = require("express-jwt");
const expressJwt = require('express-jwt').expressjwt;

// const user = require("../models/user");

exports.signup = async (req, res) => {
    try {
        console.log("req.body", req.body);
        const user = new User(req.body);
        await user.save(); // This no longer uses a callback
        res.json({
            user
        });
    } catch (err) {
        res.status(400).json({
            error: errorHandler(error) // Send a more descriptive error message
        });
        user.salt = undefined;
        user.hashed_password = undefined;
    }
};

exports.signin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        // Find the user by email
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({
                error: 'User with that email does not exist. Please signup'
            });
        }

        // Check if the password matches
        if (!user.authenticate(password)) {
            return res.status(401).json({
                error: 'Email and password don\'t match'
            });
        }

        // Generate a signed JWT token
        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

        // Set the token in a cookie with an expiry date of 1 day
        res.cookie('t', token, { expire: new Date(Date.now() + 9999 * 60 * 60 * 24), httpOnly: true });

        // Return the token and user data
        // Destructure the user object directly without declaring 'email' again
        const { _id, name, role } = user;
        return res.json({ token, user: { _id, name, email: user.email, role } });

    } catch (err) {
        return res.status(500).json({ error: 'Server error, please try again' });
    }
};

exports.signout = (req, res) => {
    res.clearCookie('t');
    res.json({ message: 'Signout success' });
};

exports.requireSignin = expressJwt({
    secret: process.env.JWT_SECRET,
    algorithms: ["HS256"], // added later
    userProperty: "auth", 
});

exports.isAuth = (req, res, next) => {
    let user = req.profile && req.auth && req.profile._id == req.auth._id;
    if (!user) {
        return res.status(403).json({
            error: 'Access denied'
        });
    }
    next();
};

exports.isAdmin = (req, res, next) => {
    if (req.profile.role === 0) {
        return res.status(403).json({
            error: 'Admin resourse! Access denied'
        });
    }
    next();
};
  

