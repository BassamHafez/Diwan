const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");
const brokerContactController = require("../controllers/brokerContactController");
const contactValidator = require("../utils/validators/contactValidator");
const { setAccountId, filterAccountResults } = require("../utils/requestUtils");

router.use(authController.protect);

router
  .route("/")
  .get(filterAccountResults, brokerContactController.getAllBrokerContacts)
  .post(
    contactValidator.createContactValidator,
    setAccountId,
    authController.checkPermission("ADD_CONTACT"),
    brokerContactController.createBrokerContact
  );

router
  .route("/:id")
  .get(
    contactValidator.getContactValidator,
    brokerContactController.getBrokerContact
  )
  .patch(
    contactValidator.updateContactValidator,
    authController.checkPermission("UPDATE_CONTACT"),
    brokerContactController.updateBrokerContact
  )
  .delete(
    contactValidator.getContactValidator,
    authController.checkPermission("DELETE_CONTACT"),
    brokerContactController.deleteBrokerContact
  );

module.exports = router;
