import React, { useState } from 'react';
import { validateEmail, apiRequest, saveToken } from '../../utils/helper';
import { useNavigate, Link } from 'react-router-dom';
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
    
    if (!email) {
      setError('Please enter your email!');
      return;
    }
    if (!validateEmail(email)) {
      setError('Please enter a valid email!');
      return;
    }

    if (!password) {
      setError('Please enter your password!');
      return;
    }

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
    <>
    <div className='flex justify-center items-center mt-28 '>
      <div className="w-96 border rounded bg-white px-7 py-10">
        <form onSubmit={handleSubmit}>
          <h2 className="text-2xl font-bold mb-5">Login</h2>
          <input type="text" placeholder='email' className="input-box" value={email} onChange={(e) => setEmail(e.target.value)} />

          <div className="relative mb-4 flex items-center">
              <input type={showPassword ? 'text' : 'password'} placeholder = 'password' className="input-box" value={password} onChange={(e) => setPassword (e.target.value)}/>
              <span
                className="absolute right-4 inset-y-0 flex items-center cursor-pointer text-gray-500"
                style={{ height: '100%' }}
                onClick={() => setShowPassword(!showPassword)}
              >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
            </div>

          {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
          <button className='btn-primary' disabled={loading}>{loading ? 'Logging in...' : 'Login'}</button>
          <p className="text-gray-600 text-sm mt-5">Don't have an account? <Link to='/signup'> Sign up</Link></p>
        </form>
      </div>
    </div>
    </>
  );
};

export default Login;