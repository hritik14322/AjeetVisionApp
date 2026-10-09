import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ArrowLeft,
  Crown,
  CheckCircle2,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Tag,
  Truck,
  Cake,
  Clock,
  Plane,
  Headphones,
  ShieldCheck,
} from 'lucide-react';
import { VIP_CLUB_BENEFITS } from '../../data/mockData';

export const VipClubScreen = () => {
  const { goBack, setIsJoinVipModalOpen, currentUser } = useApp();
  const [showTerms, setShowTerms] = useState(false);

  const isVip = currentUser?.isVipMember;

  const iconMap = {
    BadgePercent: Tag,
    Sparkles: Sparkles,
    Truck: Truck,
    Cake: Cake,
    Clock: Clock,
    Plane: Plane,
    Headphones: Headphones,
  };

  return (
    <div className="space-y-6 pb-24 md:pb-12 max-w-xl mx-auto px-4 sm:px-6 pt-3">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={goBack}
          className="p-2 -ml-2 rounded-full text-gray-700 hover:bg-gray-100 transition"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <span className="text-xs font-black uppercase tracking-wider text-amber-600">
          Privilege Club
        </span>
        <div className="w-8" />
      </div>

      {/* Gold Luxury Banner matching reference screen 12 */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-[#FFF5DC] via-[#FFEBB8] to-[#F5D485] p-6 sm:p-8 text-center border-2 border-amber-300 shadow-xl">
        {/* Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-amber-400/20 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center">
          {/* Big Golden Crown */}
          <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-2 flex items-center justify-center filter drop-shadow-md">
            <Crown className="w-12 h-12 sm:w-16 sm:h-16 text-amber-600 fill-amber-500" />
          </div>

          <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight uppercase">
            NEW AJEET VISION CLUB
          </h1>

          <div className="mt-3">
            <span className="text-xs font-extrabold uppercase text-gray-800 tracking-wider block">
              {isVip ? 'You Are A Verified VIP Member' : 'Get Verified Customer'}
            </span>
            <div className="text-3xl sm:text-4xl font-black text-gray-950 mt-1">
              ₹499 <span className="text-sm font-bold text-gray-700">/ year</span>
            </div>
          </div>

          {isVip && (
            <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-600 text-white text-xs font-bold rounded-full shadow-xs">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Membership Active until {currentUser.vipExpiryDate || '15 Sep 2027'}</span>
            </div>
          )}
        </div>
      </div>

      {/* Benefits List matching reference */}
      <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xs space-y-4">
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
          Exclusive Membership Privileges
        </h3>

        <div className="space-y-4">
          {VIP_CLUB_BENEFITS.map((b) => {
            const Icon = iconMap[b.icon] || Sparkles;
            return (
              <div key={b.id} className="flex items-start gap-3.5">
                <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center flex-shrink-0 mt-0.5 border border-amber-200">
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-gray-900">{b.title}</h4>
                  <p className="text-[11px] text-gray-500 mt-0.5 leading-relaxed">{b.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Primary Action Button */}
      <div className="space-y-3">
        <button
          onClick={() => setIsJoinVipModalOpen(true)}
          className="w-full py-4 bg-brand-red hover:bg-red-700 active:scale-[0.99] text-white font-black rounded-2xl text-sm transition-all duration-200 shadow-lg shadow-red-500/25 flex items-center justify-center gap-2"
        >
          <Crown className="w-5 h-5 text-amber-300 fill-amber-300" />
          <span>{isVip ? 'Renew VIP Membership (₹499)' : 'Join Now - ₹499 / Year'}</span>
        </button>

        {/* Terms Accordion */}
        <div className="text-center">
          <button
            onClick={() => setShowTerms(!showTerms)}
            className="text-xs font-semibold text-gray-500 hover:text-gray-900 inline-flex items-center gap-1 transition"
          >
            <span>View Terms & Conditions</span>
            {showTerms ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          {showTerms && (
            <div className="mt-3 p-4 bg-gray-50 rounded-2xl border border-gray-100 text-left text-[11px] text-gray-600 space-y-2">
              <p>• Membership valid for 365 days from date of purchase.</p>
              <p>• Discounts applicable across TV, Refrigerators, AC, Washing Machines and all major appliances.</p>
              <p>• Free doorstep delivery eligible within 25km radius of New Ajeet Vision Showroom, Obra.</p>
              <p>• Non-refundable and tied to your registered showroom mobile number.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
