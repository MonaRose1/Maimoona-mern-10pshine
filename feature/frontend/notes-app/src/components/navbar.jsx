import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './navbar.css';

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/home">MonaNotes</Link>
      </div>
      <div className="navbar-menu">
        <Link to="/home" className="navbar-item">Home</Link>
        <button onClick={handleLogout} className="navbar-item logout-btn">
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;