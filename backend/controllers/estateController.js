const { v4: uuidv4 } = require("uuid");
const sharp = require("sharp");
const mongoose = require("mongoose");

const Estate = require("../models/estateModel");
const Compound = require("../models/compoundModel");
const Expense = require("../models/expenseModel");
const Revenue = require("../models/revenueModel");
const Tag = require("../models/tagModel");
const catchAsync = require("../utils/catchAsync");
const ApiError = require("../utils/ApiError");
const factory = require("./handlerFactory");
const { uploadSingleImage } = require("../utils/uploadImage");

const estatesPopOptions = [
  {
    path: "compound",
    select: "name address region city neighborhood image",
  },
];

const estatePopOptions = [
  {
    path: "compound",
    select: "name address region city neighborhood image",
  },
  {
    path: "broker",
    select: "name phone phone2 notes",
  },
  {
    path: "landlord",
    select: "name phone phone2 notes",
  },
];

exports.getAllEstates = factory.getAll(Estate, estatesPopOptions);

exports.getEstate = catchAsync(async (req, res, next) => {
  const estateId = req.params.id;

  const estatePromise = Estate.findById(estateId)
    .populate(estatePopOptions)
    .lean();

  const revenuesAggregatePromise = Revenue.aggregate([
    {
      $match: {
        estate: new mongoose.Types.ObjectId(String(estateId)),
      },
    },
    {
      $group: {
        _id: null,
        totalPaid: {
          $sum: { $cond: [{ $eq: ["$status", "paid"] }, "$amount", 0] },
        },
        totalPending: {
          $sum: { $cond: [{ $eq: ["$status", "pending"] }, "$amount", 0] },
        },
      },
    },
  ]);

  const expensesAggregatePromise = Expense.aggregate([
    {
      $match: {
        estate: new mongoose.Types.ObjectId(String(estateId)),
      },
    },
    {
      $group: {
        _id: null,
        totalPaid: {
          $sum: { $cond: [{ $eq: ["$status", "paid"] }, "$amount", 0] },
        },
        totalPending: {
          $sum: { $cond: [{ $eq: ["$status", "pending"] }, "$amount", 0] },
        },
      },
    },
  ]);

  const [estate, revenuesAggregate, expensesAggregate] = await Promise.all([
    estatePromise,
    revenuesAggregatePromise,
    expensesAggregatePromise,
  ]);

  if (!estate) {
    return next(new ApiError("No estate found with that ID", 404));
  }

  const [
    { totalPaid: totalPaidRevenues, totalPending: totalPendingRevenues } = {
      totalPaid: 0,
      totalPending: 0,
    },
  ] = revenuesAggregate;

  const [
    { totalPaid: totalPaidExpenses, totalPending: totalPendingExpenses } = {
      totalPaid: 0,
      totalPending: 0,
    },
  ] = expensesAggregate;

  res.status(200).json({
    status: "success",
    data: {
      totalRevenue: totalPaidRevenues + totalPendingRevenues,
      totalPaidRevenues,
      totalPendingRevenues,
      totalExpense: totalPaidExpenses + totalPendingExpenses,
      totalPaidExpenses,
      totalPendingExpenses,
      estate,
    },
  });
});

exports.uploadEstateImage = uploadSingleImage("image");

exports.resizeEstateImage = catchAsync(async (req, res, next) => {
  if (!req.file) return next();

  const filename = `estate-${uuidv4()}.png`;

  if (req.file && req.file.buffer) {
    await sharp(req.file.buffer)
      // .resize(2000, 1333)
      .toFormat("png")
      .png({ quality: 99 })
      .toFile(`uploads/estates/${filename}`);

    req.body.image = `/estates/${filename}`;
  }

  next();
});

exports.createEstate = catchAsync(async (req, res, next) => {
  const { tags } = req.body;

  if (req.body.compound) {
    const compound = await Compound.findById(req.body.compound);

    if (!compound) {
      return next(new ApiError("No compound found with that ID", 404));
    }

    req.body.region = compound.region;
    req.body.city = compound.city;
    if (compound.neighborhood) req.body.neighborhood = compound.neighborhood;
    if (compound.broker) req.body.broker = compound.broker;
    if (compound.landlord) req.body.landlord = compound.landlord;
  }

  const estateCreatePromise = Estate.create(req.body);

  const estateCountUpdatePromise = req.body.compound
    ? Compound.findByIdAndUpdate(
        req.body.compound,
        { $inc: { estatesCount: 1 } },
        { lean: true }
      )
    : Promise.resolve();

  const tagUpdatePromise = tags
    ? Tag.findOneAndUpdate(
        { user: req.user._id },
        { $addToSet: { tags: { $each: tags } } },
        { upsert: true, lean: true }
      )
    : Promise.resolve();

  const [_, estate] = await Promise.all([
    tagUpdatePromise,
    estateCreatePromise,
    estateCountUpdatePromise,
  ]);

  res.status(201).json({
    status: "success",
    data: estate,
  });
});

exports.updateEstate = catchAsync(async (req, res, next) => {
  const estate = await Estate.findById(req.params.id);
  const { tags } = req.body;

  if (!estate) {
    return next(new ApiError("No estate found with that ID", 404));
  }

  if (estate.compound) {
    const compound = await Compound.findById(estate.compound);

    req.body.region = compound.region;
    req.body.city = compound.city;
    if (compound.neighborhood) req.body.neighborhood = compound.neighborhood;
    if (compound.broker) req.body.broker = compound.broker;
    if (compound.landlord) req.body.landlord = compound.landlord;
  }

  const estateUpdatePromise = Estate.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true, populate: estatePopOptions }
  );

  const tagUpdatePromise = tags
    ? Tag.findOneAndUpdate(
        { user: req.user._id },
        { $addToSet: { tags: { $each: tags } } },
        { upsert: true, lean: true }
      )
    : Promise.resolve();

  const [_, updatedEstate] = await Promise.all([
    tagUpdatePromise,
    estateUpdatePromise,
  ]);

  if (!updatedEstate) {
    return next(new ApiError("No estate found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: updatedEstate,
  });
});

exports.deleteEstate = catchAsync(async (req, res, next) => {
  const estate = await Estate.findById(req.params.id);

  if (!estate) {
    return next(new ApiError("No estate found with that ID", 404));
  }

  const estateDeletePromise = Estate.findByIdAndDelete(req.params.id);

  const estateCountUpdatePromise = estate.compound
    ? Compound.findByIdAndUpdate(
        estate.compound,
        { $inc: { estatesCount: -1 } },
        { lean: true }
      )
    : Promise.resolve();

  await Promise.all([estateDeletePromise, estateCountUpdatePromise]);

  res.status(204).json({
    status: "success",
    data: null,
  });
});

// Favorites

exports.favoriteEstate = catchAsync(async (req, res, next) => {
  const estate = await Estate.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    { inFavorites: true }
  );

  if (!estate) {
    return next(new ApiError("No estate found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    message: "Estate added to favorites",
  });
});

exports.unfavoriteEstate = catchAsync(async (req, res, next) => {
  const estate = await Estate.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    { inFavorites: false }
  );

  if (!estate) {
    return next(new ApiError("No estate found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    message: "Estate removed from favorites",
  });
});

// Estate expenses

exports.getEstateExpenses = catchAsync(async (req, res, next) => {
  const estateId = req.params.id;

  const estatePromise = Estate.findById(estateId).select("_id").lean();
  const expensesPromise = Expense.find({ estate: estateId })
    .select("note amount dueDate type status paidAt paymentMethod")
    .sort("dueDate")
    .lean();

  const [estate, expenses] = await Promise.all([
    estatePromise,
    expensesPromise,
  ]);

  if (!estate) {
    return next(new ApiError("No estate found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    results: expenses.length,
    data: expenses,
  });
});

exports.createEstateExpense = catchAsync(async (req, res, next) => {
  const estateId = req.params.id;

  const estate = await Estate.findById(estateId).select("_id").lean();

  if (!estate) {
    return next(new ApiError("No estate found with that ID", 404));
  }

  req.body.estate = estateId;

  const expense = await Expense.create(req.body);

  res.status(201).json({
    status: "success",
    data: expense,
  });
});
