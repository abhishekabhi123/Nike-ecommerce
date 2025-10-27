const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { authenticate } = require("../middlewares/authMiddleware");

router.get("/profile", authenticate, userController.getProfile);
router.put("/change-password", authenticate, userController.changePassword);
router.put("/profile", userController.updateProfile);

module.exports = router;
