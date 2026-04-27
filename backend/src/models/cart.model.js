const { all, get, run } = require("../config/db");

function getCart(userId) {
  return all(
    `SELECT c.product_id, c.quantity, p.name, p.price, p.image, p.stock
     FROM cart_items c
     JOIN products p ON p.id = c.product_id
     WHERE c.user_id = ?`,
    [userId]
  );
}

async function addCartItem(userId, productId, quantity) {
  const existing = await get("SELECT * FROM cart_items WHERE user_id = ? AND product_id = ?", [userId, productId]);
  if (existing) {
    await run("UPDATE cart_items SET quantity = quantity + ? WHERE id = ?", [quantity, existing.id]);
  } else {
    await run("INSERT INTO cart_items (user_id, product_id, quantity) VALUES (?, ?, ?)", [userId, productId, quantity]);
  }
  return getCart(userId);
}

async function updateCartItem(userId, productId, quantity) {
  if (quantity <= 0) {
    await run("DELETE FROM cart_items WHERE user_id = ? AND product_id = ?", [userId, productId]);
  } else {
    await run("UPDATE cart_items SET quantity = ? WHERE user_id = ? AND product_id = ?", [quantity, userId, productId]);
  }
  return getCart(userId);
}

async function removeCartItem(userId, productId) {
  await run("DELETE FROM cart_items WHERE user_id = ? AND product_id = ?", [userId, productId]);
  return getCart(userId);
}

function clearCart(userId) {
  return run("DELETE FROM cart_items WHERE user_id = ?", [userId]);
}

module.exports = { getCart, addCartItem, updateCartItem, removeCartItem, clearCart };
