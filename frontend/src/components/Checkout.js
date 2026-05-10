
import React, { useState, useEffect } from 'react';

const useIsMobile = () => {
  const [isMobile, setIsMobile] = React.useState(window.innerWidth < 640);
  React.useEffect(() => {
    const fn = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener('resize', fn);
    return () => window.removeEventListener('resize', fn);
  }, []);
  return isMobile;
};
import { createOrder, getWilayas } from '../services/api';
import { colors } from '../utils/theme';
import { useNavigate } from 'react-router-dom';

const Checkout = ({ cart, totalAmount, onOrderSuccess, user }) => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  // 🔹 Récupération directe du token depuis le stockage local
  const token = localStorage.getItem('shopdzToken');

  const [wilayas, setWilayas] = useState([]);
  const [selectedWilaya, setSelectedWilaya] = useState(null);
  const [customer, setCustomer] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    address: ''
  });

  //  Utilisation de getWilayas() de api.js
  useEffect(() => {
    getWilayas()
      .then(res => setWilayas(res.data))
      .catch(err => console.error("Erreur wilayas :", err));
  }, []);

  useEffect(() => {
    if (!token) navigate('/login');
  }, [token, navigate]);

  const shippingPrice = selectedWilaya ? parseFloat(selectedWilaya.shipping_price) : 0;
  const finalTotal = parseFloat(totalAmount || 0) + shippingPrice;

  const handleOrder = async (e) => {
    e.preventDefault();

    if (!selectedWilaya) {
      alert("Veuillez choisir une wilaya pour la livraison.");
      return;
    }

    const orderData = {
      wilaya_id: selectedWilaya.id,
      // AJOUT : phone et address envoyés séparément pour le nouveau backend
      phone: customer.phone,
      address: `${customer.firstName} ${customer.lastName} - ${customer.address}`,
      total_price: finalTotal,
      items: cart.map(item => ({
        product_id: item.product_id || item.id, 
        quantity: item.quantity,
        price: item.promotion_price || item.price
      }))
    };

    try {
      //  UTILISATION DE createOrder()
      const res = await createOrder(orderData);

      // AMÉLIORATION : Message de succès professionnel
      alert(`✨ Commande réussie !\nNuméro de commande : ${res.data.order_id || "Confirmée"}\n\nUn agent vous appellera au ${customer.phone} pour confirmer l'expédition.`);

      if (onOrderSuccess) onOrderSuccess();
      navigate('/profile');

    } catch (err) {
      // Affiche l'erreur du backend (ex: format téléphone incorrect)
      console.error("Erreur commande :", err);
      alert(err.response?.data?.message || "Erreur lors de la validation");
    }
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <h3 style={titleStyle}>📦 Finaliser ma commande</h3>

        {(!cart || cart.length === 0) ? (
          <div style={emptyStyle}>
            <p style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>Votre panier est vide</p>
            <button style={btnSecondaryStyle} onClick={() => navigate('/products')}>
              Retour aux produits
            </button>
          </div>
        ) : (
          <form onSubmit={handleOrder} style={formStyle}>

            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '10px' }}>
              <input
                type="text"
                placeholder="Prénom"
                required
                style={inputStyle}
                value={customer.firstName}
                onChange={(e) => setCustomer({ ...customer, firstName: e.target.value })}
              />
              <input
                type="text"
                placeholder="Nom"
                required
                style={inputStyle}
                value={customer.lastName}
                onChange={(e) => setCustomer({ ...customer, lastName: e.target.value })}
              />
            </div>

            {/* AMÉLIORATION : Validation forcée du numéro algérien */}
            <input
              type="tel"
              placeholder="Numéro de téléphone (05/06/07...)"
              required
              pattern="^0(5|6|7)[0-9]{8}$"
              title="Le numéro doit commencer par 05, 06 ou 07 et contenir 10 chiffres."
              style={inputStyle}
              value={customer.phone}
              onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
            />

            <select
              style={inputStyle}
              required
              value={selectedWilaya ? selectedWilaya.id : ''}
              onChange={(e) => {
                const w = wilayas.find(w => w.id === parseInt(e.target.value));
                setSelectedWilaya(w);
              }}
            >
              <option value="">-- Choisir votre Wilaya --</option>
              {wilayas.map(w => (
                <option key={w.id} value={w.id}>
                  {w.id} - {w.name}
                </option>
              ))}
            </select>

            <textarea
              placeholder="Adresse précise (Cité, N° porte, commune, etc.)"
              required
              style={{ ...inputStyle, height: '90px', resize: 'none' }}
              value={customer.address}
              onChange={(e) => setCustomer({ ...customer, address: e.target.value })}
            />

            <div style={summaryStyle}>
              <h4 style={{ marginBottom: '10px', color: colors.mauve.primary }}>🛒 Résumé de la commande</h4>

              {cart.map(item => (
                <div key={item.id} style={productRowStyle}>
                  <span>{item.name} × {item.quantity}</span>
                  <span>{((item.promotion_price || item.price) * item.quantity).toFixed(2)} DA</span>
                </div>
              ))}

              <hr style={hrStyle} />

              <div style={priceRow}>
                <span>Prix des articles :</span>
                <span>{parseFloat(totalAmount || 0).toFixed(2)} DA</span>
              </div>

              <div style={priceRow}>
                <span>Frais de livraison :</span>
                <span style={{ color: colors.mauve.primary, fontWeight: 'bold' }}>
                  {selectedWilaya ? `+ ${shippingPrice.toFixed(2)} DA` : 'Sélectionnez une wilaya'}
                </span>
              </div>

              <hr style={hrStyle} />

              <div style={totalFinalStyle}>
                <span>Total à payer :</span>
                <span>{finalTotal.toFixed(2)} DA</span>
              </div>
            </div>

            <div style={buttonsRowStyle}>
              <button
                type="button"
                style={btnSecondaryStyle}
                onClick={() => navigate('/products')}
              >
                Continuer mes achats
              </button>

              <button type="submit" style={btnStyle}>
                Confirmer l'achat
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

// =================== STYLES (Inchangés) ===================

const containerStyle = { minHeight: '100vh', backgroundColor: '#f8f5fb', padding: '30px 15px', display: 'flex', justifyContent: 'center', alignItems: 'flex-start' };
const cardStyle = { width: '100%', maxWidth: '850px', background: '#fff', borderRadius: '16px', boxShadow: '0 6px 18px rgba(0,0,0,0.08)', padding: '20px' };
const titleStyle = { color: colors.mauve.primary, borderBottom: `2px solid ${colors.mauve.light}`, paddingBottom: '10px', marginBottom: '20px' };
const formStyle = { display: 'flex', flexDirection: 'column', gap: '15px' };
// rowStyle is now dynamic in the component
const inputStyle = { padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '1rem', outline: 'none', width: '100%', boxSizing: 'border-box', fontFamily: 'inherit' };
const summaryStyle = { background: colors.gray.light, padding: '18px', borderRadius: '12px', marginTop: '10px' };
const productRowStyle = { display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.95rem' };
const priceRow = { display: 'flex', justifyContent: 'space-between', marginBottom: '8px' };
const totalFinalStyle = { display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', fontWeight: 'bold', color: colors.mauve.primary };
const hrStyle = { border: 'none', borderTop: '1px solid #ddd', margin: '12px 0' };
const buttonsRowStyle = { display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '10px', flexDirection: 'column' };
const btnStyle = { flex: 1, minWidth: '220px', padding: '15px', background: '#9c27b0', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1.05rem' };
const btnSecondaryStyle = { flex: 1, minWidth: '220px', padding: '15px', background: '#eee', color: '#333', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1.05rem' };
const emptyStyle = { textAlign: 'center', padding: '40px 20px' };

export default Checkout;