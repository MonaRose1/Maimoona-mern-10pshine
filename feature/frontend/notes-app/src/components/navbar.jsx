import React from 'react';

const Navbar = ({ onLogout, isLoggedIn = false }) => {
  return (
    <div style={{
      position: 'sticky',
      top: 12,
      zIndex: 20,
      display: 'flex',
      justifyContent: 'center'
    }}>
      <nav style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 18,
        padding: '10px 16px',
        background: '#ffffffcc',
        border: '1px solid #e5e7eb',
        borderRadius: 999,
        boxShadow: '0 6px 20px rgba(2,6,23,0.06)',
        backdropFilter: 'blur(6px)',
        width: 'min(900px, 94%)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 10, height: 10, borderRadius: 999, background: '#6366f1' }} />
          <strong>MonaNotes</strong>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          {isLoggedIn ? (
            <>
              <a href="/home" style={{ color: '#334155', textDecoration: 'none' }}>Home</a>
              <a href="/favourites" style={{ color: '#334155', textDecoration: 'none' }}>Favourites</a>
              <a href="/tags" style={{ color: '#334155', textDecoration: 'none' }}>Tags</a>
            </>
          ) : (
            <>
              <a href="/" style={{ color: '#334155', textDecoration: 'none' }}>Home</a>
              <a href="/#features" style={{ color: '#334155', textDecoration: 'none' }}>Features</a>
              <a href="/#about" style={{ color: '#334155', textDecoration: 'none' }}>About</a>
            </>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {isLoggedIn && onLogout ? (
            <button onClick={onLogout} title="Logout" style={{ color: '#334155', textDecoration: 'none', padding: '8px 12px', borderRadius: 999, border: '1px solid #e5e7eb', background: '#fff' }}>Logout</button>
          ) : (
            <>
              <a href="/login" style={{ color: '#334155', textDecoration: 'none', padding: '8px 12px', borderRadius: 999, border: '1px solid #e5e7eb', background: '#fff' }}>Login</a>
              <a href="/signup" className="btn-primary" style={{ width: 110, textAlign: 'center', textDecoration: 'none', borderRadius: 999 }}>Sign Up</a>
            </>
          )}
        </div>
      </nav>
    </div>
  );
};

export default Navbar;


