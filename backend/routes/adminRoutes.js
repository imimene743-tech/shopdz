const express = require("express");
const router = express.Router();

// Import des contrôleurs
const productController = require("../controllers/productController");
const orderController = require("../controllers/orderController");

// Import des middlewares de sécurité
const { protect } = require("../middleware/authMiddleware");
const { admin } = require("../middleware/authMiddleware"); // Utilise celui qu'on a créé ensemble
const upload = require("../middleware/uploadMiddleware"); // Pour les images

// --- 1. ROUTE DE VÉRIFICATION (Ton code actuel) ---
router.get("/dashboard", protect, admin, (req, res) => {
  res.json({
    message: "Bienvenue Admin",
    admin: req.user
  });
});

// --- 2. GESTION DES PRODUITS ---

// Ajouter un produit (avec image)
router.post("/products", protect, admin, upload.single("image"), productController.addProduct);

// Supprimer un produit
router.delete("/products/:id", protect, admin, productController.deleteProduct);

// Modifier un produit
router.put("/products/:id", protect, admin, upload.single("image"), productController.updateProduct);

// --- 3. GESTION DES COMMANDES ---

// Voir toutes les commandes de la boutique
router.get("/orders", protect, admin, orderController.getAllOrders);
//status

router.put("/orders/:id/status", protect, admin, orderController.updateOrderStatus);




module.exports = router;