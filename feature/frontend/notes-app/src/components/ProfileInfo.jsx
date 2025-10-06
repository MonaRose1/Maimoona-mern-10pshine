import React from 'react';
import { getInitials } from '../utils/helper';

const ProfileInfo = ({ onLogout}) => {
  return (
    <div className='flex items-center gap-3'>
        <div className='w-12 h-12 rounded-full bg-gray-500 text-white flex items-center justify-center font-bold'>
            {getInitials("John Doe")}
        </div>

        <div>
            <p className='text-gray-700'>John Doe</p>
            <button className='text-blue-500' onClick={onLogout}>Logout</button>
        </div>
    </div>
  );
};

export default ProfileInfo;