// src/components/CategoryFilter.js
import React from "react";

function CategoryFilter({ categories, selected, onSelect }) {
  return (
    <div style={{ display: "flex", gap: "10px", marginBottom: "20px", flexWrap: "wrap" }}>
      {/* Bouton "Tous" */}
      <button
        onClick={() => onSelect(null)}
        style={{
          fontWeight: !selected ? "bold" : "normal",
          padding: "5px 10px",
          borderRadius: "5px",
          border: selected === null ? "2px solid #ff6600" : "1px solid #ccc",
          backgroundColor: selected === null ? "#ff6600" : "#fff",
          color: selected === null ? "#fff" : "#333",
          cursor: "pointer",
          transition: "0.2s",
        }}
      >
        Tous
      </button>

      {/* Boutons catégories */}
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onSelect(cat.id)}
          style={{
            fontWeight: selected === cat.id ? "bold" : "normal",
            padding: "5px 10px",
            borderRadius: "5px",
            border: selected === cat.id ? "2px solid #ff6600" : "1px solid #ccc",
            backgroundColor: selected === cat.id ? "#ff6600" : "#fff",
            color: selected === cat.id ? "#fff" : "#333",
            cursor: "pointer",
            transition: "0.2s",
          }}
        >
          {cat.name}
        </button>
      ))}
    </div>
  );
}

export default CategoryFilter;