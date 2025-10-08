import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import ErrorMessage from '../../components/ErrorMessage.jsx';
import { apiRequest } from '../../utils/helper.js';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const result = await apiRequest('/login', {
        method: 'POST',
        body: { email, password },
      });
      const token = result?.token || result?.accessToken || '';
      if (token) {
        localStorage.setItem('token', token);
        navigate('/home');
      } else {
        setError('Login succeeded but no token returned');
      }
    } catch (e) {
      setError(e.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center mt-28">
      <div className="w-96 border rounded bg-white px-7 py-10">
        <form onSubmit={handleSubmit}>
          <h2 className="text-2xl font-bold mb-5">Login</h2>
          <input
            type="text"
            placeholder="email"
            className="input-box"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="password"
            className="input-box"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <ErrorMessage message={error} />
          <button className="btn-primary" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
          <p className="text-gray-600 text-sm mt-5">
            Don't have an account? <Link to="/signup">Sign up</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
