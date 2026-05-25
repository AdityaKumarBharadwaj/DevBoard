import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, User, UserPlus, AlertCircle } from 'lucide-react';
// 1. Import your logo here
import logo from '../assets/logo.png';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  // Calculate password strength
  const getPasswordStrength = (password) => {
    if (password.length < 6) return 'weak';
    if (password.length < 10) return 'medium';
    return 'strong';
  };

  const passwordStrength = getPasswordStrength(formData.password);
  const strengthConfig = {
    weak: { color: 'bg-red-500', label: 'Weak' },
    medium: { color: 'bg-yellow-500', label: 'Medium' },
    strong: { color: 'bg-green-500', label: 'Strong' },
  };

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

    // Validate all fields
    if (!formData.name.trim() || !formData.email.trim() || !formData.password.trim() || !formData.confirmPassword.trim()) {
      setError('All fields are required');
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return;
    }

    // Validate password length
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });
      navigate('/dashboard');
    } catch (err) {
      setError(err || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Logo and Title */}
      <div className="flex flex-col items-center gap-3">
        {/* 2. Replaced Code2 with your logo image */}
        <img src={logo} alt="devBoard logo" className="h-16 w-auto object-contain" />
        <h1 className="text-2xl font-bold text-indigo-400">devBoard</h1>
      </div>

      {/* Heading and Subheading */}
      <div className="space-y-2">
        <h2 className="text-3xl font-bold text-white">Create your account</h2>
        <p className="text-gray-400">Start managing your projects like a pro</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name Input */}
        <div className="relative">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter your full name"
            className="input pl-10"
          />
        </div>

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
            placeholder="Create a password"
            className="input pl-10"
          />
        </div>

        {/* Password Strength Indicator */}
        {formData.password && (
          <div className="space-y-2">
            <div className="flex h-2 gap-1 overflow-hidden rounded-full bg-surface-raised">
              {['weak', 'medium', 'strong'].map((level) => (
                <div
                  key={level}
                  className={`flex-1 transition-colors ${
                    (passwordStrength === 'weak' && level === 'weak') ||
                    (passwordStrength === 'medium' && (level === 'weak' || level === 'medium')) ||
                    (passwordStrength === 'strong' && (level === 'weak' || level === 'medium' || level === 'strong'))
                      ? strengthConfig[passwordStrength].color
                      : 'bg-surface-raised'
                  }`}
                />
              ))}
            </div>
            <p className={`text-xs font-medium ${
              passwordStrength === 'weak'
                ? 'text-red-400'
                : passwordStrength === 'medium'
                ? 'text-yellow-400'
                : 'text-green-400'
            }`}>
              Password strength: {strengthConfig[passwordStrength].label}
            </p>
          </div>
        )}

        {/* Confirm Password Input */}
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm your password"
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
              Creating account...
            </>
          ) : (
            <>
              <UserPlus size={18} />
              Create account
            </>
          )}
        </button>
      </form>

      {/* Login Link */}
      <div className="text-center">
        <p className="text-gray-400">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-indigo-400 hover:text-indigo-300 transition">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}