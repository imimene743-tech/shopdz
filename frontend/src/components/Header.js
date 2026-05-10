import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PersonIcon from '@mui/icons-material/Person';
import SearchIcon from '@mui/icons-material/Search';
import LogoutIcon from '@mui/icons-material/Logout';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import '../styles/Header.css';
import { API_URL, getImageUrl } from '../utils/config';

const Header = ({ cartCount = 0, onCartClick, user, onLogout }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const navigate = useNavigate();
  const searchRef = useRef(null);

  useEffect(() => {
    const getSuggestions = async () => {
      if (searchTerm.trim().length > 0) {
        try {
          const res = await axios.get(`${API_URL}/products/search?search=${searchTerm}`);
          setSuggestions(res.data.slice(0, 5));
          setShowSuggestions(true);
        } catch (err) {
          console.error("Erreur suggestions:", err);
        }
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    };
    const timeoutId = setTimeout(getSuggestions, 300);
    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
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
      setIsMobileMenuOpen(false);
    }
  };

  const handleSelectSuggestion = (productName) => {
    setSearchTerm(productName);
    setShowSuggestions(false);
    navigate(`/products?search=${productName}`);
  };

  return (
    <>
      <header className="main-header">
        <div className="header-container">

          {/* Logo */}
          <Link to="/" className="logo-link">
            <span>🛍️</span> Shop DZ
          </Link>

          {/* Barre de recherche */}
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

            {showSuggestions && suggestions.length > 0 && (
              <div className="suggestions-dropdown">
                {suggestions.map((p) => (
                  <div
                    key={p.id}
                    className="suggestion-item"
                    onClick={() => handleSelectSuggestion(p.name)}
                  >
                    {/* ✅ FIX : utilise getImageUrl au lieu de localhost */}
                    <img src={getImageUrl(p.image)} alt="" className="suggestion-img" />
                    <div className="suggestion-info">
                      <span className="suggestion-name">{p.name}</span>
                      <span className="suggestion-price">{p.price} DA</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Navigation desktop */}
          <div className="nav-group">
            <Link to="/products" className="icon-btn">
              <span>Produits</span>
            </Link>

            <button onClick={onCartClick} className="icon-btn cart-btn">
              <ShoppingCartIcon />
              <span>Panier</span>
              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </button>

            {user ? (
              <div className="user-menu-container">
                <button
                  onClick={(e) => { e.stopPropagation(); setIsUserMenuOpen(!isUserMenuOpen); }}
                  className="icon-btn user-btn"
                >
                  <div className="user-avatar">{user.name?.charAt(0).toUpperCase()}</div>
                  <span>{user.name?.split(' ')[0]}</span>
                </button>

                {isUserMenuOpen && (
                  <div className="user-dropdown">
                    <div className="dropdown-header">
                      <strong>{user.name}</strong>
                      <span>{user.email}</span>
                    </div>
                    <Link to="/profile" className="dropdown-item" onClick={() => setIsUserMenuOpen(false)}>
                      👤 Mon Profil
                    </Link>
                    {user.role === 'admin' && (
                      <Link to="/admin" className="dropdown-item admin-link-item" onClick={() => setIsUserMenuOpen(false)}>
                        ⚙️ Administration
                      </Link>
                    )}
                    <Link to="/profile" className="dropdown-item" onClick={() => setIsUserMenuOpen(false)}>
                      📦 Mes Commandes
                    </Link>
                    <button onClick={() => { onLogout(); setIsUserMenuOpen(false); }} className="dropdown-item logout-item">
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

          {/* Burger mobile */}
          <button className="burger-btn" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </header>

      {/* Menu mobile */}
      {isMobileMenuOpen && (
        <div className="mobile-menu">
          <form onSubmit={handleSearch} className="search-form mobile-search-form">
            <input
              type="text"
              placeholder="Rechercher..."
              className="search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button type="submit" className="search-button"><SearchIcon /></button>
          </form>

          <Link to="/products" className="mobile-menu-item" onClick={() => setIsMobileMenuOpen(false)}>
            🏪 Produits
          </Link>
          <button onClick={() => { onCartClick(); setIsMobileMenuOpen(false); }} className="mobile-menu-item">
            🛒 Panier {cartCount > 0 && `(${cartCount})`}
          </button>
          {user ? (
            <>
              <Link to="/profile" className="mobile-menu-item" onClick={() => setIsMobileMenuOpen(false)}>👤 Mon Profil</Link>
              {user.role === 'admin' && (
                <Link to="/admin" className="mobile-menu-item" onClick={() => setIsMobileMenuOpen(false)}>⚙️ Administration</Link>
              )}
              <button onClick={() => { onLogout(); setIsMobileMenuOpen(false); }} className="mobile-menu-item logout-mobile">
                🚪 Déconnexion
              </button>
            </>
          ) : (
            <Link to="/login" className="mobile-menu-item" onClick={() => setIsMobileMenuOpen(false)}>
              🔐 Connexion
            </Link>
          )}
        </div>
      )}
    </>
  );
};

export default Header;
