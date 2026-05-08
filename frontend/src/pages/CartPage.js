// src/pages/CartPage.js
import React from 'react';
import CartDrawer from '../components/CartDrawer';

const CartPage = ({ cart, onUpdateQuantity, onRemoveItem, onClose }) => {
  return (
    <div>
      <CartDrawer 
        isOpen={true} 
        onClose={onClose} 
        cartItems={cart} 
        onUpdateQuantity={onUpdateQuantity} 
        onRemoveItem={onRemoveItem} 
      />
    </div>
  );
};

export default CartPage;