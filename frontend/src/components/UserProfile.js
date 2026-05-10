import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { colors } from '../utils/theme';
import { API_URL, getImageUrl } from '../utils/config';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import FavoriteIcon from '@mui/icons-material/Favorite';
import PersonIcon from '@mui/icons-material/Person';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  useEffect(() => {
    const fn = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', fn);
    return () => window.removeEventListener('resize', fn);
  }, []);
  return isMobile;
};

const UserProfile = ({ user, token }) => {
  const [orders, setOrders] = useState([]);
  const [favoritesData, setFavoritesData] = useState([]);
  const [activeTab, setActiveTab] = useState('orders');
  const isMobile = useIsMobile();

  useEffect(() => {
    if (!token) return;
    axios.get(`${API_URL}/orders/user`, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => setOrders(res.data))
      .catch(err => console.error('Erreur commandes', err));

    const savedFavIds = JSON.parse(localStorage.getItem('favorites') || '[]');
    if (savedFavIds.length > 0) {
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
    localStorage.setItem('favorites', JSON.stringify(savedFavIds.filter(id => id !== productId)));
    setFavoritesData(favoritesData.filter(p => p.id !== productId));
  };

  const card = {
    background: 'white',
    padding: isMobile ? '1.2rem' : '2rem',
    borderRadius: '16px',
    boxShadow: '0 4px 16px rgba(0,0,0,0.07)',
    marginBottom: '1.2rem',
  };

  return (
    <div style={{
      maxWidth: '1000px',
      margin: '0 auto',
      padding: isMobile ? '1rem 0.75rem' : '2rem 1rem',
      fontFamily: 'inherit',
    }}>

      {/* ── Header Profil ── */}
      <div style={{
        ...card,
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        borderLeft: `5px solid ${colors.mauve.primary}`,
        flexWrap: 'wrap',
      }}>
        <div style={{
          background: colors.mauve.light,
          padding: '0.8rem',
          borderRadius: '50%',
          flexShrink: 0,
        }}>
          <PersonIcon style={{ fontSize: isMobile ? '2rem' : '3rem', color: colors.mauve.primary }} />
        </div>
        <div>
          <h2 style={{ margin: 0, color: colors.mauve.primary, fontSize: isMobile ? '1.2rem' : '1.5rem' }}>
            {user.name}
          </h2>
          <p style={{ margin: '4px 0', color: colors.gray.dark, fontSize: '0.9rem' }}>{user.email}</p>
          <span style={{
            fontSize: '0.75rem', background: '#f3e5f5',
            color: colors.mauve.primary, padding: '2px 10px',
            borderRadius: '10px', fontWeight: '600',
          }}>
            Compte {user.role}
          </span>
        </div>
      </div>

      {/* ── Onglets (mobile) ── */}
      {isMobile && (
        <div style={{
          display: 'flex', gap: '8px', marginBottom: '1rem',
        }}>
          {[
            { key: 'orders', label: '📦 Commandes', count: orders.length },
            { key: 'favorites', label: '❤️ Favoris', count: favoritesData.length },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              style={{
                flex: 1, padding: '0.7rem',
                borderRadius: '12px', border: 'none', cursor: 'pointer',
                fontFamily: 'inherit', fontWeight: '600', fontSize: '0.88rem',
                background: activeTab === tab.key ? colors.mauve.primary : 'white',
                color: activeTab === tab.key ? 'white' : '#666',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                transition: 'all 0.2s',
              }}
            >
              {tab.label} {tab.count > 0 && `(${tab.count})`}
            </button>
          ))}
        </div>
      )}

      {/* ── Contenu ── */}
      <div style={{
        display: isMobile ? 'block' : 'grid',
        gridTemplateColumns: '2fr 1fr',
        gap: '1.5rem',
      }}>

        {/* Commandes */}
        {(!isMobile || activeTab === 'orders') && (
          <section style={card}>
            <h3 style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              marginBottom: '1.2rem', fontSize: isMobile ? '1rem' : '1.15rem',
              color: '#333',
            }}>
              <ShoppingBagIcon style={{ color: colors.mauve.primary }} />
              Mes Commandes
              <span style={{
                fontSize: '0.78rem', background: '#f3e5f5',
                color: colors.mauve.primary, padding: '1px 8px',
                borderRadius: '10px', fontWeight: '600', marginLeft: '4px',
              }}>{orders.length}</span>
            </h3>

            {orders.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem', color: '#aaa' }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📭</div>
                <p>Aucune commande pour le moment.</p>
              </div>
            ) : isMobile ? (
              // ── Version mobile : cartes ──
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {orders.map(order => (
                  <div key={order.id} style={{
                    background: '#fafafa', borderRadius: '12px',
                    padding: '12px', border: '1px solid #f0e0f7',
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                      <span style={{ fontWeight: '600', fontSize: '0.88rem', color: '#333', flex: 1, paddingRight: '8px' }}>
                        {order.product_names || `Commande #${order.id}`}
                      </span>
                      <span style={{
                        padding: '2px 10px', borderRadius: '20px',
                        fontSize: '0.72rem', fontWeight: '700',
                        flexShrink: 0, ...getStatusStyle(order.status)
                      }}>
                        {order.status || 'En attente'}
                      </span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#888' }}>
                      <span>{new Date(order.created_at).toLocaleDateString('fr-DZ')}</span>
                      <span style={{ fontWeight: '700', color: colors.mauve.primary }}>{order.total_price} DA</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              // ── Version desktop : table ──
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ color: '#aaa', fontSize: '0.85rem' }}>
                      <th style={{ padding: '10px 12px' }}>Produits</th>
                      <th style={{ padding: '10px 12px' }}>Date</th>
                      <th style={{ padding: '10px 12px' }}>Total</th>
                      <th style={{ padding: '10px 12px' }}>Statut</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map(order => (
                      <tr key={order.id} style={{ borderTop: '1px solid #f5f5f5' }}>
                        <td style={{ padding: '12px', fontWeight: '500', fontSize: '0.9rem' }}>
                          {order.product_names || `Commande #${order.id}`}
                        </td>
                        <td style={{ padding: '12px', color: '#888', fontSize: '0.85rem' }}>
                          {new Date(order.created_at).toLocaleDateString('fr-DZ')}
                        </td>
                        <td style={{ padding: '12px', fontWeight: '700', color: colors.mauve.primary }}>
                          {order.total_price} DA
                        </td>
                        <td style={{ padding: '12px' }}>
                          <span style={{
                            padding: '4px 12px', borderRadius: '20px',
                            fontSize: '0.78rem', fontWeight: '700',
                            ...getStatusStyle(order.status)
                          }}>
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
        )}

        {/* Favoris */}
        {(!isMobile || activeTab === 'favorites') && (
          <section style={card}>
            <h3 style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              marginBottom: '1.2rem', fontSize: isMobile ? '1rem' : '1.15rem',
              color: '#333',
            }}>
              <FavoriteIcon style={{ color: '#ff5252' }} />
              Favoris
              <span style={{
                fontSize: '0.78rem', background: '#ffebee',
                color: '#ff5252', padding: '1px 8px',
                borderRadius: '10px', fontWeight: '600', marginLeft: '4px',
              }}>{favoritesData.length}</span>
            </h3>

            {favoritesData.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem', color: '#aaa' }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>💔</div>
                <p style={{ fontSize: '0.9rem' }}>Votre liste est vide.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {favoritesData.map(product => (
                  <div key={product.id} style={{
                    display: 'flex', alignItems: 'center', gap: '10px',
                    padding: '10px', background: '#fafafa',
                    borderRadius: '12px', border: '1px solid #f0f0f0',
                  }}>
                    <img
                      src={getImageUrl(product.image)}
                      alt={product.name}
                      style={{
                        width: '48px', height: '48px',
                        objectFit: 'cover', borderRadius: '8px',
                        border: '1px solid #eee', flexShrink: 0,
                      }}
                      onError={(e) => { e.target.src = 'https://via.placeholder.com/48?text=📦'; }}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{
                        fontSize: '0.85rem', fontWeight: '600',
                        color: '#333', overflow: 'hidden',
                        textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                      }}>{product.name}</div>
                      <div style={{ color: colors.mauve.primary, fontWeight: '700', fontSize: '0.82rem' }}>
                        {product.price} DA
                      </div>
                    </div>
                    <button
                      onClick={() => handleRemoveFavorite(product.id)}
                      style={{
                        background: 'none', border: 'none',
                        cursor: 'pointer', color: '#ffb3b3',
                        padding: '6px', borderRadius: '50%',
                        transition: 'color 0.2s', flexShrink: 0,
                      }}
                      onMouseEnter={e => e.currentTarget.style.color = '#ff5252'}
                      onMouseLeave={e => e.currentTarget.style.color = '#ffb3b3'}
                      title="Retirer des favoris"
                    >
                      <DeleteOutlineIcon style={{ fontSize: '1.1rem' }} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
