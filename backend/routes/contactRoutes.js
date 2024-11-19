const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");
const contactController = require("../controllers/contactController");
const { filterUserResults } = require("../utils/requestUtils");

router.use(authController.protect);

router.route("/").get(filterUserResults, contactController.getAllContacts);

module.exports = router;
