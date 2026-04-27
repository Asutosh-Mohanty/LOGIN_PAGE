const express = require("express");
const { body } = require("express-validator");
const { protect } = require("../middleware/auth.middleware");
const { getCart, addItem, updateItem, removeItem } = require("../controllers/cart.controller");

const router = express.Router();

router.use(protect);
router.get("/", getCart);
router.post("/items", [body("productId").isInt({ min: 1 }), body("quantity").optional().isInt({ min: 1 })], addItem);
router.patch("/items/:productId", [body("quantity").isInt({ min: 0 })], updateItem);
router.delete("/items/:productId", removeItem);

module.exports = router;
