import React from 'react';
import './LandingPage.css';

import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();
  return (
    <div className="landing-container">
      <header className="landing-header">
        <h1>Welcome to ABC</h1>
        <p>You’ve successfully logged in. Explore your dashboard below.</p>
      </header>

      <main className="landing-main">
        <div className="card">
          <h2>Dashboard</h2>
          <p>View account stats and latest activity.</p>
        </div>
        <div className="card">
          <h2>Settings</h2>
          <p>Update your profile and preferences.</p>
        </div>
        <div className="card">
          <h2>Support</h2>
          <p>Need help? Reach out or explore FAQs.</p>
        </div>
        <div className="card" onClick={() => navigate('/settings')} style={{ cursor: 'pointer' }}>
          <h2>Settings</h2>
          <p>Update your profile and preferences.</p>
        </div>
      </main>

     <footer className="landing-footer">
  <p>© 2025 ABC Team — All rights reserved.</p>
</footer>
    </div>
  );
};

export default LandingPage;



