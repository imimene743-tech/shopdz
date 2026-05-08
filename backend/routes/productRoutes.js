const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const upload = require("../middleware/uploadMiddleware");
const { protect } = require("../middleware/authMiddleware");
const { adminOnly, isAdmin } = require("../middleware/adminMiddleware"); // Sécurité admin

// 🔹 1. Lire tous les produits (public)
router.get("/", productController.getProducts);

// 🔹 2. Rechercher un produit (public)
router.get("/search", productController.searchProducts);


//favoris
router.post("/get-by-ids", productController.getProductsByIds);



router.get("/:id", productController.getProductById);










// 🔹 3. Ajouter un produit (Admin uniquement)
router.post("/add", protect, isAdmin, upload.single("image"), productController.addProduct);

// 🔹 4. Supprimer un produit (Admin uniquement)
router.delete("/:id", protect, isAdmin, productController.deleteProduct);

module.exports = router;
