import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Gift, Sparkles, Copy, Check, Cake } from 'lucide-react';
import confetti from 'canvas-confetti';

export const BirthdayRewardModal = () => {
  const { isBirthdayModalOpen, setIsBirthdayModalOpen, showToast } = useApp();
  const [copied, setCopied] = useState(false);

  if (!isBirthdayModalOpen) return null;

  const couponCode = 'BDAY-AJEET-1500';

  const handleCopy = () => {
    navigator.clipboard.writeText(couponCode);
    setCopied(true);
    showToast('Birthday Coupon copied to clipboard!', 'success');
    try {
      confetti({ particleCount: 70, spread: 60 });
    } catch (e) {}
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div 
        className="bg-white w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200 text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative bg-gradient-to-br from-pink-500 via-rose-500 to-brand-red p-6 text-white">
          <button
            onClick={() => setIsBirthdayModalOpen(false)}
            className="absolute top-4 right-4 p-1 rounded-full bg-white/20 hover:bg-white/30 text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="w-14 h-14 mx-auto mb-2 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-xs">
            <Cake className="w-8 h-8 text-yellow-300" />
          </div>
          <h3 className="text-xl font-black">Happy Birthday Month! 🎂</h3>
          <p className="text-xs text-rose-100 mt-1">Special Gift from New Ajeet Vision</p>
        </div>

        <div className="p-6 space-y-4">
          <p className="text-xs text-gray-600">
            Celebrate your special day with an exclusive <strong>₹1,500 instant discount</strong> on any home appliance or TV purchase at our showroom!
          </p>

          <div className="p-3 bg-red-50 border-2 border-dashed border-red-300 rounded-2xl flex items-center justify-between">
            <div className="text-left">
              <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block">Showroom Coupon Code</span>
              <span className="font-mono text-base font-extrabold text-brand-red">{couponCode}</span>
            </div>
            <button
              onClick={handleCopy}
              className="p-2 bg-brand-red hover:bg-red-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1 shadow-xs"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>

          <p className="text-[11px] text-gray-400">
            Valid on minimum purchase of ₹10,000 until end of month. Redeemable at billing counter.
          </p>

          <button
            onClick={() => setIsBirthdayModalOpen(false)}
            className="w-full py-2.5 bg-gray-900 hover:bg-black text-white rounded-xl text-xs font-bold transition"
          >
            Got It, Thanks!
          </button>
        </div>
      </div>
    </div>
  );
};
