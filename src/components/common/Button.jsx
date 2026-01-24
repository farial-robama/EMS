// src/components/common/Button.jsx

import React from 'react';
import PropTypes from 'prop-types';
import { Loader } from 'lucide-react';

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  onClick,
  type = 'button',
  fullWidth = false,
  icon: Icon,
  className = '',
}) => {
  // Variant styles
  const variantClasses = {
    primary: 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white',
    secondary: 'bg-gray-600 hover:bg-gray-700 active:bg-gray-800 text-white',
    danger: 'bg-red-600 hover:bg-red-700 active:bg-red-800 text-white',
    success: 'bg-green-600 hover:bg-green-700 active:bg-green-800 text-white',
  };

  // Size styles
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  // Base classes
  const baseClasses = `
    inline-flex items-center justify-center gap-2
    font-medium rounded-md shadow-sm
    transition duration-200 ease-in-out
    focus:outline-none focus:ring-2 focus:ring-offset-2
    disabled:opacity-50 disabled:cursor-not-allowed
    ${variantClasses[variant]}
    ${sizeClasses[size]}
    ${fullWidth ? 'w-full' : ''}
    ${className}
  `;

  // Focus ring colors based on variant
  const focusRingClasses = {
    primary: 'focus:ring-blue-500',
    secondary: 'focus:ring-gray-500',
    danger: 'focus:ring-red-500',
    success: 'focus:ring-green-500',
  };

  const finalClasses = `${baseClasses} ${focusRingClasses[variant]}`;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={finalClasses}
    >
      {/* Loading spinner */}
      {isLoading && <Loader className="h-4 w-4 animate-spin" />}

      {/* Icon */}
      {!isLoading && Icon && <Icon className="h-4 w-4" />}

      {/* Button text */}
      {isLoading ? 'Loading...' : children}
    </button>
  );
};

// PropTypes validation
Button.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(['primary', 'secondary', 'danger', 'success']),
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  isLoading: PropTypes.bool,
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
  type: PropTypes.string,
  fullWidth: PropTypes.bool,
  icon: PropTypes.elementType,
  className: PropTypes.string,
};

// Default props
Button.defaultProps = {
  variant: 'primary',
  size: 'md',
  isLoading: false,
  disabled: false,
  type: 'button',
  fullWidth: false,
  className: '',
};

export default Button;
