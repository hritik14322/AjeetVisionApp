import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { ArrowLeft, Clock, Flame, Heart, Star, Tag } from 'lucide-react';
import { getSyncProducts } from '../../services/api';

export const DailyDealsScreen = () => {
  const { goBack, navigateTo, wishlistIds, toggleWishlist, openEmiCalculator } = useApp();

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
  const dealProducts = PRODUCTS.filter((p) => p.isDeal);

  return (
    <div className="space-y-5 pb-24 md:pb-12 max-w-6xl mx-auto px-4 sm:px-6 pt-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={goBack}
            className="p-2 -ml-2 rounded-full text-gray-700 hover:bg-gray-100 transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <Flame className="w-5 h-5 text-brand-red fill-brand-red" />
              <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
                Today's Flash Deals
              </h2>
            </div>
            <p className="text-xs text-gray-500">Showroom limited-time festive promotions</p>
          </div>
        </div>

        {/* Live Countdown */}
        <div className="flex items-center gap-1.5 bg-red-600 text-white px-3 py-1.5 rounded-xl text-xs font-mono font-bold shadow-md shadow-red-600/20">
          <Clock className="w-4 h-4" />
          <span>
            {String(timeLeft.hours).padStart(2, '0')}:{String(timeLeft.minutes).padStart(2, '0')}:
            {String(timeLeft.seconds).padStart(2, '0')}
          </span>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {dealProducts.map((prod) => {
          const isWish = wishlistIds.includes(prod.id);
          return (
            <div
              key={prod.id}
              className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-200 hover:border-red-300 hover:shadow-lg transition-all flex flex-col justify-between group"
            >
              <div className="flex justify-between items-center mb-2">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black bg-brand-red text-white uppercase tracking-wider">
                  {prod.discountPercent}% OFF
                </span>
                <button
                  onClick={() => toggleWishlist(prod.id)}
                  className="p-1.5 rounded-full bg-gray-50 text-gray-400 hover:text-brand-red transition"
                >
                  <Heart className={`w-4 h-4 ${isWish ? 'text-brand-red fill-brand-red' : ''}`} />
                </button>
              </div>

              <div
                onClick={() => navigateTo('product_detail', { productId: prod.id })}
                className="w-full h-40 flex items-center justify-center cursor-pointer p-2"
              >
                <img
                  src={prod.images?.[0] || prod.image || 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80'}
                  alt={prod.name}
                  className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                />
              </div>

              <div className="mt-3">
                <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
                  <span className="flex items-center text-amber-500 font-bold">
                    <Star className="w-3.5 h-3.5 fill-amber-400 mr-0.5" />
                    {prod.rating}
                  </span>
                  <span>•</span>
                  <span className="text-emerald-600 font-semibold">Ready for Delivery</span>
                </div>

                <h3
                  onClick={() => navigateTo('product_detail', { productId: prod.id })}
                  className="font-bold text-gray-900 text-sm line-clamp-2 cursor-pointer hover:text-brand-red transition"
                >
                  {prod.name}
                </h3>

                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-lg font-black text-gray-900">
                    ₹{prod.price?.toLocaleString('en-IN')}
                  </span>
                  <span className="text-xs text-gray-400 line-through">
                    ₹{prod.originalPrice?.toLocaleString('en-IN')}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 mt-3 pt-2 border-t border-gray-100">
                  <button
                    onClick={() => openEmiCalculator(prod)}
                    className="py-2 text-[11px] font-bold text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-xl border border-gray-200 transition"
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
  );
};
