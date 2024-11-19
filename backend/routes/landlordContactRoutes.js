const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");
const landlordContactController = require("../controllers/landlordContactController");
const contactValidator = require("../utils/validators/contactValidator");
const { filterUserResults, setUserId } = require("../utils/requestUtils");

router.use(authController.protect);

router
  .route("/")
  .get(filterUserResults, landlordContactController.getAllLandlordContacts)
  .post(
    contactValidator.createContactValidator,
    setUserId,
    landlordContactController.createLandlordContact
  );

router
  .route("/:id")
  .get(
    contactValidator.getContactValidator,
    landlordContactController.getLandlordContact
  )
  .patch(
    contactValidator.updateContactValidator,
    landlordContactController.updateLandlordContact
  )
  .delete(
    contactValidator.getContactValidator,
    landlordContactController.deleteLandlordContact
  );

module.exports = router;
