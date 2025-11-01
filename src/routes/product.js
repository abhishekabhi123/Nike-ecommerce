const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");

router.post("/", productController.createProduct);
router.get("/", productController.listProducts);
router.get("/:id", productController.getProductById);
router.put("/:id", productController.updateProduct);
router.delete("/:id", productController.deleteProduct);
router.get("/products/slug/:slug", productController.getProductBySlug);
router.get(
  "/products/category/:categoryId",
  productController.getProductsByCategory
);

module.exports = router;
