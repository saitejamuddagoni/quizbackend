
const express = require("express");
const router = express.Router();
const  getCoins  = require("../controllers/payments/getCoins");

router.post('/getcoins',getCoins)


module.exports = router;