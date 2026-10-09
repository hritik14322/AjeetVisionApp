import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { ArrowLeft, Heart, Star, SlidersHorizontal, ArrowUpDown } from 'lucide-react';
import { getSyncProducts, getSyncCategories } from '../../services/api';

export const CategoryProductsScreen = () => {
  const {
    selectedCategory,
    setSelectedCategory,
    navigateTo,
    goBack,
    wishlistIds,
    toggleWishlist,
  } = useApp();

  const [selectedBrand, setSelectedBrand] = useState('All');
  const [sortBy, setSortBy] = useState('popular');

  const CATEGORIES = getSyncCategories();
  const PRODUCTS = getSyncProducts();

  const currentCategoryObj = CATEGORIES.find((c) => c.id === selectedCategory) || {
    name: selectedCategory ? selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1) : 'Electronics',
  };

  // Distinct brands for this category
  const availableBrands = useMemo(() => {
    const prods = PRODUCTS.filter(
      (p) => !selectedCategory || p.category.toLowerCase() === selectedCategory.toLowerCase()
    );
    const brands = Array.from(new Set(prods.map((p) => p.brand)));
    return ['All', ...brands];
  }, [selectedCategory]);

  const filteredProducts = useMemo(() => {
    let prods = PRODUCTS.filter(
      (p) => !selectedCategory || p.category.toLowerCase() === selectedCategory.toLowerCase()
    );

    if (selectedBrand !== 'All') {
      prods = prods.filter((p) => p.brand.toLowerCase() === selectedBrand.toLowerCase());
    }

    if (sortBy === 'price_low') {
      prods.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price_high') {
      prods.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      prods.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'discount') {
      prods.sort((a, b) => b.discountPercent - a.discountPercent);
    }

    return prods;
  }, [selectedCategory, selectedBrand, sortBy]);

  return (
    <div className="space-y-4 pb-24 md:pb-12 max-w-7xl mx-auto px-4 sm:px-6 pt-3">
      {/* Top Header Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={goBack}
            className="p-2 -ml-2 rounded-full text-gray-700 hover:bg-gray-100 transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight capitalize">
              {currentCategoryObj.name}
            </h2>
            <p className="text-xs text-gray-500">{filteredProducts.length} Showroom Models in stock</p>
          </div>
        </div>

        {/* Sort selector */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="text-xs font-semibold bg-white border border-gray-200 rounded-xl px-2.5 py-1.5 text-gray-700 focus:outline-none focus:border-brand-red pr-6 appearance-none cursor-pointer"
            >
              <option value="popular">Popularity</option>
              <option value="price_low">Price: Low to High</option>
              <option value="price_high">Price: High to Low</option>
              <option value="rating">Top Rated</option>
              <option value="discount">Biggest Discount</option>
            </select>
            <ArrowUpDown className="w-3 h-3 text-gray-400 absolute right-2 top-2.5 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Brand Filter Pills matching reference exactly */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
        {availableBrands.map((brand) => {
          const isSelected = selectedBrand === brand;
          return (
            <button
              key={brand}
              onClick={() => setSelectedBrand(brand)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition flex-shrink-0 ${
                isSelected
                  ? 'bg-brand-red text-white shadow-xs'
                  : 'bg-white text-gray-700 border border-gray-200 hover:border-gray-300'
              }`}
            >
              {brand}
            </button>
          );
        })}
      </div>

      {/* Product List Cards matching reference screen 8 */}
      <div className="space-y-3">
        {filteredProducts.map((product) => {
          const isWish = wishlistIds.includes(product.id);
          return (
            <div
              key={product.id}
              className="bg-white rounded-2xl p-4 border border-gray-200/80 hover:border-red-200 hover:shadow-md transition flex items-center justify-between gap-4 group"
            >
              {/* Product Thumbnail on Left */}
              <div
                onClick={() => navigateTo('product_detail', { productId: product.id })}
                className="w-24 h-24 sm:w-28 sm:h-28 flex-shrink-0 bg-gray-50/60 rounded-xl p-2 flex items-center justify-center cursor-pointer"
              >
                <img
                  src={product.images?.[0] || product.image || 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80'}
                  alt={product.name}
                  className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                />
              </div>

              {/* Product Details in Center */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <h3
                    onClick={() => navigateTo('product_detail', { productId: product.id })}
                    className="font-bold text-gray-900 text-xs sm:text-sm line-clamp-2 cursor-pointer hover:text-brand-red transition"
                  >
                    {product.name}
                  </h3>
                  <button
                    onClick={() => toggleWishlist(product.id)}
                    className="p-1.5 text-gray-400 hover:text-brand-red transition flex-shrink-0"
                  >
                    <Heart className={`w-4 h-4 ${isWish ? 'text-brand-red fill-brand-red' : ''}`} />
                  </button>
                </div>

                <div className="flex items-center gap-2 mt-1">
                  <span className="flex items-center text-amber-500 font-bold text-[11px]">
                    <Star className="w-3 h-3 fill-amber-400 mr-0.5" />
                    {product.rating} ({product.reviewsCount} reviews)
                  </span>
                  <span className="text-gray-300">•</span>
                  <span className="text-[11px] font-semibold text-emerald-600">In Stock</span>
                </div>

                {/* Price Line */}
                <div className="flex items-baseline gap-2 mt-1.5 flex-wrap">
                  <span className="text-sm sm:text-base font-black text-gray-900">
                    ₹{product.price?.toLocaleString('en-IN')}
                  </span>
                  <span className="text-xs text-gray-400 line-through">
                    ₹{product.originalPrice?.toLocaleString('en-IN')}
                  </span>
                  <span className="text-[10px] font-bold text-red-600 bg-red-50 px-1.5 py-0.5 rounded">
                    {product.discountPercent}% OFF
                  </span>
                </div>

                {/* Action View Details Red Button */}
                <div className="mt-2.5">
                  <button
                    onClick={() => navigateTo('product_detail', { productId: product.id })}
                    className="px-4 py-1.5 bg-brand-red hover:bg-red-700 text-white font-bold text-xs rounded-xl transition shadow-xs"
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {filteredProducts.length === 0 && (
          <div className="p-12 text-center bg-white rounded-2xl border border-gray-100 text-gray-400">
            <p className="text-sm">No products found for this brand filter.</p>
            <button
              onClick={() => setSelectedBrand('All')}
              className="mt-3 text-xs font-bold text-brand-red underline"
            >
              Reset to All Brands
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
