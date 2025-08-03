import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';

const VerifyEmailPage = () => {
  const [message, setMessage] = useState('Verifying your email, please wait...');
  const [isSuccess, setIsSuccess] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  useEffect(() => {
    const token = searchParams.get('token');

    if (!token) {
      setMessage('Verification failed: No token provided.');
      return;
    }

    const verifyToken = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/user/verify-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Verification failed.');
        }

        setMessage(data.message);
        setIsSuccess(true);
        
        // Optional: Redirect to home or login page after a few seconds
        setTimeout(() => {
            navigate('/'); 
        }, 5000);

      } catch (error) {
        setMessage(error.message);
        setIsSuccess(false);
      }
    };

    verifyToken();
  }, [searchParams, navigate]);

  return (
    <div style={{ textAlign: 'center', padding: '50px' }}>
      <h1>Email Verification</h1>
      <p style={{ color: isSuccess ? 'green' : 'red' }}>{message}</p>
      {isSuccess && <p>You will be redirected shortly. If not, <Link to="/">click here to go to the homepage.</Link></p>}
    </div>
  );
};

export default VerifyEmailPage;