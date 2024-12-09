const Revenue = require("../models/revenueModel");
const factory = require("./handlerFactory");
const catchAsync = require("../utils/catchAsync");
const ApiError = require("../utils/ApiError");

const revenuePopOptions = [
  {
    path: "tenant",
    select: "name phone phone2",
  },
];

exports.getAllRevenues = catchAsync(async (req, res, next) => {
  const { estateId } = req.params;

  const revenues = await Revenue.find({ estate: estateId })
    .populate(revenuePopOptions)
    .sort("dueDate")
    .lean();

  res.status(200).json({
    status: "success",
    results: revenues.length,
    data: revenues,
  });
});

exports.createRevenue = catchAsync(async (req, res, next) => {
  const { estateId } = req.params;

  const revenue = await Revenue.create({
    ...req.body,
    estate: estateId,
    account: req.user.account,
  });

  res.status(201).json({
    status: "success",
    data: revenue,
  });
});

exports.cancelRevenue = catchAsync(async (req, res, next) => {
  const updatedRevenue = await Revenue.findOneAndUpdate(
    { _id: req.params.id, account: req.user.account },
    { status: "canceled", paidAt: null, paymentMethod: null },
    { new: true }
  );

  if (!updatedRevenue) {
    return next(new ApiError("No revenue found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: updatedRevenue,
  });
});

exports.payRevenue = catchAsync(async (req, res, next) => {
  const { paymentMethod, paidAt } = req.body;

  const updatedRevenue = await Revenue.findOneAndUpdate(
    { _id: req.params.id, account: req.user.account },
    { status: "paid", paidAt, paymentMethod },
    { new: true }
  );

  if (!updatedRevenue) {
    return next(new ApiError("No revenue found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: updatedRevenue,
  });
});

exports.unpayRevenue = catchAsync(async (req, res, next) => {
  const updatedRevenue = await Revenue.findOneAndUpdate(
    { _id: req.params.id, account: req.user.account },
    { status: "pending", paidAt: null, paymentMethod: null },
    { new: true }
  );

  if (!updatedRevenue) {
    return next(new ApiError("No revenue found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: updatedRevenue,
  });
});

exports.deleteRevenue = factory.deleteOne(Revenue);
