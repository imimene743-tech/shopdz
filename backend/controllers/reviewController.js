const db = require("../config/db");

// ajouter review
exports.addReview = async (req, res) => {
  try {
    console.log("Route addReview appelée");

    const { product_id, rating, comment } = req.body;
    const user_id = req.user ? req.user.id : 3; // test si pas de token

    const sql = `
      INSERT INTO reviews (user_id, product_id, rating, comment)
      VALUES (?, ?, ?, ?)
    `;

    await db.query(sql, [user_id, product_id, rating, comment]);

    return res.status(201).json({
      success: true,
      message: "Review ajoutée avec succès"
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Erreur lors de l'ajout de la review"
    });
  }
};


// récupérer les reviews d’un produit
exports.getReviewsByProduct = async (req, res) => {
  try {
    console.log("Route getReviewsByProduct appelée");

    const productId = req.params.productId;

    const sql = `
      SELECT reviews.*, users.name
      FROM reviews
      JOIN users ON reviews.user_id = users.id
      WHERE product_id = ?
    `;

    const [reviews] = await db.query(sql, [productId]);

    return res.status(200).json(reviews);

  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération des reviews"
    });
  }
};