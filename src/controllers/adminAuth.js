const jwt = require("jsonwebtoken");
const User = require("../models/user");

exports.adminSignup = (req, res) => {
    const { firstName, lastName, email, password } = req.body;
    const _user = new User({
        firstName,
        lastName,
        email,
        password,
        role: "admin",
    });
    User.findOne({ email }).exec((error, user) => {
        if (error) {
            return res.status(400).json({ msg: "Something went wrong..", error });
        } else if (user) {
            return res.status(400).json({ msg: "Email already registerd.." });
        } else {
            _user.save((error, result) => {
                if (error) {
                    return res.status(400).json({ msg: "Something went wrong..", error });
                } else {
                    return res.status(201).json({ msg: "Admin created successfully..", result });
                }
            });
        }
    });
};

exports.adminSignin = (req, res) => {
    const { email, password } = req.body;

    User.findOne({ email }).exec((error, user) => {
        if (error) {
            return res.status(400).json({ msg: "Something went wrong..", error });
        } else if (user) {
            const { _id, firstName, lastName, role, email, fullName } = user;
            if (user.authenticate(password) && role === "admin") {
                const token = jwt.sign({ _id }, process.env.JWT_SECRET, { expiresIn: "2h" });
                return res.status(200).json({
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
                return res.status(400).json({ msg: "Invalid password" });
            }
        } else {
            return res.status(400).json({ msg: "Email not found.." });
        }
    });
};
