const prisma = require("../prismaClient");

exports.createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      discountPrice, // ✅ NEW
      slug,
      imageUrl,
      images, // ✅ NEW: Array of image URLs
      categoryId,
      sizes, // ✅ NEW: Array of available sizes
      colors, // ✅ NEW: Array of color objects (JSON)
      stock, // ✅ NEW: Stock quantity
      badge, // ✅ NEW: Product badge
    } = req.body;

    const product = await prisma.product.create({
      data: {
        name,
        description,
        price,
        discountPrice, // ✅ NEW
        slug,
        imageUrl,
        images: images || [], // ✅ NEW: Default to empty array
        categoryId,
        sizes: sizes || [], // ✅ NEW: Default to empty array
        colors: colors || null, // ✅ NEW: JSON field
        stock: stock || 0, // ✅ NEW: Default to 0
        badge: badge || null, // ✅ NEW
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

    // ✅ FIXED: Price filtering logic
    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = parseFloat(minPrice);
      if (maxPrice) where.price.lte = parseFloat(maxPrice);
    }

    const orderBy = {};
    if (sortBy) {
      orderBy[sortBy] = sortOrder === "desc" ? "desc" : "asc";
    } else {
      orderBy.createdAt = "desc";
    }

    // ✅ FIXED: Pagination calculation
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const take = parseInt(limit);

    // ✅ ADDED: Get total count for pagination
    const total = await prisma.product.count({ where });

    const products = await prisma.product.findMany({
      where,
      orderBy,
      take,
      skip,
      include: { category: true }, // ✅ ADDED: Include category info
    });

    // ✅ ADDED: Return pagination metadata
    res.status(200).json({
      products,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / parseInt(limit)),
      },
    });
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

// ✅ NEW: Get product by slug (useful for SEO-friendly URLs)
exports.getProductBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const product = await prisma.product.findUnique({
      where: { slug },
      include: { category: true },
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json(product);
  } catch (error) {
    console.error("Error getting product by slug:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      description,
      price,
      discountPrice, // ✅ NEW
      slug,
      imageUrl,
      images, // ✅ NEW
      categoryId,
      sizes, // ✅ NEW
      colors, // ✅ NEW
      stock, // ✅ NEW
      badge, // ✅ NEW
    } = req.body;

    // ✅ IMPROVED: Build update data object dynamically (only update provided fields)
    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (price !== undefined) updateData.price = price;
    if (discountPrice !== undefined) updateData.discountPrice = discountPrice;
    if (slug !== undefined) updateData.slug = slug;
    if (imageUrl !== undefined) updateData.imageUrl = imageUrl;
    if (images !== undefined) updateData.images = images;
    if (categoryId !== undefined) updateData.categoryId = categoryId;
    if (sizes !== undefined) updateData.sizes = sizes;
    if (colors !== undefined) updateData.colors = colors;
    if (stock !== undefined) updateData.stock = stock;
    if (badge !== undefined) updateData.badge = badge;

    const product = await prisma.product.update({
      where: { id: parseInt(id) },
      data: updateData,
      include: { category: true }, // ✅ ADDED: Include category in response
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

// ✅ NEW: Get products by category
exports.getProductsByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const products = await prisma.product.findMany({
      where: { categoryId: parseInt(categoryId) },
      include: { category: true },
      orderBy: { createdAt: "desc" },
    });

    res.status(200).json(products);
  } catch (error) {
    console.error("Error getting products by category:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
