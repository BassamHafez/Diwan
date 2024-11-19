const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");
const favoriteController = require("../controllers/favoriteController");
const favoriteValidator = require("../utils/validators/favoriteValidator");

router.use(authController.protect);

router
  .route("/")
  .get(
    favoriteController.filterUserFavorites,
    favoriteController.getAllFavorites
  )
  .post(
    favoriteValidator.favoriteEstateValidator,
    favoriteController.setUserId,
    favoriteController.favoriteEstate
  );

router
  .route("/:id")
  .delete(
    favoriteValidator.unFavoriteEstateValidator,
    favoriteController.unfavoriteEstate
  );

module.exports = router;
