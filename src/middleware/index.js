const jwt = require("jsonwebtoken");

exports.requireSignin = (req, res, next) => {
    if (req.headers.authorization) {
        const token = req.headers.authorization.split(" ")[1];
        const user = jwt.verify(token, process.env.JWT_SECRET);
        req.user = user;
    } else {
        return res.status(200).json({ status: false, message: "Authorization required" });
    }
    next();
};

exports.adminCheck = (req, res, next) => {
    if (req.user.role !== "admin") {
        return res.status(200).json({ status: false, message: "Admin access denied" });
    }
    next();
};

exports.userCheck = (req, res, next) => {
    if (req.user.role !== "user") {
        return res.status(200).json({ status: false, message: "User access denied" });
    }
    next();
};