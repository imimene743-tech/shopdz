// src/pages/RegisterPage.js
import React from 'react';
import AuthForm from '../components/AuthForm';

const RegisterPage = ({ onLogin }) => {
  return (
    <div style={{ padding: '2rem', minHeight: '80vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      {/* onLogin sera passé à AuthForm pour stocker l'utilisateur après l'inscription */}
      <AuthForm onLoginSuccess={onLogin} />
    </div>
  );
};

export default RegisterPage;