import React from 'react';
import { useApp } from '../../context/AppContext';
import { ArrowRight, Sparkles, ShieldCheck, Zap, Award } from 'lucide-react';
import { SHOWROOM_INFO } from '../../data/mockData';

export const SplashScreen = () => {
  const { navigateTo } = useApp();

  return (
    <div className="min-h-screen bg-[#0F0F11] text-white flex flex-col justify-between relative overflow-hidden select-none">
      {/* Background Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-brand-red/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Showroom Visual Image */}
      <div className="relative w-full h-[58vh] sm:h-[62vh] overflow-hidden">
        {/* Real Showroom Style Facade Image (matches reference "I ❤️ OBRA" showroom night view) */}
        <div 
          className="w-full h-full bg-cover bg-center transform scale-105 transition-transform duration-1000 ease-out"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1567449303078-57ad995bd302?auto=format&fit=crop&w=1200&q=80')`,
          }}
        >
          {/* Multi-layer gradient overlays to match reference dark cinematic showroom facade */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0F0F11] via-black/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-[#0F0F11]" />
        </div>

        {/* Floating Showroom Badge */}
        <div className="absolute top-6 left-6 right-6 flex items-center justify-between">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-black/60 backdrop-blur-md border border-white/10 rounded-full text-xs font-semibold text-white/90">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Showroom Open in Obra
          </div>
          <button
            onClick={() => navigateTo('home')}
            className="text-xs text-gray-300 hover:text-white px-3 py-1 bg-white/10 backdrop-blur-md rounded-full transition"
          >
            Skip to Store →
          </button>
        </div>

        {/* Center Illuminated Showroom Neon Board effect */}
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
          <div className="px-4 py-1.5 bg-red-600/90 text-white font-extrabold text-xs tracking-widest rounded-full uppercase mb-4 shadow-lg shadow-red-600/40 border border-red-400/40">
            I ❤️ OBRA
          </div>
          <div className="p-4 bg-white/95 rounded-3xl shadow-2xl backdrop-blur-md border border-white/20 mb-3 flex flex-col items-center gap-2 max-w-[280px]">
            <img
              src="/nav-logo.png"
              alt="New Ajeet Vision Logo"
              className="w-16 h-14 sm:w-20 sm:h-16 object-contain"
            />
            <img
              src="/nav-brand-text.png"
              alt="New AJEET Vision"
              className="h-7 sm:h-8 object-contain"
            />
          </div>
          <p className="text-xs font-semibold text-gray-200 mt-1 tracking-wide uppercase">
            Electronics Showroom
          </p>
        </div>
      </div>

      {/* Bottom Content Card */}
      <div className="px-6 py-6 sm:py-8 max-w-md mx-auto w-full flex flex-col items-center text-center z-10 space-y-5">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Your Trusted Electronics Partner
          </h2>
          <p className="text-xs sm:text-sm text-gray-400 mt-1.5 leading-relaxed">
            Mobiles, 4K Smart TVs, Refrigerators, Washing Machines & Smart Appliances at guaranteed showroom prices.
          </p>
        </div>

        {/* Trust Badges */}
        <div className="grid grid-cols-3 gap-2 w-full pt-1">
          <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 flex flex-col items-center text-center">
            <Award className="w-4 h-4 text-brand-red mb-1" />
            <span className="text-[11px] font-bold text-gray-200">Best Electronics</span>
          </div>
          <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 flex flex-col items-center text-center">
            <Zap className="w-4 h-4 text-amber-400 mb-1" />
            <span className="text-[11px] font-bold text-gray-200">0% Easy EMI</span>
          </div>
          <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 flex flex-col items-center text-center">
            <ShieldCheck className="w-4 h-4 text-emerald-400 mb-1" />
            <span className="text-[11px] font-bold text-gray-200">Trusted Service</span>
          </div>
        </div>

        {/* Primary Action Button */}
        <div className="w-full space-y-2.5 pt-2">
          <button
            onClick={() => navigateTo('login')}
            className="w-full py-3.5 bg-gradient-to-r from-[#E51926] to-[#C4121F] hover:from-red-600 hover:to-red-700 text-white font-bold rounded-2xl text-sm transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-red-600/30 active:scale-[0.98]"
          >
            <span>Login or Create Account</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => navigateTo('home')}
            className="w-full py-3 bg-white/10 hover:bg-white/15 text-gray-300 font-semibold rounded-2xl text-xs transition"
          >
            Browse Store as Guest
          </button>
        </div>
      </div>
    </div>
  );
};
