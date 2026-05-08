// src/components/AuthForm.js
import React, { useState } from 'react';
import axios from 'axios';
import { notifySuccess, notifyError } from '../utils/notify';

const AuthForm = ({ onLoginSuccess }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isRegister && password !== confirmPassword) {
      notifyError("Les mots de passe ne correspondent pas !");
      return;
    }

    try {
      const url = isRegister
        ? 'http://localhost:5000/api/auth/register'
        : 'http://localhost:5000/api/auth/login';

      const payload = isRegister
        ? { name, email, password }
        : { email, password };

      console.log("🚀 Tentative d'authentification...", isRegister ? "Inscription" : "Connexion");

      const res = await axios.post(url, payload);

      // DEBUG: Vérification de la structure de réponse du serveur
      console.log(' RÉPONSE SERVEUR :', res.data);

      if (!isRegister) {
        // --- LOGIQUE DE STOCKAGE SÉCURISÉE ---
        // On récupère le token et l'utilisateur
        const token = res.data.token;
        const user = res.data.user;

        // On vérifie que le token est bien une string non vide et pas "undefined"
        if (token && typeof token === 'string' && token !== "undefined") {
          
          // Nettoyage préventif du stockage pour éviter les conflits
          localStorage.removeItem('shopdzToken');
          localStorage.removeItem('shopdzUser');

          // Sauvegarde des nouvelles données
          localStorage.setItem('shopdzToken', token);
          localStorage.setItem('shopdzUser', JSON.stringify(user));
          
          console.log("💾 Token sauvegardé avec succès dans le LocalStorage !");
          
          notifySuccess("Connexion réussie !");
          
          // Déclenchement de la redirection/mise à jour UI
          onLoginSuccess(user);
        } else {
          console.error("❌ Erreur : Le serveur n'a pas renvoyé de token valide dans res.data.token");
          notifyError("Problème de connexion : Le jeton de sécurité est manquant.");
        }
      } else {
        // Cas de l'inscription réussie
        notifySuccess("Compte créé avec succès ! Connectez-vous.");
        setIsRegister(false);
        setName('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
      }

    } catch (err) {
      console.error("❌ ERREUR AUTH :", err.response?.data || err.message);
      notifyError(err.response?.data?.message || "Erreur lors de l'authentification");
    }
  };

  return (
    <div style={{
      maxWidth: '400px',
      margin: '2rem auto',
      padding: '2rem',
      border: '1px solid #ddd',
      borderRadius: '10px',
      backgroundColor: '#fff',
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
    }}>
      <h2 style={{ textAlign: 'center', color: '#333' }}>
        {isRegister ? "Créer un compte" : "Connexion"}
      </h2>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {isRegister && (
          <input
            type="text"
            placeholder="Nom complet"
            value={name}
            onChange={e => setName(e.target.value)}
            style={{ padding: '0.8rem', borderRadius: '5px', border: '1px solid #ccc' }}
            required
          />
        )}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          style={{ padding: '0.8rem', borderRadius: '5px', border: '1px solid #ccc' }}
          required
        />

        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={e => setPassword(e.target.value)}
          style={{ padding: '0.8rem', borderRadius: '5px', border: '1px solid #ccc' }}
          required
        />

        {isRegister && (
          <input
            type="password"
            placeholder="Confirmer le mot de passe"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            style={{ padding: '0.8rem', borderRadius: '5px', border: '1px solid #ccc' }}
            required
          />
        )}

        <button
          type="submit"
          style={{
            padding: '0.8rem',
            backgroundColor: '#ff0088',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            fontWeight: 'bold',
            cursor: 'pointer',
            fontSize: '1rem'
          }}
        >
          {isRegister ? "S'inscrire" : "Se connecter"}
        </button>
      </form>

      <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem' }}>
        {isRegister ? "Déjà un compte ?" : "Pas encore de compte ?"}{" "}
        <span
          style={{ color: '#ff0080', cursor: 'pointer', fontWeight: 'bold', textDecoration: 'underline' }}
          onClick={() => setIsRegister(!isRegister)}
        >
          {isRegister ? "Se connecter" : "S'inscrire"}
        </span>
      </p>
    </div>
  );
};

export default AuthForm;