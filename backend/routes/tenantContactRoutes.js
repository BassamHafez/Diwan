const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");
const tenantContactController = require("../controllers/tenantContactController");
const contactValidator = require("../utils/validators/contactValidator");
const { setAccountId, filterAccountResults } = require("../utils/requestUtils");

router.use(authController.protect);

router
  .route("/")
  .get(filterAccountResults, tenantContactController.getAllTenantContacts)
  .post(
    contactValidator.createTenantContactValidator,
    setAccountId,
    authController.checkPermission("ADD_CONTACT"),
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
    authController.checkPermission("UPDATE_CONTACT"),
    tenantContactController.updateTenantContact
  )
  .delete(
    contactValidator.getContactValidator,
    authController.checkPermission("DELETE_CONTACT"),
    tenantContactController.deleteTenantContact
  );

module.exports = router;
