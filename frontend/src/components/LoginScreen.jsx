import React, { useState } from 'react';

const LoginScreen = ({ onLogin, onSwitchToRegister }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
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

    try {
const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/login`, {       
   method: 'POST',     
  headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        onLogin(data.user);
      } else {
        setError(data.error || 'Login failed');
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
        <h2 className="text-center text-2xl font-bold mb-6 text-slate-100">Login</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
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
              placeholder="Enter your password"
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
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="text-center mt-6 text-sm text-slate-400">
          Don't have an account?{' '}
          <button 
            onClick={onSwitchToRegister} 
            className="text-brand-400 hover:text-brand-300 font-medium transition"
          >
            Register here
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginScreen;