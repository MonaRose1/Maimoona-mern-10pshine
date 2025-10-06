import React from 'react';

const ErrorMessage = ({ message }) => {
  if (!message) return null;
  return (
    <div className="p-4 text-red-600">{message}</div>
  );
};

export default ErrorMessage;
