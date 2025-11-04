import React from 'react';

const Loading = ({ text = 'Loading...' }) => {
  return (
    <div className="p-4 text-gray-600">{text}</div>
  );
};

export default Loading;
