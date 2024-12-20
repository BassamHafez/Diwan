const Estate = require("../models/estateModel");
const Revenue = require("../models/revenueModel");
const Expense = require("../models/expenseModel");
const Task = require("../models/taskModel");
const catchAsync = require("../utils/catchAsync");

exports.getStats = catchAsync(async (req, res, next) => {
  const accountId = req.user.account;
  const startOfYear = new Date(new Date().getFullYear(), 0, 1);
  // const endOfYear = new Date(new Date().getFullYear() + 1, 0, 1); // 1st Jan next year
  const endOfYear = new Date(new Date().getFullYear(), 11, 31); // 31st Dec this year

  const estatesAggregatePromise = Estate.aggregate([
    { $match: { account: accountId } },
    {
      $group: {
        _id: null,
        totalEstates: { $sum: 1 },
        rentedEstates: {
          $sum: { $cond: [{ $eq: ["$status", "rented"] }, 1, 0] },
        },
      },
    },
  ]);

  const revenuesAggregatePromise = Revenue.aggregate([
    { $match: { account: accountId } },
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
    { $match: { account: accountId } },
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

  const todayFilter = {
    account: accountId,
    date: {
      $gte: new Date().setHours(0, 0, 0, 0),
      $lt: new Date().setHours(23, 59, 59, 999),
    },
  };

  const popOptions = [
    {
      path: "estate",
      select: "name",
    },
    {
      path: "compound",
      select: "name",
    },
  ];

  const todayTasksPromise = Task.find(todayFilter)
    .select("title description date type cost priority isCompleted")
    .populate(popOptions)
    .lean();

  todayFilter.dueDate = todayFilter.date;
  delete todayFilter.date;

  const todayRevenuesPromise = Revenue.find(todayFilter)
    .select("note amount dueDate type status")
    .populate(popOptions)
    .lean();

  const exPendingRevenuesPromise = Revenue.find({
    account: accountId,
    status: "pending",
    dueDate: { $lt: new Date() },
  })
    .select("note amount dueDate type status")
    .populate(popOptions)
    .lean();

  const todayExpensesPromise = Expense.find(todayFilter)
    .select("note amount dueDate type status")
    .populate(popOptions)
    .lean();

  const revenuesByMonthPromise = Revenue.aggregate([
    {
      $match: {
        account: accountId,
        dueDate: { $gte: startOfYear, $lt: endOfYear },
      },
    },
    {
      $group: {
        _id: { $month: "$dueDate" },
        totalPaid: {
          $sum: { $cond: [{ $eq: ["$status", "paid"] }, "$amount", 0] },
        },
        totalPending: {
          $sum: { $cond: [{ $eq: ["$status", "pending"] }, "$amount", 0] },
        },
      },
    },
    {
      $project: {
        _id: 0,
        month: "$_id",
        totalPaid: 1,
        totalPending: 1,
      },
    },
  ]);

  const [
    estatesAggregate,
    revenuesAggregate,
    expensesAggregate,
    todayTasks,
    todayRevenues,
    exPendingRevenues,
    todayExpenses,
    revenuesByMonth,
  ] = await Promise.all([
    estatesAggregatePromise,
    revenuesAggregatePromise,
    expensesAggregatePromise,
    todayTasksPromise,
    todayRevenuesPromise,
    exPendingRevenuesPromise,
    todayExpensesPromise,
    revenuesByMonthPromise,
  ]);

  const [
    { totalEstates, rentedEstates } = { totalEstates: 0, rentedEstates: 0 },
  ] = estatesAggregate;

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
      totalPaidRevenues,
      totalPendingRevenues,
      totalPaidExpenses,
      totalPendingExpenses,
      totalEstatesCount: totalEstates,
      rentedEstatesCount: rentedEstates,
      todayTasks,
      todayRevenues,
      exPendingRevenues,
      todayExpenses,
      revenuesByMonth,
    },
  });
});
