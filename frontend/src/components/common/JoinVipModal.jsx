import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Crown, CheckCircle2, Sparkles, Shield, ArrowRight } from 'lucide-react';
import { apiService } from '../../services/api';
import confetti from 'canvas-confetti';

export const JoinVipModal = () => {
  const { isJoinVipModalOpen, setIsJoinVipModalOpen, setCurrentUser, showToast } = useApp();
  const [loading, setLoading] = useState(false);
  const [joinedSuccess, setJoinedSuccess] = useState(false);

  if (!isJoinVipModalOpen) return null;

  const handleJoin = async () => {
    try {
      setLoading(true);
      const res = await apiService.joinVipClub();
      setCurrentUser(res.user);
      setJoinedSuccess(true);
      showToast('🎉 Welcome to New Ajeet Vision Club VIP!', 'success');
      
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {}
    } catch (err) {
      showToast(err.message || 'Error joining VIP Club', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setIsJoinVipModalOpen(false);
    setJoinedSuccess(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
      <div 
        className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Gold Luxury Header */}
        <div className="relative bg-gradient-to-br from-[#1C1917] via-[#292524] to-[#121212] p-6 text-white text-center border-b border-amber-500/30">
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="w-14 h-14 mx-auto mb-2 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-300 flex items-center justify-center shadow-lg shadow-amber-500/20">
            <Crown className="w-8 h-8 text-black" />
          </div>

          <span className="text-[11px] font-extrabold tracking-widest uppercase text-amber-400">
            EXCLUSIVE PRIVILEGE MEMBERSHIP
          </span>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white mt-0.5">
            NEW AJEET VISION CLUB
          </h2>
          <div className="inline-flex items-baseline gap-1 mt-2 px-3 py-1 bg-amber-500/20 border border-amber-500/40 rounded-full">
            <span className="text-xl font-black text-amber-400">₹499</span>
            <span className="text-xs text-amber-200">/ year</span>
          </div>
        </div>

        {joinedSuccess ? (
          <div className="p-6 text-center space-y-4">
            <div className="w-16 h-16 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center mx-auto">
              <Sparkles className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-black text-gray-900">VIP Membership Activated!</h3>
            <p className="text-xs text-gray-600">
              Congratulations! You are now a Verified VIP Customer of New Ajeet Vision. You will get special member pricing on all electronics, free delivery, and an extra 500 loyalty bonus points!
            </p>
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs font-semibold text-amber-900">
              Valid for 365 Days • Active on +91 98765 43210
            </div>
            <button
              onClick={handleClose}
              className="w-full py-3 bg-[#E51926] hover:bg-red-700 text-white rounded-xl text-xs font-bold transition shadow-sm"
            >
              Explore VIP Member Benefits
            </button>
          </div>
        ) : (
          <div className="p-6 space-y-4 overflow-y-auto">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Included VIP Privileges
            </p>

            <ul className="space-y-2.5 text-xs text-gray-700">
              {[
                'Special VIP Member Pricing on TVs, Fridges & Appliances',
                'Priority & Free Showroom Delivery within 25km',
                'Birthday Gift Voucher of ₹1,500 guaranteed',
                '24-Hour Early Access to Festive Dhanteras & Diwali Sales',
                'Annual Lucky Draw ticket for Promotional Goa Trip',
                'Dedicated Showroom Installation & Service Line',
              ].map((text, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span className="font-medium">{text}</span>
                </li>
              ))}
            </ul>

            <div className="p-3.5 bg-gray-50 rounded-2xl border border-gray-100 flex items-center justify-between text-xs">
              <span className="text-gray-500">Plan Duration</span>
              <span className="font-bold text-gray-900">365 Days (1 Year)</span>
            </div>

            <div className="p-3.5 bg-gray-50 rounded-2xl border border-gray-100 flex items-center justify-between text-xs">
              <span className="text-gray-500">Total Subscription Fee</span>
              <span className="font-extrabold text-brand-red text-sm">₹499 (All Inclusive)</span>
            </div>

            <div className="flex items-center gap-2 text-[11px] text-gray-400">
              <Shield className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
              <span>Instant activation directly through the web application</span>
            </div>

            <button
              type="button"
              disabled={loading}
              onClick={handleJoin}
              className="w-full py-3.5 bg-[#E51926] hover:bg-red-700 text-white font-bold rounded-xl text-xs sm:text-sm transition flex items-center justify-center gap-2 shadow-lg shadow-red-500/20 disabled:opacity-60"
            >
              {loading ? 'Processing VIP Activation...' : 'Pay ₹499 & Activate VIP Membership'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
