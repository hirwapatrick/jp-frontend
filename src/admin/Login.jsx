import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCamera, faLock, faEnvelope, faEye, faEyeSlash,
  faSpinner, faArrowRight, faExclamationTriangle,
  faArrowLeft
} from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {
    const savedEmail = localStorage.getItem('admin_email');
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Login failed');

      if (rememberMe) {
        localStorage.setItem('admin_email', email);
      } else {
        localStorage.removeItem('admin_email');
      }

      localStorage.setItem('admin_session', JSON.stringify(data));
      sessionStorage.setItem('admin_authenticated', 'true');
      
      onLogin(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };



  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center p-4">
      {/* Simple background effect */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-800 via-gray-900 to-black" />
      
      <motion.div 
        initial={{ opacity: 0, y: 10 }} 
        animate={{ opacity: 1, y: 0 }} 
        className="w-full max-w-sm relative z-10"
      >
        {/* Compact Logo Section */}
        <div className="text-center mb-6">
          <motion.div 
            initial={{ scale: 0.9 }} 
            animate={{ scale: 1 }} 
            className="w-14 h-14 bg-white rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg"
          >
            <FontAwesomeIcon icon={faCamera} className="w-7 h-7 text-gray-900" />
          </motion.div>
          <h2 className="text-xl font-medium text-white">Admin Login</h2>
        </div>

        {/* Main Card */}
        <motion.div 
          className="bg-gray-800/40 backdrop-blur-sm border border-gray-700 rounded-xl p-5 shadow-xl"
        >
          {error && (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }}
              className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center space-x-2 text-sm"
            >
              <FontAwesomeIcon icon={faExclamationTriangle} className="w-4 h-4 text-red-400 flex-shrink-0" />
              <span className="text-red-400">{error}</span>
            </motion.div>
          )}


          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div>
              <label className="block text-gray-400 text-xs mb-1">
                <FontAwesomeIcon icon={faEnvelope} className="w-3 h-3 mr-1" />
                Email
              </label>
              <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required
                className="w-full px-3 py-2.5 bg-gray-700/50 border border-gray-600 rounded-lg focus:outline-none focus:ring-1 focus:ring-white/30 text-white text-sm placeholder-gray-500"
                placeholder="admin@example.com" 
              />
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-gray-400 text-xs mb-1">
                <FontAwesomeIcon icon={faLock} className="w-3 h-3 mr-1" />
                Password
              </label>
              <div className="relative">
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)} 
                  required
                  className="w-full px-3 py-2.5 bg-gray-700/50 border border-gray-600 rounded-lg focus:outline-none focus:ring-1 focus:ring-white/30 text-white text-sm pr-10"
                  placeholder="••••••••" 
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                >
                  <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center">
              <input 
                type="checkbox" 
                id="remember" 
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-3.5 h-3.5 bg-gray-700 border-gray-600 rounded focus:ring-0 text-white" 
              />
              <label htmlFor="remember" className="ml-2 text-xs text-gray-400">
                Remember me
              </label>
            </div>

            {/* Submit Button */}
            <button 
              type="submit" 
              disabled={isLoading}
              className={`w-full py-2.5 px-4 bg-white text-gray-900 rounded-lg text-sm font-medium flex items-center justify-center space-x-2 transition-all
                ${isLoading ? 'opacity-80 cursor-not-allowed' : 'hover:bg-gray-100 hover:shadow-md'}`}
            >
              {isLoading ? (
                <><FontAwesomeIcon icon={faSpinner} className="w-3.5 h-3.5 animate-spin" /><span>Signing in...</span></>
              ) : (
                <><span>Sign In</span><FontAwesomeIcon icon={faArrowRight} className="w-3.5 h-3.5" /></>
              )}
            </button>
          </form>
        </motion.div>

        {/* Footer */}
        <p className="text-center mt-5 text-gray-600 text-xs">
          © {new Date().getFullYear()} Jacques Photography <br />
          <p className='text-blue-500 underline hover:text-blue-100 active:text-red-900'><FontAwesomeIcon icon={faArrowLeft} className="w-3.5 h-3.5" /><Link to="/">Go to Home</Link></p>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;