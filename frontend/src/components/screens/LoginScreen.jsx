import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ArrowRight, 
  Mail, 
  Lock, 
  User, 
  Phone, 
  X, 
  KeyRound, 
  ShieldCheck, 
  Loader2
} from 'lucide-react';

export const LoginScreen = () => {
  const { 
    handleSignUp, 
    handleSignIn, 
    handleResetPasswordWithOtp, 
    showToast, 
    navigateTo 
  } = useApp();
  
  // Auth Mode: 'signin' | 'signup'
  const [authMode, setAuthMode] = useState('signin');
  const [loading, setLoading] = useState(false);

  // Form Fields - Sign In
  const [signInEmail, setSignInEmail] = useState('');
  const [signInPassword, setSignInPassword] = useState('');

  // Form Fields - Sign Up
  const [signUpName, setSignUpName] = useState('');
  const [signUpMobile, setSignUpMobile] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');

  // Forgot Password Modal
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotNewPassword, setForgotNewPassword] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);

  // Switch between Sign In and Sign Up
  const handleSwitchMode = (mode) => {
    if (loading) return;
    setAuthMode(mode);
  };

  // Handle Sign In Submit
  const handleSignInSubmit = async (e) => {
    e.preventDefault();
    if (!signInEmail || !signInEmail.includes('@')) {
      showToast('Please enter a valid email address', 'error');
      return;
    }
    if (!signInPassword) {
      showToast('Please enter your password', 'error');
      return;
    }

    try {
      setLoading(true);
      await handleSignIn({ email: signInEmail.trim().toLowerCase(), password: signInPassword });
    } catch (err) {
      showToast(err.message || 'Invalid email or password', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Handle Sign Up Submit (Direct Email & Password - No OTP)
  const handleSignUpSubmit = async (e) => {
    e.preventDefault();
    if (!signUpName.trim()) {
      showToast('Please enter your full name', 'error');
      return;
    }
    const cleanMobile = signUpMobile.replace(/\D/g, '');
    if (cleanMobile.length < 10) {
      showToast('Please enter a valid 10-digit mobile number', 'error');
      return;
    }
    if (!signUpEmail || !signUpEmail.includes('@') || !signUpEmail.includes('.')) {
      showToast('Please enter a valid email address', 'error');
      return;
    }
    if (!signUpPassword || signUpPassword.length < 6) {
      showToast('Password must be at least 6 characters long', 'error');
      return;
    }

    try {
      setLoading(true);
      await handleSignUp({
        name: signUpName.trim(),
        mobile: `+91 ${cleanMobile.slice(-10)}`,
        email: signUpEmail.trim().toLowerCase(),
        password: signUpPassword,
      });
    } catch (err) {
      showToast(err.message || 'Registration failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Handle Direct Password Reset
  const handleForgotResetSubmit = async (e) => {
    e.preventDefault();
    if (!forgotEmail || !forgotEmail.includes('@')) {
      showToast('Please enter your valid email address', 'error');
      return;
    }
    if (!forgotNewPassword || forgotNewPassword.length < 6) {
      showToast('New password must be at least 6 characters long', 'error');
      return;
    }

    try {
      setForgotLoading(true);
      await handleResetPasswordWithOtp(forgotEmail.trim().toLowerCase(), '', forgotNewPassword);
      setIsForgotModalOpen(false);
      setSignInEmail(forgotEmail);
      setSignInPassword(forgotNewPassword);
      setForgotEmail('');
      setForgotNewPassword('');
      showToast('Password updated successfully! Please sign in.', 'success');
    } catch (err) {
      showToast(err.message || 'Password reset failed', 'error');
    } finally {
      setForgotLoading(false);
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center p-4">
      {/* Dynamic Background Image */}
      <div 
        className="fixed inset-0 z-0 bg-cover bg-center transition-all duration-700 pointer-events-none"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1593784991095-a205069470b6?auto=format&fit=crop&w=1920&q=80')`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/60 to-black/75 backdrop-blur-[4px]" />
      </div>

      <div className="relative z-10 w-full max-w-md my-auto">
        {/* Glassmorphic Container Card */}
        <div className="bg-white/15 backdrop-blur-xl border border-white/30 rounded-[32px] p-6 sm:p-8 shadow-2xl flex flex-col items-center">
          
          {/* Top Branding */}
          <div className="flex flex-col items-center text-center pt-1">
            <div 
              onClick={() => navigateTo('home')}
              className="cursor-pointer flex flex-col items-center gap-1.5 transition-transform hover:scale-105 active:scale-95"
            >
              <img
                src="/nav-logo.png"
                alt="New Ajeet Vision Logo"
                className="w-16 h-14 object-contain drop-shadow-md mb-1"
              />
              <img
                src="/nav-brand-text.png"
                alt="New AJEET Vision"
                className="h-8 object-contain brightness-0 invert opacity-90 drop-shadow-sm"
              />
            </div>

            <p className="text-xs sm:text-sm text-white/90 font-medium mt-3 max-w-xs drop-shadow-sm">
              {authMode === 'signin'
                ? 'Sign in to access your orders, rewards & loyalty points'
                : 'Create your account for exclusive showroom benefits & discounts'}
            </p>
          </div>

          {/* Tab Switcher: Sign In vs Sign Up */}
          <div className="w-full mt-6 flex bg-white/10 p-1.5 rounded-2xl border border-white/20 backdrop-blur-md">
            <button
              type="button"
              disabled={loading}
              onClick={() => handleSwitchMode('signin')}
              className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
                authMode === 'signin'
                  ? 'bg-white text-gray-900 shadow-md font-black'
                  : 'text-white/80 hover:text-white hover:bg-white/10'
              } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              Sign In
            </button>
            <button
              type="button"
              disabled={loading}
              onClick={() => handleSwitchMode('signup')}
              className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
                authMode === 'signup'
                  ? 'bg-white text-gray-900 shadow-md font-black'
                  : 'text-white/80 hover:text-white hover:bg-white/10'
              } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              Sign Up
            </button>
          </div>

          {/* Form Area */}
          <div className="w-full my-5">
            {authMode === 'signin' ? (
              /* ================= SIGN IN FORM ================= */
              <form onSubmit={handleSignInSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-white drop-shadow-sm">Email Address</label>
                  <div className="flex items-center rounded-2xl border-2 border-white/30 focus-within:border-brand-red transition-all px-3.5 py-2.5 bg-white/10 shadow-sm backdrop-blur-sm">
                    <Mail className="w-4 h-4 text-white/70 mr-2 flex-shrink-0" />
                    <input
                      type="email"
                      value={signInEmail}
                      onChange={(e) => setSignInEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full text-sm font-semibold text-white placeholder:text-white/50 bg-transparent focus:outline-none"
                      disabled={loading}
                      autoFocus
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-white drop-shadow-sm">Password</label>
                    <button
                      type="button"
                      onClick={() => {
                        setForgotEmail(signInEmail);
                        setIsForgotModalOpen(true);
                      }}
                      className="text-xs font-bold text-amber-300 hover:text-white transition underline underline-offset-2 cursor-pointer"
                    >
                      Forgot Password?
                    </button>
                  </div>
                  <div className="flex items-center rounded-2xl border-2 border-white/30 focus-within:border-brand-red transition-all px-3.5 py-2.5 bg-white/10 shadow-sm backdrop-blur-sm">
                    <Lock className="w-4 h-4 text-white/70 mr-2 flex-shrink-0" />
                    <input
                      type="password"
                      value={signInPassword}
                      onChange={(e) => setSignInPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full text-sm font-semibold text-white placeholder:text-white/50 bg-transparent focus:outline-none"
                      disabled={loading}
                    />
                  </div>
                </div>

                {/* Submit Sign In */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 bg-brand-red hover:bg-red-700 active:scale-[0.99] text-white font-bold rounded-2xl text-sm transition-all duration-200 shadow-md shadow-red-500/20 flex items-center justify-center gap-2 disabled:opacity-70 cursor-pointer"
                >
                  {loading ? (
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                      <span>Signing In...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      <span>Sign In</span>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  )}
                </button>
              </form>
            ) : (
              /* ================= SIGN UP FORM (DIRECT - NO OTP) ================= */
              <form onSubmit={handleSignUpSubmit} className="space-y-3">
                {/* Full Name */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-white drop-shadow-sm">Full Name</label>
                  <div className="flex items-center rounded-2xl border-2 border-white/30 focus-within:border-brand-red transition-all px-3.5 py-2.5 bg-white/10 shadow-sm backdrop-blur-sm">
                    <User className="w-4 h-4 text-white/70 mr-2 flex-shrink-0" />
                    <input
                      type="text"
                      value={signUpName}
                      onChange={(e) => setSignUpName(e.target.value)}
                      placeholder="e.g. Ramesh Kumar"
                      className="w-full text-sm font-semibold text-white placeholder:text-white/50 bg-transparent focus:outline-none"
                      disabled={loading}
                      autoFocus
                    />
                  </div>
                </div>

                {/* Mobile Number */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-white drop-shadow-sm">Phone Number</label>
                  <div className="flex items-center rounded-2xl border-2 border-white/30 focus-within:border-brand-red transition-all px-3.5 py-2.5 bg-white/10 shadow-sm backdrop-blur-sm">
                    <span className="text-xs font-bold text-white pr-2 border-r border-white/30 flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5 text-white/70" />
                      +91
                    </span>
                    <input
                      type="tel"
                      maxLength="10"
                      value={signUpMobile}
                      onChange={(e) => setSignUpMobile(e.target.value.replace(/\D/g, ''))}
                      placeholder="98765 43210"
                      className="w-full pl-2 text-sm font-semibold text-white placeholder:text-white/50 bg-transparent focus:outline-none"
                      disabled={loading}
                    />
                  </div>
                </div>

                {/* Email Address */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-white drop-shadow-sm">Email Address</label>
                  <div className="flex items-center rounded-2xl border-2 border-white/30 focus-within:border-brand-red transition-all px-3.5 py-2.5 bg-white/10 shadow-sm backdrop-blur-sm">
                    <Mail className="w-4 h-4 text-white/70 mr-2 flex-shrink-0" />
                    <input
                      type="email"
                      value={signUpEmail}
                      onChange={(e) => setSignUpEmail(e.target.value)}
                      placeholder="e.g. customer@gmail.com"
                      className="w-full text-sm font-semibold text-white placeholder:text-white/50 bg-transparent focus:outline-none"
                      disabled={loading}
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-white drop-shadow-sm">Create Password</label>
                  <div className="flex items-center rounded-2xl border-2 border-white/30 focus-within:border-brand-red transition-all px-3.5 py-2.5 bg-white/10 shadow-sm backdrop-blur-sm">
                    <Lock className="w-4 h-4 text-white/70 mr-2 flex-shrink-0" />
                    <input
                      type="password"
                      value={signUpPassword}
                      onChange={(e) => setSignUpPassword(e.target.value)}
                      placeholder="Min. 6 characters"
                      className="w-full text-sm font-semibold text-white placeholder:text-white/50 bg-transparent focus:outline-none"
                      disabled={loading}
                    />
                  </div>
                </div>

                {/* Submit Sign Up */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 mt-2 bg-brand-red hover:bg-red-700 active:scale-[0.99] text-white font-bold rounded-2xl text-sm transition-all duration-200 shadow-md shadow-red-500/20 flex items-center justify-center gap-2 disabled:opacity-70 cursor-pointer"
                >
                  {loading ? (
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                      <span>Creating Account...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      <span>Create Account</span>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  )}
                </button>
              </form>
            )}
          </div>

          {/* Bottom Guest Mode Link */}
          <div className="w-full pt-3 border-t border-white/20 flex flex-col items-center text-center">
            <p className="text-[11px] font-bold text-white/90 drop-shadow-sm">
              Easy EMI • Trusted Showroom • Exclusive Perks
            </p>
            <button
              onClick={() => navigateTo('home')}
              className="text-xs text-brand-red font-black hover:underline mt-2 drop-shadow-md bg-white/90 hover:bg-white px-4 py-1.5 rounded-full shadow-lg transition cursor-pointer"
            >
              Skip & Explore Store as Guest →
            </button>
            <button
              type="button"
              onClick={() => navigateTo('terms')}
              className="text-[10px] text-white/80 hover:text-white underline decoration-white/40 mt-2 cursor-pointer"
            >
              Legal Terms & Showroom Policies
            </button>
          </div>

        </div>
      </div>

      {/* ================= FORGOT PASSWORD MODAL (DIRECT RESET) ================= */}
      {isForgotModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl border border-gray-100 relative animate-in fade-in zoom-in duration-200">
            <button
              onClick={() => setIsForgotModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-2xl bg-red-50 text-brand-red flex items-center justify-center mb-3">
                <KeyRound className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-gray-900">
                Reset Your Password
              </h3>
              <p className="text-xs text-gray-500 mt-1 max-w-xs">
                Enter your registered email and choose a new password.
              </p>
            </div>

            <form onSubmit={handleForgotResetSubmit} className="mt-5 space-y-3.5">
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">Email Address</label>
                <div className="flex items-center rounded-xl border border-gray-300 focus-within:border-brand-red px-3 py-2.5 bg-gray-50">
                  <Mail className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" />
                  <input
                    type="email"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full text-xs font-bold text-gray-900 bg-transparent focus:outline-none"
                    disabled={forgotLoading}
                    autoFocus
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">New Password</label>
                <div className="flex items-center rounded-xl border border-gray-300 focus-within:border-brand-red px-3 py-2.5 bg-gray-50">
                  <Lock className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" />
                  <input
                    type="password"
                    value={forgotNewPassword}
                    onChange={(e) => setForgotNewPassword(e.target.value)}
                    placeholder="Min. 6 characters"
                    className="w-full text-xs font-bold text-gray-900 bg-transparent focus:outline-none"
                    disabled={forgotLoading}
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setIsForgotModalOpen(false)}
                  className="flex-1 py-2.5 border border-gray-200 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-50 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={forgotLoading}
                  className="flex-1 py-2.5 bg-brand-red hover:bg-red-700 text-white rounded-xl text-xs font-bold transition shadow-xs flex items-center justify-center gap-1 disabled:opacity-60 cursor-pointer"
                >
                  {forgotLoading ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Updating...</span>
                    </>
                  ) : (
                    <span>Set Password</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
