const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const { authorizeAdmin } = require("../middlewares/authMiddleware");

router.post("/", orderController.placeOrder);
router.get("/mine", orderController.getMyOrders);
router.get("/:orderId", orderController.getOrderById);
//for admin
router.get("/", authorizeAdmin, orderController.getAllOrders);
router.put(
  "/:orderId/status",
  authorizeAdmin,
  orderController.updateOrderStatus
);

module.exports = router;
