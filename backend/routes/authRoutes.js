const express = require("express");
const router = express.Router();
// On importe les fonctions register et login depuis ton contrôleur
const { register, login } = require("../controllers/authController"); 
const { protect } = require("../middleware/authMiddleware");

// --- ROUTES RÉELLES ---

// Cette route va maintenant hacher le mot de passe et enregistrer en DB
router.post("/register", register); 

// Cette route va vérifier le mot de passe haché et inclure l'ID dans le token
router.post("/login", login);

// Route pour voir son profil (utilise le token pour savoir qui est connecté)
router.get("/profile", protect, (req, res) => {
  res.json({
    message: "Profil utilisateur",
    user: req.user
  });
});

module.exports = router;