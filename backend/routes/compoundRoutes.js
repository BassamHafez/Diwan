const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");
const compoundController = require("../controllers/compoundController");
const compoundValidator = require("../utils/validators/compoundValidator");
const { filterAccountResults, setAccountId } = require("../utils/requestUtils");

router.use(authController.protect);

router
  .route("/")
  .get(filterAccountResults, compoundController.getAllCompounds)
  .post(
    compoundController.uploadCompoundImage,
    compoundController.resizeCompoundImage,
    compoundValidator.createCompoundValidator,
    authController.checkPermission("ADD_COMPOUND"),
    setAccountId,
    compoundController.createCompound
  );

router
  .route("/:id")
  .get(compoundValidator.getCompoundValidator, compoundController.getCompound)
  .patch(
    compoundController.uploadCompoundImage,
    compoundController.resizeCompoundImage,
    compoundValidator.updateCompoundValidator,
    filterAccountResults,
    authController.checkPermission("UPDATE_COMPOUND"),
    compoundController.updateCompound
  )
  .delete(
    compoundValidator.getCompoundValidator,
    authController.checkPermission("DELETE_COMPOUND"),
    compoundController.deleteCompound
  );

router.get(
  "/:id/current-contracts",
  compoundValidator.getCompoundValidator,
  compoundController.getCurrentContracts
);

// Compound expenses

router
  .route("/:id/expenses")
  .get(
    compoundValidator.getCompoundValidator,
    compoundController.getCompoundExpenses
  )
  .post(
    compoundValidator.createCompoundExpenseValidator,
    authController.checkPermission("ADD_EXPENSE"),
    setAccountId,
    compoundController.createCompoundExpense
  );

module.exports = router;
