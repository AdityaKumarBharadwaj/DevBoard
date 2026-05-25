import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, LogIn, AlertCircle } from 'lucide-react';
import logo from '../assets/logo.png';

export default function LoginPage() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Validate form
    if (!formData.email.trim() || !formData.password.trim()) {
      setError('Email and password are required');
      return;
    }

    setLoading(true);
    try {
      await login(formData);
      navigate('/dashboard');
    } catch (err) {
      setError(err || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Logo and Title */}
      <div className="flex flex-col items-center gap-3">
        <img src={logo} alt="devBoard logo" className="h-16 w-auto object-contain" />
        <h1 className="text-2xl font-bold text-indigo-400">devBoard</h1>
      </div>

      {/* Heading and Subheading */}
      <div className="space-y-2">
        <h2 className="text-3xl font-bold text-white">Welcome back</h2>
        <p className="text-gray-400">Sign in to your developer workspace</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email Input */}
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            className="input pl-10"
          />
        </div>

        {/* Password Input */}
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your password"
            className="input pl-10"
          />
        </div>

        {/* Error Message */}
        {error && (
          <div className="flex items-start gap-2 rounded-lg bg-red-500/10 border border-red-500/20 p-3">
            <AlertCircle className="mt-0.5 text-red-500 flex-shrink-0" size={18} />
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <div className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
              Signing in...
            </>
          ) : (
            <>
              <LogIn size={18} />
              Sign in
            </>
          )}
        </button>
      </form>

      {/* Registration Link */}
      <div className="text-center">
        <p className="text-gray-400">
          Don't have an account?{' '}
          <Link to="/register" className="font-medium text-indigo-400 hover:text-indigo-300 transition">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}