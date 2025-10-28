const { body } = require("express-validator");

const addressValidationRules = [
  body("addressLine1")
    .trim()
    .notEmpty()
    .withMessage("Address Line 1 is required"),
  body("city").trim().notEmpty().withMessage("City is required"),
  body("state").trim().notEmpty().withMessage("State is required"),
  body("postalCode").trim().notEmpty().withMessage("Zip Code is required"),
  body("country").trim().notEmpty().withMessage("Country is required"),
  body("phone")
    .optional()
    .trim()
    .isMobilePhone()
    .withMessage("Invalid phone number"),
];

module.exports = { addressValidationRules };
