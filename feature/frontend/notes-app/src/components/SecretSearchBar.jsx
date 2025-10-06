import React from 'react';
import { verifyPin } from '../utils/secret';

const SecretSearchBar = ({ value, onChange, onClearSearch, onSecretUnlock, secretPin }) => {
  const handleChange = async (e) => {
    const next = e.target.value;
    onChange(next);
    if (next && await verifyPin(next)) {
      onSecretUnlock();
    }
  };

  return (
    <div className="flex gap-2 p-4">
      <input
        type="text"
        placeholder="Search notes or enter secret PIN"
        className="flex-1 border p-2 rounded"
        value={value}
        onChange={handleChange}
      />
      <button className="btn-secondary" onClick={onClearSearch}>Clear</button>
    </div>
  );
};

export default SecretSearchBar;


