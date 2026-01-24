// src/components/common/LoadingSpinner.jsx

import React from 'react';
import PropTypes from 'prop-types';

const LoadingSpinner = ({
  size = 'md',
  color = 'blue',
  fullScreen = false,
}) => {
  // Size classes
  const sizeClasses = {
    sm: 'w-5 h-5',
    md: 'w-10 h-10',
    lg: 'w-[60px] h-[60px]',
  };

  // Color classes for the spinning border
  const colorClasses = {
    blue: 'border-blue-500',
    red: 'border-red-500',
    green: 'border-green-500',
    yellow: 'border-yellow-500',
    purple: 'border-purple-500',
    gray: 'border-gray-500',
    white: 'border-white',
  };

  // Spinner component
  const spinner = (
    <div
      className={`
        rounded-full border-4 border-gray-200 border-t-4 animate-spin
        ${sizeClasses[size]}
        ${colorClasses[color] || colorClasses.blue}
      `}
      role="status"
      aria-label="Loading"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );

  // Full screen overlay
  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        {spinner}
      </div>
    );
  }

  // Inline spinner
  return spinner;
};

// PropTypes validation
LoadingSpinner.propTypes = {
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  color: PropTypes.string,
  fullScreen: PropTypes.bool,
};

// Default props
LoadingSpinner.defaultProps = {
  size: 'md',
  color: 'blue',
  fullScreen: false,
};

export default LoadingSpinner;
