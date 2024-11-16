const { check } = require("express-validator");
const validatorMiddleware = require("./validatorMiddleware");

exports.createContactValidator = [
  check("name")
    .notEmpty()
    .withMessage("Name is required")
    .isString()
    .withMessage("Name must be a string")
    .trim(),

  check("phone")
    .notEmpty()
    .withMessage("Phone number required")
    .isLength({ min: 10 })
    .withMessage("Invalid phone number")
    .isMobilePhone("ar-SA")
    .withMessage("Invalid Saudi phone number"),

  check("phone2")
    .optional()
    .isLength({ min: 10 })
    .withMessage("Invalid phone number")
    .isMobilePhone("ar-SA")
    .withMessage("Invalid Saudi phone number"),

  check("type")
    .notEmpty()
    .withMessage("Type is required")
    .isString()
    .withMessage("Type must be a string")
    .isIn(["broker", "tenant", "landlord", "service"])
    .withMessage("Invalid type (broker, tenant, landlord, service)"),

  // NOT ALLOWED

  check("user").isEmpty().withMessage("User cannot be set"),

  validatorMiddleware,
];

exports.updateContactValidator = [
  check("id")
    .notEmpty()
    .withMessage("Contact ID is required")
    .isMongoId()
    .withMessage("Invalid Contact ID"),

  check("name")
    .optional()
    .isString()
    .withMessage("Name must be a string")
    .trim(),

  check("phone")
    .optional()
    .isLength({ min: 10 })
    .withMessage("Invalid phone number")
    .isMobilePhone("ar-SA")
    .withMessage("Invalid Saudi phone number"),

  check("phone2")
    .optional()
    .isLength({ min: 10 })
    .withMessage("Invalid phone number")
    .isMobilePhone("ar-SA")
    .withMessage("Invalid Saudi phone number"),

  check("type")
    .optional()
    .isString()
    .withMessage("Type must be a string")
    .isIn(["broker", "tenant", "landlord", "service"])
    .withMessage("Invalid type (broker, tenant, landlord, service)"),

  // NOT ALLOWED

  check("user").isEmpty().withMessage("User cannot be set"),

  validatorMiddleware,
];

exports.getContactValidator = [
  check("id")
    .notEmpty()
    .withMessage("Contact ID is required")
    .isMongoId()
    .withMessage("Invalid Contact ID"),

  validatorMiddleware,
];
