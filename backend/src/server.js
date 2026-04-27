require("dotenv").config();
const app = require("./app");
const { initDb } = require("./config/db");
const { seed } = require("./utils/seed");

const PORT = process.env.PORT || 5000;

async function boot() {
  await initDb();
  await seed();
  app.listen(PORT, () => {
    console.log(`GlowCart backend running on http://localhost:${PORT}`);
  });
}

boot().catch((err) => {
  console.error("Failed to start server:", err.message);
  process.exit(1);
});
