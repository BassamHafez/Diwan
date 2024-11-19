const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");
const favoriteController = require("../controllers/favoriteController");
const favoriteValidator = require("../utils/validators/favoriteValidator");
const { filterUserResults, setUserId } = require("../utils/requestUtils");

router.use(authController.protect);

router
  .route("/")
  .get(filterUserResults, favoriteController.getAllFavorites)
  .post(
    favoriteValidator.favoriteEstateValidator,
    setUserId,
    favoriteController.favoriteEstate
  );

router
  .route("/:id")
  .delete(
    favoriteValidator.unFavoriteEstateValidator,
    favoriteController.unfavoriteEstate
  );

module.exports = router;
