const User = require('../models/user');

exports.userById = async (req, res, next, id) => {
    try {
        const user = await User.findById(id).exec();
        if (!user) {
            return res.status(400).json({ error: "User not found" });
        }
        req.profile = user;
        next();
    } catch (err) {
        return res.status(400).json({ error: "User not found" });
    }
};

exports.read = (req, res) => {
    req.profile.hashed_password = undefined;
    req.profile.salt = undefined;
    return res.json(req.profile);
};

exports.update = async (req, res) => {
    console.log('user update', req.body);
    req.body.role = 0; // role will always be 0

    try {
        // Use async/await with findOneAndUpdate
        const user = await User.findOneAndUpdate(
            { _id: req.profile._id },
            { $set: req.body },
            { new: true }
        );

        if (!user) {
            return res.status(400).json({
                error: 'User not found or not authorized to perform this action'
            });
        }

        // Hide sensitive fields
        user.hashed_password = undefined;
        user.salt = undefined;

        res.json(user);
    } catch (err) {
        return res.status(400).json({
            error: 'An error occurred while updating user'
        });
    }
};



