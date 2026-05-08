import React, { useState } from "react";
import axios from "axios";

const AddProduct = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    promotion_price: "",
    stock: "",
    category_id: ""
  });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 🔹 1. RÉCUPÉRATION ET NETTOYAGE DU TOKEN
    let token = localStorage.getItem("shopdzToken");
    
    // Sécurité supplémentaire : si le stockage contient la string "undefined"
    if (!token || token === "undefined" || token === "null") {
      alert("❌ Session expirée ou invalide. Veuillez vous reconnecter.");
      return;
    }

    if (!image) { 
      alert("Veuillez choisir une image"); 
      return; 
    }

    // 🔹 2. PRÉPARATION DES DONNÉES (FormData pour l'image)
    const data = new FormData();
    Object.keys(formData).forEach(key => {
      data.append(key, formData[key]);
    });
    data.append("image", image);

    try {
      setLoading(true);

      // 🔹 3. ENVOI AVEC L'EN-TÊTE EXACT
      const response = await axios.post(
        "http://localhost:5000/api/products/add", 
        data, 
        {
          headers: {
            // L'espace après 'Bearer' est CRUCIAL
            "Authorization": `Bearer ${token}`, 
            "Content-Type": "multipart/form-data"
          }
        }
      );

      console.log("Succès:", response.data);
      alert("✅ Produit ajouté avec succès !");
      
      // Reset du formulaire
      setFormData({ name: "", description: "", price: "", promotion_price: "", stock: "", category_id: "" });
      setImage(null); 
      setPreview(null);

    } catch (err) {
      console.error("Détails de l'erreur:", err.response?.data || err.message);
      
      // Si le serveur dit que le token est mauvais, on aide l'utilisateur
      if (err.response?.status === 401 || err.response?.status === 403) {
        alert("🔒 Erreur d'authentification : Votre session n'est plus valide.");
      } else {
        alert(err.response?.data?.message || "Erreur lors de l'envoi");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-add-product">
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <h3>Informations du produit</h3>
        <input type="text" placeholder="Nom du produit" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
        <textarea placeholder="Description" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} required />
        
        <div style={{ display: 'flex', gap: '10px' }}>
            <input type="number" placeholder="Prix (DA)" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} required />
            <input type="number" placeholder="Stock" value={formData.stock} onChange={e => setFormData({...formData, stock: e.target.value})} required />
        </div>

        <select value={formData.category_id} onChange={e => setFormData({...formData, category_id: e.target.value})} required>
          <option value="">Sélectionner une catégorie</option>
          <option value="1">Chaussures</option>
          <option value="2">Vêtements</option>
          <option value="4"> Mode et Accessoires</option>
          <option value="5">electronique</option>
          <option value="6">sport et loisirs</option>
             
        </select>

        <label style={{ marginTop: '10px', fontWeight: 'bold' }}>Image du produit :</label>
        <input 
            type="file" 
            accept="image/*"
            onChange={e => { 
                const file = e.target.files[0];
                setImage(file); 
                if (file) setPreview(URL.createObjectURL(file)); 
            }} 
        />
        
        {preview && (
            <div style={{ marginTop: '10px' }}>
                <p style={{ fontSize: '0.8rem' }}>Aperçu :</p>
                <img src={preview} alt="Aperçu" style={{ width: '120px', borderRadius: '5px', border: '1px solid #ddd' }} />
            </div>
        )}

        <button 
            type="submit" 
            disabled={loading} 
            style={{ 
                backgroundColor: '#ff0088', 
                color: 'white', 
                padding: '12px', 
                border: 'none', 
                borderRadius: '5px',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontWeight: 'bold',
                marginTop: '15px'
            }}
        >
          {loading ? "Chargement..." : "🚀 Publier sur ShopDZ"}
        </button>
      </form>
    </div>
  );
};

export default AddProduct;