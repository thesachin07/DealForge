import React, { useState } from 'react';

const RegisterScreen = ({ onRegister, onSwitchToLogin }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password
        }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        onRegister(data.user);
      } else {
        setError(data.error || 'Registration failed');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full flex justify-center items-center">
      <div className="w-full max-w-sm bg-slate-800/30 border border-slate-700 rounded-2xl p-8 backdrop-blur-lg">
        <h2 className="text-center text-2xl font-bold mb-6 text-slate-100">Join DealForge</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="flex flex-col gap-2">
            <label htmlFor="username" className="text-sm font-medium text-slate-300">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              minLength="3"
              maxLength="20"
              placeholder="Choose a username"
              className="px-4 py-3 border border-slate-700 rounded-lg bg-slate-800/70 text-slate-100 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/30 placeholder-slate-600"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="text-sm font-medium text-slate-300">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter your email"
              className="px-4 py-3 border border-slate-700 rounded-lg bg-slate-800/70 text-slate-100 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/30 placeholder-slate-600"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="password" className="text-sm font-medium text-slate-300">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength="6"
              placeholder="Create a password"
              className="px-4 py-3 border border-slate-700 rounded-lg bg-slate-800/70 text-slate-100 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/30 placeholder-slate-600"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="confirmPassword" className="text-sm font-medium text-slate-300">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              placeholder="Confirm your password"
              className="px-4 py-3 border border-slate-700 rounded-lg bg-slate-800/70 text-slate-100 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/30 placeholder-slate-600"
            />
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-300 px-3 py-2.5 rounded text-sm text-center">
              {error}
            </div>
          )}

          <button 
            type="submit" 
            disabled={isLoading} 
            className="w-full py-3 bg-gradient-to-r from-brand-500 to-emerald-500 hover:from-brand-600 hover:to-emerald-600 disabled:from-slate-700 disabled:to-slate-700 text-white font-bold rounded-lg transition transform hover:-translate-y-0.5 disabled:cursor-not-allowed mt-2"
          >
            {isLoading ? 'Creating account...' : 'Register'}
          </button>
        </form>

        <p className="text-center mt-6 text-sm text-slate-400">
          Already have an account?{' '}
          <button 
            onClick={onSwitchToLogin} 
            className="text-brand-400 hover:text-brand-300 font-medium transition"
          >
            Login here
          </button>
        </p>
      </div>
    </div>
  );
};

export default RegisterScreen;