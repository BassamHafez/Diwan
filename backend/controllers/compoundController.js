const { v4: uuidv4 } = require("uuid");
const sharp = require("sharp");

const Account = require("../models/accountModel");
const Compound = require("../models/compoundModel");
const Estate = require("../models/estateModel");
const Contract = require("../models/contractModel");
const Revenue = require("../models/revenueModel");
const Expense = require("../models/expenseModel");
const Tenant = require("../models/tenantContactModel");
const Tag = require("../models/tagModel");
const catchAsync = require("../utils/catchAsync");
const ApiError = require("../utils/ApiError");
const { uploadSingleImage } = require("../utils/uploadImage");

const compoundPopOptions = [
  {
    path: "broker",
    select: "name phone phone2 notes",
  },
  {
    path: "landlord",
    select: "name phone phone2 notes",
  },
];

exports.getAllCompounds = catchAsync(async (req, res, next) => {
  const permittedCompounds = req.user.permittedCompounds;

  const compoundFilter =
    permittedCompounds?.length > 0
      ? { _id: { $in: permittedCompounds }, account: req.user.account }
      : { account: req.user.account };

  const compounds = await Compound.find(compoundFilter).lean();

  const compoundsIds = compounds.map((compound) => compound._id);

  const rentedEstatesCount = await Estate.aggregate([
    {
      $match: {
        compound: { $in: compoundsIds },
        status: "rented",
      },
    },
    {
      $group: {
        _id: "$compound",
        rentedCount: { $sum: 1 },
      },
    },
    {
      $project: {
        _id: 0,
        compoundId: "$_id",
        rentedCount: 1,
      },
    },
  ]);

  res.status(200).json({
    status: "success",
    results: compounds.length,
    data: {
      compounds,
      rentedEstatesCount,
    },
  });
});

exports.getCompound = catchAsync(async (req, res, next) => {
  const compoundId = req.params.id;
  const permittedCompounds = req.user.permittedCompounds;

  const compoundFilter =
    permittedCompounds?.length > 0
      ? { _id: compoundId, _id: { $in: permittedCompounds } }
      : { _id: compoundId, account: req.user.account };

  const [compound, estates] = await Promise.all([
    Compound.findOne(compoundFilter).populate(compoundPopOptions).lean(),

    Estate.find({ compound: compoundId })
      .select(
        "unitNumber name description region city image inFavorites status"
      )
      .lean(),
  ]);

  if (!compound) {
    return next(new ApiError("No compound found with that ID", 404));
  }

  const estatesIds = estates.map((estate) => estate._id);
  const monthStart = new Date(
    new Date().getFullYear(),
    new Date().getMonth(),
    1
  );
  const monthEnd = new Date(
    new Date().getFullYear(),
    new Date().getMonth() + 1,
    0
  );

  const revenuesAggregatePromise = Revenue.aggregate([
    {
      $match: {
        estate: { $in: estatesIds },
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

  const monthRevenuesAggregatePromise = Revenue.aggregate([
    {
      $match: {
        estate: { $in: estatesIds },
        dueDate: { $gte: monthStart, $lte: monthEnd },
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
        estate: { $in: estatesIds },
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

  const [revenuesAggregate, monthRevenuesAggregate, expensesAggregate] =
    await Promise.all([
      revenuesAggregatePromise,
      monthRevenuesAggregatePromise,
      expensesAggregatePromise,
    ]);

  const [
    { totalPaid: totalPaidRevenues, totalPending: totalPendingRevenues } = {
      totalPaid: 0,
      totalPending: 0,
    },
  ] = revenuesAggregate;

  const [
    {
      totalPaid: totalMonthPaidRevenues,
      totalPending: totalMonthPendingRevenues,
    } = {
      totalPaid: 0,
      totalPending: 0,
    },
  ] = monthRevenuesAggregate;

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
      totalMonthRevenue: totalMonthPaidRevenues + totalMonthPendingRevenues,
      totalMonthPaidRevenues,
      totalMonthPendingRevenues,
      totalExpense: totalPaidExpenses + totalPendingExpenses,
      totalPaidExpenses,
      totalPendingExpenses,
      compound,
      estates,
    },
  });
});

exports.uploadCompoundImage = uploadSingleImage("image");

exports.resizeCompoundImage = catchAsync(async (req, res, next) => {
  if (!req.file) return next();

  const filename = `compound-${uuidv4()}.png`;

  if (req.file && req.file.buffer) {
    await sharp(req.file.buffer)
      // .resize(2000, 1333)
      .toFormat("png")
      .png({ quality: 99 })
      .toFile(`uploads/compounds/${filename}`);

    req.body.image = `/compounds/${filename}`;
  }

  next();
});

exports.deleteCompound = catchAsync(async (req, res, next) => {
  const permittedCompounds = req.user.permittedCompounds;

  const compoundFilter =
    permittedCompounds?.length > 0
      ? { _id: req.params.id, _id: { $in: permittedCompounds } }
      : { _id: req.params.id, account: req.user.account };

  const compound = await Compound.findOne(compoundFilter).lean();

  if (!compound) {
    return next(new ApiError("No compound found with that ID", 404));
  }

  if (compound.estatesCount > 0) {
    return next(
      new ApiError("Please delete all estates in this compound first", 400)
    );
  }

  await Compound.findByIdAndDelete(req.params.id);

  res.status(204).json({
    status: "success",
    data: null,
  });
});

exports.createCompound = catchAsync(async (req, res, next) => {
  const { tags } = req.body;

  const account = await Account.findById(req.user.account)
    .select("allowedCompounds")
    .lean();

  if (account.allowedCompounds <= 0) {
    return next(new ApiError("Subscribe and get more compounds", 403));
  }

  const tagUpdatePromise = tags
    ? Tag.findOneAndUpdate(
        { account: req.user.account },
        { $addToSet: { tags: { $each: tags } } },
        { upsert: true, lean: true }
      )
    : Promise.resolve();

  const compoundCreatePromise = Compound.create(req.body);

  const accountUpdatePromise = Account.findByIdAndUpdate(req.user.account, {
    $inc: { allowedCompounds: -1 },
  });

  const [compound] = await Promise.all([
    compoundCreatePromise,
    tagUpdatePromise,
    accountUpdatePromise,
  ]);

  res.status(201).json({
    status: "success",
    data: compound,
  });
});

exports.updateCompound = catchAsync(async (req, res, next) => {
  const { tags } = req.body;
  const { id } = req.params;
  const permittedCompounds = req.user.permittedCompounds;

  const compoundFilter =
    permittedCompounds?.length > 0
      ? { _id: id, _id: { $in: permittedCompounds } }
      : { _id: id, account: req.user.account };

  const tagUpdatePromise = tags
    ? Tag.findOneAndUpdate(
        { account: req.user.account },
        { $addToSet: { tags: { $each: tags } } },
        { upsert: true, lean: true }
      )
    : Promise.resolve();

  const compoundUpdatePromise = Compound.findOneAndUpdate(
    compoundFilter,
    req.body,
    {
      new: true,
      runValidators: true,
      populate: compoundPopOptions,
    }
  );

  const [_, compound] = await Promise.all([
    tagUpdatePromise,
    compoundUpdatePromise,
  ]);

  if (!compound) {
    return next(new ApiError("No compound found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: compound,
  });
});

exports.getCurrentContracts = catchAsync(async (req, res, next) => {
  const compoundId = req.params.id;

  const [compound, estates] = await Promise.all([
    Compound.findById(compoundId).select("_id account").lean(),
    Estate.find({ compound: compoundId }).select("_id").lean(),
  ]);

  if (!compound) {
    return next(new ApiError("No compound found with that ID", 404));
  }

  if (!estates.length) {
    return res.status(200).json({
      status: "success",
      results: 0,
      data: [],
    });
  }

  const estateIds = estates.map((estate) => estate._id);

  const currContractsPromise = Contract.find({
    estate: { $in: estateIds },
    startDate: { $lte: new Date() },
    endDate: { $gte: new Date() },
    isCanceled: false,
  }).lean();

  const tenantsPromise = Tenant.find({ account: compound.account })
    .select("_id name")
    .lean();

  const [contracts, tenants] = await Promise.all([
    currContractsPromise,
    tenantsPromise,
  ]);

  res.status(200).json({
    status: "success",
    data: {
      contracts,
      tenants,
    },
  });
});

// Compound Expenses

exports.getCompoundExpenses = catchAsync(async (req, res, next) => {
  const compoundId = req.params.id;

  const compoundPromise = Compound.findOne({
    _id: compoundId,
    account: req.user.account,
  })
    .select("_id")
    .lean();

  const expensesPromise = Expense.find({ compound: compoundId })
    .select("note amount dueDate type status paidAt paymentMethod")
    .sort("dueDate")
    .lean();

  const [compound, expenses] = await Promise.all([
    compoundPromise,
    expensesPromise,
  ]);

  if (!compound) {
    return next(new ApiError("No compound found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    results: expenses.length,
    data: expenses,
  });
});

exports.createCompoundExpense = catchAsync(async (req, res, next) => {
  const compoundId = req.params.id;

  const compound = await Compound.findById(compoundId).select("_id").lean();

  if (!compound) {
    return next(new ApiError("No compound found with that ID", 404));
  }

  req.body.compound = compoundId;

  const expense = await Expense.create(req.body);

  res.status(201).json({
    status: "success",
    data: expense,
  });
});
