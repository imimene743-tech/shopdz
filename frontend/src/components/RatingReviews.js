// src/components/RatingReviews.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';


// ── Hook responsive ───────────────────────────────────────────────
const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 600);
  useEffect(() => {
    const fn = () => setIsMobile(window.innerWidth < 600);
    window.addEventListener('resize', fn);
    return () => window.removeEventListener('resize', fn);
  }, []);
  return isMobile;
};














const Star = ({ filled, onClick }) => (
  <span
    style={{ color: filled ? '#FFC107' : '#E0E0E0', cursor: onClick ? 'pointer' : 'default', fontSize: 24 }}
    onClick={onClick}
  >
    ★
  </span>
);

const RatingReviews = ({ productId, token }) => {
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');

  // Charger les avis au montage du composant
  useEffect(() => {
    if (productId) {
      // correction de l'URL pour correspondre au backend : /api/reviews/:productId
      axios.get(`http://localhost:5000/api/reviews/${productId}`)
        .then(res => setReviews(res.data))
        .catch(err => console.error('Erreur chargement avis', err));
    }
  }, [productId]);

  const submitReview = async () => {
    if (rating === 0) {
      setError('Veuillez sélectionner une note');
      return;
    }
    if (!comment.trim()) {
      setError('Veuillez écrire un commentaire');
      return;
    }
    setError('');

    try {
      await axios.post(`http://localhost:5000/api/reviews`, 
        { product_id: productId, rating, comment },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setComment('');
      setRating(0);
      
      //  Correction de l'URL ici aussi pour rafraîchir la liste
      const res = await axios.get(`http://localhost:5000/api/reviews/${productId}`);
      setReviews(res.data);
    } catch (err) {
      setError('Erreur lors de l\'envoi de l\'avis');
      console.error(err);
    }
  };

  return (
    <div style={{ maxWidth: 800, margin: '2rem auto', padding: '0 1rem' }}>
      <h3 style={{ borderBottom: '2px solid #9c27b0', paddingBottom: '10px' }}>Avis clients ({reviews.length})</h3>

      {/* Affichage des avis existants */}
      <div style={{ marginTop: '1.5rem' }}>
        {reviews.length === 0 ? (
          <p style={{ fontStyle: 'italic', color: '#888' }}>Aucun avis pour ce produit.</p>
        ) : (
          reviews.map(r => (
            <div key={r.id} style={{ borderBottom: '1px solid #eee', padding: '1rem 0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 'bold', color: '#9c27b0' }}>{r.name || "Utilisateur"}</span>
                <small style={{ color: '#888' }}>{new Date(r.created_at).toLocaleDateString()}</small>
              </div>
              <div>
                {[1,2,3,4,5].map(i => (
                  <Star key={i} filled={i <= r.rating} />
                ))}
              </div>
              <p style={{ marginTop: '8px', color: '#444' }}>{r.comment}</p>
            </div>
          ))
        )}
      </div>

      {/* Formulaire d'ajout */}
      <div style={{ marginTop: '2.5rem', padding: '1.5rem', backgroundColor: '#fdf7ff', borderRadius: '12px' }}>
        <h4>Laissez votre avis</h4>
        {token ? (
          <div>
            <div style={{ margin: '10px 0' }}>
              {[1,2,3,4,5].map(i => (
                <Star key={i} filled={i <= rating} onClick={() => setRating(i)} />
              ))}
            </div>
            <textarea
              value={comment}
              onChange={e => setComment(e.target.value)}
              rows={3}
              style={{ width: '100%', marginTop: 8, padding: 12, borderRadius: '8px', border: '1px solid #ddd' }}
              placeholder="Qu'avez-vous pensé de ce produit ?"
            />
            {error && <p style={{ color: '#d32f2f', fontSize: '0.9rem', marginTop: '5px' }}>{error}</p>}
            <button 
              onClick={submitReview} 
              style={{ 
                marginTop: 12, 
                padding: '0.6rem 1.5rem', 
                backgroundColor: '#9c27b0', 
                color: 'white', 
                border: 'none', 
                borderRadius: '25px', 
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              Publier l'avis
            </button>
          </div>
        ) : (
          <p style={{ color: '#666' }}>
            Vous devez être <a href="/login" style={{ color: '#9c27b0', fontWeight: 'bold' }}>connecté</a> pour laisser un avis.
          </p>
        )}
      </div>
    </div>
  );
};

export default RatingReviews;