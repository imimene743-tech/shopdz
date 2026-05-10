import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProduct } from '../services/api';
import { notifySuccess, notifyError } from '../utils/notify';
import { UPLOADS_URL } from '../utils/config';
import RatingReviews from '../components/RatingReviews';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import VerifiedIcon from '@mui/icons-material/Verified';
import ReplayIcon from '@mui/icons-material/Replay';

const ProductPage = ({ onAddToCart, user }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const token = localStorage.getItem('shopdzToken');

  useEffect(() => {
    getProduct(id)
      .then(res => setProduct(res.data))
      .catch(() => notifyError("Erreur lors du chargement du produit"));
  }, [id]);

  if (!product) return (
    <div style={{ textAlign: 'center', padding: '5rem', color: '#9c27b0' }}>
      <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⏳</div>
      Chargement...
    </div>
  );

  const imageUrl = product.image
    ? (product.image.startsWith('http') ? product.image : `${UPLOADS_URL}/${product.image}`)
    : 'https://via.placeholder.com/500x400?text=Shop+DZ';

  const effectivePrice = product.promotion_price || product.price;
  const discount = product.promotion_price
    ? Math.round((1 - product.promotion_price / product.price) * 100)
    : 0;

  const handleAddToCart = () => {
    if (product.stock === 0) return;
    for (let i = 0; i < quantity; i++) onAddToCart(product);
    notifySuccess(`✅ ${quantity > 1 ? quantity + ' × ' : ''}${product.name} ajouté au panier`);
  };

  return (
    <div style={{ background: '#f8f5fc', minHeight: '100vh', paddingBottom: '3rem' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '1.5rem 1rem' }}>

        {/* Retour */}
        <button onClick={() => navigate(-1)} style={{
          display: 'flex', alignItems: 'center', gap: '6px',
          border: 'none', background: 'none', cursor: 'pointer',
          color: '#9c27b0', fontWeight: '700', fontSize: '0.95rem',
          marginBottom: '1.5rem', fontFamily: 'inherit', padding: '6px 0',
        }}>
          <ArrowBackIcon fontSize="small" /> Retour aux produits
        </button>

        {/* Carte principale */}
        <div style={{
          background: 'white', borderRadius: '20px',
          padding: '2rem', boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
          display: 'flex', flexWrap: 'wrap', gap: '2.5rem',
        }}>

          {/* Image */}
          <div style={{ flex: '1 1 350px', position: 'relative' }}>
            {discount > 0 && (
              <div style={{
                position: 'absolute', top: '14px', left: '14px',
                background: '#e53935', color: 'white',
                padding: '4px 12px', borderRadius: '20px',
                fontWeight: '700', fontSize: '0.9rem', zIndex: 1,
              }}>-{discount}%</div>
            )}
            <img
              src={imageUrl}
              alt={product.name}
              style={{
                width: '100%', maxHeight: '460px',
                objectFit: 'cover', borderRadius: '14px',
                display: 'block',
              }}
              onError={e => { e.target.src = 'https://via.placeholder.com/500x400?text=Shop+DZ'; }}
            />
          </div>

          {/* Infos */}
          <div style={{ flex: '1 1 300px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>

            {/* Catégorie */}
            {product.category_name && (
              <span style={{
                fontSize: '0.78rem', color: '#9c27b0',
                background: '#f3e5f5', padding: '3px 10px',
                borderRadius: '12px', fontWeight: '600',
                alignSelf: 'flex-start', textTransform: 'uppercase',
              }}>{product.category_name}</span>
            )}

            {/* Nom */}
            <h1 style={{
              fontSize: 'clamp(1.3rem, 3vw, 1.8rem)',
              fontWeight: '800', color: '#222',
              lineHeight: 1.3, margin: 0,
            }}>{product.name}</h1>

            {/* Prix */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '2rem', fontWeight: '800', color: '#9c27b0' }}>
                {Number(effectivePrice).toLocaleString('fr-DZ')} DA
              </span>
              {product.promotion_price && (
                <span style={{ fontSize: '1.1rem', color: '#bbb', textDecoration: 'line-through' }}>
                  {Number(product.price).toLocaleString('fr-DZ')} DA
                </span>
              )}
            </div>

            {/* Stock */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              color: product.stock > 0 ? '#2e7d32' : '#c62828',
              fontWeight: '600', fontSize: '0.92rem',
            }}>
              <span style={{
                width: '10px', height: '10px', borderRadius: '50%',
                background: product.stock > 0 ? '#2e7d32' : '#c62828',
                display: 'inline-block',
              }} />
              {product.stock > 0 ? `En stock — ${product.stock} disponibles` : 'Rupture de stock'}
            </div>

            {/* Description */}
            <p style={{
              fontSize: '0.95rem', lineHeight: '1.7', color: '#555',
              borderTop: '1px solid #f0f0f0', paddingTop: '1rem', margin: 0,
            }}>
              {product.description || 'Aucune description disponible.'}
            </p>

            {/* Avantages */}
            <div style={{
              display: 'flex', flexDirection: 'column', gap: '8px',
              background: '#f8f5fc', borderRadius: '12px', padding: '1rem',
            }}>
              {[
                { icon: <LocalShippingIcon fontSize="small" />, text: 'Livraison dans toute l\'Algérie' },
                { icon: <VerifiedIcon fontSize="small" />, text: 'Produit authentique garanti' },
                { icon: <ReplayIcon fontSize="small" />, text: 'Retour facile sous 7 jours' },
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#666', fontSize: '0.88rem' }}>
                  <span style={{ color: '#9c27b0' }}>{item.icon}</span>
                  {item.text}
                </div>
              ))}
            </div>

            {/* Quantité + Bouton */}
            {product.stock > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', marginTop: 'auto' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <span style={{ fontSize: '0.88rem', color: '#666', fontWeight: '600' }}>Quantité :</span>
                  <div style={{
                    display: 'flex', alignItems: 'center',
                    border: '1.5px solid #E0E0E0', borderRadius: '10px', overflow: 'hidden',
                  }}>
                    <button
                      onClick={() => setQuantity(q => Math.max(1, q - 1))}
                      style={{ width: '44px', height: '44px', border: 'none', background: '#f5f5f5', cursor: 'pointer', fontSize: '1.2rem', fontFamily: 'inherit' }}
                    >−</button>
                    <span style={{ width: '44px', textAlign: 'center', fontWeight: '700', fontSize: '1rem' }}>{quantity}</span>
                    <button
                      onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
                      style={{ width: '44px', height: '44px', border: 'none', background: '#f5f5f5', cursor: 'pointer', fontSize: '1.2rem', fontFamily: 'inherit' }}
                    >+</button>
                  </div>
                </div>

                <button
                  onClick={handleAddToCart}
                  style={{
                    width: '100%', padding: '0.95rem',
                    background: 'linear-gradient(135deg, #9c27b0, #6a1b9a)',
                    color: 'white', border: 'none', borderRadius: '12px',
                    fontWeight: '700', fontSize: '1.05rem', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                    boxShadow: '0 4px 14px rgba(156,39,176,0.35)',
                    fontFamily: 'inherit',
                    transition: 'transform 0.2s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  <AddShoppingCartIcon /> Ajouter au panier
                </button>
              </div>
            ) : (
              <div style={{
                background: '#FFEBEE', color: '#c62828',
                borderRadius: '10px', padding: '0.75rem 1rem',
                fontSize: '0.9rem', fontWeight: '600', textAlign: 'center',
              }}>
                ❌ Ce produit est en rupture de stock
              </div>
            )}
          </div>
        </div>

        {/* Section Avis */}
        <div style={{
          background: 'white', borderRadius: '20px',
          padding: '1.5rem 2rem', marginTop: '1.5rem',
          boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
        }}>
          <RatingReviews productId={id} user={user} token={token} />
        </div>

      </div>
    </div>
  );
};

export default ProductPage;
