import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { assets } from '../assets/assets';
import { useAuth } from '../context/AuthContext.jsx';
import PasswordStrengthIndicator from './PasswordStrengthIndicator.jsx';

const RegistrationForm = ({ onClose, onSwitchToLogin }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    dateOfBirth: '',
    acceptTerms: false
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordValidation, setPasswordValidation] = useState({
    minLength: false,
    hasUpper: false,
    hasLower: false,
    hasNumber: false,
    hasSpecial: false,
  });
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

    // First Name validation
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    } else if (formData.firstName.length < 2) {
      newErrors.firstName = 'First name must be at least 2 characters';
    }

    // Last Name validation
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    } else if (formData.lastName.length < 2) {
      newErrors.lastName = 'Last name must be at least 2 characters';
    }

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
    } else {
      // Check if all password validation criteria are met
      const allCriteriaMet = Object.values(passwordValidation).every(Boolean);
      if (!allCriteriaMet) {
        newErrors.password = 'Password must meet all requirements';
      }
    }

    // Confirm Password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    // Phone validation
    if (formData.phone && !/^[\+]?[0-9]{10,15}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    // Date of Birth validation
    if (formData.dateOfBirth) {
      const today = new Date();
      const birthDate = new Date(formData.dateOfBirth);
      const age = today.getFullYear() - birthDate.getFullYear();
      if (age < 13) {
        newErrors.dateOfBirth = 'You must be at least 13 years old';
      }
    }

    // Terms validation
    if (!formData.acceptTerms) {
      newErrors.acceptTerms = 'You must accept the terms';
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

    // Real-time password validation
    if (name === 'password') {
      setPasswordValidation({
        minLength: value.length >= 8,
        hasUpper: /[A-Z]/.test(value),
        hasLower: /[a-z]/.test(value),
        hasNumber: /\d/.test(value),
        hasSpecial: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(value),
      });
    }

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
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      // 1. Make a real API call to the backend registration endpoint
      const response = await fetch('http://localhost:3000/api/user/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password,
          phone: formData.phone,
          dateOfBirth: formData.dateOfBirth,
        }),
      });

      const data = await response.json();

      // 2. Check for errors from the backend
      if (!response.ok) {
        throw new Error(data.message || 'Failed to register');
      }

      // 3. If registration is successful, log the user in
      if (data.success) {
        login(data.token, data.user); // Use the login function from AuthContext
        alert('Registration successful! Welcome.');
        onClose();
      }
    } catch (error) {
      console.error('Registration error:', error);
      alert(`Registration failed: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Enhanced Backdrop */}
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
          {/* Animated background elements */}
          <div className="absolute inset-0 overflow-hidden rounded-2xl -z-10">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-200/40 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-200/40 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
            <div className="absolute top-40 left-40 w-80 h-80 bg-indigo-200/40 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
          </div>
          
          <div className="relative z-10 space-y-6">
            <div className="animate-fadeInDown">
              <img className="mx-auto h-12 w-auto animate-float" src={assets.logo} alt="Logo" />
              <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 animate-fadeInUp">
                Create your account
              </h2>
              <p className="mt-2 text-center text-sm text-gray-600 animate-fadeInUp animation-delay-200">
                Join us and start your journey
              </p>
            </div>
            
            <form className="mt-6 space-y-4 animate-fadeInUp animation-delay-300" onSubmit={handleSubmit}>
              <div className="grid grid-cols-2 gap-4">
                <div className="animate-slideInLeft animation-delay-400">
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">First Name *</label>
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    required
                    autoFocus
                    className={`appearance-none relative block w-full px-4 py-3 border rounded-lg input-focus-animation ${
                      errors.firstName ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-200'
                    } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 sm:text-sm shadow-sm hover:shadow-md`}
                    placeholder="First name"
                    value={formData.firstName}
                    onChange={handleInputChange}
                  />
                  {errors.firstName && <p className="text-red-500 text-xs mt-1 animate-shake">{errors.firstName}</p>}
                </div>

                <div className="animate-slideInRight animation-delay-500">
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">Last Name *</label>
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    required
                    className={`appearance-none relative block w-full px-4 py-3 border rounded-lg input-focus-animation ${
                      errors.lastName ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-200'
                    } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 sm:text-sm shadow-sm hover:shadow-md`}
                    placeholder="Last name"
                    value={formData.lastName}
                    onChange={handleInputChange}
                  />
                  {errors.lastName && <p className="text-red-500 text-xs mt-1 animate-shake">{errors.lastName}</p>}
                </div>
              </div>

              <div className="animate-slideInLeft animation-delay-600">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className={`appearance-none relative block w-full px-4 py-3 border rounded-lg input-focus-animation ${
                    errors.email ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-200'
                  } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 sm:text-sm shadow-sm hover:shadow-md`}
                  placeholder="Email address"
                  value={formData.email}
                  onChange={handleInputChange}
                />
                {errors.email && <p className="text-red-500 text-xs mt-1 animate-shake">{errors.email}</p>}
              </div>

              <div className="animate-slideInRight animation-delay-700">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">Password *</label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    required
                    className={`appearance-none relative block w-full px-4 py-3 border rounded-lg input-focus-animation ${
                      errors.password ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-200'
                    } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 sm:text-sm shadow-sm hover:shadow-md pr-12`}
                    placeholder="Create a password"
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
                <p className="text-xs text-gray-500 mt-1">
                  Must be 8+ characters with uppercase, lowercase, and number
                </p>
                
                {/* Password Strength Indicator */}
                {formData.password && (
                  <PasswordStrengthIndicator validation={passwordValidation} />
                )}
              </div>

              <div className="animate-slideInLeft animation-delay-800">
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">Confirm Password *</label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    required
                    className={`appearance-none relative block w-full px-4 py-3 border rounded-lg input-focus-animation ${
                      errors.confirmPassword ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-200'
                    } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 sm:text-sm shadow-sm hover:shadow-md pr-12`}
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-4 flex items-center transition-transform duration-200 hover:scale-110"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                  </button>
                </div>
                {errors.confirmPassword && <p className="text-red-500 text-xs mt-1 animate-shake">{errors.confirmPassword}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4 animate-fadeInUp animation-delay-900">
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    className={`appearance-none relative block w-full px-4 py-3 border rounded-lg input-focus-animation ${
                      errors.phone ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-200'
                    } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 sm:text-sm shadow-sm hover:shadow-md`}
                    placeholder="Phone number"
                    value={formData.phone}
                    onChange={handleInputChange}
                  />
                  {errors.phone && <p className="text-red-500 text-xs mt-1 animate-shake">{errors.phone}</p>}
                </div>

                <div>
                  <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
                  <input
                    id="dateOfBirth"
                    name="dateOfBirth"
                    type="date"
                    className={`appearance-none relative block w-full px-4 py-3 border rounded-lg input-focus-animation ${
                      errors.dateOfBirth ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-200'
                    } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 sm:text-sm shadow-sm hover:shadow-md`}
                    value={formData.dateOfBirth}
                    onChange={handleInputChange}
                  />
                  {errors.dateOfBirth && <p className="text-red-500 text-xs mt-1 animate-shake">{errors.dateOfBirth}</p>}
                </div>
              </div>

              <div className="flex items-start animate-fadeInUp animation-delay-1000">
                <div className="flex items-center h-5">
                  <input
                    id="acceptTerms"
                    name="acceptTerms"
                    type="checkbox"
                    required
                    checked={formData.acceptTerms}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded transition-all duration-200 hover:scale-110"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="acceptTerms" className="font-medium text-gray-700">
                    I agree to the{' '}
                    <a href="#" className="text-indigo-600 hover:text-indigo-500 hover:underline">
                      Terms of Service
                    </a>{' '}
                    and{' '}
                    <a href="#" className="text-indigo-600 hover:text-indigo-500 hover:underline">
                      Privacy Policy
                    </a>
                  </label>
                  {errors.acceptTerms && <p className="text-red-500 text-xs mt-1 animate-shake">{errors.acceptTerms}</p>}
                </div>
              </div>

              <div className="animate-fadeInUp animation-delay-1100">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 btn-hover-effect shadow-lg"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Creating account...
                    </>
                  ) : (
                    <>
                      <span className="mr-2">Create account</span>
                      <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
                      </svg>
                    </>
                  )}
                </button>
              </div>

              <div className="text-center animate-fadeInUp animation-delay-1200">
                <p className="text-sm text-gray-600">
                  Already have an account?{' '}
                  <button 
                    type="button"
                    onClick={onSwitchToLogin}
                    className="font-medium text-purple-600 hover:text-purple-500 transition-colors duration-200 hover:underline hover:text-purple-700"
                  >
                    Sign in here
                  </button>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegistrationForm;