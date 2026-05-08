// src/pages/AuthPage.js
import React from 'react';
import AuthForm from '../components/AuthForm';

const AuthPage = ({ onLoginSuccess }) => {
  return (
    <div>
      <AuthForm onLoginSuccess={onLoginSuccess} />
    </div>
  );
};

export default AuthPage;