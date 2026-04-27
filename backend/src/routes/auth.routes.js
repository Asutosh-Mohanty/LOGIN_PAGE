const express = require("express");
const { body } = require("express-validator");
const { register, login, me } = require("../controllers/auth.controller");
const { protect } = require("../middleware/auth.middleware");

const router = express.Router();

router.post(
  "/register",
  [
    body("fullname").isLength({ min: 2 }),
    body("email").isEmail(),
    body("username").isLength({ min: 3 }),
    body("password").isLength({ min: 6 })
  ],
  register
);
router.post("/login", [body("loginId").notEmpty(), body("password").notEmpty()], login);
router.get("/me", protect, me);

module.exports = router;
