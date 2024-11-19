const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");
const brokerContactController = require("../controllers/brokerContactController");
const contactValidator = require("../utils/validators/contactValidator");
const { filterUserResults, setUserId } = require("../utils/requestUtils");

router.use(authController.protect);

router
  .route("/")
  .get(filterUserResults, brokerContactController.getAllBrokerContacts)
  .post(
    contactValidator.createContactValidator,
    setUserId,
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
    brokerContactController.updateBrokerContact
  )
  .delete(
    contactValidator.getContactValidator,
    brokerContactController.deleteBrokerContact
  );

module.exports = router;
