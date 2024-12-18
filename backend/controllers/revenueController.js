const Revenue = require("../models/revenueModel");
const Estate = require("../models/estateModel");
const Compound = require("../models/compoundModel");
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

  await Revenue.create({
    ...req.body,
    estate: estateId,
    account: req.user.account,
  });

  res.status(201).json({
    status: "success",
    message: "Revenue created successfully",
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
