// src/components/CartModal.js
import React from 'react';
import { useNavigate } from 'react-router-dom';

const CartModal = ({ cart, isOpen, onClose, removeFromCart }) => {
  const navigate = useNavigate();

  if (!isOpen) return null; // Ne s'affiche que si isOpen est vrai

  const total = cart.reduce((acc, item) => {
    const price = item.promotion_price || item.price;
    return acc + price * item.quantity;
  }, 0);

  //  Vérification si l'utilisateur est connecté avant checkout
  const handleCheckout = () => {
    const token = localStorage.getItem('shopdzToken');
    if (!token) {
      alert("Vous devez vous connecter pour passer la commande !");
      navigate('/login'); // Redirige vers login
      return;
    }
    navigate('/checkout');
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="cart-modal">
        <div className="modal-header">
          <h2>Votre Panier ({cart.length})</h2>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>

        <div className="modal-body">
          {cart.length === 0 ? (
            <p className="empty-msg">Votre panier est vide.</p>
          ) : (
            cart.map(item => (
              <div key={item.id} className="cart-item-row">
                <img 
                  src={item.image ? `http://localhost:5000/uploads/${item.image}` : 'https://via.placeholder.com/80x80'} 
                  alt={item.name} 
                />
                <div className="item-info">
                  <h4>{item.name}</h4>
                  <p>{item.promotion_price || item.price} DA x {item.quantity}</p>
                </div>
                <button className="remove-btn" onClick={() => removeFromCart(item.id)}>
                  🗑
                </button>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <div className="modal-footer">
            <div className="total-row">
              <span>Total :</span>
              <span className="total-price">{total.toFixed(2)} DA</span>
            </div>
            <button className="checkout-btn" onClick={handleCheckout}>
              Confirmer la commande
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartModal;