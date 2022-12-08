const express = require("express");
const userModule = require("../Modules/userModule");
const AuthModule = require("../Modules/AuthModule")

const router = express.Router();

//routes for different requests redirecting to modules of user
router.post("/signup", userModule.signup);
router.post("/login", userModule.login);
router.post("/reset-password",userModule.resetPassword);
router.post('/check-otp',userModule.otpCheck);
router.post('/search-account',userModule.search);
module.exports = router;
