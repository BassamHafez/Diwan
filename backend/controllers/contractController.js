const Contract = require("../models/contractModel");
const Estate = require("../models/estateModel");
const Revenue = require("../models/revenueModel");
const catchAsync = require("../utils/catchAsync");
const ApiError = require("../utils/ApiError");
const calculateRevenues = require("../utils/calculateRevenues");

const contractPopOptions = [
  {
    path: "tenant",
    select: "name phone phone2",
  },
];

exports.getAllContracts = catchAsync(async (req, res, next) => {
  const { estateId } = req.params;

  const estate = await Estate.findById(estateId);

  if (!estate) {
    return next(new ApiError("No estate found with that ID", 404));
  }

  const contracts = await Contract.find({ estate: estateId, user: req.user.id })
    .populate(contractPopOptions)
    .lean();

  res.status(200).json({
    status: "success",
    results: contracts.length,
    data: contracts,
  });
});

exports.createContract = catchAsync(async (req, res, next) => {
  const { estateId } = req.params;

  const [estate, contract] = await Promise.all([
    Estate.findById(estateId),
    Contract.create({
      ...req.body,
      status:
        new Date(req.body.startDate) < Date.now() &&
        new Date(req.body.endDate) > Date.now()
          ? "active"
          : "upcoming",
      estate: estateId,
      user: req.user.id,
    }),
  ]);

  if (!estate) {
    await Contract.findByIdAndDelete(contract._id);
    return next(new ApiError("No estate found with that ID", 404));
  }

  const calculatedRevenues = calculateRevenues(contract);
  const revenues = await Revenue.insertMany(calculatedRevenues);

  res.status(201).json({
    status: "success",
    data: {
      contract,
      revenues,
    },
  });
});

exports.cancelContract = catchAsync(async (req, res, next) => {
  const updatedContract = await Contract.findByIdAndUpdate(
    req.params.id,
    { status: "canceled" },
    { new: true }
  );

  if (!updatedContract) {
    return next(new ApiError("No contract found with that ID", 404));
  }

  return res.status(200).json({
    status: "success",
    data: updatedContract,
  });
});
