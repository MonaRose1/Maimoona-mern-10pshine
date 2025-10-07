import React from 'react';

const ErrorMessage = ({ message }) => {
  if (!message) return null;
  return (
    <div style={{
      background: '#fef2f2',
      color: '#991b1b',
      border: '1px solid #fee2e2',
      borderRadius: 8,
      padding: 10,
      margin: '8px 0'
    }}>
      {String(message)}
    </div>
  );
};

export default ErrorMessage;


