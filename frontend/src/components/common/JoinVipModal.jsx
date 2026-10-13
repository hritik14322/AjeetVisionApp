import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Crown, CheckCircle2, Sparkles, Shield, ArrowRight } from 'lucide-react';
import { apiService } from '../../services/api';
import confetti from 'canvas-confetti';

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export const JoinVipModal = () => {
  const { isJoinVipModalOpen, setIsJoinVipModalOpen, currentUser, setCurrentUser, showToast } = useApp();
  const [loading, setLoading] = useState(false);
  const [joinedSuccess, setJoinedSuccess] = useState(false);

  if (!isJoinVipModalOpen) return null;

  const handleJoin = async () => {
    try {
      setLoading(true);

      // 1. Ensure Razorpay checkout script is loaded
      const isLoaded = await loadRazorpayScript();
      if (!isLoaded || !window.Razorpay) {
        throw new Error('Razorpay gateway could not be loaded. Please check your network.');
      }

      // 2. Request order from backend Razorpay API
      const orderRes = await fetch('/api/vip/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: currentUser?.email || '',
          customerId: currentUser?._id || currentUser?.id || '',
        }),
      });

      const orderData = await orderRes.json();
      if (!orderRes.ok || !orderData.orderId) {
        throw new Error(orderData.message || 'Failed to create payment order. Please try again.');
      }

      // 3. Open official Razorpay Checkout window branded as New Ajeet Vision
      const options = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency || 'INR',
        name: 'New Ajeet Vision',
        description: 'VIP Club Membership (1 Year)',
        image: '/nav-logo.png',
        order_id: orderData.orderId,
        prefill: {
          name: currentUser?.name || '',
          email: currentUser?.email || '',
          contact: (currentUser?.mobile || '').replace(/\D/g, '').slice(-10),
        },
        theme: {
          color: '#E51926',
        },
        handler: async (response) => {
          try {
            setLoading(true);
            const verifyRes = await fetch('/api/vip/verify-payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                email: currentUser?.email,
                customerId: currentUser?._id || currentUser?.id,
              }),
            });

            const verifyData = await verifyRes.json();
            if (!verifyRes.ok) {
              throw new Error(verifyData.message || 'Payment signature verification failed.');
            }

            const updated = { ...currentUser, isVipMember: true };
            setCurrentUser(updated);
            localStorage.setItem('nav_user_profile', JSON.stringify(updated));
            setJoinedSuccess(true);
            showToast('🎉 VIP Membership Activated Successfully!', 'success');
            try {
              confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
            } catch (e) {}
          } catch (err) {
            showToast(err.message || 'Payment verification failed', 'error');
          } finally {
            setLoading(false);
          }
        },
        modal: {
          ondismiss: () => {
            setLoading(false);
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (response) {
        showToast(response.error?.description || 'Payment Failed', 'error');
        setLoading(false);
      });
      rzp.open();
    } catch (err) {
      showToast(err.message || 'Error starting payment', 'error');
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
