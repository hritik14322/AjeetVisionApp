import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Gift, Sparkles, CheckCircle2, MapPin, ArrowRight } from 'lucide-react';
import { SHOWROOM_INFO } from '../../data/mockData';
import { apiService } from '../../services/api';

export const WheelResultModal = () => {
  const {
    isWheelResultModalOpen,
    setIsWheelResultModalOpen,
    wheelPrizeResult,
    showToast,
    navigateTo,
  } = useApp();

  const [isClaimed, setIsClaimed] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!isWheelResultModalOpen || !wheelPrizeResult) return null;

  const reward = wheelPrizeResult.reward;
  const claimCode = wheelPrizeResult.claimCode || 'NAV-GIFT-894721';

  const handleClaim = async () => {
    try {
      setLoading(true);
      await apiService.claimGift();
      setIsClaimed(true);
      showToast('🎁 Gift Voucher registered! Present this at the showroom counter.', 'success');
    } catch (err) {
      showToast(err.message || 'Error claiming gift', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setIsWheelResultModalOpen(false);
    navigateTo('home');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div 
        className="bg-white w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200 text-center relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-20 p-1.5 rounded-full bg-black/40 hover:bg-black/60 text-white transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Top Celebration Backdrop */}
        <div className="relative bg-gradient-to-b from-amber-400 via-yellow-400 to-amber-500 pt-8 pb-4 px-6 text-gray-950">
          <div className="w-12 h-12 mx-auto mb-1 bg-white/40 rounded-2xl flex items-center justify-center shadow-md">
            <Sparkles className="w-7 h-7 text-gray-900" />
          </div>
          <span className="text-xs font-black tracking-widest uppercase text-gray-800">
            Prize Wheel Result
          </span>
          <h2 className="text-2xl font-black tracking-tight text-gray-950 mt-0.5">
            Congratulations!
          </h2>
          <p className="text-xs font-bold text-gray-800">
            You've won <span className="underline decoration-black">{reward.name}</span> 🎉
          </p>
        </div>

        {/* Prize Image Showcase matching reference */}
        <div className="p-6 space-y-4">
          <div className="relative w-44 h-44 mx-auto rounded-3xl bg-gray-50 border-2 border-gray-100 p-4 flex items-center justify-center shadow-inner group">
            <img
              src={reward.image}
              alt={reward.name}
              className="w-full h-full object-contain filter drop-shadow-md group-hover:scale-105 transition-transform"
            />
            <span className="absolute bottom-2 right-2 px-2 py-0.5 bg-black text-white text-[10px] font-bold rounded-lg">
              Worth ₹{reward.mrp?.toLocaleString('en-IN')}
            </span>
          </div>

          <div className="space-y-1">
            <h3 className="text-base font-extrabold text-gray-900">{reward.name}</h3>
            <p className="text-xs text-gray-500">{reward.description}</p>
          </div>

          {/* Claim Code Pill */}
          <div className="p-3 bg-red-50 border border-red-200 rounded-2xl text-center">
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">
              Official Claim Verification Code
            </span>
            <span className="text-base font-mono font-black text-brand-red tracking-wider">
              {claimCode}
            </span>
          </div>

          {/* Store Redemption Instructions */}
          <div className="p-3 bg-gray-50 rounded-2xl border border-gray-100 text-left text-xs space-y-1 text-gray-600">
            <div className="flex items-center gap-1.5 font-bold text-gray-800">
              <MapPin className="w-3.5 h-3.5 text-brand-red" />
              <span>Showroom Claim Rules</span>
            </div>
            <p className="text-[11px] text-gray-500 leading-relaxed">
              Visit our New Ajeet Vision showroom in Obra with this code and your registered mobile number to claim your physical gift. Valid for 30 days.
            </p>
          </div>

          {/* Action Button */}
          {isClaimed ? (
            <div className="space-y-2">
              <div className="flex items-center justify-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 py-2.5 rounded-xl border border-emerald-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Gift Claim Code Saved to Profile</span>
              </div>
              <button
                onClick={handleClose}
                className="w-full py-3 bg-gray-900 hover:bg-black text-white text-xs font-bold rounded-xl transition"
              >
                Back to Home Dashboard
              </button>
            </div>
          ) : (
            <button
              onClick={handleClaim}
              disabled={loading}
              className="w-full py-3.5 bg-brand-red hover:bg-red-700 active:scale-[0.99] text-white font-bold rounded-2xl text-xs sm:text-sm transition shadow-lg shadow-red-500/25 flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {loading ? 'Registering Claim...' : 'Claim Your Gift'}
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
