import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Flame,
  Gift,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Crown,
  CreditCard,
  Clock,
  Heart,
  Star,
  ArrowRight,
  TrendingUp,
  Tag,
  ShieldCheck,
  Check,
  Award,
  Trophy,
  Zap,
  ShoppingCart,
} from 'lucide-react';
import { PROMOTIONAL_BANNERS } from '../../data/mockData';
import { getSyncProducts, getSyncCategories, apiService } from '../../services/api';

export const HomeScreen = () => {
  const {
    navigateTo,
    rewardJourney,
    toggleRewardTargetSimulation,
    wishlistIds,
    toggleWishlist,
    setIsJoinVipModalOpen,
    currentUser,
    openEmiCalculator,
  } = useApp();

  // Banner carousel state & gesture handling
  const [activeBannerIndex, setActiveBannerIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef(null);
  const touchDeltaX = useRef(0);
  const isDragging = useRef(false);

  // Dynamic Loyalty Points & Card state
  const [loyaltyPts, setLoyaltyPts] = useState(950);
  const [loyaltyCardDisplay, setLoyaltyCardDisplay] = useState('•••• 6789');

  useEffect(() => {
    const fetchLoyaltyData = async () => {
      try {
        const details = await apiService.getLoyaltyCardDetails();
        if (details.currentPoints !== undefined) setLoyaltyPts(details.currentPoints);
        if (details.cardNumber) {
          const clean = details.cardNumber.replace(/\s+/g, '');
          setLoyaltyCardDisplay(`•••• ${clean.slice(-4)}`);
        }
      } catch (err) {
        console.error('Error loading loyalty details on Home:', err);
      }
    };
    fetchLoyaltyData();
  }, []);

  const nextBanner = () => {
    setActiveBannerIndex((prev) => (prev + 1) % PROMOTIONAL_BANNERS.length);
  };

  const prevBanner = () => {
    setActiveBannerIndex((prev) => (prev - 1 + PROMOTIONAL_BANNERS.length) % PROMOTIONAL_BANNERS.length);
  };

  // Auto slide when not paused or interacted
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(nextBanner, 4500);
    return () => clearInterval(interval);
  }, [isPaused, activeBannerIndex]);

  // Touch Swipe for Mobile
  const handleTouchStart = (e) => {
    setIsPaused(true);
    touchStartX.current = e.touches[0].clientX;
    touchDeltaX.current = 0;
  };

  const handleTouchMove = (e) => {
    if (touchStartX.current === null) return;
    touchDeltaX.current = e.touches[0].clientX - touchStartX.current;
  };

  const handleTouchEnd = () => {
    if (Math.abs(touchDeltaX.current) > 40) {
      if (touchDeltaX.current < 0) {
        nextBanner();
      } else {
        prevBanner();
      }
    }
    touchStartX.current = null;
    touchDeltaX.current = 0;
    setTimeout(() => setIsPaused(false), 2500);
  };

  // Mouse Drag for Desktop
  const handleMouseDown = (e) => {
    setIsPaused(true);
    isDragging.current = true;
    touchStartX.current = e.clientX;
    touchDeltaX.current = 0;
  };

  const handleMouseMove = (e) => {
    if (!isDragging.current || touchStartX.current === null) return;
    touchDeltaX.current = e.clientX - touchStartX.current;
  };

  const handleMouseUp = () => {
    if (isDragging.current) {
      if (Math.abs(touchDeltaX.current) > 50) {
        if (touchDeltaX.current < 0) {
          nextBanner();
        } else {
          prevBanner();
        }
      }
      isDragging.current = false;
      touchStartX.current = null;
      touchDeltaX.current = 0;
      setTimeout(() => setIsPaused(false), 2500);
    }
  };

  // Countdown timer for Today's Deals
  const [timeLeft, setTimeLeft] = useState({ hours: 14, minutes: 22, seconds: 45 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 24, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const PRODUCTS = getSyncProducts();
  const CATEGORIES = getSyncCategories();

  const todayDeals = PRODUCTS.filter((p) => p.isDeal);
  const recommendedProducts = PRODUCTS.slice(1, 4);

  return (
    <div className="space-y-6 pb-24 md:pb-12 max-w-7xl mx-auto px-4 sm:px-6 pt-3">
      {/* ---------------- A. REWARD JOURNEY PROGRESS CARD AT TOP ---------------- */}
      <div className="relative overflow-hidden rounded-[24px] bg-gradient-to-br from-[#FFF4ED] to-[#FDE8DF] p-4 sm:p-5 shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-[#FFFaf5]">
        {/* Background decorative elements */}
        <div className="absolute top-0 right-0 w-[180px] sm:w-[280px] h-full overflow-visible pointer-events-none">
            <img 
              src="/reward-gift.jpg" 
              alt="Special Gift Background" 
              className="absolute -top-6 -right-6 w-full h-[120%] object-cover mix-blend-multiply opacity-95"
              style={{ maskImage: 'radial-gradient(circle, rgba(0,0,0,1) 40%, rgba(0,0,0,0) 70%)', WebkitMaskImage: 'radial-gradient(circle, rgba(0,0,0,1) 40%, rgba(0,0,0,0) 70%)' }}
            />
        </div>
        
        <div className="relative z-10 flex flex-col items-start">
          <div className="w-full md:w-3/5">
            <h2 className="text-[24px] sm:text-[30px] font-extrabold text-[#0B1527] leading-[1.1] tracking-tight">
              Shop More &<br/>
              <span className="text-[#C11020]">Unlock Your Gift!</span>
            </h2>
            <p className="mt-1.5 text-[#64748B] font-medium text-[13px] sm:text-[14px] leading-snug">
              Complete ₹{rewardJourney.targetSpend?.toLocaleString('en-IN')} shopping<br/>
              to get a special gift from us.
            </p>
          </div>
        </div>

        {/* Progress Section Container */}
        <div className="relative z-20 mt-4 bg-white/65 backdrop-blur-md rounded-[20px] p-4 shadow-[inset_0_0_0_2px_rgba(255,255,255,0.6),_0_8px_30px_rgba(0,0,0,0.04)] border border-white/50">
          
          {/* Top Numbers */}
          <div className="flex items-baseline gap-2 px-1">
            <span className="text-[28px] sm:text-[36px] font-extrabold text-[#C11020] tracking-tighter">
              ₹{rewardJourney.currentSpend?.toLocaleString('en-IN')}
            </span>
            <span className="text-[17px] sm:text-[20px] font-bold text-[#64748B]">
              / ₹{rewardJourney.targetSpend?.toLocaleString('en-IN')}
            </span>
          </div>

          {/* Tooltips & Bar Area */}
          <div className="relative w-full mt-3">
            {/* Tooltips */}
            <div className="relative h-10 mb-1.5 w-[calc(100%-48px)]">
              {/* Current Spend Tooltip */}
              <div 
                className="absolute top-0 transform -translate-x-1/2 bg-white px-3 py-1 rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.12)] border border-[#FDEEEA] flex flex-col items-center min-w-max z-30"
                style={{ left: `clamp(3.5rem, ${rewardJourney.percentage}%, calc(100% - 3.5rem))` }}
              >
                <span className="text-[#AF1024] font-extrabold text-[13px]">₹{rewardJourney.currentSpend?.toLocaleString('en-IN')}</span>
                <span className="text-[#64748B] text-[10px] font-medium">Spent so far</span>
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-white border-b border-r border-[#FDEEEA] transform rotate-45 rounded-sm"></div>
              </div>

              {/* Remaining Tooltip */}
              {!rewardJourney.isUnlocked && (
                <div className="absolute top-0 transform -translate-x-1/2 bg-white px-3 py-1 rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.12)] border border-[#FDEEEA] flex items-center gap-1.5 min-w-max z-20"
                  style={{ left: `clamp(50%, 85%, calc(100% - 5rem))` }}
                >
                  <Gift className="w-4 h-4 text-[#AF1024]" />
                  <div className="flex flex-col">
                    <span className="text-[#AF1024] font-extrabold text-[12px] leading-tight">₹{rewardJourney.remainingAmount?.toLocaleString('en-IN')} more</span>
                    <span className="text-[#64748B] text-[9px] font-medium leading-tight">to unlock your gift!</span>
                  </div>
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-white border-b border-r border-[#FDEEEA] transform rotate-45 rounded-sm"></div>
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-3 w-full">
              {/* The Bar */}
              <div className="relative flex-1 h-[12px] sm:h-[14px] bg-[#E1E7F1] rounded-full shadow-[inset_0_2px_4px_rgba(0,0,0,0.06)]">
                <div 
                  className="absolute top-0 left-0 h-full rounded-full transition-all duration-700 ease-out"
                  style={{ 
                    width: `${rewardJourney.percentage}%`,
                    background: 'repeating-linear-gradient(-45deg, #FF1B2D, #FF1B2D 8px, #E51020 8px, #E51020 16px)',
                    boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.3), 0 0 8px rgba(229,25,38,0.5)'
                  }}
                />
                {/* Handle */}
                <div 
                  className="absolute top-1/2 -translate-y-1/2 -ml-3 w-6 h-6 bg-[#FF1B2D] border-[4px] border-white rounded-full shadow-[0_0_10px_rgba(255,27,45,0.6)] transition-all duration-700 ease-out z-30"
                  style={{ left: `${rewardJourney.percentage}%` }}
                />
              </div>
              <span className="text-[13px] sm:text-[15px] font-bold text-[#0B1527] w-9 text-right shrink-0">
                {rewardJourney.percentage}%
              </span>
            </div>
          </div>

          {/* Action Area */}
          <div className="mt-5 flex flex-col gap-3">
            {rewardJourney.isUnlocked ? (
              <div className="bg-[#EDF7F0] rounded-[16px] px-4 py-3.5 flex items-center gap-3 border border-[#D5EEDB]">
                <div className="w-7 h-7 rounded-full bg-[#2BB159] flex items-center justify-center flex-shrink-0 text-white">
                  <Check className="w-4 h-4 stroke-[3]" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[#1A8237] font-bold text-[14px] tracking-tight leading-tight">Target Achieved!</span>
                  <span className="text-[#64748B] text-[13px] font-medium leading-tight mt-0.5">Your special gift is unlocked 🎁</span>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3 px-1 mb-1">
                <div className="w-10 h-10 rounded-full bg-[#FFEBEC] flex items-center justify-center flex-shrink-0 shadow-sm border border-[#FFD5D8]">
                  <ShoppingCart className="w-5 h-5 text-[#AF1024]" fill="currentColor" />
                </div>
                <div>
                  <p className="text-[#0B1527] font-semibold text-[13px] sm:text-[14px] tracking-tight leading-snug">
                    Shop <span className="text-[#AF1024]">₹{rewardJourney.remainingAmount?.toLocaleString('en-IN')}</span> more<br/>
                    <span className="text-[#64748B] font-medium text-[11px] sm:text-[12px]">to unlock your special gift!</span>
                  </p>
                </div>
              </div>
            )}
            
            <button 
              onClick={() => {
                if (rewardJourney.isUnlocked) {
                  navigateTo('reward_unlocked');
                } else {
                  toggleRewardTargetSimulation();
                }
              }}
              className="w-full px-5 py-3 sm:py-3.5 bg-gradient-to-r from-[#FF3B4A] to-[#E51020] text-white font-bold rounded-[14px] text-[14px] sm:text-[15px] hover:shadow-[0_8px_20px_rgba(229,16,32,0.3)] transition-all flex items-center justify-center gap-2"
            >
              {rewardJourney.isUnlocked ? (
                <>
                  <Sparkles className="w-5 h-5 fill-white" />
                  Claim Reward – Spin the Wheel Now
                  <ArrowRight className="w-4 h-4 ml-1" />
                </>
              ) : (
                <>
                  Keep Shopping
                  <ChevronRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* ---------------- B. PROMOTIONAL HERO BANNER CAROUSEL (TOUCH / DRAG SLIDABLE) ---------------- */}
      <div
        className="relative rounded-3xl overflow-hidden shadow-xl border border-gray-100 group select-none"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => {
          setIsPaused(false);
          handleMouseUp();
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        {/* Horizontal Sliding Track with smooth CSS transform */}
        <div
          className="flex w-full transition-transform duration-500 ease-[cubic-bezier(0.25,1,0.5,1)]"
          style={{ transform: `translateX(-${activeBannerIndex * 100}%)` }}
        >
          {PROMOTIONAL_BANNERS.map((banner) => (
            <div
              key={banner.id}
              className={`w-full min-w-full flex-shrink-0 relative p-6 sm:p-8 md:p-10 bg-gradient-to-r ${banner.bgGradient} text-white min-h-[200px] sm:min-h-[240px] flex items-center justify-between overflow-hidden`}
            >
              <div className="max-w-md z-10 space-y-2.5 sm:space-y-3">
                <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-[11px] font-extrabold tracking-wide uppercase border border-white/20">
                  {banner.badge}
                </span>
                <h3 className="text-xl sm:text-3xl md:text-4xl font-black tracking-tight leading-tight">
                  {banner.title}
                </h3>
                <p className="text-xs sm:text-sm text-white/85 font-medium leading-relaxed">
                  {banner.subtitle}
                </p>
                <button
                  onClick={() => {
                    if (banner.targetModal === 'emi') {
                      openEmiCalculator();
                    } else if (banner.targetCategory) {
                      navigateTo('category_products', { category: banner.targetCategory });
                    } else {
                      navigateTo('categories');
                    }
                  }}
                  className="mt-2 px-5 py-2.5 bg-white text-gray-950 hover:bg-gray-100 active:scale-95 rounded-xl font-bold text-xs sm:text-sm transition shadow-md flex items-center gap-2 cursor-pointer"
                >
                  <span>{banner.cta}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Banner Product Showcase Image */}
              <div className="hidden sm:block w-48 h-48 md:w-56 md:h-56 lg:w-64 lg:h-64 relative z-10 flex-shrink-0">
                <img
                  src={banner.image}
                  alt="Promo showcase"
                  className="w-full h-full object-contain filter drop-shadow-2xl transform group-hover:scale-105 transition-transform duration-300 pointer-events-none"
                />
              </div>

              {/* Background Ambient Glow */}
              <div className="absolute right-0 top-0 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none" />
            </div>
          ))}
        </div>

        {/* Floating Slide Navigation Arrows (Hover on Desktop, accessible on Mobile) */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            prevBanner();
          }}
          className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-black/40 hover:bg-black/70 backdrop-blur-md text-white border border-white/20 flex items-center justify-center transition-all opacity-80 sm:opacity-0 group-hover:opacity-100 shadow-lg z-20 cursor-pointer active:scale-90"
          title="Previous Banner"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            nextBanner();
          }}
          className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-black/40 hover:bg-black/70 backdrop-blur-md text-white border border-white/20 flex items-center justify-center transition-all opacity-80 sm:opacity-0 group-hover:opacity-100 shadow-lg z-20 cursor-pointer active:scale-90"
          title="Next Banner"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Carousel Indicator Dots */}
        <div className="absolute bottom-3.5 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-20">
          {PROMOTIONAL_BANNERS.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setActiveBannerIndex(idx)}
              className={`h-1.5 rounded-full transition-all cursor-pointer ${
                activeBannerIndex === idx ? 'w-7 bg-white shadow-sm' : 'w-2 bg-white/40 hover:bg-white/70'
              }`}
              title={`Slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>

      {/* ---------------- C. CATEGORIES HORIZONTAL QUICK ACCESS ---------------- */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-base sm:text-lg font-black text-gray-900 tracking-tight">
            Categories
          </h3>
          <button
            onClick={() => navigateTo('categories')}
            className="text-xs font-bold text-brand-red hover:underline flex items-center gap-0.5"
          >
            <span>See All</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Horizontal Scroll Categories */}
        <div className="flex items-center gap-3 overflow-x-auto no-scrollbar pb-2 pt-1 -mx-4 px-4 sm:mx-0 sm:px-0">
          {CATEGORIES.map((cat) => (
            <div
              key={cat.id}
              onClick={() => navigateTo('category_products', { category: cat.id })}
              className="flex flex-col items-center flex-shrink-0 cursor-pointer group w-20 sm:w-24 text-center select-none"
            >
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white border border-gray-200/90 shadow-xs flex items-center justify-center p-2 transition-all duration-200 group-hover:border-brand-red group-hover:shadow-md group-hover:-translate-y-0.5">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-contain mix-blend-multiply"
                />
              </div>
              <span className="text-[11px] sm:text-xs font-semibold text-gray-800 mt-2 truncate w-full group-hover:text-brand-red transition">
                {cat.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ---------------- D. TODAY'S DEALS ---------------- */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-gray-100 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-xl bg-red-100 text-brand-red">
              <Flame className="w-4 h-4 fill-brand-red" />
            </span>
            <div>
              <h3 className="text-base sm:text-lg font-black text-gray-900 tracking-tight leading-tight">
                Today's Deals
              </h3>
              <p className="text-[11px] text-gray-500 font-medium">Limited time showroom festive discount</p>
            </div>
          </div>

          {/* Countdown Clock */}
          <div className="flex items-center gap-1 bg-red-50 text-brand-red border border-red-200 px-2.5 py-1 rounded-xl text-xs font-mono font-bold">
            <Clock className="w-3.5 h-3.5" />
            <span>
              {String(timeLeft.hours).padStart(2, '0')}:{String(timeLeft.minutes).padStart(2, '0')}:
              {String(timeLeft.seconds).padStart(2, '0')}
            </span>
          </div>
        </div>

        {/* Deals Grid / List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {todayDeals.map((prod) => {
            const isWish = wishlistIds.includes(prod.id);
            return (
              <div
                key={prod.id}
                className="group relative bg-[#FAFAFA] hover:bg-white rounded-2xl p-4 border border-gray-200/80 hover:border-red-200 hover:shadow-lg transition-all flex flex-col justify-between"
              >
                {/* Discount Badge & Wishlist */}
                <div className="flex justify-between items-center mb-2">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-red-600 text-white tracking-wide">
                    {prod.discountPercent}% OFF
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleWishlist(prod.id);
                    }}
                    className="p-1.5 rounded-full bg-white text-gray-400 hover:text-brand-red shadow-xs transition"
                  >
                    <Heart className={`w-4 h-4 ${isWish ? 'text-brand-red fill-brand-red' : ''}`} />
                  </button>
                </div>

                {/* Product Image */}
                <div
                  onClick={() => navigateTo('product_detail', { productId: prod.id })}
                  className="w-full h-36 flex items-center justify-center cursor-pointer p-2"
                >
                  <img
                    src={prod.images?.[0] || prod.image || 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80'}
                    alt={prod.name}
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                  />
                </div>

                {/* Product Info */}
                <div className="mt-3">
                  <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-1">
                    <span className="flex items-center text-amber-500 font-bold">
                      <Star className="w-3 h-3 fill-amber-400 mr-0.5" />
                      {prod.rating}
                    </span>
                    <span>•</span>
                    <span className="text-emerald-600 font-semibold">In Stock</span>
                  </div>

                  <h4
                    onClick={() => navigateTo('product_detail', { productId: prod.id })}
                    className="font-bold text-gray-900 text-xs sm:text-sm line-clamp-2 cursor-pointer hover:text-brand-red transition"
                  >
                    {prod.name}
                  </h4>

                  <div className="flex items-baseline gap-2 mt-2">
                    <span className="text-base sm:text-lg font-black text-gray-900">
                      ₹{prod.price?.toLocaleString('en-IN')}
                    </span>
                    <span className="text-xs text-gray-400 line-through">
                      ₹{prod.originalPrice?.toLocaleString('en-IN')}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    <button
                      onClick={() => openEmiCalculator(prod)}
                      className="py-2 text-[11px] font-bold text-gray-700 bg-white hover:bg-gray-100 rounded-xl border border-gray-200 transition"
                    >
                      EMI @ ₹{prod.emiStartingAt}/mo
                    </button>
                    <button
                      onClick={() => navigateTo('product_detail', { productId: prod.id })}
                      className="py-2 text-[11px] font-bold text-white bg-brand-red hover:bg-red-700 rounded-xl transition shadow-xs"
                    >
                      View Offer
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ---------------- F. VIP / NEW AJEET VISION CLUB BANNER ---------------- */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1C1917] via-[#2A2421] to-[#121212] text-white p-6 border border-amber-500/40 shadow-xl">
        {/* Glow */}
        <div className="absolute top-0 right-0 w-60 h-60 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-300 text-black flex items-center justify-center flex-shrink-0 shadow-md shadow-amber-500/20">
              <Crown className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase tracking-wider text-amber-400">
                  Exclusive Privilege
                </span>
                <span className="text-[10px] bg-amber-400/20 text-amber-300 px-2 py-0.5 rounded-full font-bold">
                  ₹499 / Year
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-black text-white tracking-tight mt-0.5">
                Join NEW AJEET VISION CLUB
              </h3>
              <p className="text-xs text-gray-300 mt-1 max-w-lg leading-relaxed">
                Enjoy special member pricing, priority free delivery, ₹1,500 birthday gifts, and closed-door festival showroom sales.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-shrink-0">
            <button
              onClick={() => navigateTo('vip_club')}
              className="py-2.5 px-4 bg-white/10 hover:bg-white/15 text-gray-200 text-xs font-bold rounded-xl transition"
            >
              View Benefits
            </button>
            <button
              onClick={() => setIsJoinVipModalOpen(true)}
              className="py-2.5 px-5 bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-gray-950 text-xs font-black rounded-xl transition shadow-lg shadow-amber-500/20 flex items-center gap-1.5"
            >
              <Crown className="w-4 h-4" />
              <span>Join Now</span>
            </button>
          </div>
        </div>
      </div>

      {/* ---------------- G. LOYALTY POINTS CARD ---------------- */}
      <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-red-50 text-brand-red flex items-center justify-center flex-shrink-0">
            <CreditCard className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-gray-500">Showroom Loyalty Card</span>
              <span className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-mono">
                {loyaltyCardDisplay}
              </span>
            </div>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-xl sm:text-2xl font-black text-gray-900">{loyaltyPts} Points</span>
              <span className="text-xs font-semibold text-emerald-600">(₹{loyaltyPts.toLocaleString('en-IN')} Store Value)</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => navigateTo('loyalty_card')}
            className="flex-1 sm:flex-initial py-2.5 px-4 border border-gray-200 hover:bg-gray-50 text-gray-800 text-xs font-bold rounded-xl transition text-center"
          >
            View Loyalty Card
          </button>
          <button
            onClick={() => navigateTo('loyalty_card')}
            className="flex-1 sm:flex-initial py-2.5 px-4 bg-brand-red hover:bg-red-700 text-white text-xs font-bold rounded-xl transition text-center shadow-xs"
          >
            Redeem Points
          </button>
        </div>
      </div>

      {/* ---------------- E. PERSONALIZED RECOMMENDATIONS ---------------- */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-base sm:text-lg font-black text-gray-900 tracking-tight">
              Recommended For You
            </h3>
            <p className="text-xs text-gray-500">Based on your recent electronics purchases</p>
          </div>
          <button
            onClick={() => navigateTo('categories')}
            className="text-xs font-bold text-brand-red hover:underline"
          >
            View More
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {recommendedProducts.map((prod) => (
            <div
              key={prod.id}
              onClick={() => navigateTo('product_detail', { productId: prod.id })}
              className="bg-white rounded-2xl p-4 border border-gray-100 hover:border-gray-200 hover:shadow-md transition cursor-pointer flex flex-col justify-between"
            >
              <div className="w-full h-32 flex items-center justify-center p-2">
                <img
                  src={prod.images?.[0] || prod.image || 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80'}
                  alt={prod.name}
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="mt-2">
                <span className="text-[10px] font-bold text-brand-red uppercase tracking-wider">
                  {prod.brand}
                </span>
                <h4 className="font-bold text-gray-900 text-xs line-clamp-1 mt-0.5">
                  {prod.name}
                </h4>
                <div className="flex items-baseline justify-between mt-2">
                  <span className="text-sm font-black text-gray-900">
                    ₹{prod.price?.toLocaleString('en-IN')}
                  </span>
                  <span className="text-[11px] font-bold text-emerald-600">
                    {prod.discountPercent}% OFF
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
