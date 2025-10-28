const prisma = require("../prismaClient");

exports.placeOrder = async (req, res) => {
  try {
    const userId = req.user.userId;
    const cart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: { include: { product: true } },
      },
    });
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }
    let total = 0;
    let orderItemsData = cart.items.map((item) => {
      total += item.product.price * item.quantity;
      return {
        productId: item.productId,
        quantity: item.quantity,
        price: item.product.price,
      };
    });
    const order = await prisma.order.create({
      data: {
        userId,
        total,
        status: "pending",
        items: {
          create: orderItemsData,
        },
      },
      include: { items: true },
    });
    await prisma.cartItem.deleteMany({
      where: { cartId: cart.id },
    });
    res.status(201).json({ message: "Order placed successfully", order });
  } catch (error) {
    console.error("Error placing order:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getMyOrders = async (req, res) => {
  try {
    const userId = req.user.userId;
    const orders = await prisma.order.findMany({
      where: { userId },
      include: { items: { include: { product: true } } },
    });
    res.json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;
    const order = await prisma.order.findUnique({
      where: { id: parseInt(id) },
      include: { items: { include: { product: true } } },
    });
    if (!order || order.userId !== userId) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.json(order);
  } catch (error) {
    console.error("Error fetching order by ID:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      include: { user: true, items: { include: { product: true } } },
    });
    res.json(orders);
  } catch (error) {
    console.error("Error fetching all orders:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const validStatuses = [
      "pending",
      "shipped",
      "delivered",
      "paid",
      "canceled",
    ];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid order status" });
    }
    const order = await prisma.order.update({
      where: { id: parseInt(id) },
      data: { status },
    });
    res.json({ message: "Order status updated", order });
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.cancelOrder = async (req, res) => {
  const userId = req.user.userId;
  const { orderId } = req.params;
  try {
    const order = await prisma.order.findUnique({
      where: { id: parseInt(orderId) },
    });

    if (!order || order.userId !== userId || order.status === "pending") {
      return res.status(404).json({ message: "Order cannot be canceled" });
    }
    await prisma.order.update({
      where: { id: parseInt(orderId) },
      data: { status: "canceled" },
    });
    res.json({ message: "Order canceled successfully" });
  } catch (error) {
    console.error("Error canceling order:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
