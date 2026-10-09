// API Service Layer for New Ajeet Vision Web Application
import {
  INITIAL_USER,
  INITIAL_REWARD_STATE,
  WHEEL_PRIZES,
  CATEGORIES,
  PRODUCTS,
  PROMOTIONAL_BANNERS,
  PURCHASES_DATA,
  VIP_CLUB_BENEFITS,
  LOYALTY_TRANSACTIONS,
  INITIAL_NOTIFICATIONS,
  SHOWROOM_INFO,
} from '../data/mockData';

export const getSyncProducts = () => {
  const adminProds = localStorage.getItem('ADMIN_SYNC_PRODUCTS');
  return adminProds ? JSON.parse(adminProds) : PRODUCTS;
};

export const getSyncCategories = () => {
  const adminCats = localStorage.getItem('ADMIN_SYNC_CATEGORIES');
  return adminCats ? JSON.parse(adminCats) : CATEGORIES;
};

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://api.newajeetvision.com/v1';

// Helper to simulate network latency
const delay = (ms = 400) => new Promise((resolve) => setTimeout(resolve, ms));

// Storage Keys
const STORAGE_KEYS = {
  AUTH_TOKEN: 'nav_auth_token',
  CURRENT_USER: 'nav_user_profile',
  REWARD_STATE: 'nav_reward_state',
  PURCHASES: 'nav_purchases',
  LOYALTY_PTS: 'nav_loyalty_pts',
  LOYALTY_TXNS: 'nav_loyalty_txns',
  WISHLIST: 'nav_wishlist',
  NOTIFICATIONS: 'nav_notifications',
};

// Initialize LocalStorage with mock defaults if empty
const initStorage = () => {
  if (!localStorage.getItem(STORAGE_KEYS.CURRENT_USER)) {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(INITIAL_USER));
  }
  if (!localStorage.getItem(STORAGE_KEYS.REWARD_STATE)) {
    localStorage.setItem(STORAGE_KEYS.REWARD_STATE, JSON.stringify(INITIAL_REWARD_STATE));
  }
  if (!localStorage.getItem(STORAGE_KEYS.PURCHASES)) {
    localStorage.setItem(STORAGE_KEYS.PURCHASES, JSON.stringify(PURCHASES_DATA));
  }
  if (!localStorage.getItem(STORAGE_KEYS.LOYALTY_PTS)) {
    localStorage.setItem(STORAGE_KEYS.LOYALTY_PTS, JSON.stringify(950));
  }
  if (!localStorage.getItem(STORAGE_KEYS.LOYALTY_TXNS)) {
    localStorage.setItem(STORAGE_KEYS.LOYALTY_TXNS, JSON.stringify(LOYALTY_TRANSACTIONS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.WISHLIST)) {
    localStorage.setItem(STORAGE_KEYS.WISHLIST, JSON.stringify(["prod-1", "prod-7"]));
  }
  if (!localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS)) {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(INITIAL_NOTIFICATIONS));
  }
};

initStorage();

export const apiService = {
  getBaseUrl() {
    return API_BASE_URL;
  },

  // ---------------- AUTH SERVICES ----------------
  async signUp({ name, mobile, email, password }) {
    await delay(600);
    if (!name || !name.trim()) throw new Error('Please enter your full name');
    const cleanMobile = (mobile || '').replace(/\D/g, '');
    if (cleanMobile.length < 10) throw new Error('Please enter a valid 10-digit mobile number');
    if (!email || !email.includes('@')) throw new Error('Please enter a valid email address');
    if (!password || password.length < 6) throw new Error('Password must be at least 6 characters long');

    const usersDb = JSON.parse(localStorage.getItem('nav_users_db') || '[]');
    const existing = usersDb.find(u => u.email.toLowerCase() === email.trim().toLowerCase());
    if (existing) {
      throw new Error('An account with this email address already exists. Please sign in.');
    }

    const newUser = {
      name: name.trim(),
      mobile: `+91 ${cleanMobile.slice(-10)}`,
      rawMobile: cleanMobile.slice(-10),
      email: email.trim().toLowerCase(),
      password, // stored locally for mock validation
      isVerified: true,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      isVipMember: false,
    };

    usersDb.push(newUser);
    localStorage.setItem('nav_users_db', JSON.stringify(usersDb));

    const token = `jwt_nav_${Date.now()}_${Math.random().toString(36).substring(2)}`;
    localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(newUser));

    return { success: true, token, user: newUser };
  },

  async signIn({ email, password }) {
    await delay(600);
    if (!email || !email.includes('@')) throw new Error('Please enter a valid email address');
    if (!password) throw new Error('Please enter your password');

    const usersDb = JSON.parse(localStorage.getItem('nav_users_db') || '[]');
    let user = usersDb.find(u => u.email.toLowerCase() === email.trim().toLowerCase());

    if (!user) {
      // Allow fallback default login for quick testing
      const currentUser = JSON.parse(localStorage.getItem(STORAGE_KEYS.CURRENT_USER) || JSON.stringify(INITIAL_USER));
      if (currentUser.email && currentUser.email.toLowerCase() === email.trim().toLowerCase()) {
        user = currentUser;
      } else {
        // Create demo account for seamless signin
        user = {
          name: email.split('@')[0].replace(/[^a-zA-Z]/g, ' ').toUpperCase() || 'Customer',
          email: email.trim().toLowerCase(),
          mobile: '+91 9876543210',
          isVerified: true,
          isVipMember: false,
        };
      }
    }

    const token = `jwt_nav_${Date.now()}_${Math.random().toString(36).substring(2)}`;
    localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));

    return { success: true, token, user };
  },

  async forgotPassword(email) {
    await delay(500);
    if (!email || !email.includes('@')) throw new Error('Please enter a valid email address');
    return {
      success: true,
      message: `Password reset link has been sent to your Gmail address (${email}). Please check your inbox!`,
    };
  },

  async sendOtp(mobileNumber) {
    await delay(600);
    if (!mobileNumber || mobileNumber.replace(/\D/g, '').length < 10) {
      throw new Error('Please enter a valid 10-digit Indian mobile number');
    }
    // Simulate OTP sent
    const mockOtp = '123456';
    return {
      success: true,
      message: `OTP sent successfully to +91 ${mobileNumber.slice(-10)}`,
      demoOtp: mockOtp,
      expiresInSeconds: 30,
    };
  },

  async verifyOtp(mobileNumber, otp) {
    await delay(700);
    if (otp !== '123456' && otp.length !== 6) {
      throw new Error('Invalid OTP. Please enter the 6-digit verification code.');
    }

    const token = `jwt_nav_${Date.now()}_${Math.random().toString(36).substring(2)}`;
    localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);

    const currentUser = JSON.parse(localStorage.getItem(STORAGE_KEYS.CURRENT_USER) || JSON.stringify(INITIAL_USER));
    currentUser.mobile = `+91 ${mobileNumber.slice(-10)}`;
    currentUser.rawMobile = mobileNumber.slice(-10);
    currentUser.isVerified = true;
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(currentUser));

    return {
      success: true,
      token,
      user: currentUser,
    };
  },

  async getCurrentUser() {
    await delay(300);
    const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    if (!token) return null;
    const user = JSON.parse(localStorage.getItem(STORAGE_KEYS.CURRENT_USER) || 'null');
    return user;
  },

  async updateProfile(updates) {
    await delay(500);
    const currentUser = JSON.parse(localStorage.getItem(STORAGE_KEYS.CURRENT_USER) || JSON.stringify(INITIAL_USER));
    const updated = { ...currentUser, ...updates };
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(updated));
    return updated;
  },

  async logout() {
    await delay(300);
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    return { success: true };
  },

  // ---------------- REWARD & WHEEL SERVICES ----------------
  async getRewardJourney() {
    await delay(400);
    const state = JSON.parse(localStorage.getItem(STORAGE_KEYS.REWARD_STATE) || JSON.stringify(INITIAL_REWARD_STATE));
    const target = state.targetSpend || 100000;
    const current = state.currentSpend || 72500;
    const percentage = Math.min(100, Math.round((current / target) * 100));
    const remaining = Math.max(0, target - current);
    const isUnlocked = current >= target;

    return {
      ...state,
      currentSpend: current,
      targetSpend: target,
      percentage,
      remainingAmount: remaining,
      isUnlocked,
    };
  },

  // Simulate spending reach ₹1,00,000 for demonstration/testing
  async simulateReachTarget(reach = true) {
    await delay(300);
    const state = JSON.parse(localStorage.getItem(STORAGE_KEYS.REWARD_STATE) || JSON.stringify(INITIAL_REWARD_STATE));
    state.currentSpend = reach ? 100000 : 72500;
    state.isUnlocked = reach;
    state.hasSpun = false;
    state.claimedReward = null;
    state.claimCode = null;
    localStorage.setItem(STORAGE_KEYS.REWARD_STATE, JSON.stringify(state));
    return this.getRewardJourney();
  },

  // BACKEND WHEEL SPIN API: Result is securely determined by backend rules!
  async spinRewardWheel() {
    await delay(800);
    const state = JSON.parse(localStorage.getItem(STORAGE_KEYS.REWARD_STATE) || JSON.stringify(INITIAL_REWARD_STATE));
    if (state.currentSpend < 100000) {
      throw new Error('Reward is locked. Target of ₹1,00,000 not reached yet.');
    }
    if (state.hasSpun && state.claimedReward) {
      return {
        alreadySpun: true,
        reward: state.claimedReward,
        claimCode: state.claimCode,
      };
    }

    // Backend weighted selection (deterministic or weighted rule)
    // Primary winner as shown in reference: Premium Earbuds
    const prizeIndex = 0; // Index 0: Premium Earbuds
    const winningPrize = WHEEL_PRIZES[prizeIndex];

    const claimCode = `NAV-GIFT-${Math.floor(100000 + Math.random() * 900000)}`;

    state.hasSpun = true;
    state.claimedReward = winningPrize;
    state.claimCode = claimCode;
    state.claimedAt = new Date().toISOString();
    localStorage.setItem(STORAGE_KEYS.REWARD_STATE, JSON.stringify(state));

    return {
      prizeIndex,
      reward: winningPrize,
      claimCode,
      message: 'Congratulations! You won ' + winningPrize.name,
      validUntil: '30 Days from today at New Ajeet Vision Showroom',
    };
  },

  async claimGift() {
    await delay(400);
    const state = JSON.parse(localStorage.getItem(STORAGE_KEYS.REWARD_STATE) || JSON.stringify(INITIAL_REWARD_STATE));
    state.isClaimInitiated = true;
    localStorage.setItem(STORAGE_KEYS.REWARD_STATE, JSON.stringify(state));
    return {
      success: true,
      claimCode: state.claimCode,
      instructions: 'Please show this Claim Code at the New Ajeet Vision billing counter along with your registered mobile number.',
    };
  },

  async linkLoyaltyCard(cardNumber) {
    await delay(500);
    const user = JSON.parse(localStorage.getItem(STORAGE_KEYS.CURRENT_USER) || JSON.stringify(INITIAL_USER));
    if (user.loyaltyCardNumber) {
      throw new Error('Loyalty card is already linked to this account.');
    }
    user.loyaltyCardNumber = cardNumber;
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    return user;
  },

  // ---------------- PURCHASES & INVOICE SERVICES ----------------
  async getPurchases(statusFilter = 'all') {
    await delay(400);
    const purchases = JSON.parse(localStorage.getItem(STORAGE_KEYS.PURCHASES) || JSON.stringify(PURCHASES_DATA));
    let filtered = purchases;
    if (statusFilter !== 'all') {
      filtered = purchases.filter((p) => p.status === statusFilter);
    }
    const totalOutstanding = purchases.reduce((acc, curr) => acc + (curr.remainingAmount || 0), 0);

    return {
      purchases: filtered,
      allPurchasesCount: purchases.length,
      ongoingCount: purchases.filter(p => p.status === 'ongoing').length,
      completedCount: purchases.filter(p => p.status === 'completed').length,
      totalOutstanding,
    };
  },

  async getInvoiceDetails(invoiceNo) {
    await delay(350);
    const purchases = JSON.parse(localStorage.getItem(STORAGE_KEYS.PURCHASES) || JSON.stringify(PURCHASES_DATA));
    const invoice = purchases.find((p) => p.invoiceNo === invoiceNo);
    if (!invoice) {
      throw new Error(`Invoice ${invoiceNo} not found`);
    }

    const user = JSON.parse(localStorage.getItem(STORAGE_KEYS.CURRENT_USER) || JSON.stringify(INITIAL_USER));

    return {
      ...invoice,
      customer: {
        name: user.name,
        mobile: user.mobile,
        address: user.addresses[0]?.fullAddress || 'Obra, Sonebhadra, UP',
      },
      showroom: SHOWROOM_INFO,
    };
  },

  async payOutstandingAmount(invoiceNo, paymentAmount) {
    await delay(600);
    const purchases = JSON.parse(localStorage.getItem(STORAGE_KEYS.PURCHASES) || JSON.stringify(PURCHASES_DATA));
    const invoiceIndex = purchases.findIndex((p) => p.invoiceNo === invoiceNo);
    if (invoiceIndex === -1) throw new Error('Invoice not found');

    const inv = purchases[invoiceIndex];
    const amountToPay = Math.min(paymentAmount || inv.remainingAmount, inv.remainingAmount);

    inv.amountPaid += amountToPay;
    inv.remainingAmount -= amountToPay;
    if (inv.remainingAmount <= 0) {
      inv.status = 'completed';
      inv.nextDueDate = null;
    }

    inv.paymentHistory.push({
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      amount: amountToPay,
      method: 'Online Payment (Razorpay/UPI)',
      ref: `PAY-${Date.now()}`,
    });

    purchases[invoiceIndex] = inv;
    localStorage.setItem(STORAGE_KEYS.PURCHASES, JSON.stringify(purchases));

    return {
      success: true,
      message: `Payment of ₹${amountToPay.toLocaleString('en-IN')} received successfully!`,
      invoice: inv,
    };
  },

  // ---------------- VIP CLUB SERVICES ----------------
  async getVipClubDetails() {
    await delay(350);
    const user = JSON.parse(localStorage.getItem(STORAGE_KEYS.CURRENT_USER) || JSON.stringify(INITIAL_USER));
    return {
      membershipPrice: 499,
      membershipDuration: '1 Year',
      isVipMember: user.isVipMember || false,
      vipExpiryDate: user.vipExpiryDate || '15 Sep 2027',
      benefits: VIP_CLUB_BENEFITS,
      terms: [
        'VIP membership is valid for 1 full year from date of payment.',
        'Member discounts are non-transferable and tied to registered mobile number.',
        'Free delivery applies within 25km radius of New Ajeet Vision Showroom.',
        'Promotional holiday trip entry is eligible for purchases above ₹20,000 during active membership.',
      ],
    };
  },

  async joinVipClub() {
    await delay(700);
    const user = JSON.parse(localStorage.getItem(STORAGE_KEYS.CURRENT_USER) || JSON.stringify(INITIAL_USER));
    user.isVipMember = true;
    const expiry = new Date();
    expiry.setFullYear(expiry.getFullYear() + 1);
    user.vipExpiryDate = expiry.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));

    // Add bonus loyalty points
    let pts = JSON.parse(localStorage.getItem(STORAGE_KEYS.LOYALTY_PTS) || '950');
    pts += 500;
    localStorage.setItem(STORAGE_KEYS.LOYALTY_PTS, JSON.stringify(pts));

    return {
      success: true,
      message: 'Welcome to NEW AJEET VISION CLUB! Your VIP status is now active.',
      user,
    };
  },

  // ---------------- LOYALTY CARD & POINTS ----------------
  async getLoyaltyCardDetails() {
    await delay(350);
    const user = JSON.parse(localStorage.getItem(STORAGE_KEYS.CURRENT_USER) || JSON.stringify(INITIAL_USER));

    // Check if admin updated points or card number in ADMIN_SYNC_CUSTOMERS
    const adminCustomers = JSON.parse(localStorage.getItem('ADMIN_SYNC_CUSTOMERS') || '[]');
    const matchedCustomer = adminCustomers.find(c => 
      (c.email && user.email && c.email.toLowerCase() === user.email.toLowerCase()) ||
      (c.mobile && user.mobile && c.mobile.replace(/\D/g, '') === user.mobile.replace(/\D/g, '')) ||
      (c.name && c.name.toLowerCase() === user.name.toLowerCase())
    );

    const points = matchedCustomer ? matchedCustomer.points : JSON.parse(localStorage.getItem(STORAGE_KEYS.LOYALTY_PTS) || '950');
    const cardNumber = matchedCustomer?.loyaltyCardNumber || user.loyaltyCardNumber || '5422 8901 2345 6789';

    let transactions = JSON.parse(localStorage.getItem(STORAGE_KEYS.LOYALTY_TXNS) || JSON.stringify(LOYALTY_TRANSACTIONS));
    if (matchedCustomer && matchedCustomer.pointHistory && matchedCustomer.pointHistory.length > 0) {
      const adminTxns = matchedCustomer.pointHistory.map((ph, idx) => ({
        id: `admin-pts-${idx}`,
        date: ph.date,
        description: ph.reason || 'Bonus loyalty points added by Admin',
        invoiceNo: 'ADMIN-GRANT',
        type: ph.pts < 0 ? 'redeemed' : 'earned',
        points: Math.abs(ph.pts),
      }));
      transactions = adminTxns;
    }

    const earnedTotal = transactions.filter(t => t.type === 'earned' || t.points > 0).reduce((a, b) => a + Math.abs(b.points), 0);
    const redeemedTotal = Math.abs(transactions.filter(t => t.type === 'redeemed' || t.points < 0).reduce((a, b) => a + Math.abs(b.points), 0));

    return {
      cardNumber,
      qrCodeData: `NAV-LOYALTY-${user.rawMobile || '9876543210'}-PTS-${points}`,
      customerName: user.name,
      mobile: user.mobile,
      isVip: user.isVipMember,
      currentPoints: points,
      pointsValueInRupees: points * 1, // 1 point = ₹1
      earnedTotal,
      redeemedTotal,
      rules: {
        pointsPer100Rupees: 1,
        redemptionMinimumPoints: 100,
        expiryMonths: 24,
      },
      transactions,
    };
  },

  async redeemLoyaltyPoints(pointsToRedeem) {
    await delay(500);
    let pts = JSON.parse(localStorage.getItem(STORAGE_KEYS.LOYALTY_PTS) || '950');
    const txns = JSON.parse(localStorage.getItem(STORAGE_KEYS.LOYALTY_TXNS) || JSON.stringify(LOYALTY_TRANSACTIONS));

    if (pointsToRedeem > pts) {
      throw new Error(`Insufficient points. You have ${pts} points available.`);
    }

    pts -= pointsToRedeem;
    const newTxn = {
      id: `txn-${Date.now()}`,
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      description: `Redeemed ${pointsToRedeem} points for Instant Store Discount Voucher`,
      invoiceNo: `RED-${Math.floor(1000 + Math.random() * 9000)}`,
      points: -pointsToRedeem,
      type: 'redeemed',
    };

    txns.unshift(newTxn);
    localStorage.setItem(STORAGE_KEYS.LOYALTY_PTS, JSON.stringify(pts));
    localStorage.setItem(STORAGE_KEYS.LOYALTY_TXNS, JSON.stringify(txns));

    return {
      success: true,
      voucherCode: `DISC-NAV-${Math.floor(100000 + Math.random() * 900000)}`,
      discountValue: pointsToRedeem,
      newPointsBalance: pts,
    };
  },

  // ---------------- CATALOG SERVICES ----------------
  async getCategories() {
    await delay(250);
    const adminCats = localStorage.getItem('ADMIN_SYNC_CATEGORIES');
    if (adminCats) return JSON.parse(adminCats);
    return CATEGORIES;
  },

  async getProducts(filters = {}) {
    await delay(350);
    const adminProds = localStorage.getItem('ADMIN_SYNC_PRODUCTS');
    let result = adminProds ? JSON.parse(adminProds) : [...PRODUCTS];

    if (filters.category && filters.category !== 'all') {
      result = result.filter(p => p.category.toLowerCase() === filters.category.toLowerCase());
    }

    if (filters.brand && filters.brand !== 'All') {
      result = result.filter(p => p.brand.toLowerCase() === filters.brand.toLowerCase());
    }

    if (filters.search) {
      const q = filters.search.toLowerCase().trim();
      result = result.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
      );
    }

    if (filters.sortBy) {
      if (filters.sortBy === 'price_low') {
        result.sort((a, b) => a.price - b.price);
      } else if (filters.sortBy === 'price_high') {
        result.sort((a, b) => b.price - a.price);
      } else if (filters.sortBy === 'rating') {
        result.sort((a, b) => b.rating - a.rating);
      } else if (filters.sortBy === 'discount') {
        result.sort((a, b) => b.discountPercent - a.discountPercent);
      }
    }

    return result;
  },

  async getProductById(id) {
    await delay(250);
    const adminProds = localStorage.getItem('ADMIN_SYNC_PRODUCTS');
    const allProds = adminProds ? JSON.parse(adminProds) : PRODUCTS;
    const prod = allProds.find(p => p.id === id);
    if (!prod) throw new Error('Product not found');
    const related = allProds.filter(p => p.category === prod.category && p.id !== prod.id);
    return {
      product: prod,
      related,
    };
  },

  async getDailyDeals() {
    await delay(300);
    const adminProds = localStorage.getItem('ADMIN_SYNC_PRODUCTS');
    const allProds = adminProds ? JSON.parse(adminProds) : PRODUCTS;
    return allProds.filter(p => p.isDeal);
  },

  async getRecommendations() {
    await delay(300);
    const adminProds = localStorage.getItem('ADMIN_SYNC_PRODUCTS');
    const allProds = adminProds ? JSON.parse(adminProds) : PRODUCTS;
    // Personalized based on recent purchases
    return allProds.filter(p => p.id === 'prod-2' || p.id === 'prod-6' || p.id === 'prod-7');
  },

  async getBanners() {
    await delay(200);
    return PROMOTIONAL_BANNERS;
  },

  // ---------------- WISHLIST ----------------
  async getWishlist() {
    await delay(300);
    const ids = JSON.parse(localStorage.getItem(STORAGE_KEYS.WISHLIST) || '[]');
    const adminProds = localStorage.getItem('ADMIN_SYNC_PRODUCTS');
    const allProds = adminProds ? JSON.parse(adminProds) : PRODUCTS;
    const items = allProds.filter(p => ids.includes(p.id)).map(p => ({
      ...p,
      priceDropped: p.id === 'prod-7', // Example price drop indicator
      priceDropAmount: p.id === 'prod-7' ? 2000 : 0,
    }));
    return items;
  },

  async toggleWishlist(productId) {
    await delay(200);
    let ids = JSON.parse(localStorage.getItem(STORAGE_KEYS.WISHLIST) || '[]');
    const exists = ids.includes(productId);
    if (exists) {
      ids = ids.filter(id => id !== productId);
    } else {
      ids.push(productId);
    }
    localStorage.setItem(STORAGE_KEYS.WISHLIST, JSON.stringify(ids));
    return {
      isWishlisted: !exists,
      wishlistCount: ids.length,
    };
  },

  // ---------------- NOTIFICATIONS ----------------
  async getNotifications() {
    await delay(250);
    const notifs = JSON.parse(localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS) || JSON.stringify(INITIAL_NOTIFICATIONS));
    const unreadCount = notifs.filter(n => !n.read).length;
    return { notifications: notifs, unreadCount };
  },

  async markNotificationRead(id) {
    await delay(150);
    const notifs = JSON.parse(localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS) || JSON.stringify(INITIAL_NOTIFICATIONS));
    const updated = notifs.map(n => n.id === id ? { ...n, read: true } : n);
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(updated));
    return updated;
  },

  // ---------------- BIRTHDAY REWARD ----------------
  async getBirthdayReward() {
    await delay(300);
    const user = JSON.parse(localStorage.getItem(STORAGE_KEYS.CURRENT_USER) || JSON.stringify(INITIAL_USER));
    return {
      isEligible: true,
      dob: user.dateOfBirth,
      couponCode: 'BDAY-AJEET-1500',
      discountAmount: 1500,
      minPurchase: 10000,
      expiryDate: '31 Oct 2026',
      message: 'Happy Birthday Month from New Ajeet Vision! Enjoy ₹1,500 OFF on any appliance.',
    };
  },

  // ---------------- SHOWROOM INFO ----------------
  async getShowroomInfo() {
    await delay(150);
    return SHOWROOM_INFO;
  }
};
