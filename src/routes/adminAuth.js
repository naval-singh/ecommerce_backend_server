const express = require("express");
const { adminSignup, adminSignin } = require("../controllers/adminAuth");
const { validateSignupRequest, validateSigninRequest, isRequestValidated } = require("../validators/auth");
const router = express.Router();

router.post("/signup", validateSignupRequest, isRequestValidated, adminSignup);
router.post("/signin", validateSigninRequest, isRequestValidated, adminSignin);

module.exports = router;
