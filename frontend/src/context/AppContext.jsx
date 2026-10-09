import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiService } from '../services/api';

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  // Parse initial view from URL (e.g. /admin_login)
  const initialPath = window.location.pathname.replace(/^\/+/, '') || 'home';
  const initialView = ['splash', 'login', 'otp', 'home', 'reward_unlocked', 'categories', 'category_products', 'product_detail', 'purchases', 'bill_details', 'vip_club', 'loyalty_card', 'wishlist', 'daily_deals', 'notifications', 'profile', 'admin_login', 'admin_dashboard'].includes(initialPath) ? initialPath : 'home';

  // Navigation & View
  const [currentView, setCurrentView] = useState(initialView);
  const [viewHistory, setViewHistory] = useState([initialView]);
  const [selectedCategory, setSelectedCategory] = useState('television');
  const [selectedProductId, setSelectedProductId] = useState('prod-1');
  const [selectedInvoiceNo, setSelectedInvoiceNo] = useState('NAV20260915001');

  // Auth & User
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(true); // default true for seamless showroom browsing
  const [authLoading, setAuthLoading] = useState(true);
  const [pendingOtpMobile, setPendingOtpMobile] = useState('');

  // Rewards
  const [rewardJourney, setRewardJourney] = useState({
    currentSpend: 72500,
    targetSpend: 100000,
    percentage: 72,
    remainingAmount: 27500,
    isUnlocked: false,
    hasSpun: false,
    claimedReward: null,
  });

  // Wishlist
  const [wishlistIds, setWishlistIds] = useState(['prod-1', 'prod-7']);

  // Modals
  const [isEmiModalOpen, setIsEmiModalOpen] = useState(false);
  const [emiProduct, setEmiProduct] = useState(null);
  const [isWheelResultModalOpen, setIsWheelResultModalOpen] = useState(false);
  const [wheelPrizeResult, setWheelPrizeResult] = useState(null);
  const [isBirthdayModalOpen, setIsBirthdayModalOpen] = useState(false);
  const [isStoreLocatorOpen, setIsStoreLocatorOpen] = useState(false);
  const [isPayBillModalOpen, setIsPayBillModalOpen] = useState(false);
  const [payingInvoice, setPayingInvoice] = useState(null);
  const [isJoinVipModalOpen, setIsJoinVipModalOpen] = useState(false);

  // Notifications
  const [unreadNotifCount, setUnreadNotifCount] = useState(2);

  // Toasts
  const [toasts, setToasts] = useState([]);

  const showToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Initial load
  useEffect(() => {
    const loadAppData = async () => {
      try {
        setAuthLoading(true);
        // Check splash flag or auth
        const user = await apiService.getCurrentUser();
        if (user) {
          setCurrentUser(user);
          setIsAuthenticated(true);
        }
        const rewards = await apiService.getRewardJourney();
        setRewardJourney(rewards);

        const wishlist = await apiService.getWishlist();
        setWishlistIds(wishlist.map(p => p.id));

        const notifs = await apiService.getNotifications();
        setUnreadNotifCount(notifs.unreadCount);
      } catch (err) {
        console.error('Error loading initial app data:', err);
      } finally {
        setAuthLoading(false);
      }
    };

    loadAppData();
  }, []);

  // View Navigation Helpers
  const navigateTo = (view, params = {}) => {
    if (params.category) setSelectedCategory(params.category);
    if (params.productId) setSelectedProductId(params.productId);
    if (params.invoiceNo) setSelectedInvoiceNo(params.invoiceNo);

    setViewHistory((prev) => [...prev, view]);
    setCurrentView(view);
    window.history.pushState({}, '', `/${view}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goBack = () => {
    if (viewHistory.length > 1) {
      const newHistory = [...viewHistory];
      newHistory.pop(); // Remove current
      const previous = newHistory[newHistory.length - 1];
      setViewHistory(newHistory);
      setCurrentView(previous);
      window.history.pushState({}, '', `/${previous}`);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setCurrentView('home');
      window.history.pushState({}, '', '/home');
    }
  };

  // Handle browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname.replace(/^\/+/, '') || 'home';
      setCurrentView(path);
      setViewHistory(prev => [...prev, path]);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Auth Handlers
  const handleSignUp = async (userData) => {
    const res = await apiService.signUp(userData);
    setCurrentUser(res.user);
    setIsAuthenticated(true);
    showToast(`Account created successfully! Welcome, ${res.user.name}`, 'success');
    navigateTo('home');
    return res;
  };

  const handleSignIn = async (credentials) => {
    const res = await apiService.signIn(credentials);
    setCurrentUser(res.user);
    setIsAuthenticated(true);
    showToast(`Welcome back, ${res.user.name}!`, 'success');
    navigateTo('home');
    return res;
  };

  const handleForgotPassword = async (email) => {
    const res = await apiService.forgotPassword(email);
    showToast(res.message, 'success');
    return res;
  };

  const handleSendOtp = async (mobile) => {
    const res = await apiService.sendOtp(mobile);
    setPendingOtpMobile(mobile);
    showToast(res.message, 'success');
    navigateTo('otp');
    return res;
  };

  const handleVerifyOtp = async (otp) => {
    const res = await apiService.verifyOtp(pendingOtpMobile, otp);
    setCurrentUser(res.user);
    setIsAuthenticated(true);
    showToast(`Welcome back, ${res.user.name}!`, 'success');
    navigateTo('home');
    return res;
  };

  const handleLogout = async () => {
    await apiService.logout();
    setIsAuthenticated(false);
    showToast('You have been logged out safely', 'info');
    navigateTo('login');
  };

  // Wishlist toggle
  const toggleWishlist = async (productId) => {
    const res = await apiService.toggleWishlist(productId);
    if (res.isWishlisted) {
      setWishlistIds((prev) => [...prev, productId]);
      showToast('Item saved to your Wishlist ❤️', 'success');
    } else {
      setWishlistIds((prev) => prev.filter((id) => id !== productId));
      showToast('Item removed from Wishlist', 'info');
    }
  };

  // Toggle reach ₹100,000 for reward demonstration
  const toggleRewardTargetSimulation = async () => {
    const newTargetState = !rewardJourney.isUnlocked;
    const updated = await apiService.simulateReachTarget(newTargetState);
    setRewardJourney(updated);
    if (newTargetState) {
      showToast('🎉 ₹1,00,000 Target Achieved! Reward is now unlocked.', 'success');
      navigateTo('reward_unlocked');
    } else {
      showToast('Reset to ₹72,500 / ₹1,00,000 progress journey.', 'info');
    }
  };

  // Refresh rewards
  const refreshRewards = async () => {
    const rewards = await apiService.getRewardJourney();
    setRewardJourney(rewards);
  };

  // Open EMI Calculator
  const openEmiCalculator = (product = null) => {
    setEmiProduct(product);
    setIsEmiModalOpen(true);
  };

  return (
    <AppContext.Provider
      value={{
        currentView,
        navigateTo,
        goBack,
        selectedCategory,
        setSelectedCategory,
        selectedProductId,
        setSelectedProductId,
        selectedInvoiceNo,
        setSelectedInvoiceNo,
        currentUser,
        setCurrentUser,
        isAuthenticated,
        setIsAuthenticated,
        authLoading,
        pendingOtpMobile,
        setPendingOtpMobile,
        handleSignUp,
        handleSignIn,
        handleForgotPassword,
        handleSendOtp,
        handleVerifyOtp,
        handleLogout,
        rewardJourney,
        setRewardJourney,
        refreshRewards,
        toggleRewardTargetSimulation,
        wishlistIds,
        toggleWishlist,
        // Modals
        isEmiModalOpen,
        setIsEmiModalOpen,
        emiProduct,
        openEmiCalculator,
        isWheelResultModalOpen,
        setIsWheelResultModalOpen,
        wheelPrizeResult,
        setWheelPrizeResult,
        isBirthdayModalOpen,
        setIsBirthdayModalOpen,
        isStoreLocatorOpen,
        setIsStoreLocatorOpen,
        isPayBillModalOpen,
        setIsPayBillModalOpen,
        payingInvoice,
        setPayingInvoice,
        isJoinVipModalOpen,
        setIsJoinVipModalOpen,
        unreadNotifCount,
        setUnreadNotifCount,
        toasts,
        showToast,
        removeToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
