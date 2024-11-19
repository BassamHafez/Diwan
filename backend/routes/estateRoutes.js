const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");
const estateController = require("../controllers/estateController");
const estateValidator = require("../utils/validators/estateValidator");
const { filterUserResults, setUserId } = require("../utils/requestUtils");

router.use(authController.protect);

// Favorites

router
  .route("/:id/favorites")
  .post(
    estateValidator.getEstateValidator,
    setUserId,
    estateController.favoriteEstate
  )
  .delete(
    estateValidator.getEstateValidator,
    estateController.unfavoriteEstate
  );

router
  .route("/")
  .get(filterUserResults, estateController.getAllEstates)
  .post(
    estateController.uploadEstateImage,
    estateController.resizeEstateImage,
    estateValidator.createEstateValidator,
    setUserId,
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
