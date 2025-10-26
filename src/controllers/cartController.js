const prisma = require("../prismaClient");

exports.addToCart = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { productId, quantity } = req.body;
    if (!productId || !quantity || quantity < 1) {
      return res.status(400).json({ message: "Invalid product or quantity" });
    }
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // get or create cart for user
    let cart = await prisma.cart.findUnique({
      where: { userId },
      include: { items: true },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId },
        include: { items: true },
      });
    }

    // check if product already in cart
    const checkExistingItem = await prisma.cartItem.findUnique({
      where: {
        cartId_productId: {
          cartId: cart.id,
          productId: productId,
        },
      },
    });

    let cartItem;
    if (checkExistingItem) {
      cartItem = await prisma.cartItem.update({
        where: { id: checkExistingItem.id },
        data: { quantity: checkExistingItem.quantity + quantity },
        include: { product: true },
      });
    } else {
      cartItem = await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId: productId,
          quantity: quantity,
        },
        include: { product: true },
      });
    }
    res.status(200).json({ message: "Item added to cart", cartItem });
  } catch (error) {
    console.error("Error adding to cart:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getCart = async (req, res) => {
  try {
    const userId = req.user.userId;
    const cart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: {
              include: { category: true },
            },
          },
        },
      },
    });
    if (!cart) {
      return res
        .status(200)
        .json({ message: "Cart is empty", items: [], total: 0 });
    }
    const total = cart.items.reduce((sum, item) => {
      return sum + item.product.price * item.quantity;
    }, 0);
    res.json({
      items: cart.items,
      total: total.toFixed(2),
    });
  } catch (error) {
    console.error("Error getting cart:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.updateCartItem = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { itemId } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity < 1) {
      return res.status(400).json({ message: "Invalid quantity" });
    }

    const cartItem = await prisma.cartItem.findUnique({
      where: { id: parseInt(itemId) },
      include: { cart: true },
    });

    if (!cartItem || cartItem.cart.userId !== userId) {
      return res.status(404).json({ message: "Cart item not found" });
    }

    const updatedItem = await prisma.cartItem.update({
      where: { id: parseInt(itemId) },
      data: { quantity },
      include: { product: true },
    });
    res.json(updatedItem);
  } catch (error) {
    console.error("Error updating cart item:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.removeFromCart = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { itemId } = req.params;
    const cartItem = await prisma.cartItem.findUnique({
      where: { id: parseInt(itemId) },
    });
    if (!cartItem || cartItem.cart.userId !== userId) {
      return res.status(404).json({ message: "Cart item not found" });
    }
    await prisma.cartItem.delete({
      where: { id: parseInt(itemId) },
    });
    res.status(204).json({ message: "Item removed from cart" });
  } catch (error) {
    console.error("Error removing from cart:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.clearCart = async (req, res) => {
  try {
    const userId = req.user.userId;
    const cart = await prisma.cart.findUnique({
      where: { userId },
    });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }
    await prisma.cartItem.deleteMany({
      where: { cartId: cart.id },
    });
    res.status(204).send();
  } catch (error) {
    console.error("Error clearing cart:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
