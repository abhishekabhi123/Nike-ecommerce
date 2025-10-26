const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan("dev"));
app.use(express.json()); // Parse JSON request body

const {
  authenticate,
  authorizeAdmin,
} = require("./src/middlewares/authMiddleware");
const productRoutes = require("./src/routes/product");
const authRoutes = require("./src/routes/auth");
const categoryRoutes = require("./src/routes/category");
const cartRoutes = require("./src/routes/cart");
const orderRoutes = require("./src/routes/order");

app.use("/api/auth", authRoutes);
app.use("/api/products", authenticate, authorizeAdmin, productRoutes);
app.use("/api/categories", authenticate, authorizeAdmin, categoryRoutes);
app.use("/api/cart", authenticate, cartRoutes);
app.use("/api/orders", authenticate, orderRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
