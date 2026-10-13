import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Gift, Sparkles, Copy, Check, Cake, Calendar, Loader2, Lock, ShieldCheck, AlertCircle, Crown } from 'lucide-react';
import confetti from 'canvas-confetti';
import { apiService } from '../../services/api';

export const BirthdayRewardModal = () => {
  const { isBirthdayModalOpen, setIsBirthdayModalOpen, currentUser, setCurrentUser, showToast, syncCustomerFromDb, setIsJoinVipModalOpen } = useApp();
  const [copied, setCopied] = useState(false);
  const [birthdayDate, setBirthdayDate] = useState('');
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const existingDob = currentUser?.dob || currentUser?.birthday;
  const hasBirthday = Boolean(existingDob);
  const isVip = Boolean(currentUser?.isVipMember);
  const discountAmount = isVip ? 1500 : 1000;
  const couponCode = isVip ? 'BDAY-VIP-1500' : 'BDAY-AJEET-1000';

  useEffect(() => {
    if (existingDob) {
      try {
        const d = new Date(existingDob);
        if (!isNaN(d.getTime())) {
          setBirthdayDate(d.toISOString().split('T')[0]);
        }
      } catch (e) {}
    } else {
      setBirthdayDate('');
    }
  }, [existingDob, isBirthdayModalOpen]);

  if (!isBirthdayModalOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(couponCode);
    setCopied(true);
    showToast(`Birthday Coupon (${couponCode}) copied!`, 'success');
    try {
      confetti({ particleCount: 70, spread: 60 });
    } catch (e) {}
    setTimeout(() => setCopied(false), 3000);
  };

  const handleSaveBirthday = async (e) => {
    e?.preventDefault?.();
    
    // Hard guard: cannot edit if already set
    if (hasBirthday) {
      showToast('Birthday date is permanently locked and cannot be edited further.', 'error');
      return;
    }

    if (!birthdayDate) {
      showToast('Please select your birthday date', 'error');
      return;
    }

    try {
      setSaving(true);
      const email = currentUser?.email || 'customer@gmail.com';
      await apiService.updateUserProfile({
        email,
        dob: birthdayDate,
      });

      // Update current user state with locked dob
      const updatedUser = {
        ...(currentUser || {}),
        dob: birthdayDate,
        birthday: birthdayDate,
      };
      setCurrentUser(updatedUser);
      localStorage.setItem('nav_user_profile', JSON.stringify(updatedUser));
      if (syncCustomerFromDb) {
        syncCustomerFromDb(updatedUser);
      }

      setSavedSuccess(true);
      try {
        confetti({ particleCount: 90, spread: 70, origin: { y: 0.6 } });
      } catch (e) {}
      showToast(`🎉 Birthday Saved & Locked! ₹${discountAmount} Discount Unlocked.`, 'success');
    } catch (err) {
      showToast(err.message || 'Failed to save birthday', 'error');
    } finally {
      setSaving(false);
    }
  };

  const formattedSavedDate = hasBirthday 
    ? new Date(existingDob).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })
    : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-xs">
      <div 
        className="bg-white w-full max-w-sm rounded-[28px] shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200 text-center relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with festive gradient */}
        <div className={`relative p-6 text-white ${isVip ? 'bg-gradient-to-br from-[#1C1917] via-[#2A2421] to-[#121212] border-b border-amber-500/30' : 'bg-gradient-to-br from-rose-500 via-pink-600 to-[#E51926]'}`}>
          <button
            onClick={() => setIsBirthdayModalOpen(false)}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className={`w-14 h-14 mx-auto mb-2 rounded-2xl flex items-center justify-center shadow-md ${isVip ? 'bg-gradient-to-tr from-amber-500 to-yellow-300 text-black shadow-amber-500/20' : 'bg-white/20 text-yellow-300 backdrop-blur-xs shadow-inner'}`}>
            {isVip ? <Crown className="w-8 h-8 text-black" /> : <Cake className="w-8 h-8 text-yellow-300" />}
          </div>

          <div className="flex items-center justify-center gap-1.5">
            <span className={`text-[10px] font-extrabold uppercase tracking-widest ${isVip ? 'text-amber-400' : 'text-rose-100'}`}>
              {isVip ? 'VIP Privilege Reward' : 'Customer Birthday Reward'}
            </span>
          </div>

          <h3 className="text-xl font-black tracking-tight text-white mt-0.5">
            Birthday ₹{discountAmount} Discount 🎂
          </h3>
          <p className="text-xs text-white/80 mt-0.5">New Ajeet Vision, Obra, Bihar</p>
        </div>

        <div className="p-5 sm:p-6 space-y-4">
          <p className="text-xs text-gray-600 leading-relaxed">
            {isVip ? (
              <>As a verified VIP member, you get an exclusive <strong>₹1,500 Birthday Discount</strong> on electronics & appliances!</>
            ) : (
              <>Register your birthday to unlock a <strong>₹1,000 Birthday Discount</strong> (or join VIP Club for <strong>₹1,500</strong>)!</>
            )}
          </p>

          {/* Birthday Date Section */}
          {hasBirthday ? (
            /* LOCKED BIRTHDAY VIEW */
            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 text-left space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-extrabold text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#E51926]" />
                  Registered Date of Birth
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-100 border border-amber-300 rounded-full text-[10px] font-extrabold text-amber-800">
                  <Lock className="w-3 h-3 text-amber-700" />
                  Locked
                </span>
              </div>

              <div className="p-2.5 bg-white border border-gray-200 rounded-xl flex items-center justify-between">
                <span className="text-xs font-black text-gray-900">{formattedSavedDate}</span>
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
              </div>

              <div className="flex items-start gap-1.5 pt-1 text-[11px] text-gray-500 leading-tight">
                <Lock className="w-3.5 h-3.5 text-gray-400 flex-shrink-0 mt-0.5" />
                <span>
                  This birthday date cannot be edited further as per showroom policy to ensure voucher integrity.
                </span>
              </div>
            </div>
          ) : (
            /* UNLOCKED ADD BIRTHDAY FORM */
            <form onSubmit={handleSaveBirthday} className="space-y-3 bg-rose-50/70 p-4 rounded-2xl border border-rose-100 text-left">
              <label className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#E51926]" />
                <span>Select Your Date of Birth</span>
              </label>
              
              <div className="flex items-center gap-2">
                <input
                  type="date"
                  max={new Date().toISOString().split('T')[0]}
                  value={birthdayDate}
                  onChange={(e) => setBirthdayDate(e.target.value)}
                  className="w-full bg-white border border-rose-200 focus:border-[#E51926] rounded-xl px-3 py-2 text-xs font-bold text-gray-900 focus:outline-none shadow-xs"
                  required
                />
                <button
                  type="submit"
                  disabled={saving || !birthdayDate}
                  className="py-2 px-4 bg-[#E51926] hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-xs transition active:scale-95 disabled:opacity-50 whitespace-nowrap flex items-center gap-1 cursor-pointer"
                >
                  {saving ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <span>Save Date</span>
                  )}
                </button>
              </div>

              <div className="flex items-start gap-1.5 text-[10.5px] text-amber-800 bg-amber-50 p-2 rounded-xl border border-amber-200/60 leading-tight">
                <AlertCircle className="w-3.5 h-3.5 text-amber-600 flex-shrink-0 mt-0.5" />
                <span>
                  <strong>Important:</strong> Once added, birthday date cannot be edited further for your account. Please select carefully.
                </span>
              </div>
            </form>
          )}

          {/* Discount Voucher Card */}
          <div className={`p-3.5 rounded-2xl flex items-center justify-between border-2 border-dashed ${isVip ? 'bg-amber-50/90 border-amber-400' : 'bg-red-50 border-red-300'}`}>
            <div className="text-left">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block">
                  {isVip ? 'VIP Member Voucher' : 'Birthday Special Voucher'}
                </span>
                {isVip && (
                  <span className="px-1.5 py-0.2 bg-amber-400 text-gray-950 font-black text-[9px] rounded-sm uppercase">VIP</span>
                )}
              </div>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className={`font-mono text-base font-extrabold ${isVip ? 'text-amber-900' : 'text-[#E51926]'}`}>{couponCode}</span>
                <span className={`text-xs font-black ${isVip ? 'text-amber-700' : 'text-[#E51926]'}`}>₹{discountAmount} OFF</span>
              </div>
            </div>
            <button
              onClick={handleCopy}
              className={`p-2 text-white rounded-xl text-xs font-bold transition flex items-center gap-1 shadow-xs cursor-pointer ${isVip ? 'bg-amber-600 hover:bg-amber-700' : 'bg-[#E51926] hover:bg-red-700'}`}
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>

          {!isVip && (
            <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-xl text-left flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 text-[11px] text-amber-900 font-medium">
                <Crown className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
                <span>Upgrade to VIP for <strong>₹1,500 OFF</strong> on birthday!</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsBirthdayModalOpen(false);
                  setIsJoinVipModalOpen(true);
                }}
                className="text-[10.5px] font-bold text-amber-900 bg-amber-200/80 hover:bg-amber-300 px-2 py-1 rounded-lg transition whitespace-nowrap cursor-pointer"
              >
                Join VIP →
              </button>
            </div>
          )}

          <p className="text-[11px] text-gray-400">
            Valid on minimum purchase of ₹10,000 at New Ajeet Vision, Obra billing counter.
          </p>

          <button
            onClick={() => setIsBirthdayModalOpen(false)}
            className="w-full py-2.5 bg-gray-900 hover:bg-black text-white rounded-xl text-xs font-bold transition cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
