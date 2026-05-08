import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProduct, getCategories } from '../services/api';
import { notifySuccess, notifyError } from '../utils/notify';
import { colors } from '../utils/theme';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const ProductPage = ({ onAddToCart }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    getProduct(id)
      .then(res => setProduct(res.data))
      .catch(err => notifyError("Erreur lors du chargement du produit"));
  }, [id]);

  if (!product) return <p style={{ textAlign: 'center', padding: '2rem' }}>Chargement...</p>;

  // Construction de l'URL de l'image (identique à ton ProductCard)
  const imageUrl = product.image
    ? `http://localhost:5000/uploads/${product.image}`
    : 'https://via.placeholder.com/500x400?text=Shop+DZ';

  return (
    <div style={containerStyle}>
      {/* Bouton pour revenir en arrière */}
      <button onClick={() => navigate(-1)} style={backButtonStyle}>
        <ArrowBackIcon /> Retour aux produits
      </button>

      <div style={contentStyle}>
        {/* Colonne de Gauche : Grande Image */}
        <div style={imageSectionStyle}>
          <img src={imageUrl} alt={product.name} style={imageStyle} />
        </div>

        {/* Colonne de Droite : Infos détaillées */}
        <div style={infoSectionStyle}>
          <h1 style={{ color: colors.gray.dark, marginBottom: '0.5rem' }}>{product.name}</h1>
          
          <div style={priceContainerStyle}>
            {product.promotion_price ? (
              <>
                <span style={priceStyle}>{product.promotion_price} DA</span>
                <span style={oldPriceStyle}>{product.price} DA</span>
              </>
            ) : (
              <span style={priceStyle}>{product.price} DA</span>
            )}
          </div>

          <p style={descriptionStyle}>
            {product.description || "Aucune description détaillée disponible pour cet article."}
          </p>

          <div style={{ margin: '1.5rem 0', color: product.stock > 0 ? '#4CAF50' : '#F44336', fontWeight: 'bold' }}>
            {product.stock > 0 ? `En stock (${product.stock} disponibles)` : 'Rupture de stock'}
          </div>

          <button
            style={{
              ...buyButtonStyle,
              backgroundColor: product.stock > 0 ? colors.mauve.primary : colors.gray.medium,
              cursor: product.stock > 0 ? 'pointer' : 'not-allowed',
            }}
            onClick={() => {
              if (product.stock > 0) {
                onAddToCart(product);
                notifySuccess("Produit ajouté au panier");
              }
            }}
            disabled={product.stock === 0}
          >
            <AddShoppingCartIcon /> Ajouter au panier
          </button>
        </div>
      </div>
    </div>
  );
};

// Styles en ligne pour la mise en page "Professionnelle"
const containerStyle = { maxWidth: '1200px', margin: '0 auto', padding: '2rem' };
const backButtonStyle = { display: 'flex', alignItems: 'center', gap: '0.5rem', border: 'none', background: 'none', cursor: 'pointer', color: colors.mauve.primary, fontWeight: 'bold', marginBottom: '1rem' };
const contentStyle = { display: 'flex', flexWrap: 'wrap', gap: '3rem', backgroundColor: colors.white, padding: '2rem', borderRadius: '15px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' };
const imageSectionStyle = { flex: '1 1 400px' };
const imageStyle = { width: '100%', borderRadius: '10px', objectFit: 'cover', maxHeight: '500px' };
const infoSectionStyle = { flex: '1 1 400px', display: 'flex', flexDirection: 'column' };
const priceContainerStyle = { display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' };
const priceStyle = { fontSize: '2rem', fontWeight: 'bold', color: colors.mauve.primary };
const oldPriceStyle = { fontSize: '1.2rem', color: colors.gray.medium, textDecoration: 'line-through' };
const descriptionStyle = { fontSize: '1.1rem', lineHeight: '1.6', color: colors.gray.dark, borderTop: `1px solid ${colors.gray.light}`, paddingTop: '1rem' };
const buyButtonStyle = { padding: '1rem 2rem', color: 'white', border: 'none', borderRadius: '8px', fontSize: '1.2rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', marginTop: 'auto' };

export default ProductPage;