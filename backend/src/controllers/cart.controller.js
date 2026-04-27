const { validationResult } = require("express-validator");
const productModel = require("../models/product.model");
const cartModel = require("../models/cart.model");

async function getCart(req, res) {
  const items = await cartModel.getCart(req.user.id);
  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  res.json({ items, total });
}

async function addItem(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ message: "Validation failed", errors: errors.array() });
  const product = await productModel.getProductById(req.body.productId);
  if (!product) return res.status(404).json({ message: "Product not found" });
  const items = await cartModel.addCartItem(req.user.id, req.body.productId, req.body.quantity || 1);
  res.status(201).json({ message: "Added to cart", items });
}

async function updateItem(req, res) {
  const quantity = Number(req.body.quantity || 0);
  const items = await cartModel.updateCartItem(req.user.id, req.params.productId, quantity);
  res.json({ message: "Cart updated", items });
}

async function removeItem(req, res) {
  const items = await cartModel.removeCartItem(req.user.id, req.params.productId);
  res.json({ message: "Removed from cart", items });
}

module.exports = { getCart, addItem, updateItem, removeItem };
