import React, { useState } from 'react';
import { validateEmail, apiRequest, saveToken } from '../../utils/helper';
import { useNavigate, Link } from 'react-router-dom';
import ErrorMessage from '../../components/ErrorMessage.jsx';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

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
    <div className="auth-container">
      <div className="auth-card">
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
          <p className="auth-footer-text">Don't have an account? <Link to='/signup'>Sign up</Link></p>
        </form>
      </div>
    </div>
  );
};

export default Login;