const express = require("express");
const router = express.Router();
const addressController = require("../controllers/addressController");
const { authenticate } = require("../middlewares/authMiddleware");
const { addressValidationRules } = require("../validators/addressValidator");
const handleValidationErrors = require("../middlewares/handleValidationErrors");

router.get("/", authenticate, addressController.getAddresses);
router.post(
  "/",
  authenticate,
  ...addressValidationRules,
  handleValidationErrors,
  addressController.addAddress
);
router.put(
  "/:addressId",
  authenticate,
  ...addressValidationRules,
  handleValidationErrors,
  addressController.updateAddress
);
router.delete("/:addressId", authenticate, addressController.deleteAddress);

module.exports = router;
