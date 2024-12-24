const Contract = require("../models/contractModel");
const Estate = require("../models/estateModel");
const Compound = require("../models/compoundModel");
const Revenue = require("../models/revenueModel");
const TenantContact = require("../models/tenantContactModel");
const ScheduledMission = require("../models/scheduledMissionModel");
const catchAsync = require("../utils/catchAsync");
const ApiError = require("../utils/ApiError");
const calculateRevenues = require("../utils/calculateRevenues");
const { sendWAText } = require("../utils/sendWAMessage");

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

  const [overlappingContract, tenant] = await Promise.all([
    Contract.findOne({
      estate: estateId,
      startDate: { $lte: new Date(newEndDate).setHours(23, 59, 59, 999) },
      endDate: { $gte: new Date(newStartDate).setHours(0, 0, 0, 0) },
      isCanceled: false,
    })
      .select("_id")
      .lean(),

    TenantContact.findById(req.body.tenant).select("name phone").lean(),
  ]);

  if (overlappingContract) {
    return next(
      new ApiError(
        "There is an contract overlapping with the selected dates",
        400
      )
    );
  }

  if (!tenant) {
    return next(new ApiError("No tenant found with that ID", 404));
  }

  // const isActiveContract =
  //   newStartDate <= Date.now() && newEndDate >= Date.now();

  const today = new Date().toLocaleDateString();

  const isActiveContract =
    newStartDate.toLocaleDateString() <= today &&
    newEndDate.toLocaleDateString() >= today;

  const estate = isActiveContract
    ? await Estate.findByIdAndUpdate(estateId, { status: "rented" })
    : await Estate.findById(estateId).select("_id name compound").lean();

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

  const contract = await Contract.create({
    ...req.body,
    startDate: newStartDate.setHours(0, 0, 0, 0),
    endDate: newEndDate.setHours(23, 59, 59, 999),
    status: isActiveContract ? "active" : "upcoming",
    estate: estateId,
    account: req.user.account,
  });

  const scheduledMissionPromise = ScheduledMission.create({
    type: isActiveContract ? "CONTRACT_EXPIRATION" : "CONTRACT_ACTIVATION",
    // scheduledAt: isActiveContract ? newEndDate : newStartDate,
    scheduledAt: isActiveContract
      ? newEndDate.setHours(23, 59, 59, 999)
      : newStartDate.setHours(0, 0, 0, 0),
    contractEndDate: newEndDate.setHours(23, 59, 59, 999),
    estate: estateId,
    contract: contract._id,
  });

  const calculatedRevenues = calculateRevenues(contract);
  const insertRevenuesPromise = Revenue.insertMany(calculatedRevenues, {
    ordered: false,
  });

  const [insertedRevenues] = await Promise.all([
    insertRevenuesPromise,
    scheduledMissionPromise,
  ]);

  const revenuesReminders = insertedRevenues.map((revenue) => ({
    type: "REVENUE_REMINDER",
    scheduledAt: new Date(revenue.dueDate).setHours(8, 0, 0, 0),
    revenue: revenue._id,
  }));

  ScheduledMission.insertMany(revenuesReminders, { ordered: false });

  sendWAText(
    tenant.phone,
    `Hello ${
      tenant.name
    }, You have a new contract starting on ${newStartDate.toLocaleDateString()} and ending on ${newEndDate.toLocaleDateString()} at "${
      estate.name
    }"`
  );

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
    .populate(contractPopOptions)
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

  const deleteOldScheduledMissionPromise = ScheduledMission.findOneAndDelete({
    contract: id,
    isDone: false,
  });

  const [updatedContract] = await Promise.all([
    updateContractPromise,
    deleteOldScheduledMissionPromise,
    cancelOldRevenuesPromise,
  ]);

  // const isActiveContract =
  //   updatedContract.startDate <= Date.now() &&
  //   updatedContract.endDate >= Date.now();

  const today = new Date().toLocaleDateString();

  const isActiveContract =
    new Date(updatedContract.startDate).toLocaleDateString() <= today &&
    new Date(updatedContract.endDate).toLocaleDateString() >= today;

  if (isActiveContract) {
    await Estate.findByIdAndUpdate(updatedContract.estate, {
      status: "available",
    });
  }

  sendWAText(
    contract.tenant.phone,
    `Hello ${contract.tenant.name}, Your contract at "${contract.estate.name}" has been canceled.`
  );

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

  const overlappingContract = await Contract.findOne({
    _id: { $ne: id },
    estate: estateId,
    startDate: { $lte: new Date(newEndDate).setHours(23, 59, 59, 999) },
    endDate: { $gte: new Date(newStartDate).setHours(0, 0, 0, 0) },
    isCanceled: false,
  })
    .select("_id")
    .lean();

  if (overlappingContract) {
    return next(
      new ApiError(
        "There is an contract overlapping with the selected dates",
        400
      )
    );
  }

  // const isActiveContract =
  //   newStartDate <= Date.now() && newEndDate >= Date.now();

  const today = new Date().toLocaleDateString();

  const isActiveContract =
    newStartDate.toLocaleDateString() <= today &&
    newEndDate.toLocaleDateString() >= today;

  const estate = isActiveContract
    ? await Estate.findByIdAndUpdate(estateId, { status: "rented" })
    : await Estate.findById(estateId).select("_id compound").lean();

  if (!estate) {
    return next(new ApiError("No estate found with that ID", 404));
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

  const deleteOldScheduledMissionPromise = ScheduledMission.findOneAndDelete({
    contract: id,
    isDone: false,
  });

  const [updatedContract] = await Promise.all([
    updateContractPromise,
    cancelOldRevenuesPromise,
    deleteOldScheduledMissionPromise,
  ]);

  const calculatedRevenues = calculateRevenues(updatedContract);
  const insertRevenuesPromise = Revenue.insertMany(calculatedRevenues);

  const scheduledMissionPromise = ScheduledMission.create({
    type: isActiveContract ? "CONTRACT_EXPIRATION" : "CONTRACT_ACTIVATION",
    // scheduledAt: isActiveContract ? newEndDate : newStartDate,
    scheduledAt: isActiveContract
      ? newEndDate.setHours(23, 59, 59, 999)
      : newStartDate.setHours(0, 0, 0, 0),
    contractEndDate: newEndDate.setHours(23, 59, 59, 999),
    estate: estateId,
    contract: updatedContract._id,
  });

  const [insertedRevenues] = await Promise.all([
    insertRevenuesPromise,
    scheduledMissionPromise,
  ]);

  const revenuesReminders = insertedRevenues.map((revenue) => ({
    type: "REVENUE_REMINDER",
    scheduledAt: new Date(revenue.dueDate).setHours(8, 0, 0, 0),
    revenue: revenue._id,
  }));

  ScheduledMission.insertMany(revenuesReminders, { ordered: false });

  res.status(201).json({
    status: "success",
    data: updatedContract,
  });
});

exports.getCurrentContract = catchAsync(async (req, res, next) => {
  const { estateId } = req.params;

  const contract = await Contract.findOne({
    estate: estateId,
    startDate: { $lte: new Date().setHours(23, 59, 59, 999) },
    endDate: { $gte: new Date().setHours(0, 0, 0, 0) },
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
