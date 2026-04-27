const { validationResult } = require("express-validator");
const productModel = require("../models/product.model");

async function listProducts(req, res) {
  const data = await productModel.listProducts(req.query);
  res.json(data);
}

async function getProduct(req, res) {
  const item = await productModel.getProductById(req.params.id);
  if (!item) return res.status(404).json({ message: "Product not found" });
  res.json(item);
}

async function createProduct(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ message: "Validation failed", errors: errors.array() });
  const item = await productModel.createProduct(req.body);
  res.status(201).json({ message: "Product created", item });
}

async function updateProduct(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ message: "Validation failed", errors: errors.array() });
  const existing = await productModel.getProductById(req.params.id);
  if (!existing) return res.status(404).json({ message: "Product not found" });
  const item = await productModel.updateProduct(req.params.id, req.body);
  res.json({ message: "Product updated", item });
}

async function deleteProduct(req, res) {
  await productModel.deleteProduct(req.params.id);
  res.json({ message: "Product deleted" });
}

module.exports = { listProducts, getProduct, createProduct, updateProduct, deleteProduct };
