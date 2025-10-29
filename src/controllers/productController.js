const prisma = require("../prismaClient");

exports.createProduct = async (req, res) => {
  try {
    const { name, description, price, slug, imageUrl, categoryId } = req.body;
    const product = await prisma.product.create({
      data: {
        name,
        description,
        price,
        slug,
        imageUrl,
        categoryId,
      },
    });
    res.status(201).json(product);
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.listProducts = async (req, res) => {
  try {
    const {
      search,
      category,
      minPrice,
      maxPrice,
      sortBy,
      sortOrder,
      page = 1,
      limit = 10,
    } = req.query;
    const where = {};
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    if (category) {
      where.category = { name: category };
    }
    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.minPrice.gte = parseFloat(minPrice);
      if (maxPrice) where.maxPrice.lte = parseFloat(maxPrice);
    }
    const orderBy = {};
    if (sortBy) {
      orderBy[sortBy] = sortOrder === "desc" ? "desc" : "asc";
    } else {
      orderBy.createdAt = "desc";
    }
    const skip = parseInt(page) - 1 * parseInt(limit);
    const take = parseInt(limit);
    const products = await prisma.product.findMany({
      where,
      orderBy,
      take,
      skip,
    });
    res.status(200).json(products);
  } catch (error) {
    console.error("Error listing products:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await prisma.product.findUnique({
      where: { id: parseInt(id) },
      include: { category: true },
    });
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json(product);
  } catch (error) {
    console.error("Error getting product by ID:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, slug, imageUrl, categoryId } = req.body;
    const product = await prisma.product.update({
      where: { id: parseInt(id) },
      data: { name, description, price, slug, imageUrl, categoryId },
    });
    res.status(200).json(product);
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.product.delete({
      where: { id: parseInt(id) },
    });
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
