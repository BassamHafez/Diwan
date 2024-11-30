const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");
const expenseController = require("../controllers/expenseController");
const expenseValidator = require("../utils/validators/expenseValidator");
const { setUserId, filterUserResults } = require("../utils/requestUtils");

router.use(authController.protect);

router
  .route("/")
  .get(filterUserResults, expenseController.getAllExpenses)
  .post(
    expenseValidator.createExpenseValidator,
    setUserId,
    expenseController.createExpense
  );

router
  .route("/:id")
  .get(expenseValidator.getExpenseValidator, expenseController.getExpense)
  .patch(
    expenseValidator.updateExpenseValidator,
    expenseController.updateExpense
  )
  .delete(
    expenseValidator.getExpenseValidator,
    expenseController.deleteExpense
  );

router.patch(
  "/:id/pay",
  expenseValidator.payExpenseValidator,
  expenseController.payExpense
);

router.patch(
  "/:id/cancel",
  expenseValidator.getExpenseValidator,
  expenseController.cancelExpense
);

module.exports = router;
