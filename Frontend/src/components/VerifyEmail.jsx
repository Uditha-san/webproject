import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    const verify = async () => {
      try {
        const res = await fetch(`http://localhost:3000/api/user/verify-email?token=${token}`);
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || 'Verification failed');
        }

        setVerified(true);
        toast.success('Email verified successfully!');
        setTimeout(() => navigate('/'), 3000); // Redirect after 3 seconds
      } catch (err) {
        
        toast.error(err.message || 'Invalid or expired verification link');
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      verify();
    } else {
      toast.error('Invalid or missing token.');
      setLoading(false);
    }
  }, [token, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white p-6 rounded-lg shadow-lg text-center max-w-md w-full">
        {loading ? (
          <>
            <div className="animate-spin h-10 w-10 border-4 border-indigo-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-700">Verifying your email...</p>
          </>
        ) : verified ? (
          <p className="text-green-600 font-medium text-lg">✅ Email verified successfully! Redirecting...</p>
        ) : (
          <p className="text-red-600 font-medium text-lg">❌ Verification failed or link expired.</p>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;
