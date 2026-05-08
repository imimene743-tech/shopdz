const express = require("express");
const router = express.Router();
const db = require("../config/db");

// 📌 GET toutes les catégories
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM categories");
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// 📌 POST ajouter catégorie
router.post("/", async (req, res) => {
  try {
    const { name } = req.body;
    await db.query("INSERT INTO categories (name) VALUES (?)", [name]);
    res.json({ message: "Catégorie ajoutée" });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
  }
});

module.exports = router;