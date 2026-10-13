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
import { LegalTermsScreen } from './components/screens/LegalTermsScreen';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#F7F8FA] flex flex-col items-center justify-center p-6 text-center">
          <div className="w-14 h-14 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center mb-4 text-2xl font-bold border border-red-200">
            ⚠️
          </div>
          <h2 className="text-[#0B1527] font-extrabold text-[20px] mb-2">Display Error Detected</h2>
          <p className="text-[#64748B] text-[13px] max-w-sm mb-5">
            {this.state.error?.message || 'A temporary display error occurred while rendering this view.'}
          </p>
          <button
            onClick={() => { this.setState({ hasError: false }); window.location.reload(); }}
            className="px-5 py-2.5 bg-[#FF3B4A] text-white font-bold rounded-xl text-[13px] shadow hover:bg-[#E51020] transition-all"
          >
            Reload Page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

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
      case 'terms':
      case 'legal':
        return <LegalTermsScreen />;
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
    <ErrorBoundary>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </ErrorBoundary>
  );
}
