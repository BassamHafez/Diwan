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
    authController.checkPermission("ADD_REVENUE"),
    revenueValidator.createRevenueValidator,
    revenueController.createRevenue
  );

// /api/v1/estates/:estateId/revenues/:id
router
  .route("/:id")
  .patch(
    authController.checkPermission("UPDATE_REVENUE"),
    revenueValidator.getRevenueValidator,
    revenueController.cancelRevenue
  )
  .delete(
    authController.checkPermission("DELETE_REVENUE"),
    revenueValidator.getRevenueValidator,
    revenueController.deleteRevenue
  );

router.patch(
  "/:id/pay",
  authController.checkPermission("PAY_REVENUE"),
  revenueValidator.payRevenueValidator,
  revenueController.payRevenue
);

router.patch(
  "/:id/unpay",
  authController.checkPermission("UNPAY_REVENUE"),
  revenueValidator.getRevenueValidator,
  revenueController.unpayRevenue
);

module.exports = router;
