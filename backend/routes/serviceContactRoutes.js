const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");
const serviceContactController = require("../controllers/serviceContactController");
const contactValidator = require("../utils/validators/contactValidator");
const { setAccountId, filterAccountResults } = require("../utils/requestUtils");

router.use(authController.protect);

router
  .route("/")
  .get(filterAccountResults, serviceContactController.getAllServiceContacts)
  .post(
    contactValidator.createContactValidator,
    setAccountId,
    authController.checkPermission("ADD_CONTACT"),
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
    authController.checkPermission("UPDATE_CONTACT"),
    serviceContactController.updateServiceContact
  )
  .delete(
    contactValidator.getContactValidator,
    authController.checkPermission("DELETE_CONTACT"),
    serviceContactController.deleteServiceContact
  );

module.exports = router;
