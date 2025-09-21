import React from 'react';
import './navbar.css';
import { Link } from 'react-router-dom';
import ProfileInfo from './ProfileInfo';
import { useNavigate } from 'react-router-dom';
const Navbar = () => {
  const navigate = useNavigate();
  const onLogout = () => {
    navigate ('/login');
  };

  return (
    <div className="navbar">
      {/* Left: Logo/Brand */}
      <div className="navbar-left">
        <p className='text-2xl font-bold'>notifier</p>
      </div>
      {/* Center: Links */}
      <ul className="navbar-links">
        <li><Link path="/">Home</Link></li>
        <li><Link path="/about">About</Link></li>
        <li><Link path="/login">Login</Link></li>
        <li><Link to="/signup">Signup</Link></li>
      </ul>
      <ProfileInfo onLogout={onLogout} />
    </div>
  )
}

export default Navbar;