const crypto = require("crypto");
const sharp = require("sharp");
const { uploadSingleImage } = require("../utils/uploadImage");
const { sendWAText } = require("../utils/sendWAMessage");

const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");
const ApiError = require("../utils/ApiError");
const factory = require("./handlerFactory");

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });

  return newObj;
};

const accountPopOptions = [
  {
    path: "account",
    select: "name phone address region city",
  },
];

const userSelectedFields = "-permissions -permittedCompounds";

exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

exports.deleteUser = factory.deleteOne(User);
exports.getAllUsers = factory.getAll(User, [], userSelectedFields);
exports.getUser = factory.getOne(User, accountPopOptions, userSelectedFields);

exports.uploadUserPhoto = uploadSingleImage("photo");

exports.resizeUserPhoto = catchAsync(async (req, res, next) => {
  if (!req.file) return next();

  req.file.filename = `user-${req.user.id}-${Date.now()}.png`;

  await sharp(req.file.buffer)
    // .resize(500, 500)
    .toFormat("png")
    .png({ quality: 98 })
    .toFile(`uploads/users/${req.file.filename}`);

  req.body.photo = `/users/${req.file.filename}`;

  next();
});

exports.updateMe = catchAsync(async (req, res, next) => {
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new ApiError(
        "This route is not for password updates. Please use /updateMyPassword",
        400
      )
    );
  }

  const filteredBody = filterObj(req.body, "name", "email", "photo", "phone");
  if (req.body?.photo) {
    filteredBody.photo = req.body.photo;
  }

  if (req.body?.phone && req.user.role !== "admin") {
    filteredBody.phoneVerified = false;
  }

  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: "success",
    data: updatedUser,
  });
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("+password");

  if (!(await user.correctPassword(req.body.currentPassword, user.password))) {
    return next(new ApiError("current password is wrong", 401));
  }

  user.password = req.body.newPassword;
  await user.save();

  res.status(200).json({
    status: "success",
    message: "Password updated successfully",
  });
});

exports.getPhoneWACode = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  const verificationCode = Math.floor(
    100000 + Math.random() * 900000
  ).toString();
  const hashedVerificationCode = crypto
    .createHash("sha256")
    .update(verificationCode)
    .digest("hex");

  user.phoneVerificationCode = hashedVerificationCode;

  await Promise.all([
    user.save(),
    sendWAText(
      `966${user.phone}`,
      `Your verification code is ${verificationCode}`
    ),
  ]);

  res.status(200).json({
    status: "success",
    message: "Verification code sent to your whatsapp",
  });
});

exports.verifyPhone = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  const hashedVerificationCode = crypto
    .createHash("sha256")
    .update(req.body.verificationCode)
    .digest("hex");

  if (user.phoneVerificationCode !== hashedVerificationCode) {
    return next(new ApiError("Verification code is wrong", 400));
  }

  user.phoneVerificationCode = undefined;
  user.phoneVerified = true;

  await user.save();

  res.status(200).json({
    status: "success",
    message: "Phone verified successfully",
  });
});

exports.addAdmin = catchAsync(async (req, res, next) => {
  const adminData = {
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    password: req.body.password,
    role: "admin",
    phoneVerified: true,
  };

  await User.create(adminData);

  res.status(201).json({
    status: "success",
    message: "Admin added successfully",
  });
});
