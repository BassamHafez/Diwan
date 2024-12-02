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
    .sort("startDate")
    .lean();

  res.status(200).json({
    status: "success",
    results: contracts.length,
    data: contracts,
  });
});

exports.createContract = catchAsync(async (req, res, next) => {
  const { estateId } = req.params;

  const newStartDate = new Date(req.body.startDate);
  const newEndDate = new Date(req.body.endDate);

  if (newStartDate >= newEndDate) {
    return next(new ApiError("Start date must be before end date", 400));
  }

  const isActiveContract =
    newStartDate <= Date.now() && newEndDate >= Date.now();

  const isFutureContract = newStartDate > Date.now();

  const overlappingContractPromise = Contract.findOne({
    estate: estateId,
    startDate: { $lte: newEndDate },
    endDate: { $gte: newStartDate },
    isCanceled: false,
  })
    .select("_id")
    .lean();

  const estatePromise = isActiveContract
    ? Estate.findByIdAndUpdate(estateId, { status: "rented" })
    : isFutureContract
    ? Estate.findByIdAndUpdate(estateId, { status: "pending" })
    : Estate.findById(estateId);

  const [estate, overlappingContract] = await Promise.all([
    estatePromise,
    overlappingContractPromise,
  ]);

  if (!estate) {
    return next(new ApiError("No estate found with that ID", 404));
  }

  if (overlappingContract) {
    return next(
      new ApiError(
        "There is an contract overlapping with the selected dates",
        400
      )
    );
  }

  const contract = await Contract.create({
    ...req.body,
    status: isActiveContract ? "active" : "upcoming",
    estate: estateId,
    user: req.user.id,
  });

  const updateCompoundEstatesCountPromise = isActiveContract
    ? Compound.findByIdAndUpdate(estate.compound, {
        $inc: { rentedEstatesCount: 1 },
      })
    : Promise.resolve();

  const calculatedRevenues = calculateRevenues(contract);
  const insertRevenuesPromise = Revenue.insertMany(calculatedRevenues);

  await Promise.all([insertRevenuesPromise, updateCompoundEstatesCountPromise]);

  res.status(201).json({
    status: "success",
    data: contract,
  });
});

exports.cancelContract = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const contract = await Contract.findById(id)
    .select("endDate isCanceled")
    .lean();

  if (!contract) {
    return next(new ApiError("No contract found with that ID", 404));
  }

  if (contract.endDate <= Date.now() && !contract.isCanceled) {
    return next(new ApiError("Cannot cancel a completed contract", 400));
  }

  const updateContractPromise = Contract.findByIdAndUpdate(
    id,
    { isCanceled: true },
    { new: true }
  );

  const cancelOldRevenuesPromise = Revenue.updateMany(
    { contract: id, status: { $ne: "paid" } },
    { status: "canceled" }
  );

  const [updatedContract] = await Promise.all([
    updateContractPromise,
    cancelOldRevenuesPromise,
  ]);

  res.status(200).json({
    status: "success",
    data: updatedContract,
  });
});

exports.updateContract = catchAsync(async (req, res, next) => {
  const { estateId, id } = req.params;

  const newStartDate = new Date(req.body.startDate);
  const newEndDate = new Date(req.body.endDate);

  if (newStartDate >= newEndDate) {
    return next(new ApiError("Start date must be before end date", 400));
  }

  const isActiveContract =
    newStartDate <= Date.now() && newEndDate >= Date.now();

  const isFutureContract = newStartDate > Date.now();

  const overlappingContractPromise = Contract.findOne({
    _id: { $ne: id },
    estate: estateId,
    startDate: { $lte: newEndDate },
    endDate: { $gte: newStartDate },
    isCanceled: false,
  })
    .select("_id")
    .lean();

  const estatePromise = isActiveContract
    ? Estate.findByIdAndUpdate(estateId, { status: "rented" })
    : isFutureContract
    ? Estate.findByIdAndUpdate(estateId, { status: "pending" })
    : Estate.findById(estateId);

  const [estate, overlappingContract] = await Promise.all([
    estatePromise,
    overlappingContractPromise,
  ]);

  if (!estate) {
    return next(new ApiError("No estate found with that ID", 404));
  }

  if (overlappingContract) {
    return next(
      new ApiError(
        "There is an contract overlapping with the selected dates",
        400
      )
    );
  }

  const updateContractPromise = Contract.findByIdAndUpdate(
    id,
    {
      ...req.body,
      status: isActiveContract ? "active" : "upcoming",
    },
    { new: true }
  );

  const cancelOldRevenuesPromise = Revenue.updateMany(
    { contract: id, status: { $ne: "paid" } },
    { status: "canceled" }
  );

  const [updatedContract] = await Promise.all([
    updateContractPromise,
    cancelOldRevenuesPromise,
  ]);

  const updateCompoundEstatesCountPromise = isActiveContract
    ? Compound.findByIdAndUpdate(estate.compound, {
        $inc: { rentedEstatesCount: 1 },
      })
    : Promise.resolve();

  const calculatedRevenues = calculateRevenues(updatedContract);
  const insertRevenuesPromise = Revenue.insertMany(calculatedRevenues);

  await Promise.all([insertRevenuesPromise, updateCompoundEstatesCountPromise]);

  res.status(201).json({
    status: "success",
    data: updatedContract,
  });
});

exports.getCurrentContract = catchAsync(async (req, res, next) => {
  const { estateId } = req.params;

  const contract = await Contract.findOne({
    estate: estateId,
    startDate: { $lte: new Date() },
    endDate: { $gte: new Date() },
    isCanceled: false,
  })
    .populate(contractPopOptions)
    .select(
      "startDate endDate tenant totalAmount paymentPeriodValue paymentPeriodUnit isCanceled"
    )
    .lean();

  if (!contract) {
    return res.status(200).json({
      status: "success",
      data: null,
    });
  }

  const nextRevenue = await Revenue.findOne({
    contract: contract._id,
    status: "pending",
  })
    .sort("dueDate")
    .select("amount dueDate type status")
    .lean();

  res.status(200).json({
    status: "success",
    data: {
      contract,
      nextRevenue,
    },
  });
});
