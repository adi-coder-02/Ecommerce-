const express = require("express");
const router = express.Router();

const { signup, signin, signout, requireSignin } = require('../controllers/auth');
const { userSignupValidator } = require('../validator');

router.post("/signup", userSignupValidator, signup);
router.post("/signin", signin);
router.post("/signout", signout);

router.get('/profile', requireSignin, (req, res) => {
    res.send({
        message: 'User Profile',
        user: req.auth  // Contains user data (like _id, name, etc.)
    });
});

module.exports = router;
