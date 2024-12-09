const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");
const landlordContactController = require("../controllers/landlordContactController");
const contactValidator = require("../utils/validators/contactValidator");
const { setAccountId, filterAccountResults } = require("../utils/requestUtils");

router.use(authController.protect);

router
  .route("/")
  .get(filterAccountResults, landlordContactController.getAllLandlordContacts)
  .post(
    contactValidator.createContactValidator,
    setAccountId,
    authController.checkPermission("ADD_CONTACT"),
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
    authController.checkPermission("UPDATE_CONTACT"),
    landlordContactController.updateLandlordContact
  )
  .delete(
    contactValidator.getContactValidator,
    authController.checkPermission("DELETE_CONTACT"),
    landlordContactController.deleteLandlordContact
  );

module.exports = router;
