const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");
const compoundController = require("../controllers/compoundController");
const compoundValidator = require("../utils/validators/compoundValidator");
const { filterUserResults, setUserId } = require("../utils/requestUtils");

router.use(authController.protect);

router
  .route("/")
  .get(filterUserResults, compoundController.getAllCompounds)
  .post(
    compoundController.uploadCompoundImage,
    compoundController.resizeCompoundImage,
    compoundValidator.createCompoundValidator,
    setUserId,
    compoundController.createCompound
  );

router
  .route("/:id")
  .get(compoundValidator.getCompoundValidator, compoundController.getCompound)
  .patch(
    compoundController.uploadCompoundImage,
    compoundController.resizeCompoundImage,
    compoundValidator.updateCompoundValidator,
    compoundController.updateCompound
  )
  .delete(
    compoundValidator.getCompoundValidator,
    compoundController.deleteCompound
  );

module.exports = router;
