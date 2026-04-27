const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");
const userModel = require("../models/user.model");

async function updateProfile(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ message: "Validation failed", errors: errors.array() });
  const user = await userModel.updateProfile(req.user.id, req.body);
  res.json({ message: "Profile updated", user });
}

async function changePassword(req, res) {
  const { currentPassword, newPassword } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ message: "Validation failed", errors: errors.array() });
  const fullUser = await userModel.findByEmail(req.user.email);
  const match = await bcrypt.compare(currentPassword, fullUser.password_hash);
  if (!match) return res.status(400).json({ message: "Current password is incorrect" });
  const hash = await bcrypt.hash(newPassword, 10);
  await userModel.updatePassword(req.user.id, hash);
  return res.json({ message: "Password changed successfully" });
}

async function listUsers(req, res) {
  const users = await userModel.listUsers();
  res.json({ items: users });
}

module.exports = { updateProfile, changePassword, listUsers };
