// src/components/common/Input.jsx

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Eye, EyeOff } from 'lucide-react';

const Input = ({
  label,
  type = 'text',
  name,
  value,
  onChange,
  error,
  placeholder,
  required = false,
  disabled = false,
  icon: Icon,
  showPasswordToggle = false,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  // Determine input type based on password toggle
  const inputType = type === 'password' && showPassword ? 'text' : type;

  // Base input classes
  const baseClasses = `
    w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400
    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
    transition duration-200 ease-in-out
    ${Icon ? 'pl-10' : ''}
    ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300'}
    ${disabled ? 'bg-gray-100 cursor-not-allowed text-gray-500' : 'bg-white'}
  `;

  return (
    <div className="mb-4">
      {/* Label */}
      <label
        htmlFor={name}
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      {/* Input Container */}
      <div className="relative">
        {/* Icon */}
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon className="h-5 w-5 text-gray-400" />
          </div>
        )}

        {/* Input Field */}
        <input
          id={name}
          name={name}
          type={inputType}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          className={baseClasses}
        />

        {/* Password Toggle Button */}
        {type === 'password' && showPasswordToggle && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
            disabled={disabled}
          >
            {showPassword ? (
              <EyeOff className="h-5 w-5" />
            ) : (
              <Eye className="h-5 w-5" />
            )}
          </button>
        )}
      </div>

      {/* Error Message */}
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};

// PropTypes validation
Input.propTypes = {
  label: PropTypes.string.isRequired,
  type: PropTypes.string,
  name: PropTypes.string.isRequired,
  value: PropTypes.string,
  onChange: PropTypes.func,
  error: PropTypes.string,
  placeholder: PropTypes.string,
  required: PropTypes.bool,
  disabled: PropTypes.bool,
  icon: PropTypes.elementType,
  showPasswordToggle: PropTypes.bool,
};

// Default props
Input.defaultProps = {
  type: 'text',
  value: '',
  required: false,
  disabled: false,
  showPasswordToggle: false,
};

export default Input;
