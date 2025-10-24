const prisma = require("../prismaClient");

exports.createCategory = async (req, res) => {
  try {
    const { name, description, slug, imageUrl } = req.body;

    if (!name || !slug) {
      return res.status(400).json({ message: "Name and slug are required" });
    }
    const category = await prisma.category.create({
      data: { name, description, slug, imageUrl },
    });
    res.status(201).json(category);
  } catch (error) {
    console.error("Error creating category:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.listCategories = async (req, res) => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { createdAt: "desc" },
    });
    res.status(200).json(categories);
  } catch (error) {
    console.error("Error listing categories:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await prisma.category.findUnique({
      where: { id: parseInt(id) },
    });
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.status(200).json(category);
  } catch (error) {
    console.error("Error getting category by ID:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, slug, imageUrl } = req.body;
    const category = await prisma.category.update({
      where: { id: parseInt(id) },
      data: { name, description, slug, imageUrl },
    });
    res.status(200).json(category);
  } catch (error) {
    console.error("Error updating category:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.category.delete({
      where: { id: parseInt(id) },
    });
    res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    console.error("Error deleting category:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
