const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const {
  authorizeAdmin,
  authenticate,
} = require("../middlewares/authMiddleware");
const handleValidationErrors = require("../middlewares/handleValidationErrors");
const { validStatuses } = require("../validators/orderValidator");

router.post("/", orderController.placeOrder);
router.get("/mine", orderController.getMyOrders);
router.get("/:orderId", orderController.getOrderById);
router.put("/:orderId/cancel", authenticate, orderController.cancelOrder);
//for admin
router.get("/", authorizeAdmin, orderController.getAllOrders);
router.put(
  "/:orderId/status",
  authenticate,
  authorizeAdmin,
  validStatuses,
  handleValidationErrors,
  orderController.updateOrderStatus
);

module.exports = router;
