const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");
const expenseController = require("../controllers/expenseController");
const expenseValidator = require("../utils/validators/expenseValidator");
const { setAccountId, filterAccountResults } = require("../utils/requestUtils");

router.use(authController.protect);

router
  .route("/")
  .get(filterAccountResults, expenseController.getAllExpenses)
  .post(
    expenseValidator.createExpenseValidator,
    authController.checkPermission("ADD_EXPENSE"),
    setAccountId,
    expenseController.createExpense
  );

router
  .route("/:id")
  .get(expenseValidator.getExpenseValidator, expenseController.getExpense)
  .patch(
    expenseValidator.updateExpenseValidator,
    authController.checkPermission("UPDATE_EXPENSE"),
    expenseController.updateExpense
  )
  .delete(
    expenseValidator.getExpenseValidator,
    authController.checkPermission("DELETE_EXPENSE"),
    expenseController.deleteExpense
  );

router.patch(
  "/:id/pay",
  expenseValidator.payExpenseValidator,
  authController.checkPermission("PAY_EXPENSE"),
  expenseController.payExpense
);

router.patch(
  "/:id/unpay",
  expenseValidator.getExpenseValidator,
  authController.checkPermission("UNPAY_EXPENSE"),
  expenseController.unpayExpense
);

router.patch(
  "/:id/cancel",
  expenseValidator.getExpenseValidator,
  authController.checkPermission("CANCEL_EXPENSE"),
  expenseController.cancelExpense
);

module.exports = router;
