const db = require("../config/db");

// 🔹 Récupérer toutes les wilayas
exports.getWilayas = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM wilayas ORDER BY name ASC");
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
  }
};
