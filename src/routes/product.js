const express = require("express");
const upload = require("../middleware/multer");
const { requireSignin, adminCheck } = require("../middleware");
const { addProduct, displayProduct, getProductsBySlug } = require("../controllers/product");
const router = express.Router();

router.get("/display", displayProduct);
router.get('/display/:slug', getProductsBySlug);
router.post("/add", requireSignin, adminCheck, upload.array("productPicture"), addProduct);

module.exports = router;
