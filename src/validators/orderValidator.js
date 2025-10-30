const { body } = require("express-validator");
const validStatuses = ["pending", "paid", "shipped", "delivered", "cancelled"];

const validateOrderStatus = [
  body("status")
    .exists()
    .withMessage("Status is required")
    .isString()
    .withMessage("Status must be a string")
    .isIn(validStatuses)
    .withMessage(`Status must be one of: ${validStatuses.join(", ")}`),
];

module.exports = { validateOrderStatus };
