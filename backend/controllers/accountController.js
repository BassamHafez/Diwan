const Account = require("../models/accountModel");
const User = require("../models/userModel");
const Subscription = require("../models/subscriptionModel");
const factory = require("./handlerFactory");
const catchAsync = require("../utils/catchAsync");
const ApiError = require("../utils/ApiError");

const userAccessPermissions = [
  "FAVORITES",
  "ADD_COMPOUND",
  "UPDATE_COMPOUND",
  "DELETE_COMPOUND",
  "ADD_ESTATE",
  "UPDATE_ESTATE",
  "DELETE_ESTATE",
  "ADD_CONTRACT",
  "UPDATE_CONTRACT",
  "DELETE_CONTRACT",
  "CANCEL_CONTRACT",
  "ADD_REVENUE",
  "UPDATE_REVENUE",
  "DELETE_REVENUE",
  "CANCEL_REVENUE",
  "PAY_REVENUE",
  "UNPAY_REVENUE",
  "ADD_EXPENSE",
  "UPDATE_EXPENSE",
  "DELETE_EXPENSE",
  "CANCEL_EXPENSE",
  "PAY_EXPENSE",
  "UNPAY_EXPENSE",
  "ADD_CONTACT",
  "UPDATE_CONTACT",
  "DELETE_CONTACT",
  "ADD_TASK",
  "UPDATE_TASK",
  "DELETE_TASK",
  "COMPLETE_TASK",
  "UPDATE_ACCOUNT",
];

const memberPopOptions = {
  path: "members.user",
  select: "name email phone photo",
};

exports.getAllAccounts = factory.getAll(Account);
exports.updateAccount = factory.updateOne(Account);

exports.getMyAccount = catchAsync(async (req, res, next) => {
  const account = await Account.findOne({ owner: req.user.id })
    .populate(memberPopOptions)
    .lean();

  if (!account) {
    return next(new ApiError("Account not found", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      account,
    },
  });
});

exports.subscribe = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { usersCount, compoundsCount, isFavoriteAllowed } = req.body;
  let cost = 0;

  const [account, subscriptions] = await Promise.all([
    Account.findById(id).lean(),
    Subscription.find().lean(),
  ]);

  if (!account) {
    return next(new ApiError("Account not found", 404));
  }

  if (account.owner.toString() !== req.user.id) {
    return next(new ApiError("Owner of the account can only subscribe", 403));
  }

  if (!subscriptions || !subscriptions.length) {
    return next(new ApiError("Error getting subscription plans", 500));
  }

  if (usersCount && usersCount >= 1) {
    const userPrice = subscriptions.find(
      (sub) => sub.feature === "ADD_USER"
    ).price;

    cost += userPrice * usersCount;
  }

  if (compoundsCount) {
    let compoundFeature = "ADD_COMPOUND_LESS_THAN_10";

    if (compoundsCount < 10) {
      compoundFeature = "ADD_COMPOUND_LESS_THAN_10";
    } else if (compoundsCount >= 10 && compoundsCount < 30) {
      compoundFeature = "ADD_COMPOUND_10_30";
    } else if (compoundsCount >= 30 && compoundsCount < 50) {
      compoundFeature = "ADD_COMPOUND_30_50";
    } else {
      compoundFeature = "ADD_COMPOUND_MORE_THAN_50";
    }

    const compoundPrice = subscriptions.find(
      (sub) => sub.feature === compoundFeature
    ).price;

    cost += compoundPrice * compoundsCount;
  }

  if (isFavoriteAllowed) {
    const favoritePrice = subscriptions.find(
      (sub) => sub.feature === "FAVORITES"
    ).price;

    cost += favoritePrice;
  }

  if (!cost) {
    return next(new ApiError("Invalid subscription", 400));
  }

  const updateAccountPromise = Account.findByIdAndUpdate(
    id,
    {
      $inc: {
        allowedUsers: usersCount || 0,
        allowedCompounds: compoundsCount || 0,
      },
      isFavoriteAllowed: isFavoriteAllowed || account.isFavoriteAllowed,
      members: [{ user: req.user.id, permissions: userAccessPermissions }],
    },
    { new: true }
  );

  const updateUserPromise = User.findByIdAndUpdate(req.user.id, {
    permissions: userAccessPermissions,
  });

  const [updatedAccount] = await Promise.all([
    updateAccountPromise,
    updateUserPromise,
  ]);

  res.status(200).json({
    status: "success",
    data: {
      subscriptionCost: cost,
      account: updatedAccount,
    },
  });
});
