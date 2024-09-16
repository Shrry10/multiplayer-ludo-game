const express = require("express");
const router = express.Router();
const controller = require("../controller/authController");

router.post("/login", controller.send);
router.post("/verify-login-otp", controller.verify);
router.post("/signup", controller.signupSend);
router.post("/verify-signup-otp", controller.signupVerify);

module.exports = router;
