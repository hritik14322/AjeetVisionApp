import React from 'react';
import { useApp } from '../../context/AppContext';
import { Home, LayoutGrid, Receipt, User } from 'lucide-react';

export const BottomNav = () => {
  const { currentView, navigateTo } = useApp();

  const navItems = [
    {
      id: 'home',
      label: 'Home',
      icon: Home,
      views: ['home', 'reward_unlocked'],
    },
    {
      id: 'categories',
      label: 'Categories',
      icon: LayoutGrid,
      views: ['categories', 'category_products', 'product_detail'],
    },
    {
      id: 'purchases',
      label: 'Purchases',
      icon: Receipt,
      views: ['purchases', 'bill_details'],
    },
    {
      id: 'profile',
      label: 'Profile',
      icon: User,
      views: ['profile', 'vip_club', 'loyalty_card', 'loyalty_points', 'wishlist', 'notifications'],
    },
  ];

  // Hide bottom nav on splash, login, or otp screen
  if (['splash', 'login', 'otp'].includes(currentView)) {
    return null;
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-gray-200/80 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] md:hidden">
      <div className="flex items-center justify-around h-16 max-w-md mx-auto px-2">
        {navItems.map((item) => {
          const isActive = item.views.includes(currentView);
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              onClick={() => navigateTo(item.id)}
              className={`flex flex-col items-center justify-center flex-1 h-full py-1 transition-all duration-200 relative select-none ${
                isActive ? 'text-[#E51926]' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className="relative">
                <Icon
                  className={`w-5 h-5 transition-transform duration-200 ${
                    isActive ? 'scale-110 stroke-[2.4px]' : 'stroke-[1.8px]'
                  }`}
                />
                {isActive && (
                  <span className="absolute -top-1 -right-1 w-1.5 h-1.5 rounded-full bg-[#E51926]" />
                )}
              </div>
              <span
                className={`text-[11px] mt-1 transition-all ${
                  isActive ? 'font-bold tracking-tight' : 'font-medium'
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
