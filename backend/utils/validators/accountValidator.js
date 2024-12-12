const { check } = require("express-validator");
const validatorMiddleware = require("./validatorMiddleware");

const userAccessPermissions = [
  "FAVORITES",
  "ADD_COMPOUND",
  "UPDATE_COMPOUND",
  "DELETE_COMPOUND",
  "ADD_ESTATE",
  "UPDATE_ESTATE",
  "DELETE_ESTATE",
  "ADD_CONTRACT",
  "UPDATE_CONTRACT",
  "DELETE_CONTRACT",
  "CANCEL_CONTRACT",
  "ADD_REVENUE",
  "UPDATE_REVENUE",
  "DELETE_REVENUE",
  "CANCEL_REVENUE",
  "PAY_REVENUE",
  "UNPAY_REVENUE",
  "ADD_EXPENSE",
  "UPDATE_EXPENSE",
  "DELETE_EXPENSE",
  "CANCEL_EXPENSE",
  "PAY_EXPENSE",
  "UNPAY_EXPENSE",
  "ADD_CONTACT",
  "UPDATE_CONTACT",
  "DELETE_CONTACT",
  "ADD_TASK",
  "UPDATE_TASK",
  "DELETE_TASK",
  "COMPLETE_TASK",
  "UPDATE_ACCOUNT",
];

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

  check("region")
    .notEmpty()
    .withMessage("Region is required")
    .isString()
    .withMessage("Region must be a string"),

  check("city")
    .notEmpty()
    .withMessage("City is required")
    .isString()
    .withMessage("City must be a string"),

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

exports.addMemberValidator = [
  check("id")
    .exists()
    .withMessage("Account ID is required")
    .isMongoId()
    .withMessage("Invalid account ID"),

  check("name")
    .notEmpty()
    .withMessage("User name required")
    .isString()
    .withMessage("Invalid user name")
    .isLength({ min: 3 })
    .withMessage("Too short User name"),

  check("email")
    .notEmpty()
    .withMessage("Email required")
    .isEmail()
    .withMessage("Invalid email address"),

  check("phone")
    .notEmpty()
    .withMessage("Phone number required")
    .isLength({ min: 10 })
    .withMessage("Invalid phone number")
    .isMobilePhone("ar-SA")
    .withMessage("Invalid Saudi phone number"),

  check("password")
    .notEmpty()
    .withMessage("Password required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),

  check("permissions")
    .exists()
    .withMessage("Permissions required")
    .isArray({ min: 1 })
    .withMessage("Permissions must be an array with at least one permission"),

  check("permissions.*")
    .isString()
    .withMessage("Permission must be a string")
    .notEmpty()
    .withMessage("Permission cannot be empty")
    .isIn(userAccessPermissions)
    .withMessage((value) => `Invalid permission: ${value}`),

  validatorMiddleware,
];
