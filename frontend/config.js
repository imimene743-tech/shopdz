// src/utils/config.js
// Fichier centralisé pour toutes les URLs
// Pour l'hébergement, changez uniquement les variables dans .env

export const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
export const UPLOADS_URL = process.env.REACT_APP_UPLOADS_URL || 'http://localhost:5000/uploads';

// Helper pour les images produits
export const getImageUrl = (imageName) => {
  if (!imageName) return 'https://via.placeholder.com/300x200?text=Shop+DZ';
  if (imageName.startsWith('http')) return imageName;
  return `${UPLOADS_URL}/${imageName}`;
};