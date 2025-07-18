import React from 'react';
import './LandingPage.css';

const LandingPage = () => {
  return (
    <div className="landing-container">
      <header className="landing-header">
        <h1>Welcome to SecureAuth</h1>
        <p>You have successfully logged in!</p>
      </header>

      <main className="landing-main">
        <div className="card">
          <h2>Dashboard</h2>
          <p>View your account and activity.</p>
        </div>
        <div className="card">
          <h2>Settings</h2>
          <p>Update your preferences.</p>
        </div>
        <div className="card">
          <h2>Help</h2>
          <p>Contact support or browse FAQs.</p>
        </div>
      </main>

      <footer className="landing-footer">
        <p>© 2025 SecureAuth Team</p>
      </footer>
    </div>
  );
};

export default LandingPage;
