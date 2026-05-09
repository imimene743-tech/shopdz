const express = require("express");
const cors = require("cors");
require("dotenv").config();
const db = require("./config/db");

// 1. Import des routes
const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");
const orderRoutes = require("./routes/orderRoutes");
const wilayaRoutes = require("./routes/wilayaRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const userRoutes = require('./routes/userRoutes'); // Route pour voir les clients
const adminRoutes = require("./routes/adminRoutes");

const app = express();














// 2. MIDDLEWARES (DOIVENT ÊTRE AVANT LES ROUTES)
// C'est ici que l'on autorise ton frontend localhost:3000
app.use(cors({
  origin: ['http://localhost:3000', 'https://shopdz-ten.vercel.app'],
  credentials: true,
}));











// Permet de lire les données JSON envoyées par le frontend
app.use(express.json());

// Dossier pour tes images de produits
app.use("/uploads", express.static("uploads"));

// 3. DÉCLARATION DES ROUTES API
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/wilayas", wilayaRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/admin", adminRoutes);

// Cette ligne permet d'accéder à /api/users pour l'admin
app.use('/api', userRoutes); 

// 4. ROUTE DE TEST & GESTION D'ERREURS
app.get("/", (req, res) => {
  res.send("🚀 API ShopDZ fonctionne !");
});

const { errorHandler } = require("./middleware/errorMiddleware");
app.use(errorHandler);

// 5. LANCEMENT DU SERVEUR
const PORT = process.env.PORT || 5000;

(async () => {
  try {
    await db.query("SELECT 1");
    console.log("✅ Connecté à la base de données e-commerceDZ (XAMPP)");
  } catch (err) {
    console.error("❌ Erreur connexion MySQL :", err);
  }
})();

app.listen(PORT, () => {
  console.log(`✅ Serveur lancé sur le port ${PORT}`);
});