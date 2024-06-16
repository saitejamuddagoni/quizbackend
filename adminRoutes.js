const express = require("express");
const adminDash = require("../controllers/admin/adminDash");
const router = express.Router();

router.get('/admindash',adminDash)
module.exports = router