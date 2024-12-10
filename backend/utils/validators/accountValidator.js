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

exports.updateAccountValidator = [
  check("id")
    .exists()
    .withMessage("Account ID is required")
    .isMongoId()
    .withMessage("Invalid account ID"),

  check("name")
    .notEmpty()
    .withMessage("Name is required")
    .isString()
    .withMessage("Name must be a string"),

  check("phone")
    .notEmpty()
    .withMessage("Phone number required")
    .isLength({ min: 10 })
    .withMessage("Invalid phone number")
    .isMobilePhone("ar-SA")
    .withMessage("Invalid Saudi phone number"),

  check("address")
    .notEmpty()
    .withMessage("Address is required")
    .isString()
    .withMessage("Address must be a string"),

  check("commercialRecord")
    .optional()
    .isString()
    .withMessage("Commercial record must be a string")
    .matches(/^\d{10}$/)
    .withMessage("Invalid commercial record"),

  check("taxNumber")
    .optional()
    .isString()
    .withMessage("Tax number must be a string")
    .matches(/^\d{15}$/)
    .withMessage("Invalid tax number"),

  // NOT ALLOWED

  check("owner").not().exists().withMessage("Owner is not allowed"),

  check("members").not().exists().withMessage("Members are not allowed"),

  check("allowedUsers")
    .not()
    .exists()
    .withMessage("Allowed users are not allowed"),

  check("allowedCompounds")
    .not()
    .exists()
    .withMessage("Allowed compounds are not allowed"),

  check("isFavoriteAllowed")
    .not()
    .exists()
    .withMessage("Favorite allowed is not allowed"),

  validatorMiddleware,
];
