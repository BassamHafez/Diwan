const express = require("express");
const router = express.Router({ mergeParams: true });

const authController = require("../controllers/authController");
const revenueController = require("../controllers/revenueController");
const revenueValidator = require("../utils/validators/revenueValidator");

router.use(authController.protect);

// /api/v1/estates/:estateId/revenues
router
  .route("/")
  .get(revenueValidator.getRevenuesValidator, revenueController.getAllRevenues)
  .post(
    revenueValidator.createRevenueValidator,
    authController.checkPermission("ADD_REVENUE"),
    revenueController.createRevenue
  );

// /api/v1/estates/:estateId/revenues/:id
router
  .route("/:id")
  .patch(
    revenueValidator.getRevenueValidator,
    authController.checkPermission("UPDATE_REVENUE"),
    revenueController.cancelRevenue
  )
  .delete(
    revenueValidator.getRevenueValidator,
    authController.checkPermission("DELETE_REVENUE"),
    revenueController.deleteRevenue
  );

router.patch(
  "/:id/pay",
  revenueValidator.payRevenueValidator,
  authController.checkPermission("PAY_REVENUE"),
  revenueController.payRevenue
);

router.patch(
  "/:id/unpay",
  revenueValidator.getRevenueValidator,
  authController.checkPermission("UNPAY_REVENUE"),
  revenueController.unpayRevenue
);

module.exports = router;
