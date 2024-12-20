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

router.get("/purchases", accountController.getMyPurchases);

router.patch(
  "/:id",
  authController.checkPermission("UPDATE_ACCOUNT"),
  accountValidator.updateAccountValidator,
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

router.post(
  "/:id/subscribe-package",
  accountValidator.subscribeInPackageValidator,
  accountController.subscribeInPackage
);

module.exports = router;
