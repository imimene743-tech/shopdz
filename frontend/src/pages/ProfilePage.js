// src/pages/ProfilePage.js
import React, { useEffect, useState } from 'react';
import { getProfile, getOrders } from '../services/api';
import { notifySuccess, notifyError } from '../utils/notify';

const ProfilePage = ({ user, onLogout }) => {
  const [profile, setProfile] = useState(user || null);
  const [orders, setOrders] = useState([]);
  const [loadingProfile, setLoadingProfile] = useState(!user);
  const [loadingOrders, setLoadingOrders] = useState(true);

  // Charger le profil si pas fourni
  useEffect(() => {
    if (!user) {
      getProfile()
        .then(res => setProfile(res.data))
        .catch(err => notifyError("Impossible de charger le profil"))
        .finally(() => setLoadingProfile(false));
    } else {
      setLoadingProfile(false);
    }
  }, [user]);

  // Charger les commandes
  useEffect(() => {
    if (profile) {
      getOrders(profile.id)
        .then(res => setOrders(res.data))
        .catch(err => notifyError("Impossible de charger les commandes"))
        .finally(() => setLoadingOrders(false));
    }
  }, [profile]);

  if (loadingProfile) return <p>Chargement du profil...</p>;
  if (!profile) return <p>Vous devez être connecté pour voir votre profil.</p>;

  return (
    <div style={{ padding: '2rem', maxWidth: '900px', margin: '0 auto' }}>
      <h2>Mon Profil</h2>

      {/* Infos utilisateur */}
      <div style={{ display: 'flex', gap: '2rem', marginBottom: '2rem', alignItems: 'center' }}>
        <div>
          <img 
            src={profile.avatar || 'https://via.placeholder.com/120'} 
            alt="Avatar"
            style={{ width: '120px', height: '120px', borderRadius: '50%', objectFit: 'cover' }}
          />
        </div>
        <div>
          <p><strong>Nom :</strong> {profile.name || profile.email}</p>
          <p><strong>Email :</strong> {profile.email}</p>
          <p><strong>Rôle :</strong> {profile.role || 'Utilisateur'}</p>
          <button 
            onClick={onLogout} 
            style={{ padding: '0.5rem 1rem', backgroundColor: '#ff3300', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
          >
            Se déconnecter
          </button>
        </div>
      </div>

      {/* Historique des commandes */}
      <div style={{ marginBottom: '2rem' }}>
        <h3>Mes commandes</h3>
        {loadingOrders ? (
          <p>Chargement des commandes...</p>
        ) : orders.length === 0 ? (
          <p>Aucune commande passée pour le moment.</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ borderBottom: '1px solid #ccc', padding: '0.5rem' }}>Numéro</th>
                <th style={{ borderBottom: '1px solid #ccc', padding: '0.5rem' }}>Date</th>
                <th style={{ borderBottom: '1px solid #ccc', padding: '0.5rem' }}>Total</th>
                <th style={{ borderBottom: '1px solid #ccc', padding: '0.5rem' }}>Statut</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order.id}>
                  <td style={{ padding: '0.5rem', borderBottom: '1px solid #eee' }}>{order.id}</td>
                  <td style={{ padding: '0.5rem', borderBottom: '1px solid #eee' }}>{new Date(order.created_at).toLocaleDateString()}</td>
                  <td style={{ padding: '0.5rem', borderBottom: '1px solid #eee' }}>{order.total_price} DA</td>
                  <td style={{ padding: '0.5rem', borderBottom: '1px solid #eee' }}>{order.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Notifications récentes */}
      <div>
        <h3>Notifications</h3>
        {profile.notifications && profile.notifications.length > 0 ? (
          <ul>
            {profile.notifications.map((notif, idx) => (
              <li key={idx} style={{ padding: '0.5rem 0', borderBottom: '1px solid #eee' }}>
                {notif.message} <span style={{ color: '#888', fontSize: '0.85rem' }}>({new Date(notif.date).toLocaleString()})</span>
              </li>
            ))}
          </ul>
        ) : (
          <p>Aucune notification.</p>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;