const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");
const statsController = require("../controllers/statsController");

router.use(authController.protect);

router.get("/", statsController.getStats);

module.exports = router;
