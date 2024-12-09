const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");
const estateController = require("../controllers/estateController");
const estateValidator = require("../utils/validators/estateValidator");
const { setAccountId, filterAccountResults } = require("../utils/requestUtils");

router.use(authController.protect);

// Favorites

router
  .route("/:id/favorites")
  .post(
    estateValidator.getEstateValidator,
    authController.checkPermission("FAVORITES"),
    setAccountId,
    estateController.favoriteEstate
  )
  .delete(
    estateValidator.getEstateValidator,
    authController.checkPermission("FAVORITES"),
    estateController.unfavoriteEstate
  );

router
  .route("/")
  .get(filterAccountResults, estateController.getAllEstates)
  .post(
    estateController.uploadEstateImage,
    estateController.resizeEstateImage,
    estateValidator.createEstateValidator,
    authController.checkPermission("ADD_ESTATE"),
    setAccountId,
    estateController.createEstate
  );

router
  .route("/:id")
  .get(estateValidator.getEstateValidator, estateController.getEstate)
  .patch(
    estateController.uploadEstateImage,
    estateController.resizeEstateImage,
    estateValidator.updateEstateValidator,
    authController.checkPermission("UPDATE_ESTATE"),
    estateController.updateEstate
  )
  .delete(estateValidator.getEstateValidator, estateController.deleteEstate);

// Estate expenses

router
  .route("/:id/expenses")
  .get(estateValidator.getEstateValidator, estateController.getEstateExpenses)
  .post(
    estateValidator.createEstateExpenseValidator,
    authController.checkPermission("ADD_EXPENSE"),
    setAccountId,
    estateController.createEstateExpense
  );

module.exports = router;
