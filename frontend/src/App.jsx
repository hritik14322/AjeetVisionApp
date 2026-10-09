import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/common/Header';
import { BottomNav } from './components/common/BottomNav';
import { Toast } from './components/common/Toast';
import { EmiCalculatorModal } from './components/common/EmiCalculatorModal';
import { StoreLocatorModal } from './components/common/StoreLocatorModal';
import { PayBillModal } from './components/common/PayBillModal';
import { JoinVipModal } from './components/common/JoinVipModal';
import { BirthdayRewardModal } from './components/common/BirthdayRewardModal';
import { WheelResultModal } from './components/screens/WheelResultModal';

// Screens
import { SplashScreen } from './components/screens/SplashScreen';
import { LoginScreen } from './components/screens/LoginScreen';
import { OtpVerificationScreen } from './components/screens/OtpVerificationScreen';
import { HomeScreen } from './components/screens/HomeScreen';
import { RewardUnlockedScreen } from './components/screens/RewardUnlockedScreen';
import { CategoriesScreen } from './components/screens/CategoriesScreen';
import { CategoryProductsScreen } from './components/screens/CategoryProductsScreen';
import { ProductDetailScreen } from './components/screens/ProductDetailScreen';
import { PurchasesScreen } from './components/screens/PurchasesScreen';
import { BillDetailsScreen } from './components/screens/BillDetailsScreen';
import { VipClubScreen } from './components/screens/VipClubScreen';
import { LoyaltyCardScreen } from './components/screens/LoyaltyCardScreen';
import { WishlistScreen } from './components/screens/WishlistScreen';
import { DailyDealsScreen } from './components/screens/DailyDealsScreen';
import { NotificationsScreen } from './components/screens/NotificationsScreen';
import { ProfileScreen } from './components/screens/ProfileScreen';
import { AdminDashboardScreen } from './components/screens/AdminDashboardScreen';
import { AdminLoginScreen } from './components/screens/AdminLoginScreen';

const AppContent = () => {
  const { currentView } = useApp();

  const isAuthOrSplash = ['splash', 'login', 'otp'].includes(currentView);
  const isAdminRoute = ['admin_login', 'admin_dashboard'].includes(currentView);

  const renderCurrentView = () => {
    switch (currentView) {
      case 'splash':
        return <SplashScreen />;
      case 'login':
        return <LoginScreen />;
      case 'otp':
        return <OtpVerificationScreen />;
      case 'home':
        return <HomeScreen />;
      case 'reward_unlocked':
        return <RewardUnlockedScreen />;
      case 'categories':
        return <CategoriesScreen />;
      case 'category_products':
        return <CategoryProductsScreen />;
      case 'product_detail':
        return <ProductDetailScreen />;
      case 'purchases':
        return <PurchasesScreen />;
      case 'bill_details':
        return <BillDetailsScreen />;
      case 'vip_club':
        return <VipClubScreen />;
      case 'loyalty_card':
        return <LoyaltyCardScreen />;
      case 'wishlist':
        return <WishlistScreen />;
      case 'daily_deals':
        return <DailyDealsScreen />;
      case 'notifications':
        return <NotificationsScreen />;
      case 'profile':
        return <ProfileScreen />;
      case 'admin_login':
        return <AdminLoginScreen />;
      case 'admin_dashboard':
        return <AdminDashboardScreen />;
      default:
        return <HomeScreen />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F8FA] flex flex-col font-sans">
      {/* Show header on standard app screens */}
      {!isAuthOrSplash && !isAdminRoute && currentView !== 'reward_unlocked' && <Header />}

      {/* Main View Container */}
      <main className="flex-1 w-full">
        {renderCurrentView()}
      </main>

      {/* Show mobile bottom nav */}
      {!isAuthOrSplash && !isAdminRoute && <BottomNav />}

      {/* Global Modals and Alerts */}
      <Toast />
      <EmiCalculatorModal />
      <StoreLocatorModal />
      <PayBillModal />
      <JoinVipModal />
      <BirthdayRewardModal />
      <WheelResultModal />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
