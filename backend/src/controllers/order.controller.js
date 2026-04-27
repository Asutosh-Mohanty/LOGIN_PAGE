const { validationResult } = require("express-validator");
const cartModel = require("../models/cart.model");
const orderModel = require("../models/order.model");

async function placeOrder(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ message: "Validation failed", errors: errors.array() });
  const cartItems = await cartModel.getCart(req.user.id);
  if (!cartItems.length) return res.status(400).json({ message: "Cart is empty" });
  const order = await orderModel.createOrder(req.user.id, req.body.address, req.body.paymentMethod, cartItems);
  await cartModel.clearCart(req.user.id);
  res.status(201).json({ message: "Order placed successfully", order });
}

async function listOrders(req, res) {
  const items = await orderModel.listOrders(req.user.id);
  res.json({ items });
}

module.exports = { placeOrder, listOrders };
