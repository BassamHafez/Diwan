const Account = require("../models/accountModel");
const User = require("../models/userModel");
const Package = require("../models/packageModel");
const Subscription = require("../models/subscriptionModel");
const Purchase = require("../models/purchaseModel");
const ScheduledMission = require("../models/scheduledMissionModel");
const factory = require("./handlerFactory");
const catchAsync = require("../utils/catchAsync");
const ApiError = require("../utils/ApiError");
const { sendWAText } = require("../utils/sendWAMessage");
const sendEmail = require("../utils/sendEmail");
const { newMemberHtml } = require("../utils/htmlMessages");

const memberPopOptions = {
  path: "members.user",
  select: "name email phone photo",
};

const ownerPopOptions = {
  path: "owner",
  select: "name email phone",
};

exports.getAllAccounts = factory.getAll(Account, ownerPopOptions, "-members");
exports.updateAccount = factory.updateOne(Account);

exports.deleteAccount = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const account = await Account.findById(id).select("members").lean();

  if (!account) {
    return next(new ApiError("Account not found", 404));
  }

  const membersIds = account.members.map((member) => member.user);

  await Promise.all([
    User.deleteMany({ _id: { $in: membersIds } }, { ordered: false }),
    Account.deleteOne({ _id: id }),
    ScheduledMission.deleteMany({ account: id }),
  ]);

  res.status(204).json({
    status: "success",
    data: null,
  });
});

exports.getMyAccount = catchAsync(async (req, res, next) => {
  const account = await Account.findById(req.user.account)
    .populate(memberPopOptions)
    .lean();

  if (!account) {
    return next(new ApiError("Account not found", 404));
  }

  if (account.owner.toString() !== req.user.id) {
    account.members.forEach((member) => {
      delete member.permissions;
      delete member.permittedCompounds;
    });
  }

  res.status(200).json({
    status: "success",
    data: {
      account,
    },
  });
});

exports.getMyPurchases = catchAsync(async (req, res, next) => {
  const purchases = await Purchase.find({ account: req.user.account }).lean();

  res.status(200).json({
    status: "success",
    data: {
      purchases,
    },
  });
});

exports.subscribe = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const {
    usersCount,
    compoundsCount,
    estatesCount,
    maxEstatesInCompound,
    isFavoriteAllowed,
    isRemindersAllowed,
  } = req.body;
  let cost = 0;

  const expireDate = new Date(Date.now() + 30.25 * 24 * 60 * 60 * 1000);

  const accountData = {
    subscriptionEndDate: expireDate,
  };

  const [account, subscriptions] = await Promise.all([
    Account.findById(id)
      .select("owner isFavoriteAllowed isRemindersAllowed")
      .populate("owner", "name phone email")
      .lean(),
    Subscription.find().lean(),
    ScheduledMission.deleteOne({
      account: id,
      type: "SUBSCRIPTION_EXPIRATION",
      isDone: false,
    }),
  ]);

  if (!account) {
    return next(new ApiError("Account not found", 404));
  }

  if (account.owner._id.toString() !== req.user.id) {
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
    accountData.allowedUsers = usersCount;
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
    accountData.allowedCompounds = compoundsCount;
  }

  if (estatesCount) {
    let estateFeature = "ADD_ESTATE_LESS_THAN_10";

    if (estatesCount < 10) {
      estateFeature = "ADD_ESTATE_LESS_THAN_10";
    } else if (estatesCount >= 10 && estatesCount < 30) {
      estateFeature = "ADD_ESTATE_10_30";
    } else if (estatesCount >= 30 && estatesCount < 50) {
      estateFeature = "ADD_ESTATE_30_50";
    } else {
      estateFeature = "ADD_ESTATE_MORE_THAN_50";
    }

    const estatePrice = subscriptions.find(
      (sub) => sub.feature === estateFeature
    ).price;

    cost += estatePrice * estatesCount;
    accountData.allowedEstates = estatesCount;
  }

  if (maxEstatesInCompound) {
    let maxEstatesFeature = "MAX_ESTATES_IN_COMPOUND_3";
    accountData.maxEstatesInCompound = maxEstatesInCompound;

    if (maxEstatesInCompound > 3 && maxEstatesInCompound <= 10) {
      maxEstatesFeature = "MAX_ESTATES_IN_COMPOUND_10";
      accountData.maxEstatesInCompound = 10;
    } else if (maxEstatesInCompound > 10 && maxEstatesInCompound <= 30) {
      maxEstatesFeature = "MAX_ESTATES_IN_COMPOUND_30";
      accountData.maxEstatesInCompound = 30;
    } else if (maxEstatesInCompound > 30 && maxEstatesInCompound <= 50) {
      maxEstatesFeature = "MAX_ESTATES_IN_COMPOUND_50";
      accountData.maxEstatesInCompound = 50;
    } else {
      maxEstatesFeature = "MAX_ESTATES_IN_COMPOUND_300";
      accountData.maxEstatesInCompound = 300;
    }

    const maxEstatesPrice = subscriptions.find(
      (sub) => sub.feature === maxEstatesFeature
    ).price;

    cost += maxEstatesPrice;
  }

  if (!account.isFavoriteAllowed && isFavoriteAllowed) {
    const favoritePrice = subscriptions.find(
      (sub) => sub.feature === "FAVORITES"
    ).price;

    cost += favoritePrice;
    accountData.isFavoriteAllowed = true;
  }

  if (!account.isRemindersAllowed && isRemindersAllowed) {
    const remindersPrice = subscriptions.find(
      (sub) => sub.feature === "REMINDERS"
    ).price;

    cost += remindersPrice;
    accountData.isRemindersAllowed = true;
  }

  if (!cost) {
    return next(new ApiError("Invalid subscription", 400));
  }

  await Promise.all([
    Account.findByIdAndUpdate(id, accountData),

    ScheduledMission.create({
      account: id,
      accountOwner: account.owner,
      type: "SUBSCRIPTION_EXPIRATION",
      scheduledAt: expireDate,
    }),

    Purchase.create({
      account: id,
      amount: cost,
      type: "custom",
      customPackage: {
        usersCount,
        compoundsCount,
        estatesCount,
        maxEstatesInCompound,
        isFavoriteAllowed,
        isRemindersAllowed,
      },
    }),
  ]);

  res.status(200).json({
    status: "success",
    data: {
      subscriptionCost: cost,
    },
  });
});

exports.subscribeInPackage = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { packageId } = req.body;

  const [account, package] = await Promise.all([
    Account.findById(id)
      .select("owner isFavoriteAllowed isRemindersAllowed")
      .populate("owner", "name phone email")
      .lean(),
    Package.findById(packageId).select("features price duration").lean(),
    ScheduledMission.deleteOne({
      account: id,
      type: "SUBSCRIPTION_EXPIRATION",
      isDone: false,
    }),
  ]);

  if (!account) {
    return next(new ApiError("Account not found", 404));
  }

  if (account.owner._id.toString() !== req.user.id) {
    return next(new ApiError("Owner of the account can only subscribe", 403));
  }

  if (!package) {
    return next(new ApiError("Package not found", 404));
  }

  const features = package.features.reduce((acc, feature) => {
    acc[feature.label] = feature.value;
    return acc;
  }, {});

  const expireDate = new Date(
    Date.now() + package.duration * 30.25 * 24 * 60 * 60 * 1000 // 30 days + 6 hours
  );

  await Promise.all([
    Account.findByIdAndUpdate(id, {
      subscriptionEndDate: expireDate,

      allowedUsers: parseInt(features.allowedUsers) || 0,
      allowedCompounds: parseInt(features.allowedCompounds) || 0,
      allowedEstates: parseInt(features.allowedEstates) || 0,
      isFavoriteAllowed: Boolean(features.isFavoriteAllowed),
      isRemindersAllowed: Boolean(features.isRemindersAllowed),
      maxEstatesInCompound: parseInt(features.maxEstatesInCompound),
    }),

    ScheduledMission.create({
      account: id,
      accountOwner: account.owner,
      type: "SUBSCRIPTION_EXPIRATION",
      scheduledAt: expireDate,
    }),

    Purchase.create({
      account: id,
      amount: package.price,
      type: "package",
      package: packageId,
    }),
  ]);

  res.status(200).json({
    status: "success",
    data: {
      subscriptionCost: package.price,
    },
  });
});

exports.addMember = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const account = await Account.findById(id)
    .select("allowedUsers owner")
    .lean();

  if (!account) {
    return next(new ApiError("Account not found", 404));
  }

  if (account.owner.toString() !== req.user.id) {
    return next(new ApiError("Owner of the account can only add members", 403));
  }

  if (account.allowedUsers <= 0) {
    return next(new ApiError("Subscribe and get more users", 403));
  }

  const userData = {
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    password: req.body.password,
    account: id,
    permittedCompounds: req.body.permittedCompounds || [],
    permissions: req.body.permissions,
  };

  const user = await User.create(userData);

  const html = newMemberHtml(req.body.phone, req.body.password);

  await Promise.all([
    Account.findByIdAndUpdate(id, {
      $push: {
        members: {
          user: user._id,
          permissions: req.body.permissions,
          permittedCompounds: req.body.permittedCompounds || [],
        },
      },
      $inc: { allowedUsers: -1 },
    }),

    sendWAText(
      `966${req.body.phone}`,
      `Welcome to your new account on Diiwan.com. Your account has been created successfully. Your login credentials are as follows: \nPhone: ${req.body.phone}\nPassword: ${req.body.password}`
    ),

    sendEmail(
      req.body.email,
      "Welcome to Diiwan",
      `Welcome to your new account on Diiwan.com. Your account has been created successfully. Your login credentials are as follows: \nPhone: ${req.body.phone}\nPassword: ${req.body.password}`,
      html
    ),
  ]);

  res.status(201).json({
    status: "success",
    message: "Member added successfully",
  });
});

exports.updateMember = catchAsync(async (req, res, next) => {
  const { id, userId } = req.params;

  const account = await Account.findById(id).select("owner").lean();

  if (!account) {
    return next(new ApiError("Account not found", 404));
  }

  if (account.owner.toString() !== req.user.id) {
    return next(
      new ApiError("Owner of the account can only update members", 403)
    );
  }

  if (userId === account.owner.toString()) {
    return next(new ApiError("Owner of the account can't be updated", 403));
  }

  const [user] = await Promise.all([
    User.findOneAndUpdate(
      { _id: userId, account: id },
      {
        permissions: req.body.permissions,
        permittedCompounds: req.body.permittedCompounds || [],
      }
    ),

    Account.updateOne(
      { _id: id, "members.user": userId },
      {
        "members.$.permissions": req.body.permissions,
        "members.$.permittedCompounds": req.body.permittedCompounds || [],
      }
    ),
  ]);

  if (!user) {
    return next(new ApiError("Member not found", 404));
  }

  res.status(200).json({
    status: "success",
    message: "Member updated successfully",
  });
});

exports.deleteMember = catchAsync(async (req, res, next) => {
  const { id, userId } = req.params;

  const account = await Account.findById(id).select("owner").lean();

  if (!account) {
    return next(new ApiError("Account not found", 404));
  }

  if (account.owner.toString() !== req.user.id) {
    return next(
      new ApiError("Owner of the account can only delete members", 403)
    );
  }

  if (userId === account.owner.toString()) {
    return next(new ApiError("Owner of the account can't be deleted", 403));
  }

  const [user] = await Promise.all([
    User.findOneAndDelete({ _id: userId, account: id }),

    Account.findByIdAndUpdate(id, {
      $pull: { members: { user: userId } },
      $inc: { allowedUsers: 1 },
    }),
  ]);

  if (!user) {
    return next(new ApiError("Member not found", 404));
  }

  res.status(204).json({
    status: "success",
    message: "Member deleted successfully",
  });
});
