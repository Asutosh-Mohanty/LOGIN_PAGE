const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");
const userModel = require("../models/user.model");
const { createToken } = require("../utils/token");

function badValidation(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ message: "Validation failed", errors: errors.array() });
    return true;
  }
  return false;
}

async function register(req, res) {
  if (badValidation(req, res)) return;
  const { fullname, email, username, password, skinType } = req.body;
  const byEmail = await userModel.findByEmail(email);
  const byUsername = await userModel.findByUsername(username);
  if (byEmail || byUsername) return res.status(409).json({ message: "Email or username already exists" });
  const passwordHash = await bcrypt.hash(password, 10);
  const user = await userModel.createUser({ fullname, email, username, passwordHash, skinType });
  const token = createToken(user);
  res.status(201).json({ token, user });
}

async function login(req, res) {
  if (badValidation(req, res)) return;
  const { loginId, password } = req.body;
  const user = loginId.includes("@")
    ? await userModel.findByEmail(loginId)
    : await userModel.findByUsername(loginId);
  if (!user) return res.status(401).json({ message: "Invalid credentials" });
  const ok = await bcrypt.compare(password, user.password_hash);
  if (!ok) return res.status(401).json({ message: "Invalid credentials" });
  const safeUser = await userModel.findById(user.id);
  const token = createToken(safeUser);
  res.json({ token, user: safeUser });
}

function me(req, res) {
  res.json({ user: req.user });
}

module.exports = { register, login, me };
