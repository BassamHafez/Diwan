const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");
const tenantContactController = require("../controllers/tenantContactController");
const contactValidator = require("../utils/validators/contactValidator");
const { filterUserResults, setUserId } = require("../utils/requestUtils");

router.use(authController.protect);

router
  .route("/")
  .get(filterUserResults, tenantContactController.getAllTenantContacts)
  .post(
    contactValidator.createTenantContactValidator,
    setUserId,
    tenantContactController.createTenantContact
  );

router
  .route("/:id")
  .get(
    contactValidator.getContactValidator,
    tenantContactController.getTenantContact
  )
  .patch(
    contactValidator.updateTenantContactValidator,
    tenantContactController.updateTenantContact
  )
  .delete(
    contactValidator.getContactValidator,
    tenantContactController.deleteTenantContact
  );

module.exports = router;
