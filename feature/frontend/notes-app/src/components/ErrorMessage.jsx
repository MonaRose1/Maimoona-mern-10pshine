import React from 'react';

const ErrorMessage = ({ message, onClose }) => {
  if (!message) return null;

  return (
    <div className="error-message">
      <div className="error-content">
        <span className="error-text">{message}</span>
        {onClose && (
          <button onClick={onClose} className="error-close">
            ×
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorMessage;