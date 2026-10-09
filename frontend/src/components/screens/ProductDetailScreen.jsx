import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ArrowLeft,
  Heart,
  Share2,
  Star,
  CheckCircle2,
  Calculator,
  MessageCircle,
  Truck,
  ShieldCheck,
  RotateCcw,
  Tag,
  ChevronRight,
} from 'lucide-react';
import { SHOWROOM_INFO } from '../../data/mockData';
import { getSyncProducts } from '../../services/api';

export const ProductDetailScreen = () => {
  const {
    selectedProductId,
    goBack,
    navigateTo,
    wishlistIds,
    toggleWishlist,
    openEmiCalculator,
    showToast,
  } = useApp();

  const PRODUCTS = getSyncProducts();
  const product = PRODUCTS.find((p) => p.id === selectedProductId) || PRODUCTS[0];
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const isWish = wishlistIds.includes(product.id);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${product.name} at New Ajeet Vision`,
          text: `Check out ${product.name} at New Ajeet Vision for ₹${product.price?.toLocaleString('en-IN')}`,
          url: window.location.href,
        });
      } catch (err) {}
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToast('Product link copied to clipboard!', 'info');
    }
  };

  const handleWhatsAppEnquiry = () => {
    const text = encodeURIComponent(
      `Namaste New Ajeet Vision! I am interested in: "${product.name}" (Model: ${product.model || 'N/A'}, Price: ₹${product.price?.toLocaleString('en-IN')}). Is it currently available at the Obra showroom?`
    );
    window.open(`https://wa.me/${SHOWROOM_INFO.whatsapp.replace(/\D/g, '')}?text=${text}`, '_blank');
  };

  const relatedProducts = PRODUCTS.filter(
    (p) => p.category === product.category && p.id !== product.id
  );

  return (
    <div className="space-y-6 pb-28 md:pb-16 max-w-5xl mx-auto px-4 sm:px-6 pt-3">
      {/* Top Bar matching reference */}
      <div className="flex items-center justify-between">
        <button
          onClick={goBack}
          className="p-2 -ml-2 rounded-full text-gray-700 hover:bg-gray-100 transition"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => toggleWishlist(product.id)}
            className="p-2 rounded-full hover:bg-gray-100 text-gray-600 hover:text-brand-red transition"
          >
            <Heart className={`w-5 h-5 ${isWish ? 'text-brand-red fill-brand-red' : ''}`} />
          </button>
          <button
            onClick={handleShare}
            className="p-2 rounded-full hover:bg-gray-100 text-gray-600 transition"
          >
            <Share2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Image Gallery */}
      <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xs flex flex-col items-center">
        <div className="w-full h-64 sm:h-80 flex items-center justify-center p-2">
          <img
            src={product.images?.[activeImageIndex] || product.images?.[0] || product.image || 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80'}
            alt={product.name}
            className="max-h-full max-w-full object-contain transition-all duration-300"
          />
        </div>

        {/* Thumbnails */}
        {product.images.length > 1 && (
          <div className="flex items-center gap-3 mt-4">
            {product.images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImageIndex(idx)}
                className={`w-14 h-14 rounded-xl border-2 p-1 bg-gray-50 overflow-hidden transition ${
                  activeImageIndex === idx
                    ? 'border-brand-red shadow-xs'
                    : 'border-transparent opacity-60 hover:opacity-100'
                }`}
              >
                <img src={img} alt="thumb" className="w-full h-full object-contain" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Product Title & Pricing */}
      <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xs space-y-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-black uppercase tracking-wider text-brand-red">
              {product.brand}
            </span>
            <span className="text-gray-300">•</span>
            <span className="text-xs text-gray-400 font-mono">{product.model}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight leading-snug">
            {product.name}
          </h1>

          <div className="flex items-center gap-2 mt-2">
            <span className="flex items-center text-amber-500 font-bold text-xs bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-200">
              <Star className="w-3.5 h-3.5 fill-amber-400 mr-1" />
              {product.rating} ({product.reviewsCount} reviews)
            </span>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-lg border border-emerald-200">
              In Stock at Obra Showroom
            </span>
          </div>
        </div>

        {/* Pricing Line */}
        <div className="flex items-baseline gap-3 pt-2 border-t border-gray-100">
          <span className="text-2xl sm:text-3xl font-black text-brand-red">
            ₹{product.price?.toLocaleString('en-IN')}
          </span>
          <span className="text-sm sm:text-base text-gray-400 line-through">
            MRP ₹{product.originalPrice?.toLocaleString('en-IN')}
          </span>
          <span className="text-xs font-bold text-white bg-brand-red px-2 py-0.5 rounded-lg">
            {product.discountPercent}% OFF
          </span>
        </div>

        <p className="text-xs text-gray-600 leading-relaxed">
          {product.description}
        </p>

        {/* Trust Points */}
        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-gray-100 text-center">
          <div className="p-2 bg-gray-50 rounded-xl">
            <Truck className="w-4 h-4 text-brand-red mx-auto mb-1" />
            <span className="text-[11px] font-semibold text-gray-700 block">Fast Showroom Delivery</span>
          </div>
          <div className="p-2 bg-gray-50 rounded-xl">
            <ShieldCheck className="w-4 h-4 text-emerald-600 mx-auto mb-1" />
            <span className="text-[11px] font-semibold text-gray-700 block">100% Brand Warranty</span>
          </div>
          <div className="p-2 bg-gray-50 rounded-xl">
            <RotateCcw className="w-4 h-4 text-amber-500 mx-auto mb-1" />
            <span className="text-[11px] font-semibold text-gray-700 block">Installation Support</span>
          </div>
        </div>
      </div>

      {/* Easy EMI Available Section matching reference */}
      <div className="bg-red-50/70 border border-red-200 rounded-3xl p-5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-brand-red text-white flex items-center justify-center flex-shrink-0 shadow-sm">
            <Calculator className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 text-sm">Easy EMI Available</h3>
            <p className="text-xs text-gray-600">
              Starting from <strong className="text-brand-red font-black">₹{product.emiStartingAt?.toLocaleString('en-IN')}/month</strong>
            </p>
          </div>
        </div>

        <button
          onClick={() => openEmiCalculator(product)}
          className="px-4 py-2 bg-white hover:bg-gray-50 text-brand-red border border-red-200 rounded-xl text-xs font-bold transition shadow-xs flex-shrink-0"
        >
          Calculate EMI
        </button>
      </div>

      {/* Key Features matching reference */}
      <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xs space-y-3">
        <h3 className="text-base font-black text-gray-900 tracking-tight">Key Features</h3>
        <ul className="space-y-2.5">
          {product.features?.map((feature, idx) => (
            <li key={idx} className="flex items-start gap-2.5 text-xs text-gray-700">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
              <span className="font-medium leading-relaxed">{feature}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Product Specifications Table */}
      {product.specifications && (
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xs space-y-3">
          <h3 className="text-base font-black text-gray-900 tracking-tight">Product Specifications</h3>
          <div className="divide-y divide-gray-100 text-xs">
            {Object.entries(product.specifications).map(([key, val]) => (
              <div key={key} className="py-2.5 flex justify-between gap-4">
                <span className="font-medium text-gray-500">{key}</span>
                <span className="font-bold text-gray-900 text-right">{val}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div>
          <h3 className="text-base font-black text-gray-900 tracking-tight mb-3">
            Similar Products You Might Like
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {relatedProducts.map((rel) => (
              <div
                key={rel.id}
                onClick={() => navigateTo('product_detail', { productId: rel.id })}
                className="bg-white rounded-2xl p-3 border border-gray-100 hover:border-red-200 transition cursor-pointer"
              >
                <div className="w-full h-24 flex items-center justify-center p-1">
                  <img src={rel.images?.[0] || rel.image || 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80'} alt={rel.name} className="w-full h-full object-contain" />
                </div>
                <h4 className="font-bold text-gray-900 text-xs truncate mt-2">{rel.name}</h4>
                <p className="text-xs font-black text-brand-red mt-1">₹{rel.price?.toLocaleString('en-IN')}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Floating Bottom Bar matching reference */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-gray-200 p-3 sm:p-4 shadow-xl">
        <div className="max-w-5xl mx-auto flex items-center gap-3">
          <button
            onClick={() => toggleWishlist(product.id)}
            className={`flex-1 py-3 px-4 rounded-xl border text-xs font-bold transition flex items-center justify-center gap-2 ${
              isWish
                ? 'bg-red-50 text-brand-red border-red-200'
                : 'bg-gray-50 text-gray-800 border-gray-200 hover:bg-gray-100'
            }`}
          >
            <Heart className={`w-4 h-4 ${isWish ? 'fill-brand-red text-brand-red' : ''}`} />
            <span>{isWish ? 'In Wishlist' : 'Add to Wishlist'}</span>
          </button>

          <button
            onClick={handleWhatsAppEnquiry}
            className="flex-1 py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20"
          >
            <MessageCircle className="w-4 h-4 fill-white" />
            <span>Enquire on WhatsApp</span>
          </button>
        </div>
      </div>
    </div>
  );
};
