// src/components/common/Card.jsx

import React from 'react';
import PropTypes from 'prop-types';

const Card = ({
  children,
  title,
  subtitle,
  className = '',
  headerAction,
  padding = 'md',
}) => {
  // Padding classes
  const paddingClasses = {
    none: 'p-0',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  // Base card classes
  const cardClasses = `
    bg-white shadow-md rounded-lg border border-gray-200
    ${className}
  `;

  return (
    <div className={cardClasses}>
      {/* Header Section */}
      {title && (
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-gray-900">{title}</h3>
              {subtitle && (
                <p className="text-sm text-gray-600 mt-1">{subtitle}</p>
              )}
            </div>
            {headerAction && (
              <div className="flex items-center">{headerAction}</div>
            )}
          </div>
        </div>
      )}

      {/* Body Section */}
      <div className={paddingClasses[padding]}>{children}</div>
    </div>
  );
};

// PropTypes validation
Card.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.string,
  subtitle: PropTypes.string,
  className: PropTypes.string,
  headerAction: PropTypes.node,
  padding: PropTypes.oneOf(['none', 'sm', 'md', 'lg']),
};

// Default props
Card.defaultProps = {
  padding: 'md',
  className: '',
};

export default Card;
