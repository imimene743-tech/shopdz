import React, { useState } from 'react';
import Slider from '../components/Slider';
import CategoryBar from '../components/CategoryBar';
import ProductList from '../components/ProductList';
import Footer from '../components/Footer';

const Home = ({ onAddToCart }) => {
  // On crée l'état ici pour qu'il soit partagé
  const [activeCategory, setActiveCategory] = useState('Tout');

  return (
    <div className="home-page">
      <Slider />
      
      {/* On passe la fonction pour CHANGER la catégorie */}
      <CategoryBar 
        activeCategory={activeCategory} 
        setActiveCategory={setActiveCategory} 
      />
      
      {/* On passe la catégorie actuelle pour FILTRER les produits */}
      <ProductList 
        categoryFilter={activeCategory} 
        onAddToCart={onAddToCart} 
      />
      
      <Footer />
    </div>
  );
};

export default Home;