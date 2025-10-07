import React from 'react';

const Loading = ({ text = 'Loading...' }) => {
  return (
    <div style={{ padding: 12, color: '#6b7280' }}>{text}</div>
  );
};

export default Loading;


