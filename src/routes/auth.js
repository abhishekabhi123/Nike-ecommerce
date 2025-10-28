const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const authController = require("../controllers/authController");
const handleValidationErrors = require("../middlewares/handleValidationErrors");

router.post(
  "/register",
  [
    body("email").isEmail(),
    body("password").isLength({ min: 6 }),
    body("name").notEmpty(),
  ],
  handleValidationErrors,
  authController.registerUser
);
router.post("/login", authController.loginUser);

module.exports = router;
