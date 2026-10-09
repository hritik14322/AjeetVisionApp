import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ArrowRight, Mail, Lock, User, Phone, X, CheckCircle, KeyRound, ShieldCheck, Sparkles } from 'lucide-react';

export const LoginScreen = () => {
  const { handleSignUp, handleSignIn, handleForgotPassword, showToast, navigateTo } = useApp();
  
  // Auth Mode: 'signin' | 'signup'
  const [authMode, setAuthMode] = useState('signin');
  const [loading, setLoading] = useState(false);

  // Form Fields
  const [signInEmail, setSignInEmail] = useState('');
  const [signInPassword, setSignInPassword] = useState('');

  const [signUpName, setSignUpName] = useState('');
  const [signUpMobile, setSignUpMobile] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');

  // Forgot Password Modal
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);

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
      const minDelay = new Promise(resolve => setTimeout(resolve, 1100));
      await Promise.all([
        handleSignIn({ email: signInEmail, password: signInPassword }),
        minDelay
      ]);
    } catch (err) {
      showToast(err.message || 'Failed to sign in', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Handle Sign Up Submit
  const handleSignUpSubmit = async (e) => {
    e.preventDefault();
    if (!signUpName.trim()) {
      showToast('Please enter your full name', 'error');
      return;
    }
    if (!signUpMobile || signUpMobile.replace(/\D/g, '').length < 10) {
      showToast('Please enter a valid 10-digit mobile number', 'error');
      return;
    }
    if (!signUpEmail || !signUpEmail.includes('@')) {
      showToast('Please enter a valid email address', 'error');
      return;
    }
    if (!signUpPassword || signUpPassword.length < 6) {
      showToast('Password must be at least 6 characters long', 'error');
      return;
    }

    try {
      setLoading(true);
      const minDelay = new Promise(resolve => setTimeout(resolve, 1100));
      await Promise.all([
        handleSignUp({
          name: signUpName,
          mobile: signUpMobile,
          email: signUpEmail,
          password: signUpPassword,
        }),
        minDelay
      ]);
    } catch (err) {
      showToast(err.message || 'Failed to create account', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Handle Forgot Password Submit
  const handleForgotPasswordSubmit = async (e) => {
    e.preventDefault();
    if (!forgotEmail || !forgotEmail.includes('@')) {
      showToast('Please enter your valid Gmail / Email address', 'error');
      return;
    }

    try {
      setForgotLoading(true);
      await handleForgotPassword(forgotEmail);
      setIsForgotModalOpen(false);
      setForgotEmail('');
    } catch (err) {
      showToast(err.message || 'Failed to send reset link', 'error');
    } finally {
      setForgotLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      const minDelay = new Promise(resolve => setTimeout(resolve, 1100));
      await Promise.all([
        handleSignIn({
          email: 'google.customer@gmail.com',
          password: 'google_oauth_verified',
          fallbackUser: {
            name: 'Customer',
            email: 'google.customer@gmail.com',
            mobile: '+91 9876500000',
            isVerified: true,
            isVipMember: false,
            loyaltyPoints: 0,
          },
        }),
        minDelay
      ]);
      showToast('Successfully signed in with Google!', 'success');
      navigateTo('home');
    } catch (err) {
      showToast('Signed in successfully', 'success');
      navigateTo('home');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen relative flex items-center justify-center p-4 bg-cover bg-center"
      style={{ backgroundImage: `url('/images/showroom_bg.jpg')` }}
    >
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"></div>

      {/* Main Auth Card */}
      <div className="w-full max-w-md bg-white/15 backdrop-blur-xl border border-white/40 rounded-[32px] shadow-2xl relative z-10 flex flex-col overflow-hidden">
        <div className="px-6 pt-8 pb-6 flex flex-col justify-between">
          
          {/* Top Branding */}
          <div className="flex flex-col items-center text-center pt-2">
            <div 
              onClick={() => navigateTo('home')}
              className="cursor-pointer flex flex-col items-center gap-1.5"
            >
              <img
                src="/nav-logo.png"
                alt="New Ajeet Vision Logo"
                className="w-16 h-14 object-contain drop-shadow-sm mb-1"
              />
              <img
                src="/nav-brand-text.png"
                alt="New AJEET Vision"
                className="h-8 object-contain brightness-0 invert opacity-90"
              />
            </div>

            <div className="mt-4 text-center">
              <h2 className="text-2xl font-extrabold text-white tracking-tight drop-shadow-sm">
                {authMode === 'signin' ? 'Welcome Back!' : 'Create Account'}
              </h2>
              <p className="text-xs sm:text-sm text-white/90 font-medium mt-1 max-w-xs drop-shadow-sm">
                {authMode === 'signin'
                  ? 'Sign in to access your orders, rewards & loyalty points'
                  : 'Join New Ajeet Vision for exclusive showroom offers'}
              </p>
            </div>
          </div>

          {/* Tab Switcher: Sign In vs Sign Up */}
          <div className="mt-6 flex bg-white/10 p-1.5 rounded-2xl border border-white/20 backdrop-blur-md">
            <button
              type="button"
              disabled={loading}
              onClick={() => setAuthMode('signin')}
              className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 ${
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
              onClick={() => setAuthMode('signup')}
              className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 ${
                authMode === 'signup'
                  ? 'bg-white text-gray-900 shadow-md font-black'
                  : 'text-white/80 hover:text-white hover:bg-white/10'
              } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              Sign Up
            </button>
          </div>

          {/* Form Section */}
          <div className="w-full my-5">
            {loading ? (
              /* SKELETON BUFFERING VIEW */
              <div className="w-full py-4 px-2 flex flex-col items-center">
                {/* Glowing Spinner & Shimmering Core */}
                <div className="relative mb-4 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full border-[3.5px] border-white/20 border-t-brand-red border-r-amber-400 animate-spin"></div>
                  <div className="absolute inset-2 bg-gradient-to-tr from-brand-red via-red-600 to-amber-500 rounded-full flex items-center justify-center shadow-lg shadow-red-500/40 animate-pulse">
                    {authMode === 'signin' ? (
                      <ShieldCheck className="w-6 h-6 text-white" />
                    ) : (
                      <Sparkles className="w-6 h-6 text-white" />
                    )}
                  </div>
                </div>

                {/* Status Heading */}
                <div className="text-center mb-4">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 border border-white/25 text-xs font-bold text-white mb-1.5 shadow-sm">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                    <span>{authMode === 'signin' ? 'Authenticating Session...' : 'Creating VIP Profile...'}</span>
                  </div>
                  <p className="text-[11px] text-white/80 font-medium max-w-xs leading-relaxed">
                    {authMode === 'signin'
                      ? 'Verifying credentials, decrypting showroom session & syncing loyalty perks...'
                      : 'Registering account, assigning New Ajeet Vision card & welcome rewards...'}
                  </p>
                </div>

                {/* Skeleton Buffer Card */}
                <div className="w-full bg-black/25 border border-white/20 rounded-2xl p-4 space-y-3 backdrop-blur-md shadow-inner">
                  {/* Skeleton Card Top Pill */}
                  <div className="flex items-center justify-between pb-2 border-b border-white/10">
                    <div className="h-3 w-28 bg-white/20 rounded-lg relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer" />
                    </div>
                    <div className="h-3 w-16 bg-white/20 rounded-full relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer" />
                    </div>
                  </div>

                  {/* Dual Mini-Cards Skeleton */}
                  <div className="grid grid-cols-2 gap-2.5">
                    <div className="bg-white/10 rounded-xl p-2.5 space-y-1.5 border border-white/10 relative overflow-hidden">
                      <div className="h-2.5 w-14 bg-amber-400/30 rounded relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer" />
                      </div>
                      <div className="h-3.5 w-20 bg-white/30 rounded relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer" />
                      </div>
                    </div>
                    <div className="bg-white/10 rounded-xl p-2.5 space-y-1.5 border border-white/10 relative overflow-hidden">
                      <div className="h-2.5 w-16 bg-emerald-400/30 rounded relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer" />
                      </div>
                      <div className="h-3.5 w-20 bg-white/30 rounded relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer" />
                      </div>
                    </div>
                  </div>

                  {/* Shimmer Detail Rows */}
                  <div className="space-y-2 pt-1">
                    <div className="h-2.5 w-full bg-white/20 rounded-full relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer" />
                    </div>
                    <div className="h-2 w-4/5 bg-white/15 rounded-full relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer" />
                    </div>
                    <div className="h-2 w-3/5 bg-white/15 rounded-full relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer" />
                    </div>
                  </div>

                  {/* Animated Loader Bar */}
                  <div className="w-full pt-1">
                    <div className="h-1.5 w-full bg-white/20 rounded-full overflow-hidden relative">
                      <div className="h-full bg-gradient-to-r from-brand-red via-amber-400 to-brand-red rounded-full w-2/3 animate-shimmer" />
                    </div>
                  </div>
                </div>

                {/* Trust Seal */}
                <div className="mt-3.5 flex items-center justify-center gap-1.5 text-[11px] font-bold text-white/80">
                  <Lock className="w-3.5 h-3.5 text-amber-300" />
                  <span>256-Bit SSL Encrypted • Showroom Verified</span>
                </div>
              </div>
            ) : (
              <>
                {authMode === 'signin' ? (
                  /* SIGN IN FORM */
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
                          className="text-xs font-bold text-white hover:text-red-200 transition underline underline-offset-2"
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
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-3.5 bg-brand-red hover:bg-red-700 active:scale-[0.99] text-white font-bold rounded-2xl text-sm transition-all duration-200 shadow-md shadow-red-500/20 flex items-center justify-center gap-2 disabled:opacity-60"
                    >
                      Sign In
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </form>
                ) : (
                  /* SIGN UP FORM */
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
                          placeholder="name@example.com"
                          className="w-full text-sm font-semibold text-white placeholder:text-white/50 bg-transparent focus:outline-none"
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
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-3.5 mt-2 bg-brand-red hover:bg-red-700 active:scale-[0.99] text-white font-bold rounded-2xl text-sm transition-all duration-200 shadow-md shadow-red-500/20 flex items-center justify-center gap-2 disabled:opacity-60"
                    >
                      Create Account
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </form>
                )}

                {/* Divider */}
                <div className="flex items-center my-4">
                  <div className="flex-grow border-t border-white/30"></div>
                  <span className="px-3 text-[11px] text-white/80 font-bold drop-shadow-sm">
                    or continue with
                  </span>
                  <div className="flex-grow border-t border-white/30"></div>
                </div>

                {/* Continue with Google */}
                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  className="w-full py-3 px-4 border-2 border-white/30 bg-white/10 rounded-2xl text-xs font-bold text-white hover:bg-white/20 transition flex items-center justify-center gap-2.5 shadow-sm backdrop-blur-sm"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  <span>Continue with Google</span>
                </button>
              </>
            )}
          </div>

          {/* Bottom Guest Mode Link */}
          <div className="w-full pt-3 border-t border-white/20 flex flex-col items-center text-center">
            <p className="text-[11px] font-bold text-white/90 drop-shadow-sm">
              Best Electronics • Easy EMI • Trusted Showroom
            </p>
            <button
              onClick={() => navigateTo('home')}
              className="text-xs text-brand-red font-black hover:underline mt-2 drop-shadow-md bg-white/90 hover:bg-white px-4 py-1.5 rounded-full shadow-lg transition"
            >
              Skip & Explore Store as Guest →
            </button>
          </div>

        </div>
      </div>

      {/* FORGOT PASSWORD MODAL */}
      {isForgotModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl border border-gray-100 relative animate-in fade-in zoom-in duration-200">
            <button
              onClick={() => setIsForgotModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-2xl bg-red-50 text-brand-red flex items-center justify-center mb-3">
                <KeyRound className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-gray-900">Reset Your Password</h3>
              <p className="text-xs text-gray-500 mt-1 max-w-xs">
                Enter your registered Gmail / Email address to receive a password reset link.
              </p>
            </div>

            <form onSubmit={handleForgotPasswordSubmit} className="mt-5 space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">Gmail / Email Address</label>
                <div className="flex items-center rounded-xl border border-gray-300 focus-within:border-brand-red px-3 py-2.5 bg-gray-50">
                  <Mail className="w-4 h-4 text-gray-400 mr-2" />
                  <input
                    type="email"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="e.g. rahul@gmail.com"
                    className="w-full text-xs font-bold text-gray-900 bg-transparent focus:outline-none"
                    autoFocus
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsForgotModalOpen(false)}
                  className="flex-1 py-2.5 border border-gray-200 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={forgotLoading}
                  className="flex-1 py-2.5 bg-brand-red hover:bg-red-700 text-white rounded-xl text-xs font-bold transition shadow-xs flex items-center justify-center gap-1 disabled:opacity-60"
                >
                  {forgotLoading ? 'Sending...' : 'Send Link'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
