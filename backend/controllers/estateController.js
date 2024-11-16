const { v4: uuidv4 } = require("uuid");
const sharp = require("sharp");

const Estate = require("../models/estateModel");
const catchAsync = require("../utils/catchAsync");
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

exports.createEstate = factory.createOne(Estate);
exports.updateEstate = factory.updateOne(Estate);
exports.deleteEstate = factory.deleteOne(Estate);
