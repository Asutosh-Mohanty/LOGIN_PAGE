const jwt = require("jsonwebtoken");

function createToken(user) {
  return jwt.sign(
    { id: user.id, role: user.role, username: user.username },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
}

module.exports = { createToken };
