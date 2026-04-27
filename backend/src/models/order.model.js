const { all, get, run } = require("../config/db");

async function createOrder(userId, address, paymentMethod, cartItems) {
  const subtotal = cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const total = subtotal;
  const order = await run(
    `INSERT INTO orders (user_id, address_line1, city, state, postal_code, payment_method, payment_status, subtotal, total)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [userId, address.line1, address.city, address.state, address.postalCode, paymentMethod, "paid", subtotal, total]
  );
  for (const item of cartItems) {
    await run(
      "INSERT INTO order_items (order_id, product_id, name_snapshot, price_snapshot, quantity) VALUES (?, ?, ?, ?, ?)",
      [order.id, item.product_id, item.name, item.price, item.quantity]
    );
  }
  return getOrderById(order.id, userId);
}

async function getOrderById(orderId, userId) {
  const order = await get("SELECT * FROM orders WHERE id = ? AND user_id = ?", [orderId, userId]);
  if (!order) return null;
  const items = await all("SELECT * FROM order_items WHERE order_id = ?", [orderId]);
  return { ...order, items };
}

async function listOrders(userId) {
  const orders = await all("SELECT * FROM orders WHERE user_id = ? ORDER BY id DESC", [userId]);
  const withItems = [];
  for (const order of orders) {
    const items = await all("SELECT * FROM order_items WHERE order_id = ?", [order.id]);
    withItems.push({ ...order, items });
  }
  return withItems;
}

module.exports = { createOrder, getOrderById, listOrders };
