import React, { useEffect, useState } from 'react';
import { apiRequest, clearToken } from '../../utils/api';
import Navbar from '../../components/navbar';
import { useNavigate } from 'react-router-dom';
import { getStoredPinHash, setStoredPinHash, sha256, clearStoredPin } from '../../utils/secret';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pin, setPin] = useState('');
  const [pinMsg, setPinMsg] = useState('');
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

  const onSavePin = async (e) => {
    e.preventDefault();
    setPinMsg('');
    if (!pin || pin.length < 4) {
      setPinMsg('PIN must be at least 4 digits.');
      return;
    }
    const hash = await sha256(pin);
    setStoredPinHash(hash);
    setPin('');
    setPinMsg('Secret PIN saved.');
  };

  const onClearPin = () => {
    clearStoredPin();
    setPinMsg('Secret PIN cleared.');
  };

  const hasPin = !!getStoredPinHash();

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

            <div className="mt-6">
              <h3 className="text-xl font-semibold mb-2">Secret PIN</h3>
              <form onSubmit={onSavePin} className="flex gap-2 items-center">
                <input
                  type="password"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  placeholder={hasPin ? 'Change PIN' : 'Set a PIN'}
                  className="border p-2 rounded flex-1"
                />
                <button className="btn-primary" type="submit">Save PIN</button>
                {hasPin && <button className="btn-secondary" type="button" onClick={onClearPin}>Clear PIN</button>}
              </form>
              {pinMsg && <p className="text-green-600 mt-2">{pinMsg}</p>}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Profile;
