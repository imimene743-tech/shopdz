import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { colors } from '../utils/theme';

const OrderSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // On récupère l'ID de commande passé via la navigation
  const orderId = location.state?.orderId || "Confirmée";

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <div style={iconContainerStyle}>
          <span style={{ fontSize: '50px' }}>🎉</span>
        </div>
        
        <h2 style={{ color: colors.mauve.primary, marginBottom: '10px' }}>
          Merci pour votre commande !
        </h2>
        
        <p style={{ fontSize: '1.1rem', color: '#555' }}>
          Votre commande <strong>#{orderId}</strong> a été enregistrée avec succès.
        </p>
        
        <div style={infoBoxStyle}>
          <p style={{ margin: 0 }}>
            📞 Un agent de <strong>ShopD</strong> va vous appeler dans les prochaines heures pour confirmer la livraison.
          </p>
        </div>

        <div style={buttonGroupStyle}>
          <button 
            style={primaryButtonStyle} 
            onClick={() => navigate('/profile')}
          >
            Suivre ma commande
          </button>
          <button 
            style={secondaryButtonStyle} 
            onClick={() => navigate('/products')}
          >
            Continuer mes achats
          </button>
        </div>
      </div>
    </div>
  );
};

// Styles
const containerStyle = { minHeight: '80vh', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' };
const cardStyle = { background: '#fff', padding: '40px', borderRadius: '20px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', textAlign: 'center', maxWidth: '500px' };
const iconContainerStyle = { width: '80px', height: '80px', background: '#f3e5f5', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '0 auto 20px' };
const infoBoxStyle = { background: '#f8f5fb', padding: '15px', borderRadius: '10px', marginTop: '20px', borderLeft: `4px solid ${colors.mauve.primary}` };
const buttonGroupStyle = { marginTop: '30px', display: 'flex', flexDirection: 'column', gap: '10px' };
const primaryButtonStyle = { padding: '12px', background: '#9c27b0', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' };
const secondaryButtonStyle = { padding: '12px', background: 'transparent', color: '#9c27b0', border: '1px solid #9c27b0', borderRadius: '8px', cursor: 'pointer' };

export default OrderSuccess;