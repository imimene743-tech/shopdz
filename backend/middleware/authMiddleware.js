const jwt = require("jsonwebtoken");
const db = require("../config/db");

const protect = async (req, res, next) => {
  let token;

  // Vérifier header Authorization
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {

    try {

      // extraire token
      token = req.headers.authorization.split(" ")[1];

      // vérifier token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // récupérer utilisateur depuis la base
      const [users] = await db.query(
        "SELECT id, name, email, role FROM users WHERE id = ?",
        [decoded.id]
      );

      if (users.length === 0) {
        return res.status(401).json({ message: "Utilisateur introuvable" });
      }

      // stocker utilisateur
      req.user = users[0];

      next();

    } catch (error) {
      console.error("Erreur JWT:", error.message);
      return res.status(401).json({ message: "Token invalide ou expiré" });
    }

  } else {

    return res.status(401).json({
      message: "Accès refusé. Token manquant"
    });

  }
};








// Middleware pour restreindre l'accès uniquement aux admins
const admin = (req, res, next) => {
  // On vérifie le rôle stocké dans req.user par le middleware protect
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: "Accès refusé. Réservé à l'administrateur." });
  }
};

module.exports = { protect, admin };