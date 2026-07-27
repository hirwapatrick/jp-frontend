import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLock,
  faEnvelope,
  faEye,
  faEyeSlash,
  faSpinner,
  faArrowRight,
  faExclamationTriangle,
  faArrowLeft,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import logoImage from "../assets/photos/logo1.png";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {
    const savedEmail = localStorage.getItem("admin_email");
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Login failed");

      if (rememberMe) {
        localStorage.setItem("admin_email", email);
        localStorage.setItem("admin_authenticated", "true");
        sessionStorage.removeItem("admin_authenticated");
      } else {
        localStorage.removeItem("admin_email");
        localStorage.removeItem("admin_authenticated");
        sessionStorage.setItem("admin_authenticated", "true");
      }

      localStorage.setItem("admin_session", JSON.stringify(data));

      onLogin(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-800/40 via-gray-900/60 to-black" />
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-white/5 rounded-full blur-3xl" />

      {/* Subtle grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px]" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-sm relative z-10"
      >
        {/* Logo Section */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.15, duration: 0.5, ease: "easeOut" }}
            className="relative inline-flex mb-3"
          >
            <div className="absolute inset-0 bg-white/10 rounded-full blur-xl" />
            <div className="w-24 h-24 relative">
              <img
                src={logoImage}
                alt="Jacques Photography"
                className="w-full h-full object-contain drop-shadow-2xl"
              />
            </div>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25, duration: 0.4 }}
            className="text-2xl font-light tracking-wide text-white"
          >
            Admin Login
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35, duration: 0.4 }}
            className="text-gray-500 text-xs mt-1 tracking-wider uppercase"
          >
            Jacques Photography
          </motion.p>
        </div>

        {/* Main Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5, ease: "easeOut" }}
          className="bg-gradient-to-b from-white/10 to-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl shadow-black/50"
        >
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-5 p-3.5 bg-red-500/15 border border-red-500/25 rounded-xl flex items-center space-x-2.5 text-sm"
            >
              <FontAwesomeIcon
                icon={faExclamationTriangle}
                className="w-4 h-4 text-red-400 flex-shrink-0"
              />
              <span className="text-red-300">{error}</span>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            {/* Email Field */}
            <div>
              <label className="block text-gray-400 text-xs font-medium mb-1.5 tracking-wide">
                <FontAwesomeIcon icon={faEnvelope} className="w-3 h-3 mr-1.5" />
                Email
              </label>

              <div className="relative z-20">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  required
                  className="w-full px-3.5 py-3 bg-white/5 border border-white/10 rounded-xl
                 text-white placeholder-gray-500 caret-white
                 focus:outline-none focus:border-white/30 focus:bg-white/[0.07]
                 transition-all duration-300 relative z-20"
                  placeholder="admin@example.com"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-gray-400 text-xs font-medium mb-1.5 tracking-wide">
                <FontAwesomeIcon icon={faLock} className="w-3 h-3 mr-1.5" />
                Password
              </label>

              <div className="relative z-20">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                  className="w-full px-3.5 py-3 pr-12 bg-white/5 border border-white/10 rounded-xl
                 text-white placeholder-gray-500 caret-white
                 focus:outline-none focus:border-white/30 focus:bg-white/[0.07]
                 transition-all duration-300 relative z-20"
                  placeholder="••••••••"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 z-30 text-gray-500 hover:text-gray-300"
                >
                  <FontAwesomeIcon
                    icon={showPassword ? faEyeSlash : faEye}
                    className="w-4 h-4"
                  />
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center cursor-pointer group">
                <div className="relative">
                  <input
                    type="checkbox"
                    id="remember"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="sr-only"
                  />
                  <div
                    className={`w-4 h-4 border rounded transition-all duration-200 flex items-center justify-center ${
                      rememberMe
                        ? "bg-white border-white"
                        : "bg-transparent border-gray-600 group-hover:border-gray-500"
                    }`}
                  >
                    {rememberMe && (
                      <svg
                        className="w-2.5 h-2.5 text-gray-900"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={3}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    )}
                  </div>
                </div>
                <span className="ml-2.5 text-xs text-gray-400 group-hover:text-gray-300 transition-colors duration-200">
                  Remember me
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={!isLoading ? { scale: 1.01 } : {}}
              whileTap={!isLoading ? { scale: 0.99 } : {}}
              className={`w-full py-3 px-4 rounded-xl text-sm font-medium flex items-center justify-center space-x-2.5 transition-all duration-300
                ${
                  isLoading
                    ? "bg-white/20 text-white/60 cursor-not-allowed"
                    : "bg-white text-gray-900 hover:bg-white/90 hover:shadow-lg hover:shadow-white/10 active:bg-white/80"
                }`}
            >
              {isLoading ? (
                <>
                  <FontAwesomeIcon
                    icon={faSpinner}
                    className="w-4 h-4 animate-spin"
                  />
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <FontAwesomeIcon
                    icon={faArrowRight}
                    className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5"
                  />
                </>
              )}
            </motion.button>
          </form>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.4 }}
          className="text-center mt-6 space-y-2"
        >
          <Link
            to="/"
            className="inline-flex items-center space-x-1.5 text-gray-500 hover:text-gray-300 transition-colors duration-200 text-xs group"
          >
            <FontAwesomeIcon
              icon={faArrowLeft}
              className="w-3 h-3 transition-transform duration-200 group-hover:-translate-x-0.5"
            />
            <span>Back to Home</span>
          </Link>
          <p className="text-gray-600 text-xs">
            &copy; {new Date().getFullYear()} Jacques Photography
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Login;
