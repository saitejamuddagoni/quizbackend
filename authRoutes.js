const express = require("express");

const Login = require("../controllers/authorisation/loginController");
const SignUp = require("../controllers/authorisation/signUpController");
const Forgot = require("../controllers/authorisation/signUpController");

const router = express.Router();

router.post("/login", Login);
router.post("/signup", SignUp);
router.post("/forgotpassword", Forgot);

module.exports = router;
