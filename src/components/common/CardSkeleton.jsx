// src/components/common/CardSkeleton.jsx

import React from 'react';
import PropTypes from 'prop-types';

const CardSkeleton = ({ count = 4 }) => {
  const items = Array.from({ length: count });
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {items.map((_, idx) => (
        <div
          key={idx}
          className="h-28 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse"
        />
      ))}
    </div>
  );
};

CardSkeleton.propTypes = {
  count: PropTypes.number,
};

export default CardSkeleton;
