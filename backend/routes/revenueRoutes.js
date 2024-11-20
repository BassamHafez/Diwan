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
    revenueController.createRevenue
  );

// /api/v1/estates/:estateId/revenues/:id
router
  .route("/:id")
  .delete(
    revenueValidator.getRevenueValidator,
    revenueController.cancelRevenue
  );

router.patch(
  "/:id/pay",
  revenueValidator.payRevenueValidator,
  revenueController.payRevenue
);

router.patch(
  "/:id/unpay",
  revenueValidator.getRevenueValidator,
  revenueController.unpayRevenue
);

module.exports = router;
