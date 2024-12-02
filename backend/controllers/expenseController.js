const Expense = require("../models/expenseModel");
const factory = require("./handlerFactory");
const catchAsync = require("../utils/catchAsync");
const ApiError = require("../utils/ApiError");

const expensePopOptions = [
  {
    path: "estate",
    select: "name",
  },
  {
    path: "compound",
    select: "name",
  },
];

exports.getAllExpenses = factory.getAll(Expense, expensePopOptions);
exports.getExpense = factory.getOne(Expense, expensePopOptions);
exports.createExpense = factory.createOne(Expense);
exports.updateExpense = factory.updateOne(Expense);
exports.deleteExpense = factory.deleteOne(Expense);

exports.payExpense = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { paidAt, paymentMethod } = req.body;

  const updatedExpense = await Expense.findOneAndUpdate(
    { _id: id, status: { $ne: "cancelled" } },
    { status: "paid", paidAt, paymentMethod },
    { new: true }
  );

  if (!updatedExpense) {
    return next(
      new ApiError("No un cancelled expense found with that ID", 404)
    );
  }

  res.status(200).json({
    status: "success",
    data: updatedExpense,
  });
});

exports.cancelExpense = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const updatedExpense = await Expense.findOneAndUpdate(
    { _id: id, status: { $ne: "paid" } },
    { status: "cancelled" },
    { new: true }
  );

  if (!updatedExpense) {
    return next(new ApiError("No unpaid expense found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: updatedExpense,
  });
});

exports.unpayExpense = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const updatedExpense = await Expense.findByIdAndUpdate(
    id,
    { status: "pending", paidAt: null, paymentMethod: null },
    { new: true }
  );

  if (!updatedExpense) {
    return next(new ApiError("No expense found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: updatedExpense,
  });
});
