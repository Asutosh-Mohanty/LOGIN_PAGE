const { all, get, run } = require("../config/db");

function buildProductFilter(query) {
  const conditions = [];
  const params = [];
  if (query.search) {
    conditions.push("LOWER(name) LIKE ?");
    params.push(`%${query.search.toLowerCase()}%`);
  }
  if (query.category) {
    conditions.push("category = ?");
    params.push(query.category);
  }
  if (query.skinType) {
    conditions.push("skin_type LIKE ?");
    params.push(`%${query.skinType}%`);
  }
  if (query.minPrice) {
    conditions.push("price >= ?");
    params.push(Number(query.minPrice));
  }
  if (query.maxPrice) {
    conditions.push("price <= ?");
    params.push(Number(query.maxPrice));
  }
  return { where: conditions.length ? `WHERE ${conditions.join(" AND ")}` : "", params };
}

async function listProducts(query) {
  const page = Number(query.page || 1);
  const limit = Number(query.limit || 8);
  const offset = (page - 1) * limit;
  const sortMap = { price_asc: "price ASC", price_desc: "price DESC", newest: "id DESC" };
  const sort = sortMap[query.sort] || "id DESC";
  const filter = buildProductFilter(query);
  const items = await all(
    `SELECT * FROM products ${filter.where} ORDER BY ${sort} LIMIT ? OFFSET ?`,
    [...filter.params, limit, offset]
  );
  const count = await get(`SELECT COUNT(*) as total FROM products ${filter.where}`, filter.params);
  return {
    items,
    pagination: { total: count.total, page, limit, pages: Math.ceil(count.total / limit) }
  };
}

function getProductById(id) {
  return get("SELECT * FROM products WHERE id = ?", [id]);
}

async function createProduct(data) {
  const result = await run(
    "INSERT INTO products (name, description, category, skin_type, price, stock, image) VALUES (?, ?, ?, ?, ?, ?, ?)",
    [data.name, data.description || "", data.category, data.skinType || "", Number(data.price), Number(data.stock || 0), data.image || ""]
  );
  return getProductById(result.id);
}

async function updateProduct(id, data) {
  await run(
    "UPDATE products SET name=?, description=?, category=?, skin_type=?, price=?, stock=?, image=? WHERE id=?",
    [data.name, data.description || "", data.category, data.skinType || "", Number(data.price), Number(data.stock || 0), data.image || "", id]
  );
  return getProductById(id);
}

function deleteProduct(id) {
  return run("DELETE FROM products WHERE id = ?", [id]);
}

module.exports = { listProducts, getProductById, createProduct, updateProduct, deleteProduct };
