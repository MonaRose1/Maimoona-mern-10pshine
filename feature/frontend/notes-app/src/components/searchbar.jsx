import React from 'react';
import { FaMagnifyingGlass } from 'react-icons/fa6';
import { IoClose } from 'react-icons/io5';
const searchbar = ({ value, onChange, handleSearch, onClearSearch }) => {
  return (
    <div className="flex justify-center">
    <div className="w-60 text-sm bg-transparent border-[1.5px] px-5 py-3 outline-none relative mb-4 flex items-center rounded-lg">
      <input
        className="w-full bg-transparent outline-none"
        type="text"
        value={value}
        onChange={onChange}
        placeholder="Search..."
      />
      <span className="absolute right-2 inset-y-0 flex items-center cursor-pointer text-gray-500">

      {value && (
        <IoClose className="text-slate-400 cursor-pointer hover:text-slate-600 mr-2" onClick={onClearSearch} />
      )}
      <FaMagnifyingGlass className="text-slate-400 cursor-pointer hover:text-slate-600" onClick={handleSearch} />
      </span>
    </div>
    </div>
  );
};

export default searchbar;