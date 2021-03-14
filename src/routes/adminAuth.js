const express = require("express");
const { adminSignup, adminSignin, adminSignout } = require("../controllers/adminAuth");
const { requireSignin } = require("../middleware");
const { validateSignupRequest, validateSigninRequest, isRequestValidated } = require("../validators/auth");
const router = express.Router();

router.post("/signup", validateSignupRequest, isRequestValidated, adminSignup);
router.post("/signin", validateSigninRequest, isRequestValidated, adminSignin);
router.post("/signout", requireSignin, adminSignout);

module.exports = router;
