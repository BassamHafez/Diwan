const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");
const contactController = require("../controllers/contactController");
const contactValidator = require("../utils/validators/contactValidator");

router.use(authController.protect);

router
  .route("/")
  .get(contactController.filterUserContacts, contactController.getAllContacts)
  .post(
    contactValidator.createContactValidator,
    contactController.setUserId,
    contactController.createContact
  );

router
  .route("/:id")
  .get(contactValidator.getContactValidator, contactController.getContact)
  .patch(
    contactValidator.updateContactValidator,
    contactController.updateContact
  )
  .delete(
    contactValidator.getContactValidator,
    contactController.deleteContact
  );

module.exports = router;
