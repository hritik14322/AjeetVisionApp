import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ArrowLeft,
  CreditCard,
  QrCode,
  Sparkles,
  Crown,
  History,
  CheckCircle2,
  Gift,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { apiService } from '../../services/api';

export const LoyaltyCardScreen = () => {
  const { goBack, currentUser, showToast } = useApp();
  const [loyaltyData, setLoyaltyData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isRedeeming, setIsRedeeming] = useState(false);
  const [redeemedVoucher, setRedeemedVoucher] = useState(null);
  const [linkCardNumber, setLinkCardNumber] = useState('');
  const [isLinking, setIsLinking] = useState(false);

  const handleLinkCard = async () => {
    if (!linkCardNumber || linkCardNumber.length < 5) {
      showToast('Please enter a valid card number', 'error');
      return;
    }
    try {
      setIsLinking(true);
      await apiService.linkLoyaltyCard(linkCardNumber.toUpperCase());
      showToast('Physical Card Linked Successfully!', 'success');
      // In a real app we'd update AppContext state, reloading to reflect mock local storage change
      window.location.reload();
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setIsLinking(false);
    }
  };

  const fetchCard = async () => {
    try {
      setLoading(true);
      const data = await apiService.getLoyaltyCardDetails();
      setLoyaltyData(data);
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCard();
  }, []);

  const handleRedeem = async () => {
    if (!loyaltyData || loyaltyData.currentPoints < 100) {
      showToast('Minimum 100 points required to redeem store voucher', 'error');
      return;
    }

    try {
      setIsRedeeming(true);
      const res = await apiService.redeemLoyaltyPoints(500);
      setRedeemedVoucher(res);
      showToast('🎉 Points Redeemed for Showroom Voucher!', 'success');
      fetchCard();
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setIsRedeeming(false);
    }
  };

  if (loading || !loyaltyData) {
    return <div className="p-12 text-center text-gray-500">Loading Loyalty Card...</div>;
  }

  const isVip = currentUser?.isVipMember;

  return (
    <div className="space-y-6 pb-24 md:pb-12 max-w-xl mx-auto px-4 sm:px-6 pt-3">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={goBack}
          className="p-2 -ml-2 rounded-full text-gray-700 hover:bg-gray-100 transition"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h2 className="text-lg font-black text-gray-900 tracking-tight">
          Digital Loyalty Card
        </h2>
        <div className="w-8" />
      </div>

      {/* ---------------- DIGITAL METALLIC LOYALTY CARD ---------------- */}
      <div
        className={`relative overflow-hidden rounded-3xl p-6 sm:p-7 text-white shadow-2xl transition-all duration-300 ${
          isVip
            ? 'bg-gradient-to-br from-[#1C1917] via-[#2D2820] to-[#121212] border-2 border-amber-400/50 shadow-amber-500/20'
            : 'bg-gradient-to-br from-[#8C0B14] via-[#B8111D] to-[#E51926] border-2 border-red-300/30 shadow-red-600/30'
        }`}
      >
        {/* Holographic lines effect */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-white/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col justify-between h-52 sm:h-56">
          {/* Card Header */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <div className="w-9 h-8 bg-white/90 rounded-lg p-1 flex items-center justify-center shadow-xs">
                <img
                  src="/nav-logo.png"
                  alt="New Ajeet Vision"
                  className="w-full h-full object-contain"
                />
              </div>
              <img
                src="/nav-brand-text-white.png"
                alt="New AJEET Vision"
                className="h-6 object-contain"
              />
            </div>

            {isVip ? (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-amber-400 text-black text-[11px] font-black rounded-full uppercase tracking-wider shadow-sm">
                <Crown className="w-3.5 h-3.5 fill-black" />
                VIP Club
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-white/20 backdrop-blur-md text-[10px] font-bold rounded-full uppercase tracking-wider">
                Rewards Member
              </span>
            )}
          </div>

          {/* Card Middle: 16 Digit Card Number */}
          <div className="my-auto">
            <span className="text-[10px] uppercase tracking-widest text-white/60 font-semibold block">
              Loyalty Membership No.
            </span>
            <p className="font-mono text-lg sm:text-2xl font-bold tracking-widest text-white mt-0.5">
              {currentUser?.loyaltyCardNumber || loyaltyData.cardNumber}
            </p>
          </div>

          {/* Card Bottom: Holder Name, Expiry & Balance */}
          <div className="flex items-end justify-between border-t border-white/15 pt-3">
            <div>
              <span className="text-[9px] uppercase tracking-wider text-white/60 block">
                Card Holder
              </span>
              <p className="font-bold text-xs sm:text-sm text-white">
                {loyaltyData.customerName}
              </p>
            </div>

            <div className="text-right">
              <span className="text-[9px] uppercase tracking-wider text-white/60 block">
                Points Balance
              </span>
              <p className="text-base sm:text-lg font-black text-amber-300">
                {loyaltyData.currentPoints} Pts
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* QR Code Bar for Showroom Billing Counter */}
      <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xs flex flex-col items-center text-center space-y-3">
        <div className="p-3 bg-gray-50 border-2 border-gray-200 rounded-2xl">
          {/* Simulated clean QR pattern */}
          <div className="w-36 h-36 bg-gray-900 rounded-xl p-2 flex flex-col items-center justify-center text-white relative">
            <QrCode className="w-28 h-28 text-white stroke-[1.5]" />
            <span className="text-[9px] font-mono tracking-wider mt-1 text-gray-300">
              NAV-{currentUser?.mobile?.slice(-4)}
            </span>
          </div>
        </div>

        <div>
          <h4 className="font-bold text-gray-900 text-xs sm:text-sm">
            Scan at Showroom Billing Counter
          </h4>
          <p className="text-[11px] text-gray-500 mt-0.5">
            Instant point accrual & redemptions on every electronics purchase.
          </p>
        </div>

        {/* Redeem Voucher Result */}
        {redeemedVoucher && (
          <div className="w-full p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-left space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>₹500 Showroom Discount Voucher Generated!</span>
            </div>
            <p className="text-xs font-mono font-bold text-emerald-900">
              Voucher Code: {redeemedVoucher.voucherCode}
            </p>
            <p className="text-[10px] text-emerald-700">
              Present this code at New Ajeet Vision billing counter to get ₹500 discount.
            </p>
          </div>
        )}

        {/* Action Button */}
        <button
          onClick={handleRedeem}
          disabled={isRedeeming || loyaltyData.currentPoints < 100}
          className="w-full py-3.5 bg-brand-red hover:bg-red-700 active:scale-[0.99] text-white font-bold rounded-2xl text-xs sm:text-sm transition shadow-md shadow-red-500/20 flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <Gift className="w-4 h-4" />
          <span>
            {isRedeeming ? 'Redeeming Points...' : 'Redeem 500 Points for ₹500 Voucher'}
          </span>
        </button>
      </div>

      {/* Points Summary Stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="p-4 bg-white rounded-2xl border border-gray-100 shadow-xs">
          <span className="text-xs text-gray-400 font-medium">Total Points Earned</span>
          <p className="text-lg font-black text-gray-900 mt-1">+{loyaltyData.earnedTotal} Pts</p>
        </div>
        <div className="p-4 bg-white rounded-2xl border border-gray-100 shadow-xs">
          <span className="text-xs text-gray-400 font-medium">Total Points Redeemed</span>
          <p className="text-lg font-black text-brand-red mt-1">-{loyaltyData.redeemedTotal} Pts</p>
        </div>
      </div>

      {/* Transaction History List */}
      <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2">
            <History className="w-4 h-4 text-brand-red" />
            <span>Points Transaction History</span>
          </h3>
          <span className="text-[11px] text-gray-400 font-medium">
            Rule: 1 Point per ₹100 spent
          </span>
        </div>

        <div className="divide-y divide-gray-100">
          {loyaltyData.transactions?.map((t) => (
            <div key={t.id} className="py-3 flex items-center justify-between gap-3 text-xs">
              <div>
                <p className="font-bold text-gray-800">{t.description}</p>
                <div className="flex items-center gap-2 text-[11px] text-gray-400 mt-0.5 font-mono">
                  <span>{t.date}</span>
                  <span>•</span>
                  <span>Inv: {t.invoiceNo}</span>
                </div>
              </div>
              <span
                className={`font-black text-sm ${
                  t.points > 0 ? 'text-emerald-600' : 'text-brand-red'
                }`}
              >
                {t.points > 0 ? `+${t.points}` : t.points}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Link Physical Card Form (Only shows if not linked yet) */}
      {!currentUser?.loyaltyCardNumber && (
        <div className="bg-amber-50 rounded-3xl p-6 border border-amber-200 shadow-sm mt-8 relative overflow-hidden">
          <div className="relative z-10 flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mb-3">
              <CreditCard className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-gray-900">Have a Physical Showroom Card?</h3>
            <p className="text-[11px] text-gray-600 mt-1 max-w-[250px]">
              If you received a pre-printed Loyalty Card at the showroom, link it to your app account now. 
              <br /><strong className="text-amber-800 mt-1 block">Note: This can only be done ONCE.</strong>
            </p>

            <div className="w-full mt-5 flex gap-2">
              <input
                type="text"
                placeholder="Enter 12-Digit Card Number"
                value={linkCardNumber}
                onChange={(e) => setLinkCardNumber(e.target.value.toUpperCase())}
                className="flex-1 bg-white border border-amber-300 rounded-xl px-4 text-xs font-bold text-gray-900 focus:outline-none focus:border-amber-500 uppercase placeholder:normal-case tracking-wider"
              />
              <button
                onClick={handleLinkCard}
                disabled={isLinking || !linkCardNumber}
                className="bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white font-bold px-4 py-2.5 rounded-xl text-xs transition"
              >
                {isLinking ? 'Linking...' : 'Link Card'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
