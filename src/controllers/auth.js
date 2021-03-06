const jwt = require("jsonwebtoken");
const User = require("../models/user");

exports.signup = (req, res) => {
    const { firstName, lastName, email, password } = req.body;
    const _user = new User({
        firstName,
        lastName,
        email,
        password,
    });
    User.findOne({ email }).exec((error, user) => {
        if (error) {
            return res.status(200).json({ status: false, message: "Something went wrong..", error });
        } else if (user) {
            return res.status(200).json({ status: false, message: "Email already registerd.." });
        } else {
            _user.save((error, result) => {
                if (error) {
                    return res.status(200).json({ status: false, message: "Something went wrong..", error });
                } else {
                    return res.status(200).json({ status: true, message: "User created successfully..", result });
                }
            });
        }
    });
};

exports.signin = (req, res) => {
    const { email, password } = req.body;
    User.findOne({ email }).exec((error, user) => {
        if (error) {
            return res.status(200).json({status: false, message: "Something went wrong..", error });
        } else if (user) {
            const { _id, firstName, lastName, role, email, fullName } = user;
            if (user.authenticate(password) && role === "user") {
                const token = jwt.sign({ _id, role }, process.env.JWT_SECRET, { expiresIn: "10h" });
                return res.status(200).json({
                    status: true,
                    token,
                    user: {
                        _id,
                        firstName,
                        lastName,
                        role,
                        email,
                        fullName,
                    },
                });
            } else {
                return res.status(200).json({status: false, message: "Invalid password" });
            }
        } else {
            return res.status(200).json({status: false, message: "Email not found.." });
        }
    });
};
