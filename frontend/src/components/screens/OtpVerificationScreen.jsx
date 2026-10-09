import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { ArrowLeft, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const OtpVerificationScreen = () => {
  const { pendingOtpMobile, handleVerifyOtp, handleSendOtp, goBack, showToast } = useApp();
  const [otp, setOtp] = useState(['1', '2', '3', '4', '5', '6']); // prefilled with test OTP for convenience
  const [timer, setTimer] = useState(25);
  const [loading, setLoading] = useState(false);
  const inputRefs = useRef([]);

  useEffect(() => {
    let interval = null;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted.length > 0) {
      const newOtp = [...otp];
      for (let i = 0; i < 6; i++) {
        newOtp[i] = pasted[i] || '';
      }
      setOtp(newOtp);
      inputRefs.current[Math.min(pasted.length, 5)]?.focus();
    }
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    const fullOtp = otp.join('');
    if (fullOtp.length !== 6) {
      showToast('Please enter all 6 digits of the OTP', 'error');
      return;
    }

    try {
      setLoading(true);
      await handleVerifyOtp(fullOtp);
    } catch (err) {
      showToast(err.message || 'Verification failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (timer > 0) return;
    try {
      await handleSendOtp(pendingOtpMobile || '9876543210');
      setTimer(30);
      showToast('New OTP sent to your mobile', 'success');
    } catch (err) {
      showToast(err.message || 'Could not resend OTP', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col justify-between max-w-md mx-auto px-6 py-6">
      {/* Top Bar */}
      <div>
        <button
          onClick={goBack}
          className="p-2 -ml-2 rounded-full text-gray-700 hover:bg-gray-100 transition"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div className="mt-6">
          <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">
            Verify OTP
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            We have sent a 6-digit code to{' '}
            <strong className="text-gray-800">
              +91 {pendingOtpMobile ? pendingOtpMobile.slice(-10) : '98765 43210'}
            </strong>
          </p>
        </div>
      </div>

      {/* OTP Inputs */}
      <div className="my-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex items-center justify-between gap-2 sm:gap-2.5" onPaste={handlePaste}>
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                inputMode="numeric"
                maxLength="1"
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className={`w-12 h-14 sm:w-14 sm:h-16 text-center text-xl sm:text-2xl font-black rounded-2xl border-2 transition-all focus:outline-none ${
                  digit
                    ? 'border-brand-red bg-red-50/20 text-gray-900'
                    : 'border-gray-200 bg-gray-50/60 text-gray-400 focus:border-brand-red focus:bg-white'
                }`}
              />
            ))}
          </div>

          {/* Resend Timer */}
          <div className="text-center">
            {timer > 0 ? (
              <p className="text-xs text-gray-500 font-medium">
                Resend OTP in <span className="font-bold text-gray-800">00:{timer < 10 ? `0${timer}` : timer}</span>
              </p>
            ) : (
              <button
                type="button"
                onClick={handleResend}
                className="text-xs font-bold text-brand-red hover:underline"
              >
                Resend OTP Now
              </button>
            )}
          </div>

          {/* Test Hint */}
          <div className="p-3 bg-red-50/70 border border-red-100 rounded-xl text-center">
            <span className="text-xs text-brand-red font-medium">
              💡 Demo Test Code: <strong>123456</strong>
            </span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-brand-red hover:bg-red-700 active:scale-[0.99] text-white font-bold rounded-2xl text-sm transition-all duration-200 shadow-md shadow-red-500/20 flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {loading ? 'Verifying Code...' : 'Verify & Continue'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>

      {/* Trust & Safe note */}
      <div className="flex items-center justify-center gap-2 text-xs text-gray-400 pb-4">
        <ShieldCheck className="w-4 h-4 text-emerald-600" />
        <span>Secure authentication powered by New Ajeet Vision</span>
      </div>
    </div>
  );
};
