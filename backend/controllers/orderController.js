const db = require("../config/db");



// Fonction pour mettre à jour le statut
exports.updateOrderStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    try {
        const [result] = await db.query(
            "UPDATE orders SET status = ? WHERE id = ?",
            [status, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Commande non trouvée" });
        }

        res.json({ message: "Statut mis à jour avec succès" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur lors de la mise à jour sur le serveur" });
    }
};












































// 🔹 1. Créer une commande (Checkout)
exports.createOrder = async (req, res) => {
  const connection = await db.getConnection();
  try {
    const userId = req.user.id;
    // Ajout de phone et address récupérés du corps de la requête
    const { wilaya_id, phone, address } = req.body;

    // --- AJOUT DE LA VALIDATION DU NUMÉRO ALGÉRIEN ---
    const phoneRegex = /^0(5|6|7)[0-9]{8}$/;
    if (!phone || !phoneRegex.test(phone)) {
      return res.status(400).json({ 
        message: "Numéro de téléphone invalide. Il doit commencer par 05, 06 ou 07 et contenir 10 chiffres." 
      });
    }

    if (!address || address.trim().length < 5) {
      return res.status(400).json({ message: "Veuillez fournir une adresse de livraison valide." });
    }
    // ------------------------------------------------

    await connection.beginTransaction();

    const [cartItems] = await connection.query(`
      SELECT cart.*, products.price, products.name, products.stock
      FROM cart
      JOIN products ON cart.product_id = products.id
      WHERE cart.user_id = ?
    `, [userId]);

    if (cartItems.length === 0) {
      return res.status(400).json({ message: "Votre panier est vide" });
    }

    let totalProduits = 0;
    for (const item of cartItems) {
      if (item.stock < item.quantity) {
        throw new Error(`Stock insuffisant pour le produit : ${item.name}`);
      }
      totalProduits += item.price * item.quantity;
    }

    const [wilayaData] = await connection.query(
      "SELECT name, shipping_price FROM wilayas WHERE id = ?",
      [wilaya_id]
    );

    if (wilayaData.length === 0) {
      return res.status(400).json({ message: "Wilaya invalide" });
    }

    const { name: wilayaName, shipping_price: shippingPrice } = wilayaData[0];
    const totalFinal = parseFloat(totalProduits) + parseFloat(shippingPrice);

    // MODIFIÉ : Ajout des colonnes phone et address dans l'INSERT
    const [orderResult] = await connection.query(
      "INSERT INTO orders (user_id, total_price, wilaya, status, shipping_price, phone, address) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [userId, totalFinal, wilayaName, "en_attente", shippingPrice, phone, address]
    );

    const orderId = orderResult.insertId;

    for (const item of cartItems) {
      await connection.query(
        "INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)",
        [orderId, item.product_id, item.quantity, item.price]
      );

      await connection.query(
        "UPDATE products SET stock = stock - ? WHERE id = ?",
        [item.quantity, item.product_id]
      );
    }

    await connection.query("DELETE FROM cart WHERE user_id = ?", [userId]);

    await connection.commit();
    res.status(201).json({ message: "Commande réussie !", order_id: orderId, total: totalFinal });

  } catch (error) {
    if (connection) await connection.rollback();
    console.error("Erreur Checkout:", error);
    res.status(500).json({ message: error.message || "Erreur lors de la commande" });
  } finally {
    if (connection) connection.release();
  }
};

// 🔹 2. Voir ses commandes avec les noms des produits
exports.getOrders = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const [rows] = await db.query(`
      SELECT 
        o.*, 
        GROUP_CONCAT(p.name SEPARATOR ', ') as product_names
      FROM orders o
      JOIN order_items oi ON o.id = oi.order_id
      JOIN products p ON oi.product_id = p.id
      WHERE o.user_id = ?
      GROUP BY o.id
      ORDER BY o.created_at DESC
    `, [userId]);

    res.json(rows);
  } catch (error) {
    console.error("Erreur historique détaillée:", error);
    res.status(500).json({ message: "Erreur lors de la récupération des noms" });
  }
};

// 🔹 3. Voir toutes les commandes (Pour l'Admin)
exports.getAllOrders = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT orders.*, users.name as client_name 
      FROM orders 
      JOIN users ON orders.user_id = users.id 
      ORDER BY orders.created_at DESC
    `);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: "Erreur Admin" });
  }
};