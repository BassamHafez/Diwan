const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");
const contactController = require("../controllers/contactController");
const contactValidator = require("../utils/validators/contactValidator");
const { filterUserResults, setUserId } = require("../utils/requestUtils");

router.use(authController.protect);

router
  .route("/")
  .get(filterUserResults, contactController.getAllContacts)
  .post(
    contactValidator.createContactValidator,
    setUserId,
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
