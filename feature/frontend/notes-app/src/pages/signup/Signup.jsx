// Signup.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { validateEmail, validatePassword, validateUsername, validateConfirmPassword, apiRequest } from '../../utils/helper';
import ErrorMessage from '../../components/ErrorMessage.jsx';
import { FaEye, FaEyeSlash, FaUser , FaEnvelope, FaLock } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc'; // For Google icon

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Password requirements state
  const [passwordRequirements, setPasswordRequirements] = useState({
    length: false,
    uppercase: false,
    symbol: false
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Clear specific error
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }

    // Update password requirements
    if (name === 'password') {
      setPasswordRequirements({
        length: value.length >= 8,
        uppercase: /[A-Z]/.test(value),
        symbol: /[!@#$%^&*(),.?":{}|<>]/.test(value)
      });
    }
  };

  const handlePasswordToggle = (field) => {
    if (field === 'password') setShowPassword(!showPassword);
    if (field === 'confirm') setShowConfirmPassword(!showConfirmPassword);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) newErrors.fullName = 'Full Name is required.';
    if (!validateEmail(formData.email)) newErrors.email = 'Please enter a valid email.';
    if (!validatePassword(formData.password)) newErrors.password = 'Password must be at least 8 characters with uppercase and symbol.';
    if (!validateConfirmPassword(formData.password, formData.confirmPassword)) newErrors.confirmPassword = 'Passwords do not match.';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      // Assuming apiRequest handles signup with fullName instead of username; adjust if needed
      const response = await apiRequest('/signup', 'POST', { ...formData, username: formData.fullName }); // Map fullName to username if backend expects it
      if (response.success) {
        setSuccessMessage('Account created successfully! Redirecting...');
        setTimeout(() => navigate('/login'), 2000);
      } else {
        setErrors({ general: response.message || 'Signup failed. Please try again.' });
      }
    } catch (error) {
      setErrors({ general: 'An error occurred. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#EEF2FF] to-[#FFFFFF] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Optional abstract shapes or illustrations */}
      <div className="absolute top-10 left-10 w-20 h-20 bg-[#A78BFA]/10 rounded-full"></div>
      <div className="absolute bottom-20 right-10 w-32 h-32 bg-[#6366F1]/5 rounded-full"></div>

      <div className="w-full max-w-md bg-white shadow-lg shadow-[#6366F1]/10 rounded-3xl p-8 animate-fadeIn">
        {/* Top bar with app name */}
        <div className="flex items-center justify-between mb-6">
          <Link to="/" className="text-[#6366F1] font-bold text-xl">MonaNotes</Link>
          <Link to="/" className="text-gray-500 hover:text-[#6366F1] transition-colors">
            ← Back to Home
          </Link>
        </div>

        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Create Your Account</h1>
          <p className="text-gray-600">Start organizing your ideas in one secure place.</p>
          {/* Optional quote */}
          <p className="text-sm text-gray-500 mt-2 italic">"Ideas fade. Notes remember."</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Full Name */}
          <div className="relative">
            <FaUser  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              name="fullName"
              placeholder="Full Name"
              value={formData.fullName}
              onChange={handleInputChange}
              className={`w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 focus:border-[#6366F1] focus:ring-2 focus:ring-[#6366F1]/20 transition-all ${errors.fullName ? 'border-red-500' : ''}`}
              required
            />
            {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
          </div>

          {/* Email */}
          <div className="relative">
            <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleInputChange}
              className={`w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 focus:border-[#6366F1] focus:ring-2 focus:ring-[#6366F1]/20 transition-all ${errors.email ? 'border-red-500' : ''}`}
              required
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            {errors.email?.includes('already') && <p className="text-red-500 text-sm mt-1">Email already in use.</p>}
          </div>

          {/* Password */}
          <div className="relative">
            <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleInputChange}
              className={`w-full pl-10 pr-10 py-3 rounded-xl border border-gray-300 focus:border-[#6366F1] focus:ring-2 focus:ring-[#6366F1]/20 transition-all ${errors.password ? 'border-red-500' : ''}`}
              required
            />
            <button
              type="button"
              onClick={() => handlePasswordToggle('password')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-[#6366F1] transition-colors"
              aria-label="Toggle password visibility"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}

          {/* Password Requirements */}
          <div className="space-y-1 text-xs text-gray-500">
            <div className={`flex items-center ${passwordRequirements.length ? 'text-green-600' : ''}`}>
              <span className={`w-1 h-1 rounded-full mr-2 ${passwordRequirements.length ? 'bg-green-600' : 'bg-gray-300'}`}></span>
              At least 8 characters
            </div>
            <div className={`flex items-center ${passwordRequirements.uppercase ? 'text-green-600' : ''}`}>
              <span className={`w-1 h-1 rounded-full mr-2 ${passwordRequirements.uppercase ? 'bg-green-600' : 'bg-gray-300'}`}></span>
              One uppercase letter
            </div>
            <div className={`flex items-center ${passwordRequirements.symbol ? 'text-green-600' : ''}`}>
              <span className={`w-1 h-1 rounded-full mr-2 ${passwordRequirements.symbol ? 'bg-green-600' : 'bg-gray-300'}`}></span>
              One symbol
            </div>
          </div>

          {/* Confirm Password */}
          <div className="relative">
            <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              className={`w-full pl-10 pr-10 py-3 rounded-xl border border-gray-300 focus:border-[#6366F1] focus:ring-2 focus:ring-[#6366F1]/20 transition-all ${errors.confirmPassword ? 'border-red-500' : ''}`}
              required
            />
            <button
              type="button"
              onClick={() => handlePasswordToggle('confirm')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-[#6366F1] transition-colors"
              aria-label="Toggle confirm password visibility"
            >
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}

          {/* General Error */}
          {errors.general && <ErrorMessage message={errors.general} />}

          {/* Create Account Button */}
          <button
            type="submit"
            disabled={isLoading || !Object.values(formData).every(val => val.trim()) || Object.keys(errors).length > 0}
            className="w-full bg-gradient-to-r from-[#6366F1] to-[#A78BFA] text-white py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-[#6366F1]/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </button>

          {/* Optional Google Button */}
          <button
            type="button"
            className="w-full flex items-center justify-center gap-2 border border-gray-300 text-gray-700 py-3 rounded-xl hover:bg-gray-50 transition-colors"
          >
            <FcGoogle />
            Continue with Google
          </button>

          {/* Toggle to Login */}
          <p className="text-center text-gray-600">
            Already have an account? <Link to="/login" className="text-[#6366F1] font-semibold hover:underline">Log in here</Link>
          </p>

          {/* Success Message */}
          {successMessage && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-xl animate-pulse">
              {successMessage}
            </div>
          )}
        </form>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out;
        }
      `}</style>
    </div>
  );
};

export default Signup;