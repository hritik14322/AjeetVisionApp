import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Gift, Sparkles, Copy, Check, Cake, Calendar, Loader2, Lock, ShieldCheck, AlertCircle } from 'lucide-react';
import confetti from 'canvas-confetti';
import { apiService } from '../../services/api';

export const BirthdayRewardModal = () => {
  const { isBirthdayModalOpen, setIsBirthdayModalOpen, currentUser, setCurrentUser, showToast, syncCustomerFromDb } = useApp();
  const [copied, setCopied] = useState(false);
  const [birthdayDate, setBirthdayDate] = useState('');
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const existingDob = currentUser?.dob || currentUser?.birthday;
  const hasBirthday = Boolean(existingDob);

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
      showToast('🎉 Birthday Saved & Permanently Locked! Special Discount Unlocked.', 'success');
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
        <div className="relative bg-gradient-to-br from-rose-500 via-pink-600 to-[#E51926] p-6 text-white">
          <button
            onClick={() => setIsBirthdayModalOpen(false)}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="w-14 h-14 mx-auto mb-2 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-xs shadow-inner">
            <Cake className="w-8 h-8 text-yellow-300" />
          </div>
          <h3 className="text-xl font-black tracking-tight">Birthday Special Discount 🎂</h3>
          <p className="text-xs text-rose-100 mt-1">Exclusive Customer Privilege • New Ajeet Vision</p>
        </div>

        <div className="p-6 space-y-4">
          <p className="text-xs text-gray-600 leading-relaxed">
            Register your birthday to unlock an exclusive <strong>₹1,500 Birthday Voucher</strong> on appliances, TVs & electronics!
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
          <div className="p-3 bg-red-50 border-2 border-dashed border-red-300 rounded-2xl flex items-center justify-between">
            <div className="text-left">
              <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block">Birthday Special Voucher</span>
              <span className="font-mono text-base font-extrabold text-[#E51926]">{couponCode}</span>
            </div>
            <button
              onClick={handleCopy}
              className="p-2 bg-[#E51926] hover:bg-red-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1 shadow-xs cursor-pointer"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>

          <p className="text-[11px] text-gray-400">
            Valid on minimum purchase of ₹10,000 at New Ajeet Vision Obra billing counter.
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
