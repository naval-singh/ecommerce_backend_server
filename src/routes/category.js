const express = require("express");
const { addCategory } = require("../controllers/category");
const router = express.Router();

router.post("/add", addCategory);

module.exports = router;
