import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Search, ChevronRight, Layers, ArrowLeft } from 'lucide-react';
import { getSyncCategories } from '../../services/api';

export const CategoriesScreen = () => {
  const { navigateTo, goBack } = useApp();
  const [searchQuery, setSearchQuery] = useState('');

  const CATEGORIES = getSyncCategories();
  const filteredCategories = CATEGORIES.filter((cat) =>
    cat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-4 pb-24 md:pb-12 max-w-7xl mx-auto px-4 sm:px-6 pt-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={goBack}
            className="md:hidden p-1.5 -ml-1.5 rounded-full text-gray-700 hover:bg-gray-100"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
              All Categories
            </h2>
            <p className="text-xs text-gray-500">Explore New Ajeet Vision electronics range</p>
          </div>
        </div>
      </div>

      {/* Search Input matching reference */}
      <div className="relative">
        <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
        <input
          type="text"
          placeholder="Search products, brands, appliances..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-3 rounded-2xl border border-gray-200 bg-white text-xs sm:text-sm font-medium focus:outline-none focus:border-brand-red shadow-xs transition"
        />
      </div>

      {/* Categories Grid (2 cols mobile, 3 cols tablet, 4 cols desktop) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4 pt-2">
        {filteredCategories.map((category) => (
          <div
            key={category.id}
            onClick={() => navigateTo('category_products', { category: category.id })}
            className="group bg-white rounded-2xl p-4 border border-gray-200/80 hover:border-red-300 hover:shadow-lg transition-all cursor-pointer flex flex-col items-center text-center justify-between"
          >
            <div className="w-20 h-20 sm:w-24 sm:h-24 p-2 flex items-center justify-center bg-gray-50/70 rounded-xl group-hover:bg-red-50/30 transition">
              <img
                src={category.image}
                alt={category.name}
                className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-300"
              />
            </div>

            <div className="mt-3 w-full">
              <h3 className="font-bold text-gray-900 text-xs sm:text-sm truncate group-hover:text-brand-red transition">
                {category.name}
              </h3>
              <p className="text-[11px] text-gray-400 mt-0.5 font-medium">
                {category.itemCount}+ Models Available
              </p>
            </div>
          </div>
        ))}
      </div>

      {filteredCategories.length === 0 && (
        <div className="p-12 text-center text-gray-400">
          <p className="text-sm">No category matches "{searchQuery}"</p>
        </div>
      )}
    </div>
  );
};
