import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../App';
import { Lock, User, AlertCircle, Mail, UserPlus, ArrowLeft, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import '../styles/landing.css'; // Import landing page styles

const Login = () => {
  // Login state
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  // Signup state
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    confirmPassword: ''
  });

  // Demo credentials for testing
  const demoCredentials = {
    owner: { username: 'owner', password: 'owner123', role: 'owner', name: 'John Doe' },
    driver: { username: 'driver', password: 'driver123', role: 'driver', name: 'Rajesh Kumar' }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      // Check demo credentials
      if (username === demoCredentials.owner.username && password === demoCredentials.owner.password) {
        const userData = {
          id: '1',
          username: demoCredentials.owner.username,
          name: demoCredentials.owner.name,
          role: 'owner',
          fleet_id: 'fleet_001'
        };
        login(userData);
        navigate('/owner');
      } else if (username === demoCredentials.driver.username && password === demoCredentials.driver.password) {
        const userData = {
          id: '2',
          username: demoCredentials.driver.username,
          name: demoCredentials.driver.name,
          role: 'driver',
          fleet_id: 'fleet_001',
          driver_id: 'driver_456',
          vehicle: 'MH-01-AB-1234'
        };
        login(userData);
        navigate('/driver');
      } else {
        setError('Invalid username or password');
      }
      setLoading(false);
    }, 1000);
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    
    // Basic validation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      // In a real app, you would send this data to your backend
      const newUser = {
        id: Date.now().toString(),
        username: formData.username,
        email: formData.email,
        role: 'user',
        fleet_id: 'fleet_' + Math.floor(1000 + Math.random() * 9000)
      };

      // Auto-login after successful signup
      login(newUser);
      setLoading(false);
      
      // Redirect based on role
      navigate(`/${formData.role}`);
    }, 1500);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const toggleForm = () => {
    setShowSignup(!showSignup);
    setError('');
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 20
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0A0F1A] via-[#131C2E] to-[#1A2742] p-4">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-5">
          {[...Array(10)].map((_, i) => (
            <div 
              key={i}
              className="absolute rounded-full"
              style={{
                width: Math.random() * 20 + 5 + 'px',
                height: Math.random() * 20 + 5 + 'px',
                top: Math.random() * 100 + '%',
                left: Math.random() * 100 + '%',
                background: 'rgba(255, 255, 255, 0.3)',
                filter: 'blur(1px)',
                animation: `float ${Math.random() * 10 + 10}s linear infinite`
              }}
            />
          ))}
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="w-24 h-24 flex items-center justify-center mx-auto mb-4"
          >
            <div className="w-full h-full flex items-center justify-center rounded-xl bg-gradient-to-br from-[#C4D623] to-[#ECAF40] p-2">
              <span className="text-4xl font-bold text-[#1F3A52]">CZ</span>
            </div>
          </motion.div>
          <p className="text-[#C4B5A0] opacity-80">Digital Fleet Management</p>
        </div>

        {/* Login Form */}
        <AnimatePresence mode="wait">
          {!showSignup ? (
            <motion.form 
              key="login-form"
              onSubmit={handleLogin} 
              className="space-y-6 bg-[#1A2333] bg-opacity-90 backdrop-blur-sm rounded-2xl p-8 border border-[#2A3A50] shadow-2xl"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 flex items-center gap-3 text-red-300 text-sm"
                >
                  <AlertCircle size={16} />
                  <span>{error}</span>
                </motion.div>
              )}

              <motion.div variants={itemVariants}>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User size={18} className="text-[#C4B5A0] opacity-80" />
                  </div>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    className="w-full bg-[#1A2333] border border-[#2A3A50] rounded-lg pl-10 pr-4 py-3 text-white placeholder-[#5F7A8A] focus:outline-none focus:ring-2 focus:ring-[#4F9CF9] focus:border-transparent transition-all duration-200"
                    placeholder="Username"
                    autoComplete="username"
                  />
                </div>
              </motion.div>

              <motion.div variants={itemVariants}>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock size={18} className="text-[#C4B5A0] opacity-80" />
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full bg-[#1A2333] border border-[#2A3A50] rounded-lg pl-10 pr-4 py-3 text-white placeholder-[#5F7A8A] focus:outline-none focus:ring-2 focus:ring-[#4F9CF9] focus:border-transparent transition-all duration-200"
                    placeholder="Password"
                    autoComplete="current-password"
                  />
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-[#C4D623] to-[#ECAF40] hover:from-[#D6E32D] hover:to-[#F0B84D] text-[#1F3A52] font-semibold rounded-lg px-5 py-3 text-center transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-[#1F3A52] border-t-transparent rounded-full animate-spin"></div>
                      <span>Signing in...</span>
                    </>
                  ) : (
                    <>
                      <span>Sign In</span>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </>
                  )}
                </button>
              </motion.div>

              {/* Create Account button removed to prevent duplication */}
            </motion.form>
          ) : (
            <motion.form 
              key="signup-form"
              onSubmit={handleSignup}
              className="space-y-6 bg-[#1A2333] bg-opacity-90 backdrop-blur-sm rounded-2xl p-8 border border-[#2A3A50] shadow-2xl"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0, x: 20 }}
            >
              <div className="flex items-center justify-between mb-6">
                <button 
                  type="button" 
                  onClick={toggleForm}
                  className="text-[#C4B5A0] hover:text-white flex items-center gap-1 text-sm transition-colors duration-200"
                >
                  <ArrowLeft size={16} />
                  Back to Login
                </button>
                <h2 className="text-xl font-semibold text-white">Create Account</h2>
                <div className="w-6"></div> {/* For alignment */}
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 flex items-center gap-3 text-red-300 text-sm"
                >
                  <AlertCircle size={16} />
                  <span>{error}</span>
                </motion.div>
              )}

              <motion.div variants={itemVariants}>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail size={18} className="text-[#C4B5A0] opacity-80" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-[#1F3A52] bg-opacity-50 border border-[#5F7A8A] rounded-lg pl-10 pr-4 py-3 text-white placeholder-[#5F7A8A] focus:outline-none focus:ring-2 focus:ring-[#C4D623] focus:border-transparent transition-all duration-200 mb-4"
                    placeholder="Email address"
                    autoComplete="email"
                  />
                </div>
              </motion.div>

              <motion.div variants={itemVariants}>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User size={18} className="text-[#C4B5A0] opacity-80" />
                  </div>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-[#1F3A52] bg-opacity-50 border border-[#5F7A8A] rounded-lg pl-10 pr-4 py-3 text-white placeholder-[#5F7A8A] focus:outline-none focus:ring-2 focus:ring-[#C4D623] focus:border-transparent transition-all duration-200 mb-4"
                    placeholder="Choose a username"
                    autoComplete="username"
                  />
                </div>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <motion.div variants={itemVariants}>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock size={18} className="text-[#C4B5A0] opacity-80" />
                    </div>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      required
                      className="w-full bg-[#1A2333] border border-[#2A3A50] rounded-lg pl-10 pr-4 py-3 text-white placeholder-[#5F7A8A] focus:outline-none focus:ring-2 focus:ring-[#4F9CF9] focus:border-transparent transition-all duration-200"
                      placeholder="Create password"
                      autoComplete="new-password"
                    />
                  </div>
                </motion.div>

                <motion.div variants={itemVariants}>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Check size={18} className="text-[#C4B5A0] opacity-80" />
                    </div>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      required
                      className="w-full bg-[#1A2333] border border-[#2A3A50] rounded-lg pl-10 pr-4 py-3 text-white placeholder-[#5F7A8A] focus:outline-none focus:ring-2 focus:ring-[#4F9CF9] focus:border-transparent transition-all duration-200"
                      placeholder="Confirm password"
                      autoComplete="new-password"
                    />
                  </div>
                </motion.div>
              </div>

              <motion.div variants={itemVariants} className="pt-6">
                <button
                  type="submit"
                  disabled={loading || formData.password !== formData.confirmPassword || formData.password.length < 8}
                  className={`w-full bg-gradient-to-r from-[#C4D623] to-[#ECAF40] hover:from-[#D6E32D] hover:to-[#F0B84D] text-[#1F3A52] font-semibold rounded-lg px-5 py-3 text-center transition-all duration-200 ${(loading || formData.password !== formData.confirmPassword || formData.password.length < 8) ? 'opacity-70 cursor-not-allowed' : ''} flex items-center justify-center gap-2`}
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-[#1F3A52] border-t-transparent rounded-full animate-spin"></div>
                      <span>Creating account...</span>
                    </>
                  ) : (
                    <>
                      <span>Create Account</span>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                      </svg>
                    </>
                  )}
                </button>
              </motion.div>
            </motion.form>
          )}
        </AnimatePresence>

        <motion.div variants={itemVariants} className="pt-2">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#5F7A8A] opacity-30"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-[#2E5266] text-[#C4B5A0] text-sm">OR</span>
            </div>
          </div>
          
          <button 
            type="button" 
            onClick={toggleForm}
            className="w-full mt-6 text-sm text-[#C4B5A0] hover:text-white flex items-center justify-center gap-2 transition-colors duration-200"
          >
            <ArrowLeft size={16} className="text-[#ECAF40]" />
            <span>Create a new account</span>
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Login;
