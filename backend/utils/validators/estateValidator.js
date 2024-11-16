const { check } = require("express-validator");
const validatorMiddleware = require("./validatorMiddleware");

exports.createEstateValidator = [
  check("compound").optional().isMongoId().withMessage("Invalid compound ID"),

  check("name")
    .notEmpty()
    .withMessage("Name is required")
    .trim()
    .isString()
    .withMessage("Name must be a string")
    .isLength({ min: 3 })
    .withMessage("Name must be at least 3 characters long"),

  check("description")
    .notEmpty()
    .withMessage("Description is required")
    .trim()
    .isString()
    .withMessage("Description must be a string")
    .isLength({ min: 5 })
    .withMessage("Description must be at least 5 characters long"),

  check("address")
    .optional()
    .trim()
    .isString()
    .withMessage("Address must be a string"),

  check("region")
    .if((value, { req }) => !req.body.compound)
    .notEmpty()
    .withMessage("Region is required")
    .trim()
    .isString()
    .withMessage("Region must be a string"),

  check("city")
    .if((value, { req }) => !req.body.compound)
    .notEmpty()
    .withMessage("City is required")
    .trim()
    .isString()
    .withMessage("City must be a string"),

  check("neighborhood")
    .optional()
    .trim()
    .isString()
    .withMessage("Neighborhood must be a string"),

  check("price")
    .notEmpty()
    .withMessage("Price is required")
    .isNumeric()
    .withMessage("Price must be a number")
    .isInt({ min: 1 })
    .withMessage("Price must be a positive number"),

  check("area")
    .notEmpty()
    .withMessage("Area is required")
    .isNumeric()
    .withMessage("Area must be a number")
    .isInt({ min: 1 })
    .withMessage("Area must be a positive number"),

  check("tags").optional().isArray().withMessage("Tags must be an array"),

  check("tags.*").isString().withMessage("Tags must be strings"),

  check("electricityAccountNumber")
    .optional()
    .isString()
    .withMessage("Electricity account number must be a string of 11 digits")
    .matches(/^\d{11}$/)
    .withMessage("Electricity account number must be a string of 11 digits"),

  check("waterAccountNumber")
    .optional()
    .isString()
    .withMessage("Water account number must be a string of 10 digits")
    .matches(/^\d{10}$/)
    .withMessage("Water account number must be a string of 10 digits"),

  check("broker").optional().isMongoId().withMessage("Invalid broker ID"),

  check("landlord").optional().isMongoId().withMessage("Invalid landlord ID"),

  // NOT ALLOWED

  check("user").isEmpty().withMessage("User cannot be set manually"),

  validatorMiddleware,
];

exports.updateEstateValidator = [
  check("id")
    .notEmpty()
    .withMessage("Estate ID is required")
    .isMongoId()
    .withMessage("Invalid estate ID"),

  check("name")
    .optional()
    .trim()
    .isString()
    .withMessage("Name must be a string")
    .isLength({ min: 3 })
    .withMessage("Name must be at least 3 characters long"),

  check("description")
    .optional()
    .trim()
    .isString()
    .withMessage("Description must be a string")
    .isLength({ min: 5 })
    .withMessage("Description must be at least 5 characters long"),

  check("address")
    .optional()
    .trim()
    .isString()
    .withMessage("Address must be a string"),

  check("region")
    .optional()
    .trim()
    .isString()
    .withMessage("Region must be a string"),

  check("city")
    .optional()
    .trim()
    .isString()
    .withMessage("City must be a string"),

  check("neighborhood")
    .optional()
    .trim()
    .isString()
    .withMessage("Neighborhood must be a string"),

  check("price")
    .optional()
    .isNumeric()
    .withMessage("Price must be a number")
    .isInt({ min: 1 })
    .withMessage("Price must be a positive number"),

  check("area")
    .optional()
    .isNumeric()
    .withMessage("Area must be a number")
    .isInt({ min: 1 })
    .withMessage("Area must be a positive number"),

  check("tags").optional().isArray().withMessage("Tags must be an array"),

  check("tags.*").isString().withMessage("Tags must be strings"),

  check("electricityAccountNumber")
    .optional()
    .isString()
    .withMessage("Electricity account number must be a string of 11 digits")
    .matches(/^\d{11}$/)
    .withMessage("Electricity account number must be a string of 11 digits"),

  check("waterAccountNumber")
    .optional()
    .isString()
    .withMessage("Water account number must be a string of 10 digits")
    .matches(/^\d{10}$/)
    .withMessage("Water account number must be a string of 10 digits"),

  check("broker").optional().isMongoId().withMessage("Invalid broker ID"),

  check("landlord").optional().isMongoId().withMessage("Invalid landlord ID"),

  // NOT ALLOWED

  check("user").isEmpty().withMessage("User cannot be set manually"),

  check("compound").isEmpty().withMessage("Compound cannot be edited"),

  validatorMiddleware,
];

exports.getEstateValidator = [
  check("id")
    .notEmpty()
    .withMessage("Estate ID is required")
    .isMongoId()
    .withMessage("Invalid estate ID"),

  validatorMiddleware,
];
