import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { assets } from '../assets/assets';
import { useAuth } from '../context/AuthContext.jsx';

const LoginForm = ({ onClose, onSwitchToRegister }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });

  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  // Close modal on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [onClose]);

  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    // Clear errors on input change
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
    if (apiError) {
      setApiError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setApiError('');

    try {
      const response = await fetch('http://localhost:3000/api/user/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setApiError(data.message || 'Login failed. Please check your credentials.');
        setIsSubmitting(false);
        return;
      }

      // Successful login
      login(data.user, data.token); // assuming your login function accepts user & token

      alert('Login successful! Welcome back.');
      onClose();

      setFormData({
        email: '',
        password: '',
        rememberMe: false,
      });
    } catch (error) {
      console.error('Login error:', error);
      setApiError('Something went wrong. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-md"
        onClick={onClose}
      ></div>

      <div className="relative bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto p-8">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 hover:bg-gray-200"
          aria-label="Close login form"
        >
          ✕
        </button>

        <img
          className="mx-auto h-12 w-auto mb-6"
          src={assets.logo}
          alt="Logo"
        />
        <h2 className="text-center text-3xl font-extrabold text-gray-900 mb-2">
          Sign in to your account
        </h2>
        <p className="text-center text-sm text-gray-600 mb-6">
          Welcome back! Please enter your details.
        </p>

        {apiError && (
          <p className="text-center text-red-600 mb-4 animate-shake">{apiError}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              value={formData.email}
              onChange={handleInputChange}
              className={`block w-full px-4 py-3 rounded-lg border ${
                errors.email
                  ? 'border-red-500 focus:border-red-600 focus:ring-red-300'
                  : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-300'
              } focus:outline-none focus:ring-2`}
              placeholder="Enter your email"
              required
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                value={formData.password}
                onChange={handleInputChange}
                className={`block w-full px-4 py-3 rounded-lg border ${
                  errors.password
                    ? 'border-red-500 focus:border-red-600 focus:ring-red-300'
                    : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-300'
                } focus:outline-none focus:ring-2 pr-10`}
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-600 hover:text-gray-900"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center text-sm">
              <input
                type="checkbox"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleInputChange}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-gray-900">Remember me</span>
            </label>

            <a href="#" className="text-sm text-indigo-600 hover:underline">
              Forgot your password?
            </a>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 px-4 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 disabled:opacity-50"
          >
            {isSubmitting ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Don't have an account?{' '}
          <button
            onClick={onSwitchToRegister}
            className="text-indigo-600 hover:underline font-medium"
          >
            Create one here
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
