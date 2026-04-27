const bcrypt = require("bcryptjs");
const { get, run } = require("../config/db");

const products = [
  ["Vitamin C Serum", "Brightening antioxidant serum", "serum", "oily,combination,dry", 899, 45, "/images/placeholder.svg"],
  ["Hydrating Face Wash", "Daily gentle cleanser", "facewash", "dry,sensitive", 349, 60, "/images/placeholder.svg"],
  ["Niacinamide Serum", "Oil-control and pore care", "serum", "oily,combination", 749, 40, "/images/placeholder.svg"],
  ["SPF 50 Sunscreen", "Broad spectrum UV protection", "sunscreen", "oily,dry,combination,sensitive", 599, 80, "/images/placeholder.svg"],
  ["Gel Moisturizer", "Lightweight hydration", "moisturizer", "oily,combination", 499, 55, "/images/placeholder.svg"],
  ["Retinol Serum", "Night-time anti-ageing serum", "serum", "oily,combination", 1299, 22, "/images/placeholder.svg"]
];

async function seed() {
  const admin = await get("SELECT * FROM users WHERE email = ?", ["admin@glowcart.com"]);
  if (!admin) {
    const hash = await bcrypt.hash("Admin@123", 10);
    await run(
      "INSERT INTO users (fullname, email, username, password_hash, role, skin_type) VALUES (?, ?, ?, ?, ?, ?)",
      ["Admin User", "admin@glowcart.com", "admin", hash, "admin", "combination"]
    );
  }
  const row = await get("SELECT COUNT(*) as c FROM products");
  if (!row.c) {
    for (const p of products) {
      await run(
        "INSERT INTO products (name, description, category, skin_type, price, stock, image) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [p[0], p[1], p[2], p[3], p[4], p[5], p[6]]
      );
    }
  }
}

module.exports = { seed };
