const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const Stripe = require("stripe");
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const endpointSecret = process.env.STRIPE_ENDPOINT_SECRET;
const prisma = require("./src/prismaClient");

const app = express();

app.post(
  "/api/webhook",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    const sig = req.headers["stripe-signature"];
    let event;
    try {
      event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch (error) {
      console.error("Webhook signature verification failed:", error.message);
      return res.status(400).send(`Webhook Error: ${error.message}`);
    }
    if (event.type === "payment.intent.succeeded") {
      const paymentIntent = event.data.object;
      const orderId = paymentIntent.metadata.orderId;
      console.log("PaymentIntent was successful!", event.data.object);
      if (!orderId) {
        console.error("No orderId found in payment intent metadata");
        return res.status(400).send("No orderId in metadata");
      }
      try {
        const updateOrder = await prisma.order.update({
          where: { id: parseInt(orderId) },
          data: { status: "paid" },
        });
        console.log("Order status updated to paid for orderId:", orderId);
      } catch (error) {
        console.error("Error updating order status:", error);
        return res.status(500).send("Internal server error");
      }
    }
    res.json({ received: true });
  }
);
app.use(express.json()); // Parse JSON request body

app.post("/api/payments/create-intent", async (req, res) => {
  try {
    const { amount } = req.body;
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency: "usd",
    });
    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error("Error creating payment intent:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan("dev"));

const {
  authenticate,
  authorizeAdmin,
} = require("./src/middlewares/authMiddleware");
const productRoutes = require("./src/routes/product");
const authRoutes = require("./src/routes/auth");
const categoryRoutes = require("./src/routes/category");
const cartRoutes = require("./src/routes/cart");
const orderRoutes = require("./src/routes/order");
const userRoutes = require("./src/routes/user");
const addressRoutes = require("./src/routes/address");

app.use("/api/auth", authRoutes);
app.use("/api/products", authenticate, authorizeAdmin, productRoutes);
app.use("/api/categories", authenticate, authorizeAdmin, categoryRoutes);
app.use("/api/cart", authenticate, cartRoutes);
app.use("/api/orders", authenticate, orderRoutes);
app.use("/api/users", userRoutes);
app.use("/api/addresses", addressRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
