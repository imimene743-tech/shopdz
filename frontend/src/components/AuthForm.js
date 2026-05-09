import React, { useState } from 'react';
import axios from 'axios';
import { notifySuccess, notifyError } from '../utils/notify';
import { API_URL } from '../utils/config';

const AuthForm = ({ onLoginSuccess }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isRegister && password !== confirmPassword) {
      notifyError("Les mots de passe ne correspondent pas !");
      return;
    }

    setLoading(true);
    try {
      const url = isRegister
        ? `${API_URL}/auth/register`
        : `${API_URL}/auth/login`;

      const payload = isRegister
        ? { name, email, password }
        : { email, password };

      const res = await axios.post(url, payload);

      if (!isRegister) {
        const token = res.data.token;
        const user = res.data.user;

        if (token && typeof token === 'string' && token !== "undefined") {
          localStorage.removeItem('shopdzToken');
          localStorage.removeItem('shopdzUser');
          localStorage.setItem('shopdzToken', token);
          localStorage.setItem('shopdzUser', JSON.stringify(user));
          notifySuccess("Connexion réussie !");
          onLoginSuccess(user);
        } else {
          notifyError("Problème de connexion : Le jeton de sécurité est manquant.");
        }
      } else {
        notifySuccess("Compte créé avec succès ! Connectez-vous.");
        setIsRegister(false);
        setName('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
      }

    } catch (err) {
      notifyError(err.response?.data?.message || "Erreur lors de l'authentification");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    padding: '0.85rem 1rem',
    borderRadius: '10px',
    border: '1.5px solid #e0e0e0',
    fontSize: '0.95rem',
    fontFamily: 'inherit',
    outline: 'none',
    transition: 'border-color 0.2s',
    width: '100%',
    boxSizing: 'border-box',
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f3e5f5 0%, #fce4ec 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem',
    }}>
      <div style={{
        width: '100%',
        maxWidth: '420px',
        background: 'white',
        borderRadius: '20px',
        padding: '2.5rem 2rem',
        boxShadow: '0 10px 40px rgba(156,39,176,0.15)',
      }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🛍️</div>
          <h1 style={{ color: '#9c27b0', fontWeight: '800', fontSize: '1.6rem', margin: 0 }}>Shop DZ</h1>
          <p style={{ color: '#aaa', fontSize: '0.88rem', marginTop: '4px' }}>
            {isRegister ? 'Créez votre compte gratuit' : 'Bienvenue ! Connectez-vous'}
          </p>
        </div>

        {/* Toggle */}
        <div style={{
          display: 'flex',
          background: '#f5f5f5',
          borderRadius: '12px',
          padding: '4px',
          marginBottom: '1.5rem',
        }}>
          {['Connexion', 'Inscription'].map((label, i) => (
            <button
              key={label}
              onClick={() => setIsRegister(i === 1)}
              style={{
                flex: 1,
                padding: '0.6rem',
                border: 'none',
                borderRadius: '10px',
                fontWeight: '600',
                fontSize: '0.9rem',
                cursor: 'pointer',
                fontFamily: 'inherit',
                transition: 'all 0.2s',
                background: isRegister === (i === 1) ? 'white' : 'transparent',
                color: isRegister === (i === 1) ? '#9c27b0' : '#888',
                boxShadow: isRegister === (i === 1) ? '0 2px 8px rgba(0,0,0,0.1)' : 'none',
              }}
            >{label}</button>
          ))}
        </div>

        {/* Formulaire */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>

          {isRegister && (
            <div>
              <label style={{ fontSize: '0.82rem', color: '#666', fontWeight: '600', display: 'block', marginBottom: '5px' }}>
                Nom complet
              </label>
              <input
                type="text"
                placeholder="Votre nom"
                value={name}
                onChange={e => setName(e.target.value)}
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = '#9c27b0'}
                onBlur={e => e.target.style.borderColor = '#e0e0e0'}
                required
              />
            </div>
          )}

          <div>
            <label style={{ fontSize: '0.82rem', color: '#666', fontWeight: '600', display: 'block', marginBottom: '5px' }}>
              Adresse email
            </label>
            <input
              type="email"
              placeholder="exemple@email.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              style={inputStyle}
              onFocus={e => e.target.style.borderColor = '#9c27b0'}
              onBlur={e => e.target.style.borderColor = '#e0e0e0'}
              required
            />
          </div>

          <div>
            <label style={{ fontSize: '0.82rem', color: '#666', fontWeight: '600', display: 'block', marginBottom: '5px' }}>
              Mot de passe
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              style={inputStyle}
              onFocus={e => e.target.style.borderColor = '#9c27b0'}
              onBlur={e => e.target.style.borderColor = '#e0e0e0'}
              required
            />
          </div>

          {isRegister && (
            <div>
              <label style={{ fontSize: '0.82rem', color: '#666', fontWeight: '600', display: 'block', marginBottom: '5px' }}>
                Confirmer le mot de passe
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = '#9c27b0'}
                onBlur={e => e.target.style.borderColor = '#e0e0e0'}
                required
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              padding: '0.9rem',
              background: loading ? '#ce93d8' : 'linear-gradient(135deg, #9c27b0, #6a1b9a)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              fontWeight: '700',
              fontSize: '1rem',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontFamily: 'inherit',
              marginTop: '0.3rem',
              boxShadow: '0 4px 14px rgba(156,39,176,0.35)',
              transition: 'transform 0.2s',
            }}
            onMouseEnter={e => { if (!loading) e.currentTarget.style.transform = 'translateY(-1px)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; }}
          >
            {loading ? '⏳ Chargement...' : isRegister ? "✨ Créer mon compte" : "🔐 Se connecter"}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '1.2rem', fontSize: '0.88rem', color: '#888' }}>
          {isRegister ? "Déjà un compte ?" : "Pas encore de compte ?"}{" "}
          <span
            onClick={() => setIsRegister(!isRegister)}
            style={{ color: '#9c27b0', cursor: 'pointer', fontWeight: '700' }}
          >
            {isRegister ? "Se connecter" : "S'inscrire gratuitement"}
          </span>
        </p>
      </div>
    </div>
  );
};

export default AuthForm;
