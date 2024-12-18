const Contract = require("../models/contractModel");
const Estate = require("../models/estateModel");
const Compound = require("../models/compoundModel");
const Revenue = require("../models/revenueModel");
const ScheduledTask = require("../models/scheduledTaskModel");
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

  const [estate, contracts] = await Promise.all([
    Estate.findById(estateId).select("_id").lean(),

    Contract.find({ estate: estateId, account: req.user.account })
      .populate(contractPopOptions)
      .sort("startDate")
      .lean(),
  ]);

  if (!estate) {
    return next(new ApiError("No estate found with that ID", 404));
  }

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

  // const isFutureContract = newStartDate > Date.now();

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
    : Estate.findById(estateId).select("_id compound").lean();

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

  if (estate.compound) req.body.compound = estate.compound;

  if (estate.landlord) req.body.landlord = estate.landlord;

  if (!req.body.landlord && estate.compound) {
    const compound = await Compound.findById(estate.compound)
      .select("landlord")
      .lean();

    req.body.landlord = compound.landlord;
  }

  const contract = await Contract.create({
    ...req.body,
    status: isActiveContract ? "active" : "upcoming",
    estate: estateId,
    account: req.user.account,
  });

  const scheduledTaskPromise = ScheduledTask.create({
    type: isActiveContract ? "CONTRACT_EXPIRATION" : "CONTRACT_ACTIVATION",
    scheduledAt: isActiveContract ? newEndDate : newStartDate,
    estate: estateId,
    contract: contract._id,
  });

  const calculatedRevenues = calculateRevenues(contract);
  const insertRevenuesPromise = Revenue.insertMany(calculatedRevenues);

  await Promise.all([scheduledTaskPromise, insertRevenuesPromise]);

  res.status(201).json({
    status: "success",
    data: contract,
  });
});

exports.cancelContract = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const contract = await Contract.findOne({
    _id: id,
    account: req.user.account,
  })
    .select("status")
    .lean();

  if (!contract) {
    return next(new ApiError("No contract found with that ID", 404));
  }

  if (contract.status === "completed") {
    return next(new ApiError("Cannot cancel a completed contract", 400));
  }

  const updateContractPromise = Contract.findByIdAndUpdate(
    id,
    { isCanceled: true, status: "canceled" },
    { new: true }
  );

  const cancelOldRevenuesPromise = Revenue.updateMany(
    { contract: id, status: { $ne: "paid" } },
    { status: "canceled" }
  );

  const oldScheduledTaskPromise = ScheduledTask.findOne({
    contract: id,
    isDone: false,
  });

  const [updatedContract, oldScheduledTask] = await Promise.all([
    updateContractPromise,
    oldScheduledTaskPromise,
    cancelOldRevenuesPromise,
  ]);

  let updateEstatePromise = Promise.resolve();

  const deleteOldScheduledTaskPromise = ScheduledTask.findByIdAndDelete(
    oldScheduledTask._id
  );

  if (contract.status === "active") {
    updateEstatePromise = Estate.findByIdAndUpdate(updatedContract.estate, {
      status: "available",
    });
  }

  await Promise.all([updateEstatePromise, deleteOldScheduledTaskPromise]);

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

  // const isFutureContract = newStartDate > Date.now();

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
    : Estate.findById(estateId).select("_id").lean();

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

  const deleteOldScheduledTaskPromise = ScheduledTask.findOneAndDelete({
    contract: id,
    isDone: false,
  });

  const [updatedContract] = await Promise.all([
    updateContractPromise,
    cancelOldRevenuesPromise,
    deleteOldScheduledTaskPromise,
  ]);

  const calculatedRevenues = calculateRevenues(updatedContract);
  const insertRevenuesPromise = Revenue.insertMany(calculatedRevenues);

  const scheduledTaskPromise = ScheduledTask.create({
    type: isActiveContract ? "CONTRACT_EXPIRATION" : "CONTRACT_ACTIVATION",
    scheduledAt: isActiveContract ? newEndDate : newStartDate,
    estate: estateId,
    contract: updatedContract._id,
  });

  await Promise.all([insertRevenuesPromise, scheduledTaskPromise]);

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
