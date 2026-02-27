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
  // Variant styles with dark-mode variants and an outline variant
  const variantClasses = {
    primary:
      'bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 active:bg-blue-800 dark:active:bg-blue-700 text-white',
    secondary:
      'bg-gray-600 dark:bg-gray-700 hover:bg-gray-700 dark:hover:bg-gray-600 active:bg-gray-800 dark:active:bg-gray-700 text-white',
    danger:
      'bg-red-600 dark:bg-red-500 hover:bg-red-700 dark:hover:bg-red-600 active:bg-red-800 dark:active:bg-red-700 text-white',
    success:
      'bg-green-600 dark:bg-green-500 hover:bg-green-700 dark:hover:bg-green-600 active:bg-green-800 dark:active:bg-green-700 text-white',
    outline:
      'bg-transparent border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700',
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

  // Focus ring colors based on variant (include dark variants)
  const focusRingClasses = {
    primary: 'focus:ring-blue-500 dark:focus:ring-blue-300',
    secondary: 'focus:ring-gray-500 dark:focus:ring-gray-400',
    danger: 'focus:ring-red-500 dark:focus:ring-red-400',
    success: 'focus:ring-green-500 dark:focus:ring-green-400',
    outline: 'focus:ring-black/10 dark:focus:ring-white/10',
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
