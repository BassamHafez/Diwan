const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");
const estateController = require("../controllers/estateController");
const estateValidator = require("../utils/validators/estateValidator");

router.use(authController.protect);

router
  .route("/")
  .get(estateController.filterUserEstates, estateController.getAllEstates)
  .post(
    estateController.uploadEstateImage,
    estateController.resizeEstateImage,
    estateValidator.createEstateValidator,
    estateController.setUserId,
    estateController.createEstate
  );

router
  .route("/:id")
  .get(estateValidator.getEstateValidator, estateController.getEstate)
  .patch(
    estateController.uploadEstateImage,
    estateController.resizeEstateImage,
    estateValidator.updateEstateValidator,
    estateController.updateEstate
  )
  .delete(estateValidator.getEstateValidator, estateController.deleteEstate);

module.exports = router;
