const Expense = require("../models/expenseModel");
const Estate = require("../models/estateModel");
const Compound = require("../models/compoundModel");
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
exports.updateExpense = factory.updateOne(Expense);
exports.deleteExpense = factory.deleteOne(Expense);

exports.createExpense = catchAsync(async (req, res, next) => {
  const { estate, compound } = req.body;

  if (estate && !compound) {
    const estateData = await Estate.findById(estate)
      .select("compound landlord")
      .lean();

    req.body.compound = estateData.compound;
    req.body.landlord = estateData.landlord;

    if (!req.body.landlord) {
      const compoundData = await Compound.findById(estateData.compound)
        .select("landlord")
        .lean();

      req.body.landlord = compoundData.landlord;
    }
  } else if (compound && !estate) {
    const compoundData = await Compound.findById(compound)
      .select("landlord")
      .lean();

    req.body.landlord = compoundData.landlord;
  }

  await Expense.create(req.body);

  res.status(201).json({
    status: "success",
    message: "Expense created successfully",
  });
});

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
