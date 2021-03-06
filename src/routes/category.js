const express = require("express");
const upload = require('../middleware/multer');
const { requireSignin, adminCheck } = require("../middleware");
const { addCategory, displayCategory } = require("../controllers/category");
const router = express.Router();

router.get("/display", displayCategory);
router.post("/add", requireSignin, adminCheck, upload.single('categoryPicture'), addCategory);

module.exports = router;
