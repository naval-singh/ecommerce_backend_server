const { check, validationResult } = require("express-validator");

exports.validateSigninRequest = [
    check("email").isEmail().withMessage("valid email is required"), 
    check("password").isLength({ min: 6 }).withMessage("password must be at least 6 characters long")
];

exports.validateSignupRequest = [
    check("firstName").notEmpty().withMessage("first name is required"),
    check("lastName").notEmpty().withMessage("last name is required"),
    check("email").isEmail().withMessage("valid email is required"),
    check("password").isLength({ min: 6 }).withMessage("password must be at least 6 characters long"),
];

exports.isRequestValidated = (req, res, next) => {
    const errors = validationResult(req);
    if (errors.array().length > 0) {
        return res.status(200).json({ message: errors.array()[0].msg });
    }
    next();
};
