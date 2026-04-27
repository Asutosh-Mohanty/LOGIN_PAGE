const express = require("express");
const { body } = require("express-validator");
const { protect, requireAdmin } = require("../middleware/auth.middleware");
const { updateProfile, changePassword, listUsers } = require("../controllers/user.controller");

const router = express.Router();

router.patch("/profile", protect, [body("fullname").isLength({ min: 2 })], updateProfile);
router.patch(
  "/change-password",
  protect,
  [body("currentPassword").isLength({ min: 6 }), body("newPassword").isLength({ min: 6 })],
  changePassword
);
router.get("/", protect, requireAdmin, listUsers);

module.exports = router;
