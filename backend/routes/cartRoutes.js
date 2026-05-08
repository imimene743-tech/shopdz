const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cartController");
const { protect } = require("../middleware/authMiddleware");

// Toutes les routes protégées
router.get("/", protect, cartController.getCart);
router.post("/", protect, cartController.addToCart);
router.delete("/:id", protect, cartController.deleteCartItem);

module.exports = router;
