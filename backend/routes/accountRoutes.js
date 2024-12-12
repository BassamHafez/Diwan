const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");
const accountController = require("../controllers/accountController");
const accountValidator = require("../utils/validators/accountValidator");

router.use(authController.protect);

router.get(
  "/",
  authController.restrictTo("admin"),
  accountController.getAllAccounts
);

router.get("/my-account", accountController.getMyAccount);

router.patch(
  "/:id",
  accountValidator.updateAccountValidator,
  authController.checkPermission("UPDATE_ACCOUNT"),
  accountController.updateAccount
);

router.post(
  "/:id/members",
  accountValidator.addMemberValidator,
  accountController.addMember
);

router
  .route("/:id/members/:userId")
  .patch(accountValidator.updateMemberValidator, accountController.updateMember)
  .delete(
    accountValidator.deleteMemberValidator,
    accountController.deleteMember
  );

router.post(
  "/:id/subscribe",
  accountValidator.subscribeValidator,
  accountController.subscribe
);

module.exports = router;
