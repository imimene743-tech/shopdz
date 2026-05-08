// src/pages/ProductDetails.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import axios from 'axios';
import Footer from '../components/Footer';
//  1. On change l'import vers ton nouveau composant
import RatingReviews from '../components/RatingReviews'; 

const ProductDetails = ({ onAddToCart }) => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  //  2. On récupère le token pour permettre l'ajout de commentaires
  const token = localStorage.getItem('token'); 

  useEffect(() => {
    axios.get(`http://localhost:5000/api/products/${id}`)
      .then(res => setProduct(res.data))
      .catch(err => console.error(err));
  }, [id]);

  if (!product) return <p>Chargement du produit...</p>;

  return (
    <div>
      <ProductCard 
        product={product} 
        onAddToCart={onAddToCart} 
        onToggleFavorite={() => {}} 
        isFavorite={false} 
      />
      
      {/*  3. On utilise le nouveau composant avec l'ID et le Token */}
      <RatingReviews productId={product.id} token={token} />
      
      <Footer />
    </div>
  );
};

export default ProductDetails;