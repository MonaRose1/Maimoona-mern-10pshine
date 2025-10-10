import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const ProfileInfo = ({ onLogout }) => {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const onDocClick = (e) => {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('click', onDocClick);
    return () => document.removeEventListener('click', onDocClick);
  }, []);

  return (
    <div className="profile-info" ref={menuRef}>
      <button className="profile-avatar" onClick={() => setOpen((v) => !v)} aria-haspopup="menu" aria-expanded={open}>
        <span className="avatar-initial">U</span>
      </button>
      {open && (
        <div className="profile-menu" role="menu">
          <button className="profile-menu__item" onClick={() => { setOpen(false); navigate('/profile'); }}>Profile</button>
          <button className="profile-menu__item profile-menu__logout" onClick={() => { setOpen(false); onLogout?.(); }}>Logout</button>
        </div>
      )}
    </div>
  );
};

export default ProfileInfo;
