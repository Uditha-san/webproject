import React, { useEffect, useState } from 'react';
import PasswordStrengthIndicator from './PasswordStrengthIndicator.jsx';

const FadePasswordStrengthIndicator = ({ show, validation }) => {
  const [visible, setVisible] = useState(show);
  const [shouldRender, setShouldRender] = useState(show);

  useEffect(() => {
    if (show) {
      setShouldRender(true);
      setVisible(true);
    } else if (shouldRender) {
      setVisible(false);
      const timeout = setTimeout(() => setShouldRender(false), 400); // 400ms fade
      return () => clearTimeout(timeout);
    }
  }, [show]);

  if (!shouldRender) return null;

  return (
    <div style={{
      transition: 'opacity 0.4s',
      opacity: visible ? 1 : 0,
      pointerEvents: visible ? 'auto' : 'none',
    }}>
      <PasswordStrengthIndicator validation={validation} />
    </div>
  );
};

export default FadePasswordStrengthIndicator;
