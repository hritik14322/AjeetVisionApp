import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ArrowRight, 
  Mail, 
  Lock, 
  User, 
  Phone, 
  X, 
  CheckCircle, 
  KeyRound, 
  ShieldCheck, 
  Sparkles, 
  RefreshCw, 
  ArrowLeft, 
  Edit3, 
  Key 
} from 'lucide-react';

export const LoginScreen = () => {
  const { 
    handleSignUp, 
    handleSignIn, 
    handleForgotPassword, 
    handleSendEmailOtp, 
    handleVerifyEmailOtp, 
    handleResetPasswordWithOtp, 
    showToast, 
    navigateTo 
  } = useApp();
  
  // Auth Mode: 'signin' | 'signup'
  const [authMode, setAuthMode] = useState('signin');
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState('');

  // Form Fields - Sign In
  const [signInEmail, setSignInEmail] = useState('');
  const [signInPassword, setSignInPassword] = useState('');

  // Form Fields - Sign Up
  const [signUpStep, setSignUpStep] = useState('form'); // 'form' | 'otp'
  const [signUpName, setSignUpName] = useState('');
  const [signUpMobile, setSignUpMobile] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [emailOtp, setEmailOtp] = useState(['', '', '', '', '', '']);
  const [resendTimer, setResendTimer] = useState(0);
  const [receivedPreviewOtp, setReceivedPreviewOtp] = useState('');
  const otpInputRefs = useRef([]);

  // Forgot Password Modal
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
  const [forgotStep, setForgotStep] = useState('email'); // 'email' | 'otp'
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotOtp, setForgotOtp] = useState('');
  const [forgotNewPassword, setForgotNewPassword] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotResendTimer, setForgotResendTimer] = useState(0);

  // Countdown timer for Sign Up OTP resend
  useEffect(() => {
    let interval = null;
    if (resendTimer > 0) {
      interval = setInterval(() => setResendTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  // Countdown timer for Forgot Password OTP resend
  useEffect(() => {
    let interval = null;
    if (forgotResendTimer > 0) {
      interval = setInterval(() => setForgotResendTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [forgotResendTimer]);

  // Reset steps when switching between signin and signup
  const handleSwitchMode = (mode) => {
    if (loading) return;
    setAuthMode(mode);
    setSignUpStep('form');
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
      setLoadingText('Authenticating Session...');
      setLoading(true);
      await handleSignIn({ email: signInEmail, password: signInPassword });
    } catch (err) {
      showToast(err.message || 'Failed to sign in', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Step 1: Send OTP to Gmail during Sign Up
  const handleSendSignUpOtp = async (e) => {
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
      showToast('Please enter a valid Gmail / Email address', 'error');
      return;
    }
    if (!signUpPassword || signUpPassword.length < 6) {
      showToast('Password must be at least 6 characters long', 'error');
      return;
    }

    try {
      setLoadingText('Sending Verification Code to Gmail...');
      setLoading(true);
      const res = await handleSendEmailOtp(signUpEmail, 'signup');

      setSignUpStep('otp');
      setResendTimer(45);
      setEmailOtp(['', '', '', '', '', '']);

      if (res?.previewOtp) {
        setReceivedPreviewOtp(res.previewOtp);
        showToast(`Verification code sent to Gmail! (Code: ${res.previewOtp})`, 'info');
      } else {
        showToast(`Verification code sent to ${signUpEmail}! Check your inbox.`, 'success');
      }
    } catch (err) {
      showToast(err.message || 'Could not send verification OTP to Gmail', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Complete Sign Up with verified OTP
  const handleCompleteSignUp = async (e) => {
    e.preventDefault();
    const fullOtp = emailOtp.join('');
    if (fullOtp.length !== 6) {
      showToast('Please enter the complete 6-digit OTP code', 'error');
      return;
    }

    try {
      setLoadingText('Verifying Gmail & Initializing VIP Profile...');
      setLoading(true);
      await handleSignUp({
        name: signUpName,
        mobile: signUpMobile,
        email: signUpEmail,
        password: signUpPassword,
        otp: fullOtp,
      });
    } catch (err) {
      showToast(err.message || 'Failed to create account', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Resend Sign Up OTP
  const handleResendSignUpOtp = async () => {
    if (resendTimer > 0 || loading) return;
    try {
      setLoadingText('Resending Verification Code...');
      setLoading(true);
      const res = await handleSendEmailOtp(signUpEmail, 'signup');
      setResendTimer(45);
      if (res?.previewOtp) {
        setReceivedPreviewOtp(res.previewOtp);
        showToast(`New code sent! (Code: ${res.previewOtp})`, 'info');
      } else {
        showToast(`A fresh verification OTP was sent to ${signUpEmail}`, 'success');
      }
    } catch (err) {
      showToast(err.message || 'Failed to resend OTP', 'error');
    } finally {
      setLoading(false);
    }
  };

  // OTP inputs handling
  const handleOtpDigitChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...emailOtp];
    newOtp[index] = value.slice(-1);
    setEmailOtp(newOtp);

    // Auto-focus next field
    if (value && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !emailOtp[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted.length > 0) {
      const newOtp = [...emailOtp];
      for (let i = 0; i < 6; i++) {
        newOtp[i] = pasted[i] || '';
      }
      setEmailOtp(newOtp);
      otpInputRefs.current[Math.min(pasted.length, 5)]?.focus();
    }
  };

  // Handle Forgot Password - Step 1: Send OTP
  const handleForgotSendOtp = async (e) => {
    e.preventDefault();
    if (!forgotEmail || !forgotEmail.includes('@')) {
      showToast('Please enter your valid Gmail / Email address', 'error');
      return;
    }

    try {
      setForgotLoading(true);
      const res = await handleForgotPassword(forgotEmail);
      setForgotStep('otp');
      setForgotResendTimer(45);
      if (res?.previewOtp) {
        showToast(`Reset code sent to Gmail! (Code: ${res.previewOtp})`, 'info');
      } else {
        showToast(`Password reset code sent to ${forgotEmail}`, 'success');
      }
    } catch (err) {
      showToast(err.message || 'Failed to send reset OTP', 'error');
    } finally {
      setForgotLoading(false);
    }
  };

  // Handle Forgot Password - Step 2: Reset Password with OTP
  const handleForgotResetSubmit = async (e) => {
    e.preventDefault();
    if (!forgotOtp || forgotOtp.trim().length !== 6) {
      showToast('Please enter the 6-digit OTP code sent to your Gmail', 'error');
      return;
    }
    if (!forgotNewPassword || forgotNewPassword.length < 6) {
      showToast('New password must be at least 6 characters long', 'error');
      return;
    }

    try {
      setForgotLoading(true);
      await handleResetPasswordWithOtp(forgotEmail, forgotOtp.trim(), forgotNewPassword);
      setIsForgotModalOpen(false);
      setSignInEmail(forgotEmail);
      setSignInPassword(forgotNewPassword);
      setForgotStep('email');
      setForgotOtp('');
      setForgotNewPassword('');
      showToast('Password updated successfully! Please sign in.', 'success');
    } catch (err) {
      showToast(err.message || 'Password reset failed', 'error');
    } finally {
      setForgotLoading(false);
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
                {authMode === 'signin' 
                  ? 'Welcome Back!' 
                  : signUpStep === 'otp' ? 'Verify Gmail' : 'Create Account'}
              </h2>
              <p className="text-xs sm:text-sm text-white/90 font-medium mt-1 max-w-xs drop-shadow-sm">
                {authMode === 'signin'
                  ? 'Sign in to access your orders, rewards & loyalty points'
                  : signUpStep === 'otp'
                  ? `Enter the 6-digit OTP code sent to ${signUpEmail}`
                  : 'Join New Ajeet Vision with verified Gmail for exclusive benefits'}
              </p>
            </div>
          </div>

          {/* Tab Switcher: Sign In vs Sign Up */}
          <div className="mt-6 flex bg-white/10 p-1.5 rounded-2xl border border-white/20 backdrop-blur-md">
            <button
              type="button"
              disabled={loading}
              onClick={() => handleSwitchMode('signin')}
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
              onClick={() => handleSwitchMode('signup')}
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
                    <span>{loadingText || (authMode === 'signin' ? 'Authenticating Session...' : 'Creating VIP Profile...')}</span>
                  </div>
                  <p className="text-[11px] text-white/80 font-medium max-w-xs leading-relaxed">
                    {authMode === 'signin'
                      ? 'Verifying credentials, decrypting showroom session & syncing loyalty perks...'
                      : signUpStep === 'otp'
                      ? 'Validating 6-digit OTP, activating account & generating showroom loyalty card...'
                      : 'Connecting to mail server & dispatching verification code to your Gmail...'}
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
                            setForgotStep('email');
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
                      className="w-full py-3.5 bg-brand-red hover:bg-red-700 active:scale-[0.99] text-white font-bold rounded-2xl text-sm transition-all duration-200 shadow-md shadow-red-500/20 flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
                    >
                      Sign In
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </form>
                ) : signUpStep === 'form' ? (
                  /* ================= SIGN UP STEP 1: CREDENTIALS ================= */
                  <form onSubmit={handleSendSignUpOtp} className="space-y-3">
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
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-white drop-shadow-sm">Gmail / Email Address</label>
                        <span className="text-[10px] font-bold text-amber-300">OTP will be sent here</span>
                      </div>
                      <div className="flex items-center rounded-2xl border-2 border-white/30 focus-within:border-brand-red transition-all px-3.5 py-2.5 bg-white/10 shadow-sm backdrop-blur-sm">
                        <Mail className="w-4 h-4 text-white/70 mr-2 flex-shrink-0" />
                        <input
                          type="email"
                          value={signUpEmail}
                          onChange={(e) => setSignUpEmail(e.target.value)}
                          placeholder="e.g. customer@gmail.com"
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
                      className="w-full py-3.5 mt-2 bg-brand-red hover:bg-red-700 active:scale-[0.99] text-white font-bold rounded-2xl text-sm transition-all duration-200 shadow-md shadow-red-500/20 flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
                    >
                      <span>Send OTP to Gmail</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </form>
                ) : (
                  /* ================= SIGN UP STEP 2: VERIFY GMAIL OTP ================= */
                  <form onSubmit={handleCompleteSignUp} className="space-y-4">
                    {/* Destination info pill */}
                    <div className="bg-black/30 border border-white/20 rounded-2xl p-3 backdrop-blur-md">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2 text-white truncate mr-2">
                          <Mail className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                          <span className="font-bold truncate">{signUpEmail}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setSignUpStep('form')}
                          className="text-[11px] font-bold text-amber-300 hover:text-amber-200 flex items-center gap-1 flex-shrink-0 underline underline-offset-2"
                        >
                          <Edit3 className="w-3 h-3" />
                          Edit
                        </button>
                      </div>
                    </div>

                    {/* 6 Digit OTP Inputs */}
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-white drop-shadow-sm block text-center">
                        Enter 6-Digit Verification Code
                      </label>
                      <div className="flex items-center justify-between gap-1.5 sm:gap-2" onPaste={handleOtpPaste}>
                        {emailOtp.map((digit, index) => (
                          <input
                            key={index}
                            ref={(el) => (otpInputRefs.current[index] = el)}
                            type="text"
                            inputMode="numeric"
                            maxLength="1"
                            value={digit}
                            onChange={(e) => handleOtpDigitChange(index, e.target.value)}
                            onKeyDown={(e) => handleOtpKeyDown(index, e)}
                            className={`w-11 h-13 sm:w-12 sm:h-14 text-center text-xl font-black rounded-xl border-2 transition-all focus:outline-none ${
                              digit
                                ? 'border-brand-red bg-white/25 text-white'
                                : 'border-white/30 bg-white/10 text-white focus:border-brand-red focus:bg-white/20'
                            }`}
                            autoFocus={index === 0}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Resend Timer & Button */}
                    <div className="text-center pt-1">
                      {resendTimer > 0 ? (
                        <p className="text-xs text-white/80 font-medium">
                          Resend OTP in <span className="font-bold text-amber-300">00:{resendTimer < 10 ? `0${resendTimer}` : resendTimer}</span>
                        </p>
                      ) : (
                        <button
                          type="button"
                          onClick={handleResendSignUpOtp}
                          className="text-xs font-bold text-amber-300 hover:text-amber-200 transition underline underline-offset-2"
                        >
                          Resend OTP to Gmail
                        </button>
                      )}
                    </div>

                    {/* Instant Code Fallback / Auto-fill Helper */}
                    {receivedPreviewOtp && (
                      <div className="bg-amber-500/20 backdrop-blur-sm border border-amber-300/40 rounded-xl p-2.5 text-center mt-1">
                        <p className="text-[11px] text-amber-200">
                          Instant Verification Code: <span className="font-mono font-black text-white tracking-widest text-sm">{receivedPreviewOtp}</span>
                        </p>
                        <button
                          type="button"
                          onClick={() => {
                            const digits = receivedPreviewOtp.toString().split('').slice(0, 6);
                            setEmailOtp(digits);
                          }}
                          className="mt-1 text-xs font-bold text-amber-300 underline hover:text-white transition cursor-pointer"
                        >
                          ⚡ Tap to Auto-Fill OTP
                        </button>
                      </div>
                    )}

                    {/* Submit Registration */}
                    <button
                      type="submit"
                      disabled={loading || emailOtp.join('').length !== 6}
                      className="w-full py-3.5 bg-brand-red hover:bg-red-700 active:scale-[0.99] text-white font-bold rounded-2xl text-sm transition-all duration-200 shadow-md shadow-red-500/20 flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                    >
                      <ShieldCheck className="w-4 h-4 text-white" />
                      <span>Verify & Create Account</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSignUpStep('form')}
                      className="w-full text-center text-xs font-bold text-white/70 hover:text-white transition py-1"
                    >
                      ← Back to Details
                    </button>
                  </form>
                )}
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

      {/* ================= FORGOT PASSWORD MODAL ================= */}
      {isForgotModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl border border-gray-100 relative animate-in fade-in zoom-in duration-200">
            <button
              onClick={() => {
                setIsForgotModalOpen(false);
                setForgotStep('email');
              }}
              className="absolute top-4 right-4 p-1.5 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-2xl bg-red-50 text-brand-red flex items-center justify-center mb-3">
                <KeyRound className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-gray-900">
                {forgotStep === 'email' ? 'Reset Your Password' : 'Verify & Set Password'}
              </h3>
              <p className="text-xs text-gray-500 mt-1 max-w-xs">
                {forgotStep === 'email'
                  ? 'Enter your registered Gmail to receive a 6-digit security OTP code.'
                  : `Enter the code sent to ${forgotEmail} and create your new password.`}
              </p>
            </div>

            {forgotStep === 'email' ? (
              <form onSubmit={handleForgotSendOtp} className="mt-5 space-y-4">
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">Registered Gmail / Email</label>
                  <div className="flex items-center rounded-xl border border-gray-300 focus-within:border-brand-red px-3 py-2.5 bg-gray-50">
                    <Mail className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" />
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
                    className="flex-1 py-2.5 bg-brand-red hover:bg-red-700 text-white rounded-xl text-xs font-bold transition shadow-xs flex items-center justify-center gap-1 disabled:opacity-60 cursor-pointer"
                  >
                    {forgotLoading ? 'Sending OTP...' : 'Send OTP'}
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleForgotResetSubmit} className="mt-5 space-y-3.5">
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">6-Digit Gmail OTP</label>
                  <div className="flex items-center rounded-xl border border-gray-300 focus-within:border-brand-red px-3 py-2 bg-gray-50">
                    <Key className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" />
                    <input
                      type="text"
                      maxLength="6"
                      value={forgotOtp}
                      onChange={(e) => setForgotOtp(e.target.value.replace(/\D/g, ''))}
                      placeholder="123456"
                      className="w-full text-sm font-black tracking-widest text-gray-900 bg-transparent focus:outline-none"
                      autoFocus
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">New Password</label>
                  <div className="flex items-center rounded-xl border border-gray-300 focus-within:border-brand-red px-3 py-2 bg-gray-50">
                    <Lock className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" />
                    <input
                      type="password"
                      value={forgotNewPassword}
                      onChange={(e) => setForgotNewPassword(e.target.value)}
                      placeholder="Min. 6 characters"
                      className="w-full text-xs font-bold text-gray-900 bg-transparent focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setForgotStep('email')}
                    className="flex-1 py-2.5 border border-gray-200 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-50 transition"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={forgotLoading || forgotOtp.length !== 6 || forgotNewPassword.length < 6}
                    className="flex-1 py-2.5 bg-brand-red hover:bg-red-700 text-white rounded-xl text-xs font-bold transition shadow-xs flex items-center justify-center gap-1 disabled:opacity-60 cursor-pointer"
                  >
                    {forgotLoading ? 'Updating...' : 'Update Password'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
