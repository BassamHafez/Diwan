const { v4: uuidv4 } = require("uuid");
const sharp = require("sharp");

const Estate = require("../models/estateModel");
const Compound = require("../models/compoundModel");
const Tag = require("../models/tagModel");
const catchAsync = require("../utils/catchAsync");
const ApiError = require("../utils/ApiError");
const factory = require("./handlerFactory");
const { uploadSingleImage } = require("../utils/uploadImage");

const estatesPopOptions = [
  {
    path: "compound",
    select: "name address region city neighborhood image",
  },
];

const estatePopOptions = [
  {
    path: "compound",
    select: "name address region city neighborhood image",
  },
  {
    path: "broker",
    select: "name phone phone2 type",
  },
  {
    path: "landlord",
    select: "name phone phone2 type",
  },
];

exports.getAllEstates = factory.getAll(Estate, estatesPopOptions);
exports.getEstate = factory.getOne(Estate, estatePopOptions);
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
  const { tags } = req.body;

  if (req.body.compound) {
    const compound = await Compound.findById(req.body.compound);

    if (!compound) {
      return next(new ApiError("No compound found with that ID", 404));
    }

    req.body.region = compound.region;
    req.body.city = compound.city;
    if (compound.neighborhood) req.body.neighborhood = compound.neighborhood;
    if (compound.broker) req.body.broker = compound.broker;
    if (compound.landlord) req.body.landlord = compound.landlord;
  }

  const estateCreatePromise = Estate.create(req.body);

  const tagUpdatePromise = tags
    ? Tag.findOneAndUpdate(
        { user: req.user._id },
        { $addToSet: { tags: { $each: tags } } },
        { upsert: true, lean: true }
      )
    : Promise.resolve();

  const [_, estate] = await Promise.all([
    tagUpdatePromise,
    estateCreatePromise,
  ]);

  res.status(201).json({
    status: "success",
    data: estate,
  });
});

exports.updateEstate = catchAsync(async (req, res, next) => {
  const estate = await Estate.findById(req.params.id);
  const { tags } = req.body;

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

  const estateUpdatePromise = Estate.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );

  const tagUpdatePromise = tags
    ? Tag.findOneAndUpdate(
        { user: req.user._id },
        { $addToSet: { tags: { $each: tags } } },
        { upsert: true, lean: true }
      )
    : Promise.resolve();

  const [_, updatedEstate] = await Promise.all([
    tagUpdatePromise,
    estateUpdatePromise,
  ]);

  if (!updatedEstate) {
    return next(new ApiError("No estate found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: updatedEstate,
  });
});

// Favorites

exports.favoriteEstate = catchAsync(async (req, res, next) => {
  const estate = await Estate.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    { inFavorites: true }
  );

  if (!estate) {
    return next(new ApiError("No estate found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    message: "Estate added to favorites",
  });
});

exports.unfavoriteEstate = catchAsync(async (req, res, next) => {
  const estate = await Estate.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    { inFavorites: false }
  );

  if (!estate) {
    return next(new ApiError("No estate found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    message: "Estate removed from favorites",
  });
});
