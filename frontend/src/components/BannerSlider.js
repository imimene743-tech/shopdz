// src/components/BannerSlider.js
import React, { useState, useEffect } from 'react';

const banners = [
  { id: 1, image: 'https://via.placeholder.com/1200x300?text=Promo+1', text: 'Promo spéciale -50%' },
  { id: 2, image: 'https://via.placeholder.com/1200x300?text=Promo+2', text: 'Livraison gratuite dès 5000 DA' },
  { id: 3, image: 'https://via.placeholder.com/1200x300?text=Promo+3', text: 'Nouveautés mode femme' },
];

const BannerSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((i) => (i + 1) % banners.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div style={{ position: 'relative', overflow: 'hidden', borderRadius: 8, marginBottom: '2rem' }}>
      {banners.map((banner, i) => (
        <div
          key={banner.id}
          style={{
            backgroundImage: `url(${banner.image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            height: 300,
            width: '100%',
            opacity: i === currentIndex ? 1 : 0,
            transition: 'opacity 1s ease-in-out',
            position: i === currentIndex ? 'relative' : 'absolute',
            top: 0,
            left: 0,
          }}
        >
          <div style={{
            position: 'absolute',
            bottom: 20,
            left: 20,
            color: 'white',
            fontSize: 24,
            fontWeight: 'bold',
            textShadow: '0 0 10px rgba(0,0,0,0.7)'
          }}>
            {banner.text}
          </div>
        </div>
      ))}
    </div>
  );
};

export default BannerSlider;