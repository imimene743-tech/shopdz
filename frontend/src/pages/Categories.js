// src/pages/Categories.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Categories = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    // Remplace l'URL par ton API backend pour récupérer les catégories
    axios.get('http://localhost:5000/api/categories')
      .then(res => setCategories(res.data))
      .catch(err => console.error("Erreur chargement catégories:", err));
  }, []);

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Catégories de produits</h1>
      {categories.length === 0 ? (
        <p>Aucune catégorie disponible</p>
      ) : (
        <ul>
          {categories.map(cat => (
            <li key={cat.id}>{cat.name}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Categories;