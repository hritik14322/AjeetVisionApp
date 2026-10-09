import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ArrowLeft,
  Bell,
  Sparkles,
  Receipt,
  TrendingDown,
  Crown,
  CheckCircle2,
  Cake,
  ChevronRight,
} from 'lucide-react';
import { apiService } from '../../services/api';

export const NotificationsScreen = () => {
  const { goBack, navigateTo, setUnreadNotifCount } = useApp();
  const [notifications, setNotifications] = useState([]);
  const [activeFilter, setActiveFilter] = useState('all');

  const fetchNotifs = async () => {
    const data = await apiService.getNotifications();
    setNotifications(data.notifications);
  };

  useEffect(() => {
    fetchNotifs();
  }, []);

  const handleNotificationClick = async (notif) => {
    await apiService.markNotificationRead(notif.id);
    setNotifications((prev) =>
      prev.map((n) => (n.id === notif.id ? { ...n, read: true } : n))
    );
    setUnreadNotifCount((prev) => Math.max(0, prev - 1));

    if (notif.action) {
      navigateTo(notif.action);
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'reward':
        return <Sparkles className="w-4 h-4 text-amber-500" />;
      case 'bill':
        return <Receipt className="w-4 h-4 text-brand-red" />;
      case 'price_drop':
        return <TrendingDown className="w-4 h-4 text-emerald-600" />;
      case 'vip':
        return <Crown className="w-4 h-4 text-amber-500" />;
      case 'birthday':
        return <Cake className="w-4 h-4 text-pink-500" />;
      default:
        return <Bell className="w-4 h-4 text-gray-500" />;
    }
  };

  const filtered = notifications.filter((n) => {
    if (activeFilter === 'unread') return !n.read;
    if (activeFilter !== 'all') return n.type === activeFilter;
    return true;
  });

  return (
    <div className="space-y-4 pb-24 md:pb-12 max-w-xl mx-auto px-4 sm:px-6 pt-3">
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
            <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
              Notifications
            </h2>
            <p className="text-xs text-gray-500">Showroom alerts, bills and rewards</p>
          </div>
        </div>
      </div>

      {/* Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
        {[
          { id: 'all', label: 'All' },
          { id: 'unread', label: 'Unread' },
          { id: 'bill', label: 'Bills & Payments' },
          { id: 'reward', label: 'Rewards' },
          { id: 'price_drop', label: 'Price Drops' },
        ].map((f) => (
          <button
            key={f.id}
            onClick={() => setActiveFilter(f.id)}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition flex-shrink-0 ${
              activeFilter === f.id
                ? 'bg-brand-red text-white'
                : 'bg-white text-gray-700 border border-gray-200 hover:border-gray-300'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="space-y-2.5">
        {filtered.map((item) => (
          <div
            key={item.id}
            onClick={() => handleNotificationClick(item)}
            className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-3.5 ${
              item.read
                ? 'bg-white border-gray-100 hover:border-gray-200'
                : 'bg-red-50/50 border-red-200 shadow-xs'
            }`}
          >
            <div className="w-9 h-9 rounded-xl bg-white border border-gray-100 flex items-center justify-center flex-shrink-0 shadow-xs">
              {getIcon(item.type)}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <h4 className="font-bold text-gray-900 text-xs sm:text-sm truncate">
                  {item.title}
                </h4>
                <span className="text-[10px] text-gray-400 font-medium whitespace-nowrap">
                  {item.time}
                </span>
              </div>
              <p className="text-xs text-gray-600 mt-1 leading-relaxed">{item.message}</p>
            </div>

            <ChevronRight className="w-4 h-4 text-gray-400 self-center flex-shrink-0" />
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="p-12 text-center bg-white rounded-3xl border border-gray-100 text-gray-400">
            <Bell className="w-8 h-8 mx-auto mb-2 text-gray-300" />
            <p className="text-xs">No notifications in this filter.</p>
          </div>
        )}
      </div>
    </div>
  );
};
