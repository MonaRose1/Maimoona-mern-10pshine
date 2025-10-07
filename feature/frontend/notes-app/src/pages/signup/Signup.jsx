import React,{ useState } from 'react';
import { validateEmail, validatePassword, validateUsername, validateConfirmPassword, apiRequest } from '../../utils/helper';
import { useNavigate, Link } from 'react-router-dom';
import ErrorMessage from '../../components/ErrorMessage.jsx';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
const Signup = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSignup = async (e) => {
        e.preventDefault();

        if (!validateUsername(username)) {
            setError('Please enter your username!');
            return;
        }

        if (!email || !validateEmail(email)) {
            setError('Please enter a valid email!');
            return;
        }
        if (!password || !validatePassword(password)) {
            setError('Please enter your password!');
            return;
        }

        if (!validateConfirmPassword(password, confirmPassword)) {
            setError('Passwords do not match!');
            return;
        }
        
        setError('');
        setLoading(true);
        try {
            await apiRequest('/signup', {
                method: 'POST',
                body: JSON.stringify({ name: username, email, password })
            });
            navigate('/login');
        } catch (e) {
            setError(e.message || 'Signup failed');
        } finally {
            setLoading(false);
        }
    };

  return (
    <>
    <div className='flex justify-center items-center mt-28 '>
        <div className="w-96 border rounded bg-white px-7 py-10">
            <form onSubmit={handleSignup}>
                <h2 className="text-2xl font-bold mb-5 ">Signup</h2>
                <input type = 'text' placeholder = 'username' className="input-box" value={username} onChange={(e) => setUsername (e.target.value)}/>
            <input type = 'text' placeholder = 'email' className="input-box" value={email} onChange={(e) => setEmail (e.target.value)}/>

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
                

                <div className="relative mb-4">
                <input type={showConfirmPassword ? 'text' : 'password'} placeholder = 'confirm password' className="input-box" value={confirmPassword} onChange={(e) => setConfirmPassword (e.target.value)}/>
                <span className="absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
                </div>

                    <ErrorMessage message={error} />

                <button className="btn-primary" disabled={loading}>{loading ? 'Submitting...' : 'Submit'}</button>
                <p className= "text-gray-600 text-sm mt-5">Already have an account? <Link to='/login'> Log in</Link></p>

            </form>
        </div>
    </div>
    </>
  );
};

export default Signup;