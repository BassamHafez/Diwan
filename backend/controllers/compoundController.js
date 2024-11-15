const { v4: uuidv4 } = require("uuid");
const sharp = require("sharp");

const Compound = require("../models/compoundModel");
const catchAsync = require("../utils/catchAsync");
const ApiError = require("../utils/ApiError");
const factory = require("./handlerFactory");
const { uploadSingleImage } = require("../utils/uploadImage");

exports.setUserId = (req, res, next) => {
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

exports.filterUserCompounds = (req, res, next) => {
  if (req.user.role !== "admin") req.query.user = req.user.id;
  next();
};

exports.getAllCompounds = factory.getAll(Compound);
exports.getCompound = factory.getOne(Compound);

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

exports.createCompound = factory.createOne(Compound);
exports.updateCompound = factory.updateOne(Compound);
exports.deleteCompound = factory.deleteOne(Compound);
