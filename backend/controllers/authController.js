const { promisify } = require("util");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Account = require("../models/accountModel");
const User = require("../models/userModel");
const Tag = require("../models/tagModel");
const catchAsync = require("../utils/catchAsync");
const ApiError = require("../utils/ApiError");

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);

  // Remove password from output
  user.password = undefined;

  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const userId = new mongoose.Types.ObjectId();
  const accountId = new mongoose.Types.ObjectId();

  const userData = {
    _id: userId,
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    password: req.body.password,
    // accounts: [
    //   {
    //     account: accountId,
    //   },
    // ],
    account: accountId,
  };

  const accountData = {
    _id: accountId,
    owner: userId,
    members: [
      {
        user: userId,
      },
    ],
  };

  const [newUser, _] = await Promise.all([
    User.create(userData),
    Tag.create({ user: userId }),
    Account.create(accountData),
  ]);

  createSendToken(newUser, 201, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { phone, password } = req.body;

  if (!phone || !password) {
    return next(new ApiError("Please provide email and password!", 400));
  }

  const user = await User.findOne({ phone }).select("+password");

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new ApiError("Incorrect phone or password", 401));
  }

  createSendToken(user, 200, res);
});

exports.protect = catchAsync(async (req, res, next) => {
  // 1) Getting token and check of it's there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(
      new ApiError("You are not logged in! Please log in to get access.", 401)
    );
  }

  // 2) Verification token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // 3) Check if user still exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new ApiError(
        "The user belonging to this token does no longer exist.",
        401
      )
    );
  }

  // 4) Check if user changed password after the token was issued
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new ApiError("User recently changed password! Please log in again.", 401)
    );
  }

  // GRANT ACCESS TO PROTECTED ROUTE
  req.user = currentUser;
  next();
});

exports.restrictTo =
  (...roles) =>
  (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ApiError("You do not have permission to perform this action", 403)
      );
    }

    next();
  };

exports.checkPermission = (requiredPermission) => (req, res, next) => {
  const { user } = req;

  if (!user.account) {
    return next(new ApiError("Access denied: Account not found", 403));
  }

  if (!user.permissions.includes(requiredPermission)) {
    return next(new ApiError("Access denied: Missing permission", 403));
  }

  next();
};
