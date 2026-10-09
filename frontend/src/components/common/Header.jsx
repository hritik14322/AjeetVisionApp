import React from 'react';
import { useApp } from '../../context/AppContext';
import { Bell, Heart, MessageCircle, Crown } from 'lucide-react';
import { SHOWROOM_INFO } from '../../data/mockData';
import { BrandLogo } from './BrandLogo';

export const Header = () => {
  const {
    currentView,
    navigateTo,
    currentUser,
    unreadNotifCount,
    wishlistIds,
  } = useApp();

  const isVip = currentUser?.isVipMember;

  // Format WhatsApp Link
  const openWhatsAppShowroom = () => {
    const text = encodeURIComponent("Namaste New Ajeet Vision! I am browsing your web store and would like assistance.");
    window.open(`https://wa.me/${SHOWROOM_INFO.whatsapp.replace(/\D/g, '')}?text=${text}`, '_blank');
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm transition-all">
      {/* Main Header Bar */}
      <div className="max-w-7xl mx-auto px-4 py-2.5 sm:py-3 flex items-center justify-between gap-3">
        {/* Brand / Logo */}
        <div 
          onClick={() => navigateTo('home')} 
          className="flex items-center cursor-pointer group select-none flex-shrink-0"
        >
          <BrandLogo size="md" variant="dark" />
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-700">
          <button
            onClick={() => navigateTo('home')}
            className={`transition hover:text-brand-red ${currentView === 'home' ? 'text-brand-red font-semibold' : ''}`}
          >
            Home
          </button>
          <button
            onClick={() => navigateTo('categories')}
            className={`transition hover:text-brand-red ${currentView.includes('categor') ? 'text-brand-red font-semibold' : ''}`}
          >
            Categories
          </button>
          <button
            onClick={() => navigateTo('purchases')}
            className={`transition hover:text-brand-red ${currentView === 'purchases' || currentView === 'bill_details' ? 'text-brand-red font-semibold' : ''}`}
          >
            My Purchases & Bills
          </button>
          <button
            onClick={() => navigateTo('vip_club')}
            className={`transition hover:text-amber-600 flex items-center gap-1 ${currentView === 'vip_club' ? 'text-amber-600 font-semibold' : ''}`}
          >
            <Crown className="w-4 h-4 text-amber-500" />
            VIP Club
          </button>
          <button
            onClick={() => navigateTo('loyalty_card')}
            className={`transition hover:text-brand-red ${currentView.includes('loyalty') ? 'text-brand-red font-semibold' : ''}`}
          >
            Loyalty Card
          </button>
          <button
            onClick={() => navigateTo('daily_deals')}
            className={`transition hover:text-brand-red ${currentView === 'daily_deals' ? 'text-brand-red font-semibold' : ''}`}
          >
            Today's Deals
          </button>
        </nav>

        {/* Right Action Icons */}
        <div className="flex items-center gap-2 sm:gap-3">

          {/* WhatsApp Direct Enquiry */}
          <button
            onClick={openWhatsAppShowroom}
            className="hidden sm:flex items-center gap-1.5 text-xs font-semibold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 px-3 py-1.5 rounded-full transition shadow-xs"
            title="Chat with New Ajeet Vision Showroom"
          >
            <MessageCircle className="w-3.5 h-3.5 fill-emerald-600 text-emerald-600" />
            <span>Showroom Help</span>
          </button>

          {/* Wishlist Icon */}
          <button
            onClick={() => navigateTo('wishlist')}
            className="relative p-2 text-gray-700 hover:text-brand-red hover:bg-gray-50 rounded-full transition"
            title="Wishlist"
          >
            <Heart className={`w-5 h-5 ${wishlistIds.length > 0 ? 'text-brand-red fill-brand-red/10' : ''}`} />
            {wishlistIds.length > 0 && (
              <span className="absolute 1 top-0.5 right-0.5 bg-brand-red text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {wishlistIds.length}
              </span>
            )}
          </button>

          {/* Notifications Icon with Badge */}
          <button
            onClick={() => navigateTo('notifications')}
            className="relative p-2 text-gray-700 hover:text-brand-red hover:bg-gray-50 rounded-full transition"
            title="Notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadNotifCount > 0 && (
              <span className="absolute top-1 right-1 bg-brand-red w-2.5 h-2.5 rounded-full ring-2 ring-white animate-pulse" />
            )}
          </button>

          {/* Profile / VIP badge desktop or Sign In button */}
          {currentUser ? (
            <button
              onClick={() => navigateTo('profile')}
              className="hidden sm:flex items-center gap-2 pl-2 pr-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-xs font-semibold text-gray-800 transition"
            >
              <div className="w-6 h-6 rounded-full overflow-hidden bg-brand-red text-white flex items-center justify-center text-[11px] font-bold">
                {currentUser?.avatar ? (
                  <img src={currentUser.avatar} alt="User" className="w-full h-full object-cover" />
                ) : (
                  currentUser?.name ? currentUser.name.slice(0, 2).toUpperCase() : 'ME'
                )}
              </div>
              <span>{currentUser?.name?.split(' ')[0] || 'Profile'}</span>
              {isVip && <Crown className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />}
            </button>
          ) : (
            <button
              onClick={() => navigateTo('login')}
              className="hidden sm:flex items-center gap-1.5 px-4 py-1.5 bg-brand-red hover:bg-red-700 text-white rounded-full text-xs font-bold transition shadow-xs"
            >
              <span>Sign In / Sign Up</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
