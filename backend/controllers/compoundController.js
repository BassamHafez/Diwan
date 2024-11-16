const { v4: uuidv4 } = require("uuid");
const sharp = require("sharp");

const Compound = require("../models/compoundModel");
const Estate = require("../models/estateModel");
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

exports.deleteCompound = catchAsync(async (req, res, next) => {
  const compound = await Compound.findById(req.params.id);

  if (!compound) {
    return next(new ApiError("No compound found with that ID", 404));
  }

  const estates = await Estate.find({ compound: compound._id });

  if (estates.length > 0) {
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
