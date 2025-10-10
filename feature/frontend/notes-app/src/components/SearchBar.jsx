import React from 'react';

const SearchBar = ({ value, onChange, handleSearch, onClearSearch }) => {
  return (
    <div className="flex items-center justify-center p-4">
      <div className="relative w-full max-w-md">
        <input
          type="text"
          placeholder="Search notes..."
          value={value}
          onChange={onChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <div className="absolute inset-y-0 right-0 flex">
          <button
            onClick={handleSearch}
            className="px-4 py-2 bg-blue-500 text-white rounded-r-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Search
          </button>
          {value && (
            <button
              onClick={onClearSearch}
              className="ml-2 px-3 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 focus:outline-none"
            >
              Clear
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchBar;