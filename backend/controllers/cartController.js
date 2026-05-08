const db = require("../config/db");

// 🔹 1. Récupérer le panier (avec les infos produits et images)
exports.getCart = async (req, res) => {
  try {
    // Sécurité : Vérifier si req.user existe (via le middleware protect)
    const userId = req.user ? req.user.id : null;

    if (!userId) {
      return res.status(401).json({ message: "Utilisateur non identifié" });
    }

    const [rows] = await db.query(`
      SELECT 
        cart.id,
        cart.quantity,
        products.id AS product_id,
        products.name,
        products.price,
        products.image
      FROM cart
      JOIN products ON cart.product_id = products.id
      WHERE cart.user_id = ?
    `, [userId]);

    res.json(rows);
  } catch (error) {
    console.error("Erreur récupération panier:", error);
    res.status(500).json({ message: "Erreur lors de la récupération du panier" });
  }
};

// 🔹 2. Ajouter au panier (Version sécurisée contre les erreurs SQL)
exports.addToCart = async (req, res) => {
  try {
    const userId = req.user ? req.user.id : null;
    const { product_id, quantity } = req.body;

    // 🛑 Bloquer si l'utilisateur est vide pour éviter le crash SQL
    if (!userId) {
      return res.status(401).json({ message: "Erreur : Token manquant ou invalide" });
    }

    // 🛑 Vérifier si le produit existe vraiment avant d'insérer
    const [productCheck] = await db.query("SELECT id FROM products WHERE id = ?", [product_id]);
    if (productCheck.length === 0) {
      return res.status(404).json({ message: "Erreur : Ce produit n'existe pas" });
    }

    // Vérifier si le produit est déjà dans le panier
    const [existing] = await db.query(
      "SELECT * FROM cart WHERE user_id = ? AND product_id = ?",
      [userId, product_id]
    );

    if (existing.length > 0) {
      // Si oui, on additionne la nouvelle quantité
      await db.query(
        "UPDATE cart SET quantity = quantity + ? WHERE user_id = ? AND product_id = ?",
        [quantity, userId, product_id]
      );
      return res.json({ message: "Quantité mise à jour dans le panier" });
    }

    // Sinon, on crée une nouvelle ligne (Sans NULL !)
    await db.query(
      "INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, ?)",
      [userId, product_id, quantity]
    );

    res.json({ message: "Produit ajouté au panier !" });
  } catch (error) {
    console.error("Détail Erreur SQL:", error);
    res.status(500).json({ message: "Erreur lors de l'ajout au panier" });
  }
};

// 🔹 3. Supprimer un produit du panier
exports.deleteCartItem = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user ? req.user.id : null;

    if (!userId) {
      return res.status(401).json({ message: "Action non autorisée" });
    }

    await db.query(
      "DELETE FROM cart WHERE id = ? AND user_id = ?",
      [id, userId]
    );

    res.json({ message: "Produit retiré du panier" });
  } catch (error) {
    console.error("Erreur suppression panier:", error);
    res.status(500).json({ message: "Erreur lors de la suppression" });
  }
};