import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { assets } from '../assets/assets';
import { useAuth } from '../context/AuthContext.jsx';

const LoginForm = ({ onClose, onSwitchToRegister }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [attemptsLeft, setAttemptsLeft] = useState(null);
  const [isLocked, setIsLocked] = useState(false);
  const { login } = useAuth();
  // Forgot password/OTP states
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpError, setOtpError] = useState('');
  const navigate = useNavigate();

  // Close modal on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    
    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [onClose]);

  const validateForm = () => {
    const newErrors = {};

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Make a real API call to your backend login endpoint
      const response = await fetch('http://localhost:3000/api/user/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        }),
      });

      const data = await response.json();

      // 2. Check if the backend responded with an error
      if (!response.ok) {
        // Handle different types of errors
        if (response.status === 423) {
          // Account locked
          setIsLocked(true);
          setAttemptsLeft(0);
          alert(`🔒 ${data.message}`);
        } else if (response.status === 401) {
          // Invalid credentials with attempt count
          setIsLocked(false);
          if (data.attemptsLeft !== undefined) {
            setAttemptsLeft(data.attemptsLeft);
            alert(`❌ ${data.message}`);
          } else {
            alert(`❌ ${data.message || 'Invalid credentials'}`);
          }
        } else {
          // Other errors
          throw new Error(data.message || 'Something went wrong');
        }
        return;
      }

      // 3. If login is successful, use the real data from the backend
      if (data.success) {
        // Reset attempt tracking on successful login
        setAttemptsLeft(null);
        setIsLocked(false);
        
        // Call the login function from your AuthContext with the token and user data
        login(data.token, data.user); 
        
        alert('✅ Login successful! Welcome back.');
        onClose();
        
        // Reset form
        setFormData({
          email: '',
          password: '',
          rememberMe: false
        });
      }
      
    } catch (error) {
      console.error('Login error:', error);
      // Display the actual error message from the backend or a generic one
      alert(`Login failed: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        {/* Enhanced Backdrop with stronger blur */}
        <div 
          className="absolute inset-0 bg-black/60 backdrop-blur-md animate-backdropFadeIn"
          onClick={onClose}
        ></div>
        {/* Modal Content */}
        <div className="relative bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto animate-modalSlideIn modal-content">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors duration-200 group"
          >
            <svg className="w-5 h-5 text-gray-600 group-hover:text-gray-800 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
          <div className="p-8">
            {/* Enhanced background elements  */}
            <div className="absolute inset-0 overflow-hidden rounded-2xl -z-10">
              <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200/40 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
              <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-200/40 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
              <div className="absolute top-40 left-40 w-80 h-80 bg-purple-200/40 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
            </div>
            <div className="relative z-10 space-y-8">
              <div className="animate-fadeInDown">
                <img className="mx-auto h-12 w-auto animate-float" src={assets.logo} alt="Logo" />
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 animate-fadeInUp">
                  Sign in to your account
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600 animate-fadeInUp animation-delay-200">
                  Welcome back! Please enter your details.
                </p>
              </div>
              <form className="mt-8 space-y-6 animate-fadeInUp animation-delay-300" onSubmit={handleSubmit}>
                {/* Warning message for low attempts */}
                {attemptsLeft !== null && attemptsLeft <= 2 && !isLocked && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg animate-shake">
                    <p className="text-red-600 text-sm text-center">
                      ⚠️ Warning: Only {attemptsLeft} login attempts remaining before account lockout!
                    </p>
                  </div>
                )}
                {/* Account locked message */}
                {isLocked && (
                  <div className="mb-4 p-3 bg-red-100 border border-red-300 rounded-lg">
                    <p className="text-red-700 text-sm text-center">
                      🔒 Account is locked due to too many failed attempts. Please try again later.
                    </p>
                  </div>
                )}
                <div className="space-y-4">
                  <div className="animate-slideInLeft animation-delay-400">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email address</label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      className={`appearance-none relative block w-full px-4 py-3 border rounded-lg input-focus-animation ${
                        errors.email ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-200'
                      } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:z-10 sm:text-sm shadow-sm hover:shadow-md`}
                      placeholder="Enter your email address"
                      value={formData.email}
                      onChange={handleInputChange}
                    />
                    {errors.email && <p className="text-red-500 text-xs mt-1 animate-shake">{errors.email}</p>}
                  </div>
                  <div className="animate-slideInRight animation-delay-500">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                    <div className="relative">
                      <input
                        id="password"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        autoComplete="current-password"
                        required
                        className={`appearance-none relative block w-full px-4 py-3 border rounded-lg input-focus-animation ${
                          errors.password ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-200'
                        } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:z-10 sm:text-sm shadow-sm hover:shadow-md pr-12`}
                        placeholder="Enter your password"
                        value={formData.password}
                        onChange={handleInputChange}
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-4 flex items-center transition-transform duration-200 hover:scale-110"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? '👁️' : '👁️‍🗨️'}
                      </button>
                    </div>
                    {errors.password && <p className="text-red-500 text-xs mt-1 animate-shake">{errors.password}</p>}
                  </div>
                </div>
                <div className="flex items-center justify-between animate-fadeInUp animation-delay-600">
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      name="rememberMe"
                      type="checkbox"
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded transition-all duration-200 hover:scale-110"
                      checked={formData.rememberMe}
                      onChange={handleInputChange}
                    />
                    <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                      Remember me
                    </label>
                  </div>
                  <div className="text-sm">
                    <button
                      type="button"
                      className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors duration-200 hover:underline"
                      onClick={() => setShowForgotModal(true)}
                    >
                      Forgot your password?
                    </button>
                  </div>
                </div>
                <div className="animate-fadeInUp animation-delay-700">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 btn-hover-effect shadow-lg"
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Signing in...
                      </>
                    ) : (
                      <>
                        <span className="mr-2">Sign in</span>
                        <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
                        </svg>
                      </>
                    )}
                  </button>
                </div>
                {/* Social login section removed for cleaner UI */}
                <div className="text-center animate-fadeInUp animation-delay-1100">
                  <p className="text-sm text-gray-600">
                    Don't have an account?{' '}
                    <button 
                      onClick={onSwitchToRegister}
                      className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors duration-200 hover:underline hover:text-indigo-700"
                    >
                      Create one here
                    </button>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={() => setShowForgotModal(false)}></div>
          <div className="relative bg-white/95 rounded-2xl shadow-2xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto animate-modalSlideIn">
            <button
              onClick={() => setShowForgotModal(false)}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-gray-100 hover:bg-gray-200"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
            <div className="p-8">
              <h2 className="text-xl font-bold mb-4 text-center">Forgot Password</h2>
              {!otpSent ? (
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    setOtpLoading(true);
                    setOtpError('');
                  try {
                    const res = await fetch('http://localhost:3000/api/user/send-otp', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ email: forgotEmail })
                    });
                    let data;
                    const contentType = res.headers.get('content-type');
                    if (contentType && contentType.includes('application/json')) {
                      data = await res.json();
                    } else {
                      data = { message: await res.text() };
                    }
                    if (!res.ok) throw new Error(data.message || 'Failed to send OTP');
                    setOtpError('');
                    setOtpSent(true);
                  } catch (err) {
                    setOtpError(err.message);
                  } finally {
                    setOtpLoading(false);
                  }
                  }}
                  className="space-y-4"
                >
                  <label className="block text-sm font-medium text-gray-700">Enter your email</label>
                  <input
                    type="email"
                    className="w-full border rounded px-3 py-2"
                    value={forgotEmail}
                    onChange={e => setForgotEmail(e.target.value)}
                    required
                  />
                  {otpError && <div className="text-red-500 text-sm">{otpError}</div>}
                  <button
                    type="submit"
                    className="w-full py-2 px-4 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                    disabled={otpLoading}
                  >
                    {otpLoading ? 'Sending OTP...' : 'Send OTP'}
                  </button>
                </form>
              ) : (
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    setOtpLoading(true);
                    setOtpError('');
                  try {
                    const res = await fetch('http://localhost:3000/api/user/verify-otp', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ email: forgotEmail, otp })
                    });
                    let data;
                    const contentType = res.headers.get('content-type');
                    if (contentType && contentType.includes('application/json')) {
                      data = await res.json();
                    } else {
                      data = { message: await res.text() };
                    }
                    if (!res.ok) throw new Error(data.message || 'OTP verification failed');
                    // On success, log in user
                    login(data.token, data.user);
                    alert('✅ Signed in successfully!');
                    setShowForgotModal(false);
                    setOtpSent(false);
                    setForgotEmail('');
                    setOtp('');
                    onClose();
                  } catch (err) {
                    setOtpError(err.message);
                  } finally {
                    setOtpLoading(false);
                  }
                  }}
                  className="space-y-4"
                >
                  <label className="block text-sm font-medium text-gray-700">Enter OTP sent to your email</label>
                  <input
                    type="text"
                    className="w-full border rounded px-3 py-2"
                    value={otp}
                    onChange={e => setOtp(e.target.value)}
                    required
                  />
                  {otpError && <div className="text-red-500 text-sm">{otpError}</div>}
                  <button
                    type="submit"
                    className="w-full py-2 px-4 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                    disabled={otpLoading}
                  >
                    {otpLoading ? 'Verifying...' : 'Verify & Sign In'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default LoginForm;