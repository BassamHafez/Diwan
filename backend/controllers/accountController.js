const Account = require("../models/accountModel");
const User = require("../models/userModel");
const Package = require("../models/packageModel");
const Subscription = require("../models/subscriptionModel");
const Purchase = require("../models/purchaseModel");
const factory = require("./handlerFactory");
const catchAsync = require("../utils/catchAsync");
const ApiError = require("../utils/ApiError");

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
  } = req.body;
  let cost = 0;

  const [account, subscriptions] = await Promise.all([
    Account.findById(id).select("owner isFavoriteAllowed").lean(),
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
  }

  if (maxEstatesInCompound) {
    let maxEstatesFeature = "MAX_ESTATES_IN_COMPOUND_3";

    if (maxEstatesInCompound > 3 && maxEstatesInCompound <= 10) {
      maxEstatesFeature = "MAX_ESTATES_IN_COMPOUND_10";
    } else if (maxEstatesInCompound > 10 && maxEstatesInCompound <= 30) {
      maxEstatesFeature = "MAX_ESTATES_IN_COMPOUND_30";
    } else {
      maxEstatesFeature = "MAX_ESTATES_IN_COMPOUND_50";
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
  }

  if (!cost) {
    return next(new ApiError("Invalid subscription", 400));
  }

  await Promise.all([
    Account.findByIdAndUpdate(id, {
      $inc: {
        allowedUsers: usersCount || 0,
        allowedCompounds: compoundsCount || 0,
        allowedEstates: estatesCount || 0,
      },
      maxEstatesInCompound:
        maxEstatesInCompound || account.maxEstatesInCompound,
      isFavoriteAllowed: isFavoriteAllowed || account.isFavoriteAllowed,
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
    Account.findById(id).select("owner isFavoriteAllowed").lean(),
    Package.findById(packageId).select("features price").lean(),
  ]);

  if (!account) {
    return next(new ApiError("Account not found", 404));
  }

  if (account.owner.toString() !== req.user.id) {
    return next(new ApiError("Owner of the account can only subscribe", 403));
  }

  if (!package) {
    return next(new ApiError("Package not found", 404));
  }

  const features = package.features.reduce((acc, feature) => {
    acc[feature.label] = feature.value;
    return acc;
  }, {});

  await Promise.all([
    Account.findByIdAndUpdate(id, {
      $inc: {
        allowedUsers: parseInt(features.allowedUsers) || 0,
        allowedCompounds: parseInt(features.allowedCompounds) || 0,
        allowedEstates: parseInt(features.allowedEstates) || 0,
      },
      isFavoriteAllowed:
        Boolean(features.isFavoriteAllowed) || account.isFavoriteAllowed,
      maxEstatesInCompound:
        parseInt(features.maxEstatesInCompound) || account.maxEstatesInCompound,
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

  await Account.findByIdAndUpdate(id, {
    $push: {
      members: {
        user: user._id,
        permissions: req.body.permissions,
        permittedCompounds: req.body.permittedCompounds || [],
      },
    },
    $inc: { allowedUsers: -1 },
  });

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
