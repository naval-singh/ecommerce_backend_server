const express = require("express");
const upload = require('../middleware/multer');
const { requireSignin, adminCheck } = require("../middleware");
const { addCategory, displayCategory, updateCategories, deleteCategories } = require("../controllers/category");
const router = express.Router();

router.get("/display", displayCategory);
router.post("/add", requireSignin, adminCheck, upload.single('categoryPicture'), addCategory);
router.post("/update", requireSignin, adminCheck, upload.array('categoryPicture'), updateCategories);
router.post("/delete", requireSignin, adminCheck, deleteCategories);

module.exports = router;
