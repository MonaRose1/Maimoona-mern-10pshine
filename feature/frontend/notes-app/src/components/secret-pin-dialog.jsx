import React, { useState } from 'react';
import { apiRequest } from '../utils/api';

export const SecretPinDialog = ({ isOpen, onClose, onPinSet }) => {
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (pin !== confirmPin) {
      setError('PINs do not match');
      return;
    }
    
    if (pin.length < 4) {
      setError('PIN must be at least 4 characters');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      setIsSettingPin(true);
      setError('');
      
      const response = await apiRequest('/secret/set-pin', {
        method: 'POST',
        body: JSON.stringify({ pin })
      });
      
      if (response?.message) {
        onSuccess();
      } else {
        setError(response.message || 'Failed to set PIN');
      }
    } catch (err) {
      setError('Failed to set PIN');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Set Secret PIN</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="pin">Enter PIN:</label>
            <input
              type="password"
              id="pin"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              minLength="4"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="confirmPin">Confirm PIN:</label>
            <input
              type="password"
              id="confirmPin"
              value={confirmPin}
              onChange={(e) => setConfirmPin(e.target.value)}
              minLength="4"
              required
            />
          </div>
          {error && <div className="error-message">{error}</div>}
          <div className="modal-actions">
            <button type="button" onClick={onClose} disabled={isLoading}>
              Cancel
            </button>
            <button type="submit" disabled={isLoading}>
              {isLoading ? 'Setting PIN...' : 'Set PIN'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};