const express = require("express");
const router = express.Router();

// Import du contrôleur que tu as partagé
const orderController = require("../controllers/orderController");

// Import du middleware de protection (le token)
const { protect } = require("../middleware/authMiddleware");

/**
 * @route   POST /api/orders
 * @desc    Créer une nouvelle commande (Checkout)
 * @access  Privé (Utilisateur connecté)
 */
router.post("/", protect, orderController.createOrder);

/**
 * @route   GET /api/orders/user
 * @desc    Récupérer l'historique des commandes de l'utilisateur
 * @access  Privé (Utilisateur connecté)
 */
// Assure-toi d'avoir une fonction getOrders exportée dans ton contrôleur
router.get("/user", protect, orderController.getOrders);

module.exports = router;