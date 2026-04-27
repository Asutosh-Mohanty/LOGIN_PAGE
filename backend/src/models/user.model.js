const { all, get, run } = require("../config/db");

function findByEmail(email) {
  return get("SELECT * FROM users WHERE email = ?", [email]);
}
function findByUsername(username) {
  return get("SELECT * FROM users WHERE username = ?", [username]);
}
function findById(id) {
  return get(
    "SELECT id, fullname, email, username, skin_type, role, created_at FROM users WHERE id = ?",
    [id]
  );
}
async function createUser(data) {
  const result = await run(
    "INSERT INTO users (fullname, email, username, password_hash, skin_type, role) VALUES (?, ?, ?, ?, ?, ?)",
    [data.fullname, data.email, data.username, data.passwordHash, data.skinType || "", data.role || "user"]
  );
  return findById(result.id);
}
async function updateProfile(id, data) {
  await run("UPDATE users SET fullname = ?, skin_type = ? WHERE id = ?", [data.fullname, data.skinType || "", id]);
  return findById(id);
}
function updatePassword(id, passwordHash) {
  return run("UPDATE users SET password_hash = ? WHERE id = ?", [passwordHash, id]);
}
function listUsers() {
  return all("SELECT id, fullname, email, username, skin_type, role, created_at FROM users ORDER BY id DESC");
}

module.exports = {
  findByEmail,
  findByUsername,
  findById,
  createUser,
  updateProfile,
  updatePassword,
  listUsers
};
