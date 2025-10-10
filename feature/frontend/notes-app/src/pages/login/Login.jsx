import React, { useState } from 'react';
import { validateEmail, apiRequest, saveToken } from '../../utils/helper';
import { useNavigate, Link } from 'react-router-dom';
import ErrorMessage from '../../components/ErrorMessage.jsx';
import { FaEye, FaEyeSlash, FaGoogle, FaGithub } from 'react-icons/fa';

const containerStyle = {
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: '#f1f5f9',
  padding: 16,
};

const cardStyle = {
  width: '100%',
  maxWidth: 420,
  backgroundColor: '#ffffff',
  borderRadius: 12,
  boxShadow: '0 10px 25px rgba(2, 6, 23, 0.10)',
  padding: 24,
};

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) { setError('Please enter your email!'); return; }
    if (!validateEmail(email)) { setError('Please enter a valid email!'); return; }
    if (!password) { setError('Please enter your password!'); return; }

    setError('');
    setLoading(true);
    try {
      const res = await apiRequest('/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      });
      if (res?.token) {
        saveToken(res.token);
        navigate('/home');
      } else {
        setError('Invalid response from server');
      }
    } catch (e) {
      setError(e.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container" style={containerStyle}>
      <div className="auth-card" style={cardStyle}>
        <form onSubmit={handleSubmit}>
          <h2 className="auth-title">Welcome back</h2>
          <p className="auth-subtitle">Log in to continue to your notes</p>

          <label style={{ fontSize: 13, color: '#334155' }}>Email</label>
          <input type="text" placeholder="you@example.com" className="input-box" value={email} onChange={(e) => setEmail(e.target.value)} />

          <label style={{ fontSize: 13, color: '#334155' }}>Password</label>
          <div style={{ position: 'relative', marginBottom: 12 }}>
            <input type={showPassword ? 'text' : 'password'} placeholder="••••••••" className="input-box" value={password} onChange={(e) => setPassword(e.target.value)} />
            <span className="toggle-eye" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          <ErrorMessage message={error} />
          <button className='btn-primary' disabled={loading}>{loading ? 'Logging in…' : 'Log in'}</button>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 16, marginBottom: 8 }}>
            <div style={{ height: 1, background: '#e2e8f0', flex: 1 }} />
            <span style={{ color: '#64748b', fontSize: 12 }}>or continue with</span>
            <div style={{ height: 1, background: '#e2e8f0', flex: 1 }} />
          </div>

          <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
            <a href="/api/auth/google" style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              border: '1px solid #e2e8f0',
              borderRadius: 8,
              padding: '10px 12px',
              flex: 1,
              color: '#0f172a',
              textDecoration: 'none',
              background: '#ffffff'
            }}>
              <FaGoogle />
              <span style={{ fontSize: 14 }}>Google</span>
            </a>

            <a href="/api/auth/github" style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              border: '1px solid #e2e8f0',
              borderRadius: 8,
              padding: '10px 12px',
              flex: 1,
              color: '#0f172a',
              textDecoration: 'none',
              background: '#ffffff'
            }}>
              <FaGithub />
              <span style={{ fontSize: 14 }}>GitHub</span>
            </a>
          </div>
          <p className="auth-footer-text">Don't have an account? <Link to='/signup'>Sign up</Link></p>
        </form>
      </div>
    </div>
  );
};

export default Login;