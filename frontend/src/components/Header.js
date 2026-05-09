import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PersonIcon from '@mui/icons-material/Person';
import SearchIcon from '@mui/icons-material/Search';
import LogoutIcon from '@mui/icons-material/Logout';
import '../styles/Header.css';


import { API_URL } from '../utils/config';




const Header = ({ cartCount = 0, onCartClick, user, onLogout }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  
  // Nouveaux états pour les suggestions
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  const navigate = useNavigate();
  const searchRef = useRef(null); // Pour fermer les suggestions si on clique ailleurs

  // 1. Logique pour les suggestions (Recherche intuitive)
  useEffect(() => {
    const getSuggestions = async () => {
      if (searchTerm.trim().length > 0) {
        try {






          const res = await axios.get(`${API_URL}/products/search?search=${searchTerm}`);
         
         
         
         
         
         
         
         
         
         
         
         
         
         
         
         
         
         
         
         
         
         
         
         
          setSuggestions(res.data.slice(0, 5)); // On garde les 5 premiers
          setShowSuggestions(true);
        } catch (err) {
          console.error("Erreur suggestions:", err);
        }
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    };

    // Debounce : on attend 300ms pour ne pas saturer le serveur
    const timeoutId = setTimeout(getSuggestions, 300);
    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  // 2. Fermer les menus (Dropdown user et Suggestions) si on clique ailleurs
  useEffect(() => {
    const handleClickOutside = (e) => {
      // Ferme les suggestions
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
      // Ferme le menu utilisateur
      if (!e.target.closest('.user-menu-container')) {
        setIsUserMenuOpen(false);
      }
    };

    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/products?search=${searchTerm}`);
      setShowSuggestions(false);
      // Optionnel : on ne vide plus le searchTerm pour que l'utilisateur voie ce qu'il a cherché
    }
  };

  const handleSelectSuggestion = (productName) => {
    setSearchTerm(productName);
    setShowSuggestions(false);
    navigate(`/products?search=${productName}`);
  };

  return (
    <header className="main-header">
      <div className="header-container">
        
        {/* Logo */}
        <Link to="/" className="logo-link">
          <span>🛍️</span> Shop DZ
        </Link>

        {/* Barre de Recherche avec Wrapper pour les suggestions */}
        <div className="search-wrapper" ref={searchRef}>
          <form onSubmit={handleSearch} className="search-form">
            <input
              type="text"
              placeholder="Rechercher un produit..."
              className="search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => searchTerm && setShowSuggestions(true)}
            />
            <button type="submit" className="search-button">
              <SearchIcon />
            </button>
          </form>

          {/* Menu des suggestions intuitives */}
          {showSuggestions && suggestions.length > 0 && (
            <div className="suggestions-dropdown">
              {suggestions.map((p) => (
                <div 
                  key={p.id} 
                  className="suggestion-item"
                  onClick={() => handleSelectSuggestion(p.name)}
                >
                  <img src={`http://localhost:5000/uploads/${p.image}`} alt="" className="suggestion-img" />
                  <div className="suggestion-info">
                    <span className="suggestion-name">{p.name}</span>
                    <span className="suggestion-price">{p.price} DA</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Navigation et Actions */}
        <div className="nav-group">
          <Link to="/products" className="icon-btn">
            Produits
          </Link>

          {/* Bouton Panier */}
          <button onClick={onCartClick} className="icon-btn">
            <ShoppingCartIcon />
            <span>Panier</span>
            {cartCount > 0 && (
              <span className="cart-badge">{cartCount}</span>
            )}
          </button>

          {/* Menu Utilisateur / Connexion */}
          {user ? (
            <div className="user-menu-container">
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setIsUserMenuOpen(!isUserMenuOpen);
                }} 
                className="icon-btn"
              >
                <PersonIcon />
                <span>{user.name}</span>
              </button>
              
              {isUserMenuOpen && (
                <div className="user-dropdown">
                  <Link to="/profile" className="dropdown-item">
                    Mon Profil
                  </Link>
                  
                  {user.role === 'admin' && (
                    <Link to="/admin" className="dropdown-item admin-link-item">
                      Administration ⚙️
                    </Link>
                  )}
                  
                  <Link to="/orders" className="dropdown-item">
                    Mes Commandes
                  </Link>
                  
                  <button onClick={onLogout} className="dropdown-item logout-item">
                    <LogoutIcon fontSize="small" /> Déconnexion
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="icon-btn login-btn">
              <PersonIcon />
              <span>Connexion</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;