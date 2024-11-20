const { check, validationResult } = require('express-validator');

exports.userSignupValidator = [
    check('name', 'Name is required').notEmpty(),
    check('email', 'Email must be between 3 to 32 characters')
        .isEmail()
        .withMessage('Invalid email format')
        .isLength({ min: 4, max: 32 }),
    check('password', 'Password is required').notEmpty(),
    check('password')
        .isLength({ min: 6 })
        .withMessage('Password must contain at least 6 characters')
        .matches(/\d/)
        .withMessage('Password must contain a number'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ error: errors.array()[0].msg });
        }
        next();
    }
];
