const express = require("express");
const { addItemToCart } = require("../controllers/cart");
const { requireSignin, userCheck } = require("../middleware");
const router = express.Router();

router.post("/addtocart", requireSignin, userCheck, addItemToCart);

module.exports = router;
