const Contract = require("../models/contractModel");
const Estate = require("../models/estateModel");
const Revenue = require("../models/revenueModel");
const Compound = require("../models/compoundModel");
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

  const isActiveContract =
    new Date(req.body.startDate) < Date.now() &&
    new Date(req.body.endDate) > Date.now();

  const isFutureContract = new Date(req.body.startDate) > Date.now();

  const [estate, contract] = await Promise.all([
    isActiveContract
      ? Estate.findByIdAndUpdate(estateId, { status: "rented" })
      : isFutureContract
      ? Estate.findByIdAndUpdate(estateId, { status: "pending" })
      : Estate.findById(estateId),

    Contract.create({
      ...req.body,
      status: isActiveContract ? "active" : "upcoming",
      estate: estateId,
      user: req.user.id,
    }),
  ]);

  if (!estate) {
    await Contract.findByIdAndDelete(contract._id);
    return next(new ApiError("No estate found with that ID", 404));
  }

  const updateCompoundEstatesCountPromise = isActiveContract
    ? Compound.findByIdAndUpdate(estate.compound, {
        $inc: { rentedEstatesCount: 1 },
      })
    : Promise.resolve();

  const calculatedRevenues = calculateRevenues(contract);
  const insertRevenuesPromise = Revenue.insertMany(calculatedRevenues);

  const [revenues] = await Promise.all([
    insertRevenuesPromise,
    updateCompoundEstatesCountPromise,
  ]);

  res.status(201).json({
    status: "success",
    data: {
      contract,
      revenues,
    },
  });
});

exports.cancelContract = catchAsync(async (req, res, next) => {
  const contract = await Contract.findById(req.params.id);

  if (!contract) {
    return next(new ApiError("No contract found with that ID", 404));
  }

  if (contract.status === "completed") {
    return next(new ApiError("Cannot cancel a completed contract", 400));
  }

  const updatedContract = await Contract.findByIdAndUpdate(
    req.params.id,
    { status: "canceled" },
    { new: true }
  );

  return res.status(200).json({
    status: "success",
    data: updatedContract,
  });
});
