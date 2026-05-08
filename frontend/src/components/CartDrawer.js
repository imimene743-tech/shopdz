// src/components/CartDrawer.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { colors } from '../utils/theme';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

const CartDrawer = ({ isOpen, onClose, cartItems, onUpdateQuantity, onRemoveItem }) => {
  const navigate = useNavigate();

  const drawerStyle = {
    position: 'fixed',
    top: 0,
    right: isOpen ? 0 : '-400px',
    width: '100%',
    maxWidth: '400px',
    height: '100vh',
    backgroundColor: colors.white,
    boxShadow: '-2px 0 10px rgba(0,0,0,0.1)',
    transition: 'right 0.3s ease',
    zIndex: 2000,
    display: 'flex',
    flexDirection: 'column',
  };

  const overlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100vh',
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: isOpen ? 'block' : 'none',
    zIndex: 1999,
  };

  const headerStyle = {
    padding: '1rem',
    borderBottom: `1px solid ${colors.gray.medium}`,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.mauve.primary,
    color: colors.white,
  };

  const titleStyle = {
    fontSize: '1.2rem',
    fontWeight: 'bold',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  };

  const closeButtonStyle = {
    backgroundColor: 'transparent',
    border: 'none',
    color: colors.white,
    cursor: 'pointer',
    fontSize: '1.2rem',
  };

  const contentStyle = {
    flex: 1,
    overflowY: 'auto',
    padding: '1rem',
  };

  const itemStyle = {
    display: 'flex',
    gap: '1rem',
    padding: '1rem',
    borderBottom: `1px solid ${colors.gray.medium}`,
    position: 'relative',
  };

  const itemImageStyle = {
    width: '80px',
    height: '80px',
    objectFit: 'cover',
    borderRadius: '5px',
  };

  const itemInfoStyle = {
    flex: 1,
  };

  const itemNameStyle = {
    fontSize: '1rem',
    fontWeight: 'bold',
    marginBottom: '0.3rem',
    color: colors.gray.dark,
  };

  const itemPriceStyle = {
    fontSize: '1.1rem',
    fontWeight: 'bold',
    color: colors.mauve.primary,
    marginBottom: '0.5rem',
  };

  const quantityControlsStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  };

  const quantityButtonStyle = {
    backgroundColor: colors.gray.light,
    border: `1px solid ${colors.gray.medium}`,
    borderRadius: '3px',
    width: '25px',
    height: '25px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    fontSize: '1rem',
    transition: 'background-color 0.3s',
  };

  const quantityStyle = {
    minWidth: '30px',
    textAlign: 'center',
  };

  const deleteButtonStyle = {
    position: 'absolute',
    top: '0.5rem',
    right: '0.5rem',
    backgroundColor: 'transparent',
    border: 'none',
    color: colors.gray.medium,
    cursor: 'pointer',
    fontSize: '1rem',
    transition: 'color 0.3s',
  };

  const footerStyle = {
    padding: '1rem',
    borderTop: `1px solid ${colors.gray.medium}`,
    backgroundColor: colors.gray.light,
  };

  const totalStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '1rem',
    fontSize: '1.2rem',
    fontWeight: 'bold',
  };

  const checkoutButtonStyle = {
    width: '100%',
    padding: '1rem',
    backgroundColor: colors.mauve.primary,
    color: colors.white,
    border: 'none',
    borderRadius: '5px',
    fontSize: '1.1rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  };

  const emptyCartStyle = {
    textAlign: 'center',
    padding: '3rem 1rem',
    color: colors.gray.medium,
  };

  const emptyCartIconStyle = {
    fontSize: '4rem',
    color: colors.gray.medium,
    marginBottom: '1rem',
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      const price = item.promotion_price || item.price;
      return total + price * item.quantity;
    }, 0);
  };

  // ✅ Vérification si l'utilisateur est connecté
  const handleCheckout = () => {
    const token = localStorage.getItem('shopdzToken');
    if (!token) {
      alert("Vous devez vous connecter pour passer la commande !");
      navigate('/login'); // Redirige vers login
      return;
    }
    onClose();
    navigate('/checkout');
  };

  return (
    <>
      <div style={overlayStyle} onClick={onClose} />
      
      <div style={drawerStyle}>
        <div style={headerStyle}>
          <span style={titleStyle}>
            <ShoppingCartIcon /> Votre Panier ({cartItems.length})
          </span>
          <button onClick={onClose} style={closeButtonStyle}>
            <CloseIcon />
          </button>
        </div>

        <div style={contentStyle}>
          {cartItems.length === 0 ? (
            <div style={emptyCartStyle}>
              <div style={emptyCartIconStyle}>🛒</div>
              <p style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>
                Votre panier est vide
              </p>
              <p style={{ fontSize: '0.9rem' }}>
                Découvrez nos produits et commencez vos achats !
              </p>
            </div>
          ) : (
            cartItems.map(item => (
              <div key={item.id} style={itemStyle}>
                <img
                  src={item.image || 'https://via.placeholder.com/80x80'}
                  alt={item.name}
                  style={itemImageStyle}
                />
                <div style={itemInfoStyle}>
                  <div style={itemNameStyle}>{item.name}</div>
                  <div style={itemPriceStyle}>{item.promotion_price || item.price} DA</div>
                  <div style={quantityControlsStyle}>
                    <button
                      onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                      style={quantityButtonStyle}
                      disabled={item.quantity <= 1}
                    >
                      <RemoveIcon fontSize="small" />
                    </button>
                    <span style={quantityStyle}>{item.quantity}</span>
                    <button
                      onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                      style={quantityButtonStyle}
                      disabled={item.quantity >= item.stock}
                    >
                      <AddIcon fontSize="small" />
                    </button>
                  </div>
                </div>

                <button
                  onClick={() => onRemoveItem(item.id)}
                  style={deleteButtonStyle}
                >
                  <DeleteIcon />
                </button>
              </div>
            ))
          )}
        </div>

        {cartItems.length > 0 && (
          <div style={footerStyle}>
            <div style={totalStyle}>
              <span>Total TTC</span>
              <span>{calculateTotal().toFixed(2)} DA</span>
            </div>
            
            <button onClick={handleCheckout} style={checkoutButtonStyle}>
              Passer la commande
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default CartDrawer;