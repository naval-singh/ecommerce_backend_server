const express = require("express");
const { addItemToCart, getCartItems } = require("../controllers/cart");
const { requireSignin, userCheck } = require("../middleware");
const router = express.Router();

router.post("/addtocart", requireSignin, userCheck, addItemToCart);
router.post("/getfromcart", requireSignin, userCheck, getCartItems);

module.exports = router;
