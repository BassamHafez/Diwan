const express = require("express");
const router = express.Router({ mergeParams: true });

const authController = require("../controllers/authController");
const contractController = require("../controllers/contractController");
const contractValidator = require("../utils/validators/contractValidator");
const { filterUserResults, setUserId } = require("../utils/requestUtils");

router.use(authController.protect);

// /api/v1/estates/:estateId/contracts
router
  .route("/")
  .get(
    contractValidator.getContractsValidator,
    filterUserResults,
    contractController.getAllContracts
  )
  .post(
    contractValidator.createContractValidator,
    setUserId,
    contractController.createContract
  );

// /api/v1/estates/:estateId/contracts/:id
router
  .route("/:id")
  .patch(
    contractValidator.updateContractValidator,
    contractController.updateContract
  )
  .delete(
    contractValidator.getContractValidator,
    contractController.cancelContract
  );

module.exports = router;
