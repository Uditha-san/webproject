import React from 'react';

const DashboardPage = () => {
  return (
    <div style={pageStyle}>
      This is the Dashboard page.
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

export default DashboardPage;
