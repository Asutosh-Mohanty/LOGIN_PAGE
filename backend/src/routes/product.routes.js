const express = require("express");
const { body } = require("express-validator");
const { protect, requireAdmin } = require("../middleware/auth.middleware");
const {
  listProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct
} = require("../controllers/product.controller");

const router = express.Router();

const productValidators = [
  body("name").isLength({ min: 2 }),
  body("category").notEmpty(),
  body("price").isFloat({ gt: 0 }),
  body("stock").isInt({ min: 0 })
];

router.get("/", listProducts);
router.get("/:id", getProduct);
router.post("/", protect, requireAdmin, productValidators, createProduct);
router.put("/:id", protect, requireAdmin, productValidators, updateProduct);
router.delete("/:id", protect, requireAdmin, deleteProduct);

module.exports = router;
