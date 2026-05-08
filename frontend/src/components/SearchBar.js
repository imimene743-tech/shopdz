// src/components/SearchBar.js
import React, { useState } from 'react';

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(query.trim()); // On envoie la recherche au parent
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <input
        type="text"
        placeholder="Rechercher un produit..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        style={styles.input}
      />
      <button type="submit" style={styles.button}>🔍</button>
    </form>
  );
};

const styles = {
  form: {
    display: 'flex',
    width: '100%',
    maxWidth: '400px',
    margin: '0 auto 1rem',
  },
  input: {
    flex: 1,
    padding: '0.5rem 1rem',
    borderRadius: '5px 0 0 5px',
    border: '1px solid #ccc',
    outline: 'none',
  },
  button: {
    padding: '0.5rem 1rem',
    borderRadius: '0 5px 5px 0',
    border: '1px solid #ccc',
    backgroundColor: '#8e44ad',
    color: 'white',
    cursor: 'pointer',
    fontSize: '1rem',
  }
};

export default SearchBar;