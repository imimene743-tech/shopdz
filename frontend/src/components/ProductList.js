import React, { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import ProductCard from './ProductCard';
import { colors } from '../utils/theme';
import { getProducts, getCategories } from '../services/api';
import axios from 'axios'; // Assure-toi qu'axios est importé
import toast from 'react-hot-toast';



import { API_URL } from '../utils/config';












const ProductList = ({ onAddToCart }) => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState([]);
  const [sortBy, setSortBy] = useState('default');
  const [filterPrice, setFilterPrice] = useState({ min: '', max: '' });
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [categories, setCategories] = useState([]);

  const location = useLocation();















  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const searchParams = new URLSearchParams(location.search);
      const searchQuery = searchParams.get('search');

      let response; // On déclare la variable une seule fois ici

      if (searchQuery) {
        // CORRECTION : On retire le "const", on utilise la variable 'response' déclarée plus haut
        response = await axios.get(`${API_URL}/products/search?search=${searchQuery}`);
      } else {
        response = await getProducts();
      }

      // On vérifie que response existe avant d'accéder à .data
      if (response && response.data) {
        setProducts(response.data);
      } else {
        setProducts([]);
      }
    } catch (error) {
      console.error('Erreur chargement produits:', error);
      toast.error('Erreur de connexion avec le serveur');
      setProducts([]); // Sécurité : on vide la liste en cas d'erreur
    } finally {
      setLoading(false);
    }
  }, [location.search]);















  // 2. Initialisation et Refresh quand l'URL change
  useEffect(() => {
    fetchProducts();
    fetchCategories();
    loadFavorites();
  }, [fetchProducts]);

  // 3. Synchronisation de la catégorie via l'URL
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const cat = searchParams.get('category') || 'all';
    setSelectedCategory(cat);
  }, [location.search]);

  // 4. Filtrage Local (Prix et Catégorie) sur les résultats de l'API
  useEffect(() => {
    let result = [...products];

    // Filtre catégorie
    if (selectedCategory !== 'all') {
      result = result.filter(p => p.category_id === parseInt(selectedCategory));
    }

    // Filtre prix
    if (filterPrice.min) {
      result = result.filter(p => (p.promotion_price || p.price) >= parseFloat(filterPrice.min));
    }
    if (filterPrice.max) {
      result = result.filter(p => (p.promotion_price || p.price) <= parseFloat(filterPrice.max));
    }

    // Tri
    if (sortBy === 'price-asc') result.sort((a, b) => (a.promotion_price || a.price) - (b.promotion_price || b.price));
    if (sortBy === 'price-desc') result.sort((a, b) => (b.promotion_price || b.price) - (a.promotion_price || a.price));
    if (sortBy === 'name-asc') result.sort((a, b) => (a.name || "").localeCompare(b.name || ""));

    setFilteredProducts(result);
  }, [products, selectedCategory, sortBy, filterPrice]);

  const fetchCategories = async () => {
    try {
      const response = await getCategories();
      setCategories(response.data);
    } catch (error) {
      console.error('Erreur catégories:', error);
    }
  };

  const loadFavorites = () => {
    const saved = localStorage.getItem('favorites');
    if (saved) setFavorites(JSON.parse(saved));
  };

  const handleToggleFavorite = (product) => {
    const isFav = favorites.includes(product.id);
    const newFavs = isFav ? favorites.filter(id => id !== product.id) : [...favorites, product.id];
    localStorage.setItem('favorites', JSON.stringify(newFavs));
    setFavorites(newFavs);
    toast.success(isFav ? 'Retiré' : 'Ajouté', { icon: isFav ? '💔' : '❤️' });
  };

  // --- Rendu ---
  if (loading) return <div style={{ textAlign: 'center', padding: '3rem' }}>Chargement...</div>;

  const searchQueryDisplay = new URLSearchParams(location.search).get('search');

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <h1 style={{ fontSize: '2rem', color: colors.mauve.primary, fontWeight: 'bold' }}>
          {searchQueryDisplay ? `Résultats pour "${searchQueryDisplay}"` : 'Nos Produits'}
        </h1>
        
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <select value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)} style={selectStyle}>
            <option value="all">Toutes les catégories</option>
            {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
          </select>

          <select value={sortBy} onChange={e => setSortBy(e.target.value)} style={selectStyle}>
            <option value="default">Trier par</option>
            <option value="price-asc">Prix croissant</option>
            <option value="price-desc">Prix décroissant</option>
            <option value="name-asc">Nom (A-Z)</option>
          </select>

          <input type="number" placeholder="Min" value={filterPrice.min} onChange={e => setFilterPrice({...filterPrice, min: e.target.value})} style={inputStyle} />
          <input type="number" placeholder="Max" value={filterPrice.max} onChange={e => setFilterPrice({...filterPrice, max: e.target.value})} style={inputStyle} />
        </div>
      </div>

      {filteredProducts.length === 0 ? (
        <div style={{ textAlign: 'center', color: colors.gray.medium }}>Aucun produit trouvé</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '2rem' }}>
          {filteredProducts.map(product => (
            <ProductCard 
              key={product.id} 
              product={product} 
              onAddToCart={onAddToCart} 
              isFavorite={favorites.includes(product.id)}
              onToggleFavorite={() => handleToggleFavorite(product)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const selectStyle = { padding: '0.5rem', borderRadius: '5px', border: `1px solid ${colors.gray.medium}` };
const inputStyle = { padding: '0.5rem', width: '80px', borderRadius: '5px', border: `1px solid ${colors.gray.medium}` };

export default ProductList;