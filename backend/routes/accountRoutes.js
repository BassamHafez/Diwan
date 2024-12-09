const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");
const accountController = require("../controllers/accountController");
const accountValidator = require("../utils/validators/accountValidator");

router.get(
  "/",
  authController.protect,
  authController.restrictTo("admin"),
  accountController.getAllAccounts
);

router.get(
  "/my-account",
  authController.protect,
  accountController.getMyAccount
);

router.post(
  "/:id/subscribe",
  authController.protect,
  accountValidator.subscribeValidator,
  accountController.subscribe
);

module.exports = router;
