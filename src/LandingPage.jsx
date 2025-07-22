import React from 'react';
import './LandingPage.css';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();

  const handleCardClick = (path) => {
    navigate(path);
  };


  const cards = [
    {
      path: '/dashboard',
      title: 'Dashboard',
      description: 'View account stats and latest activity.'
    },
    {
      path: '/settings',
      title: 'Settings',
      description: 'Update your profile and preferences.'
    },
    {
      path: '/support',
      title: 'Support',
      description: 'Reach out if you need help using the app.'
    }
  ];

  return (
    <div className="landing-container">
      <header className="landing-header">
        <h1>Welcome to ABC</h1>
        <p className="subtitle">You've successfully logged in. Explore your dashboard below.</p>
      </header>

      <main className="landing-main">
        {cards.map((card, index) => (
          <div 
            key={index}
            className="card"
            onClick={() => handleCardClick(card.path)}
            role="button"
            tabIndex={0}
            aria-label={`Navigate to ${card.title}`}
            onKeyPress={(e) => e.key === 'Enter' && handleCardClick(card.path)}
          >
            <h2>{card.title}</h2>
            <p>{card.description}</p>
          </div>
        ))}
      </main>

      <footer className="landing-footer">
        <p>© 2025 ABC Team — All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
