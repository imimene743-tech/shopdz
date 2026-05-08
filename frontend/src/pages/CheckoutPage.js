import React from 'react';
import Checkout from '../components/Checkout';

const CheckoutPage = ({ cart, totalAmount, onOrderSuccess, user }) => {
  return (
    <div>
      {/* On passe le user pour que le composant sache qui passe la commande */}
      <Checkout 
        cart={cart} 
        totalAmount={totalAmount} 
        onOrderSuccess={onOrderSuccess} 
        user={user} 
      />
    </div>
  );
};

export default CheckoutPage;