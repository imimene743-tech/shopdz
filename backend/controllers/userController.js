const db = require("../config/db");

// On utilise le nom "getAllUsers" pour correspondre à la route
const getAllUsers = async (req, res) => {
  try {
    // La requête est correcte par rapport à ta table 'users'
    const [rows] = await db.query(
      "SELECT id, name, email, role, created_at FROM users WHERE role = 'client' ORDER BY created_at DESC"
    );
    res.json(rows);
  } catch (error) {
    console.error("Erreur récup clients:", error);
    res.status(500).json({ message: "Erreur lors de la récupération des clients" });
  }
};

module.exports = { getAllUsers };