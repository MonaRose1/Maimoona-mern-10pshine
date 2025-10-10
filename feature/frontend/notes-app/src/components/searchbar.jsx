import React from 'react';

const SearchBar = ({ value, onChange, handleSearch, onClearSearch }) => {
  return (
    <div className="searchbar">
      <input
        type="text"
        className="search-input"
        placeholder="Search notes..."
        value={value}
        onChange={onChange}
      />
      <button className="btn-secondary" onClick={handleSearch}>Search</button>
      <button className="btn-secondary" onClick={onClearSearch}>Clear</button>
    </div>
  );
};

export default SearchBar;
