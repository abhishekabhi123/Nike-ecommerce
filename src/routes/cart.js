const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cartController");

router.post("/items", cartController.addToCart);
router.get("/", cartController.getCart);
router.put("/items/:itemId", cartController.updateCartItem);
router.delete("/items/:itemId", cartController.removeFromCart);
router.delete("/", cartController.clearCart);

module.exports = router;
