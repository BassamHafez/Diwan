const { check } = require("express-validator");
const validatorMiddleware = require("./validatorMiddleware");

exports.subscribeValidator = [
  check("id")
    .exists()
    .withMessage("Account ID is required")
    .isMongoId()
    .withMessage("Invalid account ID"),

  check("usersCount")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Invalid users count"),

  check("compoundsCount")
    .exists()
    .withMessage("Compounds count is required")
    .isInt({ min: 1 })
    .withMessage("Invalid compounds count"),

  check("isFavoriteAllowed")
    .exists()
    .withMessage("Favorite allowed is required")
    .isBoolean()
    .withMessage("Invalid favorite allowed"),

  validatorMiddleware,
];
