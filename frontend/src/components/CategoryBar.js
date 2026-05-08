import React from 'react';

import '../styles/CategoryBar.css';

const categories = [
  { id: 1, name: 'Tout', icon: '🌐' },
  { id: 2, name: 'Maison', icon: '🏠' },
  { id: 3, name: 'Mode Femme', icon: '👗' },
  { id: 4, name: 'Beauté', icon: '💄' },
  { id: 5, name: 'Électronique', icon: '📱' },
  { id: 6, name: 'Cuisine', icon: '🍳' },
];

const CategoryBar = ({ activeCategory, setActiveCategory }) => {
  return (
    <div className="category-scroll">
      {categories.map(cat => (
        <div 
          key={cat.id} 
          className={`category-item ${activeCategory === cat.name ? 'active' : ''}`}
          onClick={() => setActiveCategory(cat.name)} // Au clic, on change la catégorie active
          style={{ cursor: 'pointer' }}
        >
          <div className="category-circle">
            <span className="category-icon">{cat.icon}</span>
          </div>
          <span className="category-name">{cat.name}</span>
        </div>
      ))}
    </div>
  );
};

export default CategoryBar;