const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");
const authValidator = require("../utils/validators/authValidator");

router.post("/signup", authValidator.signupValidator, authController.signup);
router.post("/login", authValidator.loginValidator, authController.login);

module.exports = router;
