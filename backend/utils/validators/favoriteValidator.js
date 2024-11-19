const { check } = require("express-validator");
const validatorMiddleware = require("./validatorMiddleware");

exports.favoriteEstateValidator = [
  check("estate")
    .notEmpty()
    .withMessage("Estate ID is required")
    .isMongoId()
    .withMessage("Invalid Estate ID"),

  validatorMiddleware,
];

exports.unFavoriteEstateValidator = [
  check("id")
    .notEmpty()
    .withMessage("Favorite ID is required")
    .isMongoId()
    .withMessage("Invalid Favorite ID"),

  validatorMiddleware,
];
