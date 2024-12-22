const mongoose = require("mongoose");
const Revenue = require("../models/revenueModel");
const Estate = require("../models/estateModel");
const Compound = require("../models/compoundModel");
const ScheduledTask = require("../models/scheduledTaskModel");
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

  const estate = await Estate.findById(estateId)
    .select("compound landlord")
    .lean();

  if (!estate) {
    return next(new ApiError("No estate found with that ID", 404));
  }

  if (estate.compound) req.body.compound = estate.compound;

  if (estate.landlord) req.body.landlord = estate.landlord;

  if (!req.body.landlord && estate.compound) {
    const compound = await Compound.findById(estate.compound)
      .select("landlord")
      .lean();

    req.body.landlord = compound.landlord;
  }

  const revenueId = new mongoose.Types.ObjectId();

  await Promise.all([
    Revenue.create({
      _id: revenueId,
      ...req.body,
      estate: estateId,
      account: req.user.account,
    }),

    ScheduledTask.create({
      type: "REVENUE_REMINDER",
      scheduledAt: new Date(req.body.dueDate).setHours(8, 0, 0, 0),
      revenue: revenueId,
    }),
  ]);

  res.status(201).json({
    status: "success",
    message: "Revenue created successfully",
  });
});

exports.cancelRevenue = catchAsync(async (req, res, next) => {
  const updatedRevenue = await Revenue.findOneAndUpdate(
    { _id: req.params.id, account: req.user.account },
    { status: "canceled", paidAt: null, paymentMethod: null }
  );

  if (!updatedRevenue) {
    return next(new ApiError("No revenue found with that ID", 404));
  }

  await ScheduledTask.deleteOne({ revenue: req.params.id, isDone: false });

  res.status(200).json({
    status: "success",
    message: "Revenue canceled successfully",
  });
});

exports.payRevenue = catchAsync(async (req, res, next) => {
  const { paymentMethod, paidAt } = req.body;

  const updatedRevenue = await Revenue.findOneAndUpdate(
    { _id: req.params.id, account: req.user.account },
    { status: "paid", paidAt, paymentMethod }
  );

  if (!updatedRevenue) {
    return next(new ApiError("No revenue found with that ID", 404));
  }

  await ScheduledTask.deleteOne({ revenue: req.params.id, isDone: false });

  res.status(200).json({
    status: "success",
    message: "Revenue marked as paid successfully",
  });
});

exports.unpayRevenue = catchAsync(async (req, res, next) => {
  const updatedRevenue = await Revenue.findOneAndUpdate(
    { _id: req.params.id, account: req.user.account },
    { status: "pending", paidAt: null, paymentMethod: null }
  );

  if (!updatedRevenue) {
    return next(new ApiError("No revenue found with that ID", 404));
  }

  if (updatedRevenue.dueDate > new Date()) {
    await ScheduledTask.create({
      type: "REVENUE_REMINDER",
      scheduledAt: new Date(updatedRevenue.dueDate).setHours(8, 0, 0, 0),
      revenue: req.params.id,
    });
  }

  res.status(200).json({
    status: "success",
    message: "Revenue marked as unpaid successfully",
  });
});

exports.deleteRevenue = catchAsync(async (req, res, next) => {
  const revenue = await Revenue.findOneAndDelete({
    _id: req.params.id,
    account: req.user.account,
  });

  if (!revenue) {
    return next(new ApiError("No revenue found with that ID", 404));
  }

  await ScheduledTask.deleteOne({ revenue: req.params.id, isDone: false });

  res.status(204).json({
    status: "success",
    data: null,
  });
});
