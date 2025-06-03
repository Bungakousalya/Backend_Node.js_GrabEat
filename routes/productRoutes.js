const express = require("express");
const productController = require("../controllers/productController");
const router = express.Router();

router.post("/add-product/:firmId", productController.addProduct); // Add product
router.get("/products/:firmId", productController.getProductsByFirm); // Get products by firm ID
router.delete("/delete-product/:productId", productController.deleteProductById); // Delete product by ID

module.exports = router;