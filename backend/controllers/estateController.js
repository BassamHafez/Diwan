const { v4: uuidv4 } = require("uuid");
const sharp = require("sharp");

const Estate = require("../models/estateModel");
const Compound = require("../models/compoundModel");
const catchAsync = require("../utils/catchAsync");
const ApiError = require("../utils/ApiError");
const factory = require("./handlerFactory");
const { uploadSingleImage } = require("../utils/uploadImage");

exports.setUserId = (req, res, next) => {
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

exports.filterUserEstates = (req, res, next) => {
  if (req.user.role !== "admin") req.query.user = req.user.id;
  next();
};

const compoundPopOptions = [
  {
    path: "compound",
    select: "name address region city neighborhood image",
  },
];

exports.getAllEstates = factory.getAll(Estate, compoundPopOptions);
exports.getEstate = factory.getOne(Estate, compoundPopOptions);
exports.deleteEstate = factory.deleteOne(Estate);

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
  let estate;

  if (!req.body.compound) {
    estate = await Estate.create(req.body);
  } else {
    const compound = await Compound.findById(req.body.compound);

    if (!compound) {
      return next(new ApiError("No compound found with that ID", 404));
    }

    req.body.region = compound.region;
    req.body.city = compound.city;
    if (compound.neighborhood) req.body.neighborhood = compound.neighborhood;
    if (compound.broker) req.body.broker = compound.broker;
    if (compound.landlord) req.body.landlord = compound.landlord;

    estate = await Estate.create(req.body);
  }

  res.status(201).json({
    status: "success",
    data: estate,
  });
});

exports.updateEstate = catchAsync(async (req, res, next) => {
  const estate = await Estate.findById(req.params.id);

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

  const updatedEstate = await Estate.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );

  res.status(200).json({
    status: "success",
    data: updatedEstate,
  });
});
