const express = require("express");
const { createPage, getPageById, getAllPages } = require("../controllers/page");
const { requireSignin, adminCheck } = require('../middleware');
const upload = require("../middleware/multer");
const router = express.Router();

router.get('/display', getAllPages);
router.get('/display/:category/:type', getPageById);
router.post("/create", requireSignin, adminCheck, upload.fields([{ name: "banners" }, { name: "products" }]), createPage);

module.exports = router;
