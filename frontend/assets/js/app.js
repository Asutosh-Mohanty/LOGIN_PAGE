const API_BASE = "http://localhost:5000/api";

const state = { products: [], pagination: null, loading: false };

function getToken() {
  return localStorage.getItem("token");
}

function getUser() {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
}

function setSession(data) {
  localStorage.setItem("token", data.token);
  localStorage.setItem("user", JSON.stringify(data.user));
}

function clearSession() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
}

function showToast(message, type = "success") {
  const toast = document.getElementById("toast");
  if (!toast) return;
  toast.textContent = message;
  toast.className = `toast ${type} show`;
  setTimeout(() => toast.classList.remove("show"), 2500);
}

async function api(path, options = {}) {
  const headers = { "Content-Type": "application/json", ...(options.headers || {}) };
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Request failed");
  return data;
}

function renderNavbar() {
  const user = getUser();
  const el = document.getElementById("navAuth");
  if (!el) return;
  if (user) {
    el.innerHTML = `<a href="profile.html">${user.username}</a> <button id="logoutBtn">Logout</button>`;
    document.getElementById("logoutBtn").onclick = () => {
      clearSession();
      showToast("Logged out");
      window.location.href = "index.html";
    };
  } else {
    el.innerHTML = `<a href="login.html">Login</a>`;
  }
}

function getFiltersFromUI() {
  return {
    search: document.getElementById("search")?.value || "",
    category: document.getElementById("category")?.value || "",
    skinType: document.getElementById("skinType")?.value || "",
    minPrice: document.getElementById("minPrice")?.value || "",
    maxPrice: document.getElementById("maxPrice")?.value || "",
    sort: document.getElementById("sort")?.value || "newest",
    page: document.getElementById("page")?.value || 1,
    limit: 8
  };
}

function buildQuery(obj) {
  const params = new URLSearchParams();
  Object.entries(obj).forEach(([k, v]) => {
    if (String(v).trim()) params.append(k, v);
  });
  return params.toString();
}

async function loadProducts() {
  const grid = document.getElementById("productsGrid");
  if (!grid) return;
  grid.innerHTML = `<p>Loading products...</p>`;
  const query = buildQuery(getFiltersFromUI());
  const data = await api(`/products?${query}`);
  state.products = data.items;
  state.pagination = data.pagination;
  grid.innerHTML = data.items
    .map(
      (p) => `<article class="card">
        <img loading="lazy" src="http://localhost:5000${p.image}" alt="${p.name}">
        <h3>${p.name}</h3><p>${p.category} | ${p.skin_type}</p><strong>Rs.${p.price}</strong>
        <div class="row"><a href="product.html?id=${p.id}">Details</a><button onclick="addToCart(${p.id})">Add</button></div>
      </article>`
    )
    .join("");
  document.getElementById("pageInfo").textContent = `${data.pagination.page}/${Math.max(1, data.pagination.pages)}`;
}

async function loadProductDetail() {
  const wrap = document.getElementById("productDetail");
  if (!wrap) return;
  const id = new URLSearchParams(location.search).get("id");
  const p = await api(`/products/${id}`);
  wrap.innerHTML = `<div class="detail"><img src="http://localhost:5000${p.image}" alt="${p.name}">
  <div><h2>${p.name}</h2><p>${p.description}</p><p>Category: ${p.category}</p><p>Skin Type: ${p.skin_type}</p><h3>Rs.${p.price}</h3>
  <button onclick="addToCart(${p.id})">Add to cart</button></div></div>`;
}

async function addToCart(productId) {
  try {
    await api("/cart/items", { method: "POST", body: JSON.stringify({ productId, quantity: 1 }) });
    showToast("Added to cart");
    updateCartCount();
  } catch (e) {
    showToast(e.message, "error");
    if (e.message.includes("Unauthorized")) window.location.href = "login.html";
  }
}

async function updateCartCount() {
  const badge = document.getElementById("cartCount");
  if (!badge || !getToken()) return;
  const data = await api("/cart");
  const count = data.items.reduce((s, i) => s + i.quantity, 0);
  badge.textContent = String(count);
}

async function loadCart() {
  const wrap = document.getElementById("cartWrap");
  if (!wrap) return;
  const data = await api("/cart");
  wrap.innerHTML = data.items.length
    ? data.items
        .map(
          (i) => `<div class="row item"><span>${i.name}</span><input type="number" min="1" value="${i.quantity}" onchange="changeQty(${i.product_id}, this.value)">
      <strong>Rs.${i.price * i.quantity}</strong><button onclick="removeItem(${i.product_id})">Remove</button></div>`
        )
        .join("") + `<h3>Total: Rs.${data.total}</h3>`
    : "<p>Cart is empty</p>";
}

async function changeQty(productId, quantity) {
  await api(`/cart/items/${productId}`, { method: "PATCH", body: JSON.stringify({ quantity: Number(quantity) }) });
  await loadCart();
  updateCartCount();
}

async function removeItem(productId) {
  await api(`/cart/items/${productId}`, { method: "DELETE" });
  await loadCart();
  updateCartCount();
}

async function placeOrder(e) {
  e.preventDefault();
  const address = {
    line1: document.getElementById("line1").value,
    city: document.getElementById("city").value,
    state: document.getElementById("state").value,
    postalCode: document.getElementById("postalCode").value
  };
  const paymentMethod = document.getElementById("paymentMethod").value;
  const data = await api("/orders", { method: "POST", body: JSON.stringify({ address, paymentMethod }) });
  showToast("Order placed");
  window.location.href = `orders.html?new=${data.order.id}`;
}

async function loadOrders() {
  const wrap = document.getElementById("ordersWrap");
  if (!wrap) return;
  const data = await api("/orders");
  wrap.innerHTML = data.items
    .map(
      (o) => `<article class="card"><h3>Order #${o.id} - ${o.order_status}</h3><p>Rs.${o.total}</p>
      ${o.items.map((i) => `<p>${i.name_snapshot} x ${i.quantity}</p>`).join("")}</article>`
    )
    .join("");
}

async function loadProfile() {
  const form = document.getElementById("profileForm");
  if (!form) return;
  const me = await api("/auth/me");
  document.getElementById("fullname").value = me.user.fullname;
  document.getElementById("skinTypeProfile").value = me.user.skin_type || "";
}

async function saveProfile(e) {
  e.preventDefault();
  await api("/users/profile", {
    method: "PATCH",
    body: JSON.stringify({ fullname: document.getElementById("fullname").value, skinType: document.getElementById("skinTypeProfile").value })
  });
  showToast("Profile updated");
}

async function savePassword(e) {
  e.preventDefault();
  await api("/users/change-password", {
    method: "PATCH",
    body: JSON.stringify({
      currentPassword: document.getElementById("currentPassword").value,
      newPassword: document.getElementById("newPassword").value
    })
  });
  showToast("Password changed");
  e.target.reset();
}

async function login(e) {
  e.preventDefault();
  const data = await api("/auth/login", {
    method: "POST",
    body: JSON.stringify({ loginId: document.getElementById("loginId").value, password: document.getElementById("password").value })
  });
  setSession(data);
  showToast("Login successful");
  window.location.href = "products.html";
}

async function register(e) {
  e.preventDefault();
  const data = await api("/auth/register", {
    method: "POST",
    body: JSON.stringify({
      fullname: document.getElementById("fullname").value,
      email: document.getElementById("email").value,
      username: document.getElementById("username").value,
      password: document.getElementById("password").value,
      skinType: document.getElementById("skinType").value
    })
  });
  setSession(data);
  showToast("Account created");
  window.location.href = "products.html";
}

async function loadAdminProducts() {
  const wrap = document.getElementById("adminProducts");
  if (!wrap) return;
  const data = await api("/products?limit=100&page=1");
  wrap.innerHTML = data.items
    .map((p) => `<div class="item row"><span>${p.name} (Rs.${p.price})</span><button onclick="deleteProduct(${p.id})">Delete</button></div>`)
    .join("");
}

async function createProduct(e) {
  e.preventDefault();
  await api("/products", {
    method: "POST",
    body: JSON.stringify({
      name: document.getElementById("pname").value,
      description: document.getElementById("pdesc").value,
      category: document.getElementById("pcategory").value,
      skinType: document.getElementById("pskinType").value,
      price: Number(document.getElementById("pprice").value),
      stock: Number(document.getElementById("pstock").value),
      image: document.getElementById("pimage").value
    })
  });
  showToast("Product created");
  e.target.reset();
  loadAdminProducts();
}

async function deleteProduct(id) {
  await api(`/products/${id}`, { method: "DELETE" });
  showToast("Product deleted");
  loadAdminProducts();
}

async function init() {
  renderNavbar();
  updateCartCount().catch(() => {});
  const page = document.body.dataset.page;
  if (page === "products") {
    const rerender = () => loadProducts().catch((e) => showToast(e.message, "error"));
    ["search", "category", "skinType", "minPrice", "maxPrice", "sort"].forEach((id) => {
      document.getElementById(id)?.addEventListener("change", rerender);
    });
    document.getElementById("prevPage")?.addEventListener("click", () => {
      const p = document.getElementById("page");
      p.value = Math.max(1, Number(p.value) - 1);
      rerender();
    });
    document.getElementById("nextPage")?.addEventListener("click", () => {
      const p = document.getElementById("page");
      p.value = Number(p.value) + 1;
      rerender();
    });
    rerender();
  }
  if (page === "product") loadProductDetail().catch((e) => showToast(e.message, "error"));
  if (page === "cart") loadCart().catch((e) => showToast(e.message, "error"));
  if (page === "checkout") document.getElementById("checkoutForm")?.addEventListener("submit", (e) => placeOrder(e).catch((er) => showToast(er.message, "error")));
  if (page === "orders") loadOrders().catch((e) => showToast(e.message, "error"));
  if (page === "profile") {
    loadProfile().catch((e) => showToast(e.message, "error"));
    document.getElementById("profileForm")?.addEventListener("submit", (e) => saveProfile(e).catch((er) => showToast(er.message, "error")));
    document.getElementById("passwordForm")?.addEventListener("submit", (e) => savePassword(e).catch((er) => showToast(er.message, "error")));
  }
  if (page === "login") document.getElementById("loginForm")?.addEventListener("submit", (e) => login(e).catch((er) => showToast(er.message, "error")));
  if (page === "register") document.getElementById("registerForm")?.addEventListener("submit", (e) => register(e).catch((er) => showToast(er.message, "error")));
  if (page === "admin") {
    document.getElementById("createProductForm")?.addEventListener("submit", (e) => createProduct(e).catch((er) => showToast(er.message, "error")));
    loadAdminProducts().catch((e) => showToast(e.message, "error"));
  }
}

document.addEventListener("DOMContentLoaded", init);

window.addToCart = addToCart;
window.changeQty = changeQty;
window.removeItem = removeItem;
window.deleteProduct = deleteProduct;
