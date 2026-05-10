import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { API_URL, UPLOADS_URL } from '../utils/config';
import RatingReviews from '../components/RatingReviews';
import Footer from '../components/Footer';

const ProductDetails = ({ onAddToCart, user }) => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const token = localStorage.getItem('shopdzToken');

  useEffect(() => {
    axios.get(`${API_URL}/products/${id}`)
      .then(res => setProduct(res.data))
      .catch(err => console.error(err));
  }, [id]);

  if (!product) return <p>Chargement...</p>;

  return (
    <div>
      <RatingReviews productId={product.id} user={user} token={token} />
      <Footer />
    </div>
  );
};

export default ProductDetails;