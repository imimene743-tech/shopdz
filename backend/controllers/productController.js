const db = require("../config/db");
const fs = require("fs");
const path = require("path");

// 🔹 1. Récupérer tous les produits (Site + Admin)
const getProducts = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT products.*, categories.name AS category_name 
      FROM products 
      LEFT JOIN categories ON products.category_id = categories.id
      ORDER BY products.created_at DESC
    `);
    res.json(rows);
  } catch (error) {
    console.error("Erreur récupération:", error);
    res.status(500).json({ message: "Erreur lors de la récupération des produits" });
  }
};

// 🔹 2. Rechercher des produits
const searchProducts = async (req, res) => {
  try {
    const { search } = req.query;
    if (!search) return res.status(400).json({ message: "Terme de recherche vide" });

    const [rows] = await db.query(
      "SELECT * FROM products WHERE name LIKE ? OR description LIKE ?",
      [`%${search}%`, `%${search}%`]
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: "Erreur recherche" });
  }
};






// 🔹 Nouvelle fonction pour un seul produit





const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.query(`
      SELECT products.*, categories.name AS category_name 
      FROM products 
      LEFT JOIN categories ON products.category_id = categories.id
      WHERE products.id = ?
    `, [id]);

    if (rows.length === 0) {
      return res.status(404).json({ message: "Produit non trouvé" });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error("Erreur:", error);
    res.status(500).json({ message: "Erreur lors de la récupération du produit" });
  }
};


























































































































// 🔹 3. Ajouter un produit (Compatible adminRoutes -> addProduct)
const addProduct = async (req, res)=> {





  try {
    const { name, description, price, promotion_price, stock, category_id } = req.body;
    
    if (!req.file) {
      return res.status(400).json({ message: "Veuillez uploader une photo." });
    }


const imageName = req.file.path;






    const query = `
      INSERT INTO products (name, description, price, promotion_price, stock, category_id, image) 
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    await db.query(query, [
      name, description, price, 
      promotion_price || null, 
      stock, category_id, imageName
    ]);

    res.status(201).json({ message: "Produit ajouté avec succès !" });
  } catch (error) {
    console.error("Erreur ajout:", error);
    res.status(500).json({ message: "Erreur lors de l'ajout." });
  }
};

// 🔹 4. Supprimer un produit (Base de données + Fichier physique)
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    // 1. Trouver le nom de l'image avant de supprimer
    const [product] = await db.query("SELECT image FROM products WHERE id = ?", [id]);
    
    if (product.length === 0) {
      return res.status(404).json({ message: "Produit non trouvé" });
    }

    // 2. Supprimer le fichier image du dossier uploads
    const imagePath = path.join(__dirname, "../../uploads", product[0].image);
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }

    // 3. Supprimer de la DB
    await db.query("DELETE FROM products WHERE id = ?", [id]);

    res.json({ message: "Produit et image supprimés !" });
  } catch (error) {
    console.error("Erreur suppression:", error);
    res.status(500).json({ message: "Erreur de suppression" });
  }
};

// 🔹 5. Modifier un produit (Gestion du remplacement d'image)
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, promotion_price, stock, category_id } = req.body;

    // Récupérer l'ancienne image pour la supprimer si on en met une nouvelle
    const [oldProduct] = await db.query("SELECT image FROM products WHERE id = ?", [id]);

    let query = "UPDATE products SET name=?, description=?, price=?, promotion_price=?, stock=?, category_id=? WHERE id=?";
    let params = [name, description, price, promotion_price || null, stock, category_id, id];

    if (req.file) {
      // Supprimer l'ancienne image physiquement
      if (oldProduct.length > 0) {
        const oldImagePath = path.join(__dirname, "../../uploads", oldProduct[0].image);
        if (fs.existsSync(oldImagePath)) fs.unlinkSync(oldImagePath);
      }

      // Mettre à jour avec la nouvelle image
      query = "UPDATE products SET name=?, description=?, price=?, promotion_price=?, stock=?, category_id=?, image=? WHERE id=?";
      params = [name, description, price, promotion_price || null, stock, category_id, req.file.filename, id];
    }

    await db.query(query, params);
    res.json({ message: "Produit mis à jour avec succès !" });
  } catch (error) {
    console.error("Erreur update:", error);
    res.status(500).json({ message: "Erreur de mise à jour" });
  }
};




// 🔹 6. Récupérer plusieurs produits par leurs IDs (Pour les favoris du profil)
const getProductsByIds = async (req, res) => {
  try {
    const { ids } = req.body; // Récupère le tableau d'IDs [1, 15, ...]
    
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.json([]); // Renvoie un tableau vide si aucun favori
    }

    // Requête SQL pour récupérer les noms et prix de ces produits spécifiques
    const [rows] = await db.query(
      "SELECT id, name, price, image FROM products WHERE id IN (?)",
      [ids]
    );

    res.json(rows);
  } catch (error) {
    console.error("Erreur récupération favoris:", error);
    res.status(500).json({ message: "Erreur lors de la récupération des favoris" });
  }
};

















































// Exportation de toutes les fonctions pour les routes
module.exports = { 
  getProducts, 
  getProductById,

  getProductsByIds,

  searchProducts, 
  addProduct, 
  deleteProduct, 
  updateProduct 
};