// src/App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';


import { addToCart } from './services/api';

import UserProfile from './components/UserProfile';

import Header from './components/Header';
import Footer from './components/Footer';
import ProductList from './components/ProductList';
import CartDrawer from './components/CartDrawer';

import ProductPage from './pages/ProductPage';


import Categories from "./pages/Categories";
import AdminDashboard from "./pages/AdminDashboard";
import AuthPage from './pages/AuthPage'; // Login/Register
import { colors } from './utils/theme';

import CheckoutPage from "./pages/CheckoutPage";

import './App.css';


// ✅ On passe les props à ProductList même dans l'alias
const Home = ({ onAddToCart }) => <ProductList onAddToCart={onAddToCart} />;
// Pages temporaires
//const Home = () => <ProductList />;


function App() {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [user, setUser] = useState(null);

  // Charger le panier et l'utilisateur depuis localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) setCartItems(JSON.parse(savedCart));

    const savedUser = localStorage.getItem('shopdzUser');
    const savedToken = localStorage.getItem('shopdzToken');

    if (savedUser && savedToken) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  // Sauvegarder le panier à chaque modification
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // Gestion du login
  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('shopdzUser', JSON.stringify(userData));
 
  };

  // Gestion du logout
  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('shopdzUser');
    localStorage.removeItem('shopdzToken');
  };

  // Gestion du panier
const handleAddToCart = async (product) => {
    // 1. ✅ Mise à jour visuelle immédiate (Interface utilisateur)
    setCartItems(prev => {
      const existingItem = prev.find(item => item.id === product.id);
      if (existingItem) {
        if (existingItem.quantity < product.stock) {
          return prev.map(item =>
            item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
          );
        }
        return prev;
      }
      return [...prev, { ...product, quantity: 1 }];
    });


    if (user) {
      try {
        // Envoie les données à votre table 'cart' via l'API
        await addToCart({ 
          product_id: product.id, 
          quantity: 1 
        });
        console.log("Produit ajouté à la base de données !");
      } catch (err) {
        // L'erreur est gérée par votre intercepteur dans api.js (toast.error)
        console.error("Erreur de synchronisation backend:", err);
      }
    }
  };





















  const handleUpdateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) return;
    setCartItems(prev =>
      prev.map(item =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const handleRemoveItem = (productId) => {
    setCartItems(prev => prev.filter(item => item.id !== productId));
  };

  return (
    <Router>
      <div className="App" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: colors.white,
              color: colors.gray.dark,
              border: `1px solid ${colors.gray.medium}`,
            },
            success: {
              iconTheme: {
                primary: colors.mauve.primary,
                secondary: colors.white,
              },
            },
          }}
        />

        <Header
          cartCount={cartItems.length}
          onCartClick={() => setIsCartOpen(true)}
          user={user}
          onLogout={handleLogout}
        />

        <CartDrawer
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
          cartItems={cartItems}
          onUpdateQuantity={handleUpdateQuantity}
          onRemoveItem={handleRemoveItem}
        />

        <main style={{ flex: 1, backgroundColor: colors.gray.light }}>
          <Routes>
          <Route path="/" element={<Home onAddToCart={handleAddToCart} />} />
            <Route path="/products" element={<ProductList onAddToCart={handleAddToCart} />} />



           <Route
              path="/checkout"
              element={
                user ? (
                  <CheckoutPage
                    cart={cartItems}
                    user={user}
                    totalAmount={cartItems.reduce(
                      (total, item) => total + item.price * item.quantity,
                      0
                    )}
                  />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />




            {/* 🔹 Login & Register */}
            <Route path="/login" element={<AuthPage onLoginSuccess={handleLogin} />} />
            <Route path="/register" element={<AuthPage onLoginSuccess={handleLogin} />} />














            {/* 🔹 Profil accessible uniquement si connecté */}
           <Route 
  path="/profile" 
  element={
    user ? (
      <UserProfile 
        user={user} 
        token={localStorage.getItem('shopdzToken')} 
      />
    ) : (
      <Navigate to="/login" />
    )
  } 
/>




















            <Route path="/categories" element={<Categories />} />

            {/* 🔹 Admin sécurisé */}
            <Route
              path="/admin/*"
              element={user?.role === 'admin' ? <AdminDashboard /> : <Navigate to="/login" replace />}
            />










<Route path="/product/:id" element={<ProductPage onAddToCart={handleAddToCart} />} />






          </Routes>









           
        </main>

        <Footer />
      </div>
    </Router>
  );
}

export default App;