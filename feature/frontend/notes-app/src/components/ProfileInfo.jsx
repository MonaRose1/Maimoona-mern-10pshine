import React from 'react';

const ProfileInfo = ({ onLogout }) => {
  return (
    <div className="navbar-right">
      <div className="flex items-center space-x-4">
        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
          <span className="text-white text-sm font-semibold">
            {localStorage.getItem('userName')?.charAt(0) || 'U'}
          </span>
        </div>
        <button
          onClick={onLogout}
          className="text-gray-600 hover:text-gray-800 text-sm"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default ProfileInfo;