import React, { useEffect, useState } from 'react';
import { apiRequest, clearToken } from '../../utils/api';
import Navbar from '../../components/navbar';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const data = await apiRequest('/me', { method: 'GET' });
        if (active) setUser(data);
      } catch (e) {
        if (active) setError(e.message || 'Failed to load profile');
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
  }, []);

  const onLogout = () => {
    clearToken();
    navigate('/login');
  };

  return (
    <>
      <Navbar />
      <div className="p-6 max-w-xl mx-auto">
        {loading && <p>Loading profile...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {user && (
          <div className="border rounded p-4 bg-white">
            <h2 className="text-2xl font-bold mb-2">{user.name || 'User'}</h2>
            <p className="text-gray-700 mb-4">{user.email}</p>
            <button className="btn-primary" onClick={onLogout}>Logout</button>
          </div>
        )}
      </div>
    </>
  );
};

export default Profile;
