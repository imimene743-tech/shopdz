// src/components/UserProfile.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { colors } from '../utils/theme';
import { API_URL, getImageUrl } from '../utils/config';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import FavoriteIcon from '@mui/icons-material/Favorite';
import PersonIcon from '@mui/icons-material/Person';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

const UserProfile = ({ user, token }) => {
  const [orders, setOrders] = useState([]);
  const [favoritesData, setFavoritesData] = useState([]);

  useEffect(() => {
    if (!token) return;

    //  FIX : utilise API_URL au lieu de localhost
    axios.get(`${API_URL}/orders/user`, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => setOrders(res.data))
      .catch(err => console.error('Erreur commandes', err));

    const savedFavIds = JSON.parse(localStorage.getItem('favorites') || '[]');
    if (savedFavIds.length > 0) {
      //  FIX : utilise API_URL au lieu de localhost
      axios.post(`${API_URL}/products/get-by-ids`, { ids: savedFavIds })
        .then(res => setFavoritesData(res.data))
        .catch(err => console.error('Erreur favoris', err));
    }
  }, [token]);

  const getStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
      case 'livré': return { color: '#4CAF50', background: '#E8F5E9' };
      case 'annulé': return { color: '#F44336', background: '#FFEBEE' };
      default: return { color: '#FF9800', background: '#FFF3E0' };
    }
  };

  const handleRemoveFavorite = (productId) => {
    const savedFavIds = JSON.parse(localStorage.getItem('favorites') || '[]');
    const updatedFavIds = savedFavIds.filter(id => id !== productId);
    localStorage.setItem('favorites', JSON.stringify(updatedFavIds));
    setFavoritesData(favoritesData.filter(p => p.id !== productId));
  };

  const sectionStyle = {
    background: 'white',
    padding: '2rem',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
    marginBottom: '2rem'
  };

  return (
    <div style={{ maxWidth: 1000, margin: '3rem auto', padding: '0 1rem', fontFamily: 'inherit' }}>

      {/* Header Profil */}
      <div style={{ ...sectionStyle, display: 'flex', alignItems: 'center', gap: '1.5rem', borderLeft: `6px solid ${colors.mauve.primary}` }}>
        <div style={{ background: colors.mauve.light, padding: '1rem', borderRadius: '50%' }}>
          <PersonIcon style={{ fontSize: '3rem', color: colors.mauve.primary }} />
        </div>
        <div>
          <h2 style={{ margin: 0, color: colors.mauve.primary }}>{user.name}</h2>
          <p style={{ margin: '5px 0', color: colors.gray.dark }}>{user.email}</p>
          <span style={{ fontSize: '0.8rem', background: colors.gray.light, padding: '2px 8px', borderRadius: '10px' }}>
            Compte {user.role}
          </span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem', flexWrap: 'wrap' }}>

        {/* Commandes */}
        <section style={sectionStyle}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.5rem' }}>
            <ShoppingBagIcon color="primary" /> Mes Commandes
          </h3>

          {orders.length === 0 ? (
            <p style={{ color: colors.gray.medium }}>Aucune commande pour le moment.</p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ color: colors.gray.medium, fontSize: '0.9rem' }}>
                    <th style={{ padding: '12px' }}>Produits</th>
                    <th style={{ padding: '12px' }}>Date</th>
                    <th style={{ padding: '12px' }}>Total</th>
                    <th style={{ padding: '12px' }}>Statut</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map(order => (
                    <tr key={order.id} style={{ borderTop: `1px solid ${colors.gray.light}` }}>
                      <td style={{ padding: '12px', fontWeight: '500', fontSize: '0.9rem' }}>
                        {order.product_names || "Commande #" + order.id}
                      </td>
                      <td style={{ padding: '12px' }}>{new Date(order.created_at).toLocaleDateString('fr-DZ')}</td>
                      <td style={{ padding: '12px' }}>{order.total_price} DA</td>
                      <td style={{ padding: '12px' }}>
                        <span style={{ padding: '4px 12px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 'bold', ...getStatusStyle(order.status) }}>
                          {order.status || 'En attente'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* Favoris */}
        <section style={sectionStyle}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.5rem' }}>
            <FavoriteIcon style={{ color: '#ff5252' }} /> Favoris
          </h3>

          {favoritesData.length === 0 ? (
            <p style={{ color: colors.gray.medium, fontSize: '0.9rem' }}>Votre liste est vide.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {favoritesData.map(product => (
                <div key={product.id} style={{
                  display: 'flex', alignItems: 'center', gap: '12px',
                  padding: '10px', background: colors.gray.light,
                  borderRadius: '12px',
                }}>
                  {/* FIX : utilise getImageUrl au lieu de localhost */}
                  <img
                    src={getImageUrl(product.image)}
                    alt={product.name}
                    style={{ width: '45px', height: '45px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #ddd' }}
                    onError={(e) => { e.target.src = 'https://via.placeholder.com/45?text=📦'; }}
                  />
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: '600' }}>{product.name}</span>
                    <strong style={{ color: colors.mauve.primary, fontSize: '0.8rem' }}>{product.price} DA</strong>
                  </div>
                  <button
                    onClick={() => handleRemoveFavorite(product.id)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ff5252', padding: '8px', borderRadius: '50%' }}
                    title="Retirer des favoris"
                  >
                    <DeleteOutlineIcon style={{ fontSize: '1.2rem' }} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default UserProfile;
