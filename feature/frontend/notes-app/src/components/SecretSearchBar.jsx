import React from 'react';

const SecretSearchBar = ({ value, onChange, onClearSearch, onSecretUnlock, secretPin }) => {
  const handleChange = (e) => {
    const next = e.target.value;
    onChange(next);
    if (secretPin && next === secretPin) {
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


