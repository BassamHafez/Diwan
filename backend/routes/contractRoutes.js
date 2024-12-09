const express = require("express");
const router = express.Router({ mergeParams: true });

const authController = require("../controllers/authController");
const contractController = require("../controllers/contractController");
const contractValidator = require("../utils/validators/contractValidator");
const { setAccountId, filterAccountResults } = require("../utils/requestUtils");

router.use(authController.protect);

// /api/v1/estates/:estateId/contracts
router
  .route("/")
  .get(
    contractValidator.getContractsValidator,
    filterAccountResults,
    contractController.getAllContracts
  )
  .post(
    contractValidator.createContractValidator,
    authController.checkPermission("ADD_CONTRACT"),
    setAccountId,
    contractController.createContract
  );

router.get(
  "/current",
  contractValidator.getContractsValidator,
  contractController.getCurrentContract
);

// /api/v1/estates/:estateId/contracts/:id
router
  .route("/:id")
  .patch(
    contractValidator.updateContractValidator,
    authController.checkPermission("UPDATE_CONTRACT"),
    contractController.updateContract
  )
  .delete(
    contractValidator.getContractValidator,
    authController.checkPermission("CANCEL_CONTRACT"),
    contractController.cancelContract
  );

module.exports = router;
