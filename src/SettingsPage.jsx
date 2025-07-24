import React from 'react';

const SettingsPage = () => {
  return (
    <div style={pageStyle}>
      This is the Settings page.
    </div>
  );
};

const pageStyle = {
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  fontSize: '2rem',
  color: '#ffffff',
  background: 'linear-gradient(135deg, #0e1326 0%, #1a1f38 100%)'
};

export default SettingsPage;
