import React from 'react';

const PasswordStrengthIndicator = ({ validation }) => {
  if (!validation) return null;

  const requirements = [
    {
      key: 'minLength',
      label: 'At least 8 characters',
      met: validation.minLength
    },
    {
      key: 'hasUpper',
      label: 'At least one uppercase letter (A-Z)',
      met: validation.hasUpper
    },
    {
      key: 'hasLower',
      label: 'At least one lowercase letter (a-z)',
      met: validation.hasLower
    },
    {
      key: 'hasNumber',
      label: 'At least one number (0-9)',
      met: validation.hasNumber
    },
    {
      key: 'hasSpecial',
      label: 'At least one special character (!@#$...)',
      met: validation.hasSpecial
    }
  ];

  const metCount = Object.values(validation).filter(Boolean).length;
  const totalCount = requirements.length;
  const strengthPercentage = (metCount / totalCount) * 100;

  const getStrengthColor = () => {
    if (strengthPercentage >= 80) return 'text-green-600';
    if (strengthPercentage >= 60) return 'text-yellow-600';
    if (strengthPercentage >= 40) return 'text-orange-600';
    return 'text-red-600';
  };

  const getStrengthLabel = () => {
    if (strengthPercentage >= 80) return 'Strong';
    if (strengthPercentage >= 60) return 'Good';
    if (strengthPercentage >= 40) return 'Fair';
    return 'Weak';
  };

  const getProgressBarColor = () => {
    if (strengthPercentage >= 80) return 'bg-green-500';
    if (strengthPercentage >= 60) return 'bg-yellow-500';
    if (strengthPercentage >= 40) return 'bg-orange-500';
    return 'bg-red-500';
  };

  return (
    <div className="mt-3 p-3 bg-gray-50 rounded-lg border animate-fadeInUp">
      {/* Password Strength Header */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-700">Password Strength:</span>
        <span className={`text-sm font-semibold ${getStrengthColor()}`}>
          {getStrengthLabel()}
        </span>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
        <div 
          className={`h-2 rounded-full transition-all duration-300 ${getProgressBarColor()}`}
          style={{ width: `${strengthPercentage}%` }}
        ></div>
      </div>

      {/* Requirements Checklist */}
      <div className="space-y-1">
        {requirements.map((requirement) => (
          <div
            key={requirement.key}
            className={`flex items-center text-xs transition-all duration-200 ${
              requirement.met 
                ? 'text-green-600' 
                : 'text-gray-500'
            }`}
          >
            <span className={`mr-2 font-bold transition-all duration-200 ${
              requirement.met ? 'text-green-600 scale-110' : 'text-gray-400'
            }`}>
              {requirement.met ? '✓' : '•'}
            </span>
            <span className={requirement.met ? 'line-through' : ''}>
              {requirement.label}
            </span>
          </div>
        ))}
      </div>

      {/* Overall Status */}
      {strengthPercentage === 100 && (
        <div className="mt-2 p-2 bg-green-100 border border-green-200 rounded text-center">
          <span className="text-green-700 text-xs font-medium">
            ✨ Perfect! Your password meets all requirements
          </span>
        </div>
      )}
    </div>
  );
};

export default PasswordStrengthIndicator;