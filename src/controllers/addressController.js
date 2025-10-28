const prisma = require("../prismaClient");

exports.getAddresses = async (req, res) => {
  const userId = req.user.userId;
  try {
    const address = await prisma.address.findMany({
      where: { userId },
    });
    res.json(address);
  } catch (error) {
    console.error("Error fetching addresses:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.addAddress = async (req, res) => {
  const userId = req.user.userId;
  const {
    addressLine1,
    addressLine2,
    city,
    state,
    postalCode,
    country,
    phone,
  } = req.body;
  try {
    const newAddress = await prisma.address.create({
      data: {
        userId,
        addressLine1,
        addressLine2,
        city,
        state,
        postalCode,
        country,
        phone,
      },
    });
    res.status(201).json(newAddress);
  } catch (error) {
    console.error("Error adding address:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.updateAddress = async (req, res) => {
  const userId = req.user.userId;
  const { addressId } = req.params;
  const {
    addressLine1,
    addressLine2,
    city,
    state,
    postalCode,
    country,
    phone,
  } = req.body;
  try {
    const address = await prisma.address.findUnique({
      where: { id: parseInt(addressId) },
    });
    if (!address || address.userId !== userId) {
      return res.status(404).json({ message: "Address not found" });
    }
    const updatedAddress = await prisma.address.update({
      where: { id: parseInt(addressId) },
      data: {
        addressLine1,
        addressLine2,
        city,
        state,
        postalCode,
        country,
        phone,
      },
    });
    res.json(updatedAddress);
  } catch (error) {
    console.error("Error updating address:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.deleteAddress = async (req, res) => {
  const userId = req.user.userId;
  const { addressId } = req.params;
  try {
    const address = await prisma.address.findUnique({
      where: { id: parseInt(addressId) },
    });
    if (!address || address.userId !== userId) {
      return res.status(404).json({ message: "Address not found" });
    }
    await prisma.address.delete({
      where: { id: parseInt(addressId) },
    });
    res.status(204).json({ message: "Address deleted" });
  } catch (error) {
    console.error("Error deleting address:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
