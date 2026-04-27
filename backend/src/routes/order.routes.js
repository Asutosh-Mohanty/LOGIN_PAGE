const express = require("express");
const { body } = require("express-validator");
const { protect } = require("../middleware/auth.middleware");
const { placeOrder, listOrders } = require("../controllers/order.controller");

const router = express.Router();

router.use(protect);
router.get("/", listOrders);
router.post(
  "/",
  [
    body("address.line1").isLength({ min: 4 }),
    body("address.city").notEmpty(),
    body("address.state").notEmpty(),
    body("address.postalCode").isLength({ min: 4 }),
    body("paymentMethod").notEmpty()
  ],
  placeOrder
);

module.exports = router;
