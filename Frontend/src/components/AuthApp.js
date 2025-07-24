import React, { useState } from 'react';
import LoginForm from './LoginForm';
import RegistrationForm from './RegistrationForm';
import './AuthApp.css';

const AuthApp = () => {
  const [currentForm, setCurrentForm] = useState('login');

  const switchToRegistration = () => {
    setCurrentForm('registration');
  };

  const switchToLogin = () => {
    setCurrentForm('login');
  };

  return (
    <div className="auth-container">
      <div className={`auth-wrapper ${currentForm === 'registration' ? 'show-registration' : 'show-login'}`}>
        <div className="form-container">
          {currentForm === 'login' ? (
            <LoginForm onSwitchToRegistration={switchToRegistration} />
          ) : (
            <RegistrationForm onSwitchToLogin={switchToLogin} />
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthApp; 