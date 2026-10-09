import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  User,
  ShieldCheck,
  Crown,
  Flame,
  ChevronRight,
  Receipt,
  MapPin,
  Heart,
  Share2,
  Bell,
  CreditCard,
  Cake,
  Settings,
  LogOut,
  Sparkles,
  Store,
  Phone,
} from 'lucide-react';
import { SHOWROOM_INFO } from '../../data/mockData';

export const ProfileScreen = () => {
  const {
    currentUser,
    handleLogout,
    navigateTo,
    rewardJourney,
    setIsJoinVipModalOpen,
    setIsBirthdayModalOpen,
    setIsStoreLocatorOpen,
    unreadNotifCount,
    wishlistIds,
  } = useApp();

  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const isVip = currentUser?.isVipMember;

  return (
    <div className="space-y-4 pb-24 md:pb-12 max-w-xl mx-auto px-4 sm:px-6 pt-3">
      {/* Title */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
          My Profile
        </h2>
        <button
          onClick={() => setIsStoreLocatorOpen(true)}
          className="text-xs font-bold text-brand-red flex items-center gap-1 hover:underline"
        >
          <Store className="w-3.5 h-3.5" />
          <span>Showroom Info</span>
        </button>
      </div>

      {/* If Not Logged In, Prompt Sign In / Sign Up */}
      {!currentUser ? (
        <div className="bg-gradient-to-br from-brand-red to-red-700 rounded-3xl p-6 text-white text-center shadow-lg space-y-3">
          <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto">
            <User className="w-7 h-7 text-white" />
          </div>
          <h3 className="text-lg font-black tracking-tight">Sign In to Your Account</h3>
          <p className="text-xs text-white/90 max-w-xs mx-auto leading-relaxed">
            Sign in or create an account to view your purchase invoices, warranty cards, reward spins, and loyalty coins.
          </p>
          <button
            onClick={() => navigateTo('login')}
            className="w-full py-3 bg-white hover:bg-gray-100 text-brand-red font-black text-xs rounded-2xl shadow-md transition"
          >
            Sign In / Sign Up Now →
          </button>
        </div>
      ) : (
        /* User Info Card */
        <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-xs flex items-center gap-4">
          <div className="relative w-16 h-16 rounded-2xl overflow-hidden bg-gray-100 border-2 border-red-100 flex-shrink-0">
            {currentUser?.avatar ? (
              <img
                src={currentUser.avatar}
                alt={currentUser.name || 'User'}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-brand-red text-white font-bold text-xl">
                {currentUser?.name ? currentUser.name.slice(0, 2).toUpperCase() : 'ME'}
              </div>
            )}
            {isVip && (
              <div className="absolute top-0 right-0 bg-amber-500 p-0.5 rounded-bl-lg">
                <Crown className="w-3 h-3 text-white fill-white" />
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <h3 className="text-base sm:text-lg font-black text-gray-900 truncate">
                {currentUser?.name || 'Customer'}
              </h3>
              {currentUser?.isVerified && (
                <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-full border border-emerald-200">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                  Verified
                </span>
              )}
            </div>
            <p className="text-xs text-gray-500 font-medium mt-0.5">
              {currentUser?.email || currentUser?.mobile || ''}
            </p>
          </div>
        </div>
      )}

      {/* My Membership Card matching reference */}
      <div className="bg-white rounded-3xl p-4 border border-gray-100 shadow-xs flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0">
            <Crown className="w-5 h-5 fill-amber-400" />
          </div>
          <div>
            <span className="text-[11px] text-gray-400 font-bold uppercase tracking-wider block">
              Showroom Membership
            </span>
            <p className="text-xs sm:text-sm font-bold text-gray-900">
              {isVip ? 'Verified VIP Club Member' : 'Not a member yet'}
            </p>
          </div>
        </div>

        {isVip ? (
          <button
            onClick={() => navigateTo('vip_club')}
            className="py-1.5 px-3 bg-amber-50 text-amber-800 border border-amber-200 rounded-xl text-xs font-bold hover:bg-amber-100 transition"
          >
            Manage VIP
          </button>
        ) : (
          <button
            onClick={() => setIsJoinVipModalOpen(true)}
            className="py-1.5 px-3.5 bg-brand-red hover:bg-red-700 text-white rounded-xl text-xs font-bold transition shadow-xs"
          >
            Join Now
          </button>
        )}
      </div>

      {/* Reward Progress Snippet matching reference */}
      <div
        onClick={() => navigateTo('home')}
        className="bg-white rounded-3xl p-4 border border-gray-100 shadow-xs cursor-pointer hover:border-red-200 transition space-y-2"
      >
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5">
            <Flame className="w-4 h-4 text-brand-red fill-brand-red" />
            <span className="font-bold text-gray-800">Reward Journey Progress</span>
          </div>
          <span className="font-bold text-gray-900">{rewardJourney.percentage}%</span>
        </div>

        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-brand-red rounded-full transition-all duration-500"
            style={{ width: `${rewardJourney.percentage}%` }}
          />
        </div>

        <div className="flex justify-between text-[11px] text-gray-500">
          <span>₹{rewardJourney.currentSpend?.toLocaleString('en-IN')}</span>
          <span>Target: ₹{rewardJourney.targetSpend?.toLocaleString('en-IN')}</span>
        </div>
      </div>

      {/* Profile Links List matching reference */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-xs divide-y divide-gray-100 overflow-hidden">
        {[
          {
            id: 'purchases',
            label: 'My Purchases & Invoices',
            icon: Receipt,
            badge: null,
            onClick: () => navigateTo('purchases'),
          },
          {
            id: 'loyalty',
            label: 'Digital Loyalty Card & Points',
            icon: CreditCard,
            badge: '950 Pts',
            onClick: () => navigateTo('loyalty_card'),
          },
          {
            id: 'wishlist',
            label: 'My Wishlist',
            icon: Heart,
            badge: wishlistIds.length ? `${wishlistIds.length} items` : null,
            onClick: () => navigateTo('wishlist'),
          },
          {
            id: 'notifications',
            label: 'Notifications',
            icon: Bell,
            badge: unreadNotifCount > 0 ? `${unreadNotifCount} new` : null,
            onClick: () => navigateTo('notifications'),
          },
          {
            id: 'birthday',
            label: 'Birthday Reward Voucher',
            icon: Cake,
            badge: '₹1,500 Coupon',
            onClick: () => setIsBirthdayModalOpen(true),
          },
          {
            id: 'addresses',
            label: 'My Showroom Delivery Addresses',
            icon: MapPin,
            badge: `${currentUser?.addresses?.length || 2} saved`,
            onClick: () => {
              alert(`Saved Addresses:\n1. ${currentUser?.addresses?.[0]?.fullAddress}\n2. ${currentUser?.addresses?.[1]?.fullAddress}`);
            },
          },
          {
            id: 'locator',
            label: 'Showroom Location & Contact',
            icon: Store,
            badge: 'Obra Branch',
            onClick: () => setIsStoreLocatorOpen(true),
          },
          {
            id: 'admin',
            label: 'Admin Login',
            icon: ShieldCheck,
            badge: null,
            onClick: () => navigateTo('admin_login'),
          },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={item.onClick}
              className="w-full p-4 flex items-center justify-between text-left hover:bg-gray-50/70 transition group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-gray-100 text-gray-700 flex items-center justify-center group-hover:bg-red-50 group-hover:text-brand-red transition">
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-xs sm:text-sm font-bold text-gray-800 group-hover:text-gray-950 transition">
                  {item.label}
                </span>
              </div>

              <div className="flex items-center gap-2">
                {item.badge && (
                  <span className="px-2 py-0.5 bg-red-50 text-brand-red text-[11px] font-bold rounded-lg border border-red-100">
                    {item.badge}
                  </span>
                )}
                <ChevronRight className="w-4 h-4 text-gray-400 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </button>
          );
        })}
      </div>

      {/* Logout Button (only when signed in) */}
      {currentUser && (
        <div className="pt-2">
          <button
            onClick={() => setShowLogoutConfirm(true)}
            className="w-full py-3.5 px-4 rounded-2xl border border-red-200 text-brand-red hover:bg-red-50 font-bold text-xs sm:text-sm transition flex items-center justify-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout Account</span>
          </button>
        </div>
      )}

      {/* Logout Confirmation Dialog */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-xs w-full text-center space-y-4 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="w-12 h-12 bg-red-100 text-brand-red rounded-full flex items-center justify-center mx-auto">
              <LogOut className="w-6 h-6" />
            </div>
            <h4 className="text-base font-black text-gray-900">Logout Confirmation</h4>
            <p className="text-xs text-gray-500">
              Are you sure you want to log out of your New Ajeet Vision account?
            </p>
            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs rounded-xl transition"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowLogoutConfirm(false);
                  handleLogout();
                }}
                className="py-2.5 bg-brand-red hover:bg-red-700 text-white font-bold text-xs rounded-xl transition shadow-xs"
              >
                Yes, Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
