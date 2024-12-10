const { check } = require("express-validator");
const validatorMiddleware = require("./validatorMiddleware");

exports.getUserValidator = [
  check("id")
    .notEmpty()
    .withMessage("User ID is required")
    .isMongoId()
    .withMessage("User ID must be a valid MongoDB ID"),

  validatorMiddleware,
];

exports.updateMeValidator = [
  check("name").optional().isString().withMessage("Name must be a string"),

  check("email")
    .optional()
    .isEmail()
    .withMessage("Email must be a valid email"),

  check("phone")
    .optional()
    .isLength({ min: 10 })
    .withMessage("Invalid phone number")
    .isMobilePhone("ar-SA")
    .withMessage("Invalid Saudi phone number"),

  // NOT ALLOWED

  check("role").isEmpty().withMessage("Role cannot be set"),

  check("phoneVerified")
    .isEmpty()
    .withMessage("Phone verification cannot be set"),

  check("passwordResetCode")
    .isEmpty()
    .withMessage("Password reset code cannot be set here"),

  validatorMiddleware,
];

exports.updatePasswordValidator = [
  check("currentPassword")
    .notEmpty()
    .withMessage("Current password is required")
    .isString()
    .withMessage("Current password must be a string"),

  check("newPassword")
    .notEmpty()
    .withMessage("New password is required")
    .isString()
    .withMessage("New password must be a string")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 8 characters long"),

  check("passwordConfirm")
    .notEmpty()
    .withMessage("Password confirm is required")
    .isString()
    .withMessage("Password confirm must be a string")
    .custom((value, { req }) => {
      if (value !== req.body.newPassword) {
        throw new Error("Passwords do not match");
      }
      return true;
    }),

  validatorMiddleware,
];

exports.verifyPhoneValidator = [
  check("verificationCode")
    .notEmpty()
    .withMessage("Verification code is required")
    .isString()
    .withMessage("Verification code must be a string"),

  validatorMiddleware,
];
