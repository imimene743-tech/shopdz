// src/components/ProductCard.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { colors } from '../utils/theme';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

const ProductCard = ({ product, onAddToCart, onToggleFavorite, isFavorite }) => {
  const navigate = useNavigate();

  // 🔹 Transforme le nom du fichier en URL complète pour le backend uploads
  const imageUrl = product.image
    ? `http://localhost:5000/uploads/${product.image}`
    : 'https://via.placeholder.com/300x200?text=Shop+DZ';

  const cardStyle = {
    backgroundColor: colors.white,
    borderRadius: '10px',
    overflow: 'hidden',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    transition: 'transform 0.3s, box-shadow 0.3s',
    cursor: 'pointer',
    position: 'relative',
  };

  const imageStyle = {
    width: '100%',
    height: '200px',
    objectFit: 'cover',
    borderBottom: `1px solid ${colors.gray.medium}`,
  };

  const infoStyle = {
    padding: '1rem',
  };

  const nameStyle = {
    fontSize: '1.1rem',
    fontWeight: 'bold',
    marginBottom: '0.5rem',
    color: colors.gray.dark,
  };

  const priceContainerStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    marginBottom: '0.5rem',
  };

  const priceStyle = {
    fontSize: '1.2rem',
    fontWeight: 'bold',
    color: colors.mauve.primary,
  };

  const oldPriceStyle = {
    fontSize: '1rem',
    color: colors.gray.medium,
    textDecoration: 'line-through',
  };

  const buttonStyle = {
    width: '100%',
    padding: '0.8rem',
    backgroundColor: colors.mauve.primary,
    color: colors.white,
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: 'bold',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
  };

  const stockStyle = {
    fontSize: '0.9rem',
    color: product.stock > 0 ? '#4CAF50' : '#F44336',
    marginBottom: '0.5rem',
  };

  const favoriteStyle = {
    position: 'absolute',
    top: '10px',
    right: '10px',
    backgroundColor: colors.white,
    borderRadius: '50%',
    width: '35px',
    height: '35px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
    border: 'none',
    color: isFavorite ? '#F44336' : colors.gray.medium,
    zIndex: 2,
  };

  const discountBadgeStyle = {
    position: 'absolute',
    top: '10px',
    left: '10px',
    backgroundColor: colors.mauve.primary,
    color: colors.white,
    padding: '0.3rem 0.8rem',
    borderRadius: '15px',
    fontSize: '0.9rem',
    fontWeight: 'bold',
    zIndex: 2,
  };

  const handleCardClick = () => {
    navigate(`/product/${product.id}`);
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (product.stock > 0) {
      onAddToCart(product);
    }
  };

  const handleToggleFavorite = (e) => {
    e.stopPropagation();
    onToggleFavorite(product);
  };

  const discount = product.promotion_price
    ? Math.round((1 - product.promotion_price / product.price) * 100)
    : 0;

  return (
    <div style={cardStyle} onClick={handleCardClick}>
      {product.promotion_price && product.promotion_price < product.price && (
        <div style={discountBadgeStyle}>-{discount}%</div>
      )}

      <button style={favoriteStyle} onClick={handleToggleFavorite}>
        {isFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
      </button>

      <img src={imageUrl} alt={product.name} style={imageStyle} />

      <div style={infoStyle}>
        <div style={nameStyle}>{product.name}</div>

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

        <div style={stockStyle}>
          {product.stock > 0 ? `En stock (${product.stock})` : 'Rupture de stock'}
        </div>

        <button
          style={{
            ...buttonStyle,
            backgroundColor: product.stock > 0 ? colors.mauve.primary : colors.gray.medium,
            cursor: product.stock > 0 ? 'pointer' : 'not-allowed',
          }}
          onClick={handleAddToCart}
          disabled={product.stock === 0}
        >
          <AddShoppingCartIcon />
          {product.stock > 0 ? 'Ajouter au panier' : 'Indisponible'}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;