const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");
const serviceContactController = require("../controllers/serviceContactController");
const contactValidator = require("../utils/validators/contactValidator");
const { filterUserResults, setUserId } = require("../utils/requestUtils");

router.use(authController.protect);

router
  .route("/")
  .get(filterUserResults, serviceContactController.getAllServiceContacts)
  .post(
    contactValidator.createContactValidator,
    setUserId,
    serviceContactController.createServiceContact
  );

router
  .route("/:id")
  .get(
    contactValidator.getContactValidator,
    serviceContactController.getServiceContact
  )
  .patch(
    contactValidator.updateContactValidator,
    serviceContactController.updateServiceContact
  )
  .delete(
    contactValidator.getContactValidator,
    serviceContactController.deleteServiceContact
  );

module.exports = router;
