import React from 'react';
import './navbar.css';
import { Link } from 'react-router-dom';
import ProfileInfo from './ProfileInfo';
import { useNavigate } from 'react-router-dom';
const Navbar = () => {
  const navigate = useNavigate();
  const onLogout = () => {
    try {
      localStorage.removeItem('token');
    } catch (e) {}
    navigate('/login');
  };

  return (
    <div className="navbar">
      {/* Left: Logo/Brand */}
      <div className="navbar-left">
        <p className='text-2xl font-bold'>notifier</p>
      </div>
      {/* Center: Links */}
      <ul className="navbar-links">
        <li><Link to="/home">Home</Link></li>
        <li><Link to="/profile">Profile</Link></li>
        <li><button onClick={onLogout} className="text-blue-600">Logout</button></li>
      </ul>
      <ProfileInfo onLogout={onLogout} />
    </div>
  )
}

export default Navbar;