import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ArrowLeft,
  Heart,
  Trash2,
  TrendingDown,
  MessageCircle,
  Eye,
  Star,
} from 'lucide-react';
import { apiService } from '../../services/api';
import { SHOWROOM_INFO } from '../../data/mockData';

export const WishlistScreen = () => {
  const { goBack, navigateTo, toggleWishlist, wishlistIds, showToast } = useApp();
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      const items = await apiService.getWishlist();
      setWishlistItems(items);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, [wishlistIds]);

  const handleRemove = async (id) => {
    await toggleWishlist(id);
    setWishlistItems((prev) => prev.filter((p) => p.id !== id));
  };

  const handleEnquire = (product) => {
    const text = encodeURIComponent(
      `Namaste New Ajeet Vision! I am inquiring about "${product.name}" (Price: ₹${product.price?.toLocaleString('en-IN')}). Is it in stock?`
    );
    window.open(`https://wa.me/${SHOWROOM_INFO.whatsapp.replace(/\D/g, '')}?text=${text}`, '_blank');
  };

  return (
    <div className="space-y-4 pb-24 md:pb-12 max-w-4xl mx-auto px-4 sm:px-6 pt-3">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={goBack}
            className="p-2 -ml-2 rounded-full text-gray-700 hover:bg-gray-100 transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
              My Wishlist
            </h2>
            <p className="text-xs text-gray-500">{wishlistItems.length} saved electronics</p>
          </div>
        </div>
      </div>

      {/* Wishlist Items List */}
      <div className="space-y-3">
        {wishlistItems.map((prod) => (
          <div
            key={prod.id}
            className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-200/80 hover:border-red-200 hover:shadow-md transition flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
          >
            <div className="flex items-center gap-3.5">
              <div
                onClick={() => navigateTo('product_detail', { productId: prod.id })}
                className="w-20 h-20 sm:w-24 sm:h-24 bg-gray-50 rounded-xl p-2 flex items-center justify-center flex-shrink-0 cursor-pointer"
              >
                <img
                  src={prod.images[0]}
                  alt={prod.name}
                  className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                />
              </div>

              <div>
                {/* Price Drop Alert badge if price dropped */}
                {prod.priceDropped && (
                  <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-black mb-1">
                    <TrendingDown className="w-3 h-3" />
                    <span>PRICE DROPPED BY ₹{prod.priceDropAmount?.toLocaleString('en-IN')}!</span>
                  </div>
                )}

                <h3
                  onClick={() => navigateTo('product_detail', { productId: prod.id })}
                  className="font-bold text-gray-900 text-xs sm:text-sm line-clamp-2 cursor-pointer hover:text-brand-red transition"
                >
                  {prod.name}
                </h3>

                <div className="flex items-center gap-2 mt-1">
                  <span className="flex items-center text-amber-500 font-bold text-[11px]">
                    <Star className="w-3 h-3 fill-amber-400 mr-0.5" />
                    {prod.rating}
                  </span>
                  <span className="text-gray-300">•</span>
                  <span className="text-[11px] font-semibold text-emerald-600">Available at Showroom</span>
                </div>

                <div className="flex items-baseline gap-2 mt-1.5">
                  <span className="text-sm sm:text-base font-black text-gray-900">
                    ₹{prod.price?.toLocaleString('en-IN')}
                  </span>
                  <span className="text-xs text-gray-400 line-through">
                    ₹{prod.originalPrice?.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 self-end sm:self-center">
              <button
                onClick={() => handleRemove(prod.id)}
                className="p-2 text-gray-400 hover:text-rose-600 rounded-xl border border-gray-200 hover:bg-rose-50 transition"
                title="Remove from wishlist"
              >
                <Trash2 className="w-4 h-4" />
              </button>

              <button
                onClick={() => handleEnquire(prod)}
                className="py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
              >
                <MessageCircle className="w-3.5 h-3.5 fill-white" />
                <span>Enquire</span>
              </button>

              <button
                onClick={() => navigateTo('product_detail', { productId: prod.id })}
                className="py-2 px-4 bg-brand-red hover:bg-red-700 text-white rounded-xl text-xs font-bold transition shadow-xs"
              >
                View Product
              </button>
            </div>
          </div>
        ))}

        {!loading && wishlistItems.length === 0 && (
          <div className="p-12 text-center bg-white rounded-3xl border border-gray-100 space-y-3">
            <Heart className="w-12 h-12 text-gray-300 mx-auto" />
            <h3 className="font-bold text-gray-700 text-base">Your Wishlist is Empty</h3>
            <p className="text-xs text-gray-500 max-w-xs mx-auto">
              Save TVs, Mobiles & Appliances to monitor special festive price drops.
            </p>
            <button
              onClick={() => navigateTo('categories')}
              className="mt-2 py-2 px-6 bg-brand-red text-white text-xs font-bold rounded-xl hover:bg-red-700 transition"
            >
              Explore Products
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
