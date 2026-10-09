import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Eye, EyeOff, Lock, Mail, ShieldCheck, AlertCircle } from 'lucide-react';

// Hardcoded admin credentials (replace with real backend auth later)
const ADMIN_CREDENTIALS = {
  email: 'admin@newajeetvision.com',
  password: 'Admin@2024',
};

export const AdminLoginScreen = () => {
  const { navigateTo } = useApp();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.email || !form.password) {
      setError('Please enter both email and password.');
      return;
    }

    setLoading(true);
    // Simulate a brief loading state
    await new Promise(r => setTimeout(r, 800));

    if (
      form.email.trim().toLowerCase() === ADMIN_CREDENTIALS.email &&
      form.password === ADMIN_CREDENTIALS.password
    ) {
      navigateTo('admin_dashboard');
    } else {
      setError('Invalid email or password. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B1527] flex flex-col items-center justify-center px-6 relative overflow-hidden">
      {/* Background decorative circles */}
      <div className="absolute top-0 left-0 w-80 h-80 bg-[#FF3B4A]/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#FF3B4A]/8 rounded-full blur-3xl translate-x-1/3 translate-y-1/3 pointer-events-none" />

      <div className="w-full max-w-sm relative z-10">

        {/* Logo + Brand */}
        <div className="flex flex-col items-center mb-10">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#FF3B4A] to-[#E51020] flex items-center justify-center shadow-2xl shadow-red-900/50 mb-4">
            <ShieldCheck className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-white font-extrabold text-[26px] tracking-tight">Admin Panel</h1>
          <p className="text-white/50 text-[14px] mt-1 font-medium">New Ajeet Vision · Secure Access</p>
        </div>

        {/* Login Card */}
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-[28px] p-7 shadow-2xl">
          <h2 className="text-white font-bold text-[18px] mb-1">Welcome back</h2>
          <p className="text-white/50 text-[13px] mb-6">Sign in to manage your store</p>

          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email */}
            <div>
              <label className="text-white/60 text-[12px] font-medium block mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                <input
                  type="email"
                  placeholder="admin@newajeetvision.com"
                  value={form.email}
                  onChange={e => { setForm(f => ({ ...f, email: e.target.value })); setError(''); }}
                  className="w-full bg-white/8 border border-white/15 rounded-[14px] pl-11 pr-4 py-3.5 text-white text-[14px] placeholder:text-white/30 focus:outline-none focus:border-[#FF3B4A] transition-colors"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="text-white/60 text-[12px] font-medium block mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={e => { setForm(f => ({ ...f, password: e.target.value })); setError(''); }}
                  className="w-full bg-white/8 border border-white/15 rounded-[14px] pl-11 pr-12 py-3.5 text-white text-[14px] placeholder:text-white/30 focus:outline-none focus:border-[#FF3B4A] transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-center gap-2 bg-[#FF3B4A]/15 border border-[#FF3B4A]/30 rounded-[12px] px-4 py-3">
                <AlertCircle className="w-4 h-4 text-[#FF3B4A] flex-shrink-0" />
                <p className="text-[#FF3B4A] text-[12px] font-medium">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 mt-2 bg-gradient-to-r from-[#FF3B4A] to-[#E51020] text-white font-bold rounded-[14px] text-[15px] shadow-lg shadow-red-900/40 hover:shadow-red-900/60 transition-all disabled:opacity-70 relative overflow-hidden">
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Verifying...
                </span>
              ) : (
                'Sign In to Admin Panel'
              )}
            </button>
          </form>
        </div>

        {/* Hint */}
        <div className="mt-5 bg-white/5 border border-white/10 rounded-[16px] px-4 py-3.5">
          <p className="text-white/40 text-[11px] font-medium text-center mb-1">Default Credentials</p>
          <p className="text-white/60 text-[12px] text-center font-mono">admin@newajeetvision.com</p>
          <p className="text-white/60 text-[12px] text-center font-mono">Admin@2024</p>
        </div>

        {/* Back to App */}
        <button
          onClick={() => navigateTo('home')}
          className="mt-5 w-full text-center text-white/40 text-[13px] font-medium hover:text-white/70 transition-colors">
          ← Back to Customer App
        </button>
      </div>
    </div>
  );
};
