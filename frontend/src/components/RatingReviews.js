import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { API_URL } from '../utils/config';

const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 600);
  useEffect(() => {
    const fn = () => setIsMobile(window.innerWidth < 600);
    window.addEventListener('resize', fn);
    return () => window.removeEventListener('resize', fn);
  }, []);
  return isMobile;
};

const Stars = ({ value, size = 22, interactive = false, onSelect }) => (
  <span style={{ display: 'inline-flex', gap: '2px' }}>
    {[1,2,3,4,5].map(i => (
      <span key={i} onClick={() => interactive && onSelect && onSelect(i)}
        style={{
          fontSize: size, color: i <= Math.round(value) ? '#FFC107' : '#DDD',
          cursor: interactive ? 'pointer' : 'default',
          transition: 'transform 0.1s', display: 'inline-block', lineHeight: 1,
        }}
        onMouseEnter={e => { if (interactive) e.currentTarget.style.transform = 'scale(1.25)'; }}
        onMouseLeave={e => { if (interactive) e.currentTarget.style.transform = 'scale(1)'; }}
      >★</span>
    ))}
  </span>
);

const Avatar = ({ name }) => {
  const palette = ['#9c27b0','#1976d2','#388e3c','#f57c00','#c2185b','#00796b'];
  const color = palette[(name || 'U').charCodeAt(0) % palette.length];
  const initials = (name || 'U').split(' ').map(w => w[0]).join('').slice(0,2).toUpperCase();
  return (
    <div style={{
      width: '40px', height: '40px', borderRadius: '50%',
      backgroundColor: color, color: 'white', flexShrink: 0,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontWeight: '700', fontSize: '0.88rem',
    }}>{initials}</div>
  );
};

const RatingReviews = ({ productId, user, token }) => {
  const isMobile = useIsMobile();
  const [reviews, setReviews]     = useState([]);
  const [stats, setStats]         = useState(null);
  const [loading, setLoading]     = useState(true);
  const [rating, setRating]       = useState(0);
  const [comment, setComment]     = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError]         = useState('');
  const [success, setSuccess]     = useState('');
  const [sortBy, setSortBy]       = useState('recent');

  const fetchReviews = useCallback(async () => {
    try {
      setLoading(true);
      // ✅ utilise API_URL
      const res = await axios.get(`${API_URL}/reviews/${productId}`);
      // gère les 2 formats : { reviews, stats } ou tableau direct
      if (Array.isArray(res.data)) {
        setReviews(res.data);
        setStats(null);
      } else {
        setReviews(res.data.reviews || []);
        setStats(res.data.stats || null);
      }
    } catch (err) {
      console.error('Erreur avis:', err);
    } finally {
      setLoading(false);
    }
  }, [productId]);

  useEffect(() => { if (productId) fetchReviews(); }, [fetchReviews]);

  const handleSubmit = async () => {
    setError(''); setSuccess('');
    if (rating === 0) return setError('Choisissez une note.');
    if (comment.trim().length < 5) return setError('Commentaire trop court (min 5 caractères).');
    setSubmitting(true);
    try {
      // ✅ utilise API_URL
      await axios.post(
        `${API_URL}/reviews`,
        { product_id: productId, rating, comment },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccess('Votre avis a été publié !');
      setRating(0); setComment('');
      fetchReviews();
    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors de l'envoi.");
    } finally {
      setSubmitting(false);
    }
  };

  const sorted = [...reviews].sort((a, b) => {
    if (sortBy === 'best')  return b.rating - a.rating;
    if (sortBy === 'worst') return a.rating - b.rating;
    return new Date(b.created_at) - new Date(a.created_at);
  });

  const total   = Number(stats?.total)   || reviews.length;
  const average = Number(stats?.average) || (reviews.length > 0 ? reviews.reduce((s,r) => s + r.rating, 0) / reviews.length : 0);
  const alreadyReviewed = user && reviews.some(r => r.user_id === user.id);
  const ratingLabel = ['','Très mauvais 😞','Mauvais 😐','Correct 🙂','Bon 😊','Excellent 🤩'];

  return (
    <div style={{ maxWidth: '860px', margin: '2.5rem auto 0', padding: '0 1rem 3rem' }}>

      <h3 style={{
        fontSize: isMobile ? '1.05rem' : '1.25rem',
        fontWeight: '800', color: '#2d2d2d',
        borderBottom: '3px solid #9c27b0',
        paddingBottom: '12px', marginBottom: '1.5rem',
        display: 'flex', alignItems: 'center', gap: '10px',
      }}>
        ⭐ Avis clients
        <span style={{ fontSize: '0.88rem', fontWeight: '500', color: '#999' }}>({total})</span>
      </h3>

      {/* Résumé */}
      {total > 0 && average > 0 && (
        <div style={{
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          alignItems: isMobile ? 'center' : 'flex-start',
          gap: isMobile ? '1rem' : '2rem',
          background: '#FAFAFA', borderRadius: '16px',
          padding: isMobile ? '1rem' : '1.2rem 1.5rem',
          marginBottom: '1.8rem', border: '1px solid #F0E0F7',
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', fontWeight: '800', color: '#9c27b0', lineHeight: 1 }}>
              {average.toFixed(1)}
            </div>
            <Stars value={average} size={18} />
            <div style={{ fontSize: '0.75rem', color: '#aaa', marginTop: '4px' }}>{total} avis</div>
          </div>
        </div>
      )}

      {/* Tri */}
      {total > 1 && (
        <div style={{ display: 'flex', gap: '8px', marginBottom: '1rem', flexWrap: 'wrap' }}>
          {[
            { key: 'recent', label: isMobile ? '🕐 Récents' : '🕐 Plus récents' },
            { key: 'best',   label: isMobile ? '⬆️ Meilleures' : '⬆️ Meilleures notes' },
            { key: 'worst',  label: isMobile ? '⬇️ Basses' : '⬇️ Notes les plus basses' },
          ].map(opt => (
            <button key={opt.key} onClick={() => setSortBy(opt.key)} style={{
              padding: isMobile ? '5px 10px' : '5px 14px',
              borderRadius: '20px', fontSize: isMobile ? '0.78rem' : '0.82rem',
              border: `1.5px solid ${sortBy === opt.key ? '#9c27b0' : '#ddd'}`,
              background: sortBy === opt.key ? '#9c27b0' : 'white',
              color: sortBy === opt.key ? 'white' : '#555',
              cursor: 'pointer', fontFamily: 'inherit', fontWeight: '500',
            }}>{opt.label}</button>
          ))}
        </div>
      )}

      {/* Liste avis */}
      {loading ? (
        <p style={{ color: '#aaa', textAlign: 'center', padding: '2rem' }}>Chargement...</p>
      ) : sorted.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '2rem', background: '#fafafa', borderRadius: '12px', border: '1px dashed #ddd' }}>
          <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>💬</div>
          <p style={{ fontWeight: '500', color: '#888' }}>Aucun avis pour l'instant.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {sorted.map(r => (
            <div key={r.id} style={{
              background: 'white', borderRadius: '14px',
              padding: isMobile ? '0.85rem' : '1rem 1.2rem',
              boxShadow: '0 2px 10px rgba(0,0,0,0.06)',
            }}>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                <Avatar name={r.name} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '4px' }}>
                    <span style={{ fontWeight: '700', color: '#333', fontSize: '0.92rem' }}>{r.name || 'Utilisateur'}</span>
                    <span style={{ fontSize: '0.75rem', color: '#bbb' }}>
                      {new Date(r.created_at).toLocaleDateString('fr-DZ', { day: 'numeric', month: isMobile ? 'short' : 'long', year: 'numeric' })}
                    </span>
                  </div>
                  <div style={{ margin: '4px 0' }}><Stars value={r.rating} size={15} /></div>
                  <p style={{ color: '#444', fontSize: '0.9rem', lineHeight: '1.6', margin: '6px 0 0', wordBreak: 'break-word' }}>
                    {r.comment}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Formulaire */}
      <div style={{
        marginTop: '2rem', background: '#fdf7ff',
        borderRadius: '16px', padding: isMobile ? '1rem' : '1.5rem',
        border: '1px solid #E1BEE7',
      }}>
        <h4 style={{ margin: '0 0 1rem', color: '#6a1b9a', fontSize: '1rem', fontWeight: '700' }}>
          ✍️ Laisser un avis
        </h4>

        {!user && !token ? (
          <p style={{ color: '#666', fontSize: '0.92rem' }}>
            Vous devez être{' '}
            <a href="/login" style={{ color: '#9c27b0', fontWeight: '700' }}>connecté</a>
            {' '}pour laisser un avis.
          </p>
        ) : alreadyReviewed ? (
          <div style={{ background: '#e8f5e9', borderRadius: '10px', padding: '0.8rem 1rem', color: '#2e7d32', fontSize: '0.9rem', fontWeight: '500' }}>
            ✅ Vous avez déjà laissé un avis sur ce produit. Merci !
          </div>
        ) : (
          <div>
            <div style={{ marginBottom: '1rem' }}>
              <p style={{ fontSize: '0.85rem', color: '#888', marginBottom: '8px' }}>Votre note :</p>
              <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', alignItems: isMobile ? 'flex-start' : 'center', gap: isMobile ? '6px' : '12px' }}>
                <Stars value={rating} size={isMobile ? 36 : 32} interactive onSelect={setRating} />
                {rating > 0 && <span style={{ fontSize: '0.88rem', color: '#9c27b0', fontWeight: '600' }}>{ratingLabel[rating]}</span>}
              </div>
            </div>

            <textarea
              value={comment}
              onChange={e => setComment(e.target.value)}
              rows={isMobile ? 3 : 4}
              placeholder="Qu'avez-vous pensé de ce produit ?"
              maxLength={500}
              style={{
                width: '100%', padding: '12px', borderRadius: '10px',
                border: '1.5px solid #E1BEE7', fontSize: '0.93rem',
                fontFamily: 'inherit', resize: 'vertical', outline: 'none',
                lineHeight: '1.5', boxSizing: 'border-box',
              }}
              onFocus={e => e.target.style.borderColor = '#9c27b0'}
              onBlur={e => e.target.style.borderColor = '#E1BEE7'}
            />

            <div style={{ marginTop: '6px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <span style={{ fontSize: '0.75rem', color: comment.length < 5 ? '#bbb' : '#9c27b0' }}>{comment.length} / 500</span>
              {error   && <span style={{ fontSize: '0.85rem', color: '#d32f2f', fontWeight: '500' }}>⚠️ {error}</span>}
              {success && <span style={{ fontSize: '0.85rem', color: '#2e7d32', fontWeight: '500' }}>✅ {success}</span>}
            </div>

            <button onClick={handleSubmit} disabled={submitting} style={{
              marginTop: '1rem', width: isMobile ? '100%' : 'auto',
              padding: '0.75rem 2rem',
              background: submitting ? '#ce93d8' : 'linear-gradient(135deg, #9c27b0, #6a1b9a)',
              color: 'white', border: 'none', borderRadius: '30px',
              fontWeight: '700', fontSize: '0.95rem',
              cursor: submitting ? 'not-allowed' : 'pointer',
              fontFamily: 'inherit', boxShadow: '0 4px 14px rgba(156,39,176,0.35)',
            }}>
              {submitting ? '⏳ Publication...' : '📤 Publier mon avis'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RatingReviews;
