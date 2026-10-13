import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { LayoutDashboard, Users, ShoppingBag, Gift, Tag, Image, Star,
  TrendingUp, CreditCard, UserCheck, ArrowUpRight, ChevronRight,
  Edit2, Save, X, Plus, Trash2, Settings, ToggleLeft, ToggleRight,
  Package, Megaphone, Zap, Crown, ArrowLeft, Check, Upload, DollarSign, RotateCcw,
  Search
} from 'lucide-react';
import { CATEGORIES, PRODUCTS } from '../../data/mockData';

// ── Sidebar Nav Items
const NAV = [
  { id: 'overview',    label: 'Overview',        icon: LayoutDashboard },
  { id: 'customers',  label: 'Customers',        icon: Users },
  { id: 'categories', label: 'Categories',       icon: Package },
  { id: 'loyalty',    label: 'Loyalty Points',   icon: Star },
  { id: 'rewards',    label: 'Wheel Gifts',      icon: Gift },
  { id: 'deals',      label: "Today's Deals",    icon: Zap },
  { id: 'banners',    label: 'Hero Banners',     icon: Image },
];

// ── Reusable components

const SectionCard = ({ children, className = '' }) => (
  <div className={`bg-white rounded-[20px] border border-[#F1E5DB] shadow-[0_2px_16px_rgba(0,0,0,0.04)] ${className}`}>
    {children}
  </div>
);

const SectionHeader = ({ title, subtitle, action }) => (
  <div className="flex items-center justify-between p-5 border-b border-[#F1E5DB]">
    <div>
      <h2 className="text-[#0B1527] font-bold text-[18px]">{title}</h2>
      {subtitle && <p className="text-[#64748B] text-[13px] mt-0.5">{subtitle}</p>}
    </div>
    {action}
  </div>
);

const Btn = ({ children, onClick, variant = 'primary', size = 'md', className = '' }) => {
  const base = 'flex items-center justify-center gap-1.5 font-semibold rounded-[12px] transition-all';
  const sz = size === 'sm' ? 'px-3 py-1.5 text-[12px]' : 'px-4 py-2 text-[13px]';
  const v = variant === 'primary'
    ? 'bg-gradient-to-r from-[#FF3B4A] to-[#E51020] text-white shadow-sm hover:shadow-md hover:shadow-red-200'
    : variant === 'ghost'
    ? 'bg-[#F7F8FA] border border-[#E2E8F0] text-[#0B1527] hover:bg-[#E8EDF4]'
    : 'bg-[#EDF7F0] border border-[#D5EEDB] text-[#2BB159] hover:bg-[#D5EEDB]';
  return (
    <button onClick={onClick} className={`${base} ${sz} ${v} ${className}`}>
      {children}
    </button>
  );
};

// ── Demo Customer & Bill Definition
export const DEMO_HRITIK = {
  id: 'usr-hritik-demo',
  _id: 'usr-hritik-demo',
  name: 'Hritik Kumar',
  mobile: '+91 99318 42478',
  phone: '+91 99318 42478',
  email: 'hritik@gmail.com',
  points: 950,
  vip: true,
  isVipMember: true,
  outstanding: 0,
  spent: 48990,
  rewardProgress: 49,
  joinedDate: '10 Oct 2024',
  loyaltyCardNumber: 'NAV-2024-8849',
  purchases: [
    {
      _id: 'demo_pur_hritik_001',
      id: 'NAV-2024-001',
      invoiceNumber: 'NAV-2024-001',
      invoiceNo: 'NAV-2024-001',
      name: 'Hritik Kumar',
      customer: { name: 'Hritik Kumar', email: 'hritik@gmail.com', phone: '+91 99318 42478' },
      items: 'Sony Bravia 50" 4K Smart Google TV',
      item: 'Sony Bravia 50" 4K Smart Google TV',
      amount: 48990,
      totalAmount: 48990,
      amt: '₹48,990',
      paid: 48990,
      paidAmount: 48990,
      remainingAmount: 0,
      due: 0,
      date: '10 Oct 2024',
      status: 'Paid',
      method: 'UPI / Online',
    }
  ],
  pointHistory: [
    { date: '10 Oct 2024', type: 'earn', pts: 489, reason: 'Purchase Reward Points', by: 'System' },
    { date: '10 Oct 2024', type: 'bonus', pts: 461, reason: 'VIP Welcome Bonus', by: 'System' },
  ],
};

// ── SECTION: Overview
const OverviewSection = () => {
  const [statsData, setStatsData] = useState({
    totalSales: 48990,
    totalOutstanding: 0,
    totalCustomers: 1,
    totalVipMembers: 1,
    recentPurchases: DEMO_HRITIK.purchases,
  });
  const [loadingStats, setLoadingStats] = useState(true);

  React.useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/admin/dashboard/stats');
        if (res.ok) {
          const data = await res.json();
          const localUsers = JSON.parse(localStorage.getItem('nav_users_db') || '[]');
          const localVips = localUsers.filter(u => u.isVipMember).length;

          const hasDbPurchases = data.recentPurchases && data.recentPurchases.length > 0;
          const sales = (data.totalSales && data.totalSales > 0) ? data.totalSales : 48990;
          const customers = Math.max(1, data.totalCustomers || 0, localUsers.length);
          const vips = Math.max(1, data.totalVipMembers || 0, localVips);
          const purchases = hasDbPurchases ? data.recentPurchases : DEMO_HRITIK.purchases;

          setStatsData({
            totalSales: sales,
            totalOutstanding: data.totalOutstanding || 0,
            totalCustomers: customers,
            totalVipMembers: vips,
            recentPurchases: purchases,
          });
        }
      } catch (err) {
        const localUsers = JSON.parse(localStorage.getItem('nav_users_db') || '[]');
        setStatsData({
          totalSales: 48990,
          totalOutstanding: 0,
          totalCustomers: Math.max(1, localUsers.length),
          totalVipMembers: Math.max(1, localUsers.filter(u => u.isVipMember).length),
          recentPurchases: DEMO_HRITIK.purchases,
        });
      } finally {
        setLoadingStats(false);
      }
    };

    fetchStats();
  }, []);

  const formatCurrency = (amt) => {
    if (!amt || amt === 0) return '₹0';
    if (amt >= 100000) return `₹${(amt / 100000).toFixed(1)}L`;
    return `₹${amt.toLocaleString('en-IN')}`;
  };

  const stats = [
    { 
      label: 'Total Sales', 
      value: formatCurrency(statsData.totalSales), 
      sub: statsData.totalSales > 0 ? '+12% this month' : 'No sales recorded yet', 
      icon: TrendingUp, 
      bg: 'bg-[#E8EDF4]', 
      ic: 'text-[#0B1527]' 
    },
    { 
      label: 'Outstanding', 
      value: formatCurrency(statsData.totalOutstanding), 
      sub: statsData.totalOutstanding > 0 ? 'Pending bills active' : '0 pending bills', 
      icon: CreditCard, 
      bg: 'bg-[#FFEBEC]', 
      ic: 'text-[#FF3B4A]' 
    },
    { 
      label: 'Total Customers', 
      value: statsData.totalCustomers.toString(), 
      sub: statsData.totalCustomers > 0 ? `${statsData.totalCustomers} registered` : '0 registered users', 
      icon: Users, 
      bg: 'bg-[#EBF3FF]', 
      ic: 'text-[#3B82F6]' 
    },
    { 
      label: 'VIP Members', 
      value: statsData.totalVipMembers.toString(), 
      sub: statsData.totalVipMembers > 0 ? `${statsData.totalVipMembers} active members` : '0 active VIPs', 
      icon: Crown, 
      bg: 'bg-[#FEF5E7]', 
      ic: 'text-[#F59E0B]' 
    },
  ];

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-4">
        {stats.map(s => (
          <SectionCard key={s.label} className="p-5">
            <div className={`w-11 h-11 rounded-full flex items-center justify-center mb-4 ${s.bg}`}>
              <s.icon className={`w-5 h-5 ${s.ic}`} />
            </div>
            <p className="text-[#64748B] text-[12px] font-medium">{s.label}</p>
            <p className="text-[#0B1527] font-extrabold text-[22px] tracking-tight">{s.value}</p>
            <p className="text-[#2BB159] text-[11px] font-semibold mt-0.5">{s.sub}</p>
          </SectionCard>
        ))}
      </div>

      <SectionCard>
        <SectionHeader title="Recent Bills" />
        {statsData.recentPurchases && statsData.recentPurchases.length > 0 ? (
          <div className="divide-y divide-[#F7F8FA]">
            {statsData.recentPurchases.map(r => (
              <div key={r._id || r.invoiceNumber || r.invoiceNo || r.id} className="flex items-center justify-between px-5 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#F1E5DB] flex items-center justify-center font-bold text-[#0B1527] text-[14px]">
                    {(r.customer?.name || r.name || 'H')[0]}
                  </div>
                  <div>
                    <p className="text-[#0B1527] font-semibold text-[14px]">{r.customer?.name || r.name || 'Hritik Kumar'}</p>
                    <p className="text-[#64748B] text-[11px]">{r.invoiceNumber || r.invoiceNo || r.id || 'NAV-2024-001'}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[#0B1527] font-bold text-[14px]">₹{(r.totalAmount || (typeof r.amt === 'string' ? parseInt(r.amt.replace(/[^0-9]/g, '')) : r.amt) || 48990).toLocaleString('en-IN')}</p>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${r.remainingAmount > 0 ? 'bg-[#FFEBEC] text-[#FF3B4A]' : 'bg-[#EDF7F0] text-[#2BB159]'}`}>
                    {r.remainingAmount > 0 ? 'Pending EMI' : 'Paid'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-12 px-4 text-center flex flex-col items-center justify-center">
            <div className="w-12 h-12 rounded-2xl bg-[#F7F8FA] flex items-center justify-center text-[#64748B] mb-3 border border-[#E2E8F0]">
              <CreditCard className="w-6 h-6 text-[#94A3B8]" />
            </div>
            <p className="text-[#0B1527] font-bold text-[15px]">No Bills Generated Yet</p>
            <p className="text-[#64748B] text-[12px] mt-1 max-w-sm">
              All customer and purchase records in the database are currently 0. When customers purchase products in the showroom or via the app, invoices will automatically show up here.
            </p>
          </div>
        )}
      </SectionCard>
    </div>
  );
};

// ── SECTION: Customers
const CustomersSection = () => {
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [pointsForm, setPointsForm] = useState({ amount: '', reason: '', note: '' });
  const [pointsSaved, setPointsSaved] = useState(false);
  const [pointsTab, setPointsTab] = useState('give'); // 'give' | 'history'
  
  const [editCardNumber, setEditCardNumber] = useState('');
  const [isEditingCard, setIsEditingCard] = useState(false);

  // States for adding bill / purchase
  const [isAddingBill, setIsAddingBill] = useState(false);
  const [billForm, setBillForm] = useState({
    invoiceNumber: '',
    description: '',
    totalAmount: '',
    paymentStatus: 'paid', // 'paid' | 'partial'
    amountPaid: '',
    pointsToAward: '',
    billDate: new Date().toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' }),
  });
  const [billSaving, setBillSaving] = useState(false);
  const [billSuccess, setBillSuccess] = useState(false);

  const [customers, setCustomers] = useState(() => {
    const saved = localStorage.getItem('ADMIN_SYNC_CUSTOMERS');
    let list = saved ? JSON.parse(saved) : [];
    return list.filter(c => c && c.id !== 'usr-hritik-demo');
  });
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Fetch live customers directly from MongoDB Atlas
  const fetchCustomersFromDb = React.useCallback(async (showIndicator = false) => {
    try {
      if (showIndicator) setIsRefreshing(true);
      const res = await fetch('/api/admin/dashboard/customers');
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.customers)) {
          setCustomers(data.customers);
          localStorage.setItem('ADMIN_SYNC_CUSTOMERS', JSON.stringify(data.customers));
          setSelectedCustomer(prev => {
            if (!prev) return null;
            const updated = data.customers.find(c => c.id === prev.id || (c.email && prev.email && c.email.toLowerCase() === prev.email.toLowerCase()));
            return updated ? { ...prev, ...updated } : prev;
          });
        }
      }
    } catch (err) {
      console.warn('Could not fetch server customers:', err.message);
    } finally {
      if (showIndicator) setTimeout(() => setIsRefreshing(false), 500);
    }
  }, []);

  // Poll database in real time every 3.5s
  React.useEffect(() => {
    fetchCustomersFromDb();
    const interval = setInterval(() => {
      fetchCustomersFromDb();
    }, 3500);
    return () => clearInterval(interval);
  }, [fetchCustomersFromDb]);

  const filtered = customers.filter(c => {
    const matchesFilter = filter === 'vip' ? c.vip : filter === 'outstanding' ? c.outstanding > 0 : true;
    if (!matchesFilter) return false;
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    return (
      (c.name && c.name.toLowerCase().includes(q)) ||
      (c.email && c.email.toLowerCase().includes(q)) ||
      (c.mobile && c.mobile.includes(q)) ||
      (c.loyaltyCardNumber && c.loyaltyCardNumber.toLowerCase().includes(q))
    );
  });

  const handleGivePoints = async () => {
    if (!pointsForm.amount || Number(pointsForm.amount) <= 0 || !selectedCustomer) return;
    const pts = Number(pointsForm.amount);

    // 1. Persist directly to MongoDB Atlas
    try {
      await fetch('/api/admin/dashboard/customers/give-points', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerId: selectedCustomer._id || selectedCustomer.id,
          email: selectedCustomer.email,
          points: pts,
        })
      });
    } catch (err) {
      console.warn('DB give-points API note:', err);
    }

    const updatedCustomers = customers.map(c => {
      if (c.id !== selectedCustomer.id) return c;
      return {
        ...c,
        points: (c.points || 0) + pts,
        pointHistory: [
          { date: new Date().toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' }), type: 'manual', pts, reason: pointsForm.reason || 'Manual bonus by admin', by: 'Admin' },
          ...(c.pointHistory || []),
        ],
      };
    });
    setCustomers(updatedCustomers);
    localStorage.setItem('ADMIN_SYNC_CUSTOMERS', JSON.stringify(updatedCustomers));

    const newTotal = (selectedCustomer.points || 0) + pts;
    setSelectedCustomer(prev => ({ ...prev, points: newTotal,
      pointHistory: [
        { date: new Date().toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' }), type: 'manual', pts, reason: pointsForm.reason || 'Manual bonus by admin', by: 'Admin' },
        ...(prev.pointHistory || []),
      ]
    }));

    // Sync to active logged-in user profile if it matches selected customer
    const activeUser = JSON.parse(localStorage.getItem('nav_user_profile') || 'null');
    if (activeUser && (
      (activeUser.email && selectedCustomer.email && activeUser.email.toLowerCase() === selectedCustomer.email.toLowerCase()) ||
      (activeUser.name && activeUser.name.toLowerCase() === selectedCustomer.name.toLowerCase())
    )) {
      localStorage.setItem('nav_loyalty_pts', JSON.stringify(newTotal));
      activeUser.loyaltyPoints = newTotal;
      localStorage.setItem('nav_user_profile', JSON.stringify(activeUser));
    }

    setPointsForm({ amount: '', reason: '', note: '' });
    setPointsSaved(true);
    setTimeout(() => setPointsSaved(false), 3000);
    setTimeout(() => fetchCustomersFromDb(), 600);
  };

  const handleSaveCardNumber = () => {
    if (!selectedCustomer) return;
    const cardNum = editCardNumber.toUpperCase();
    const updatedCustomers = customers.map(c => {
      if (c.id === selectedCustomer.id) {
        return { ...c, loyaltyCardNumber: cardNum };
      }
      return c;
    });
    setCustomers(updatedCustomers);
    localStorage.setItem('ADMIN_SYNC_CUSTOMERS', JSON.stringify(updatedCustomers));
    setSelectedCustomer({ ...selectedCustomer, loyaltyCardNumber: cardNum });

    // Sync to active user profile if matched
    const activeUser = JSON.parse(localStorage.getItem('nav_user_profile') || 'null');
    if (activeUser && (
      (activeUser.email && selectedCustomer.email && activeUser.email.toLowerCase() === selectedCustomer.email.toLowerCase()) ||
      (activeUser.name && activeUser.name.toLowerCase() === selectedCustomer.name.toLowerCase())
    )) {
      activeUser.loyaltyCardNumber = cardNum;
      localStorage.setItem('nav_user_profile', JSON.stringify(activeUser));
    }

    setIsEditingCard(false);
  };

  const handleToggleVip = async () => {
    if (!selectedCustomer) return;
    const targetVip = !Boolean(selectedCustomer.vip);

    try {
      await fetch('/api/admin/dashboard/customers/toggle-vip', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerId: selectedCustomer._id || selectedCustomer.id,
          email: selectedCustomer.email,
          isVip: targetVip,
        })
      });
    } catch (err) {
      console.warn('VIP toggle API error:', err);
    }

    const updated = { ...selectedCustomer, vip: targetVip, isVipMember: targetVip };
    setSelectedCustomer(updated);
    setCustomers(prev => prev.map(c => c.id === selectedCustomer.id ? { ...c, vip: targetVip, isVipMember: targetVip } : c));
    setTimeout(() => fetchCustomersFromDb(), 500);
  };

  const handleAddBill = async (e) => {
    e?.preventDefault?.();
    if (!selectedCustomer) return;
    if (!billForm.description.trim()) {
      alert('Please enter a description or product name.');
      return;
    }
    const totalAmt = Number(billForm.totalAmount);
    if (!totalAmt || totalAmt <= 0) {
      alert('Please enter a valid bill amount.');
      return;
    }

    setBillSaving(true);

    const paidAmt = billForm.paymentStatus === 'paid' ? totalAmt : Number(billForm.amountPaid || 0);
    const dueAmt = Math.max(0, totalAmt - paidAmt);
    const pts = Number(billForm.pointsToAward || 0);
    const invNo = billForm.invoiceNumber.trim() || `VYP-${Date.now().toString().slice(-4)}`;
    const billDate = billForm.billDate || new Date().toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' });

    const newPurchase = {
      id: invNo,
      invoiceNumber: invNo,
      invoiceNo: invNo,
      name: selectedCustomer.name,
      item: billForm.description.trim(),
      items: billForm.description.trim(),
      amount: totalAmt,
      totalAmount: totalAmt,
      amt: `₹${totalAmt.toLocaleString('en-IN')}`,
      paid: paidAmt,
      paidAmount: paidAmt,
      due: dueAmt,
      remainingAmount: dueAmt,
      date: billDate,
      status: dueAmt > 0 ? 'Pending' : 'Paid',
      method: dueAmt > 0 ? 'EMI / Partial' : 'Paid in Full',
    };

    // Calculate updated metrics
    const newSpent = (Number(selectedCustomer.spent) || 0) + totalAmt;
    const newOutstanding = (Number(selectedCustomer.outstanding) || 0) + dueAmt;
    const newPoints = (Number(selectedCustomer.points) || 0) + pts;
    const newProgress = Math.min(100, Math.round((newSpent / 100000) * 100));

    const updatedPointHistory = pts > 0 ? [
      {
        date: billDate,
        type: 'earn',
        pts: pts,
        reason: `Vyapar Bill: ${billForm.description.trim()} (${invNo})`,
        by: 'Admin'
      },
      ...(selectedCustomer.pointHistory || [])
    ] : (selectedCustomer.pointHistory || []);

    const updatedPurchases = [newPurchase, ...(selectedCustomer.purchases || [])];

    const updatedCustomer = {
      ...selectedCustomer,
      spent: newSpent,
      outstanding: newOutstanding,
      points: newPoints,
      rewardProgress: newProgress,
      purchases: updatedPurchases,
      pointHistory: updatedPointHistory,
    };

    // Update state & localStorage
    const updatedList = customers.map(cust => cust.id === selectedCustomer.id ? updatedCustomer : cust);
    setCustomers(updatedList);
    setSelectedCustomer(updatedCustomer);
    localStorage.setItem('ADMIN_SYNC_CUSTOMERS', JSON.stringify(updatedList));

    // If active user profile matches this customer, sync so their app views update in real time
    const activeUser = JSON.parse(localStorage.getItem('nav_user_profile') || 'null');
    if (activeUser && (
      (activeUser.email && selectedCustomer.email && activeUser.email.toLowerCase() === selectedCustomer.email.toLowerCase()) ||
      (activeUser.name && activeUser.name.toLowerCase() === selectedCustomer.name.toLowerCase()) ||
      (activeUser.mobile && selectedCustomer.mobile && activeUser.mobile.replace(/\D/g, '') === selectedCustomer.mobile.replace(/\D/g, ''))
    )) {
      activeUser.loyaltyPoints = newPoints;
      activeUser.rewardProgress = {
        currentAmount: newSpent,
        targetAmount: 100000,
        isUnlocked: newSpent >= 100000,
      };
      localStorage.setItem('nav_user_profile', JSON.stringify(activeUser));
      localStorage.setItem('nav_loyalty_pts', JSON.stringify(newPoints));
    }

    // Generate real billing notification for this customer (visible only when bill added by Admin)
    try {
      const custEmail = selectedCustomer.email ? selectedCustomer.email.toLowerCase() : null;
      const targetNotifKeys = custEmail ? [`nav_notifications_${custEmail}`, 'nav_notifications'] : ['nav_notifications'];
      const newBillNotif = {
        id: `notif-bill-${Date.now()}`,
        title: '🧾 New Showroom Bill Generated',
        message: `Bill #${invNo} generated for ${billForm.description.trim()} of ₹${totalAmt.toLocaleString('en-IN')}.${pts > 0 ? ` +${pts} loyalty points earned!` : ''}`,
        time: 'Just now',
        type: 'bill',
        read: false,
        action: 'purchases',
      };
      targetNotifKeys.forEach(k => {
        const notifs = JSON.parse(localStorage.getItem(k) || '[]');
        notifs.unshift(newBillNotif);
        localStorage.setItem(k, JSON.stringify(notifs));
      });
    } catch (e) {}

    // Also notify backend API to record in MongoDB
    try {
      await fetch('/api/purchases/manual', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerId: selectedCustomer._id || selectedCustomer.id,
          customerMobile: selectedCustomer.mobile,
          customerEmail: selectedCustomer.email,
          invoiceNumber: invNo,
          description: billForm.description.trim(),
          totalAmount: totalAmt,
          amountPaid: paidAmt,
          pointsAwarded: pts,
        })
      });
    } catch (apiErr) {
      console.warn('API purchase sync note:', apiErr);
    }

    setTimeout(() => fetchCustomersFromDb(), 600);

    setBillSaving(false);
    setBillSuccess(true);
    setTimeout(() => {
      setBillSuccess(false);
      setIsAddingBill(false);
      setBillForm({
        invoiceNumber: '',
        description: '',
        totalAmount: '',
        paymentStatus: 'paid',
        amountPaid: '',
        pointsToAward: '',
        billDate: new Date().toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' }),
      });
    }, 1200);
  };

  // ─── Customer Detail View ───
  if (selectedCustomer) {
    const c = selectedCustomer;
    const customerSpent = Number(c.spent) || 0;
    const customerOutstanding = Number(c.outstanding) || 0;
    const customerPoints = Number(c.points) || 0;
    const customerPurchases = Array.isArray(c.purchases) ? c.purchases : [];
    const customerHistory = Array.isArray(c.pointHistory) ? c.pointHistory : [];
    const progressPercent = Math.min(100, Math.round(((customerSpent || Number(c.rewardProgress) || 0) / 100000) * 100));

    return (
      <div className="space-y-4">
        {/* Back bar */}
        <button onClick={() => setSelectedCustomer(null)}
          className="flex items-center gap-2 text-[#0B1527] font-semibold text-[14px] hover:text-[#FF3B4A] transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Customers
        </button>

        {/* Profile Card */}
        <SectionCard className="p-5">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#FF3B4A] to-[#0B1527] flex items-center justify-center text-white font-extrabold text-[24px] flex-shrink-0">
              {(c.name || 'U')[0]}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-[#0B1527] font-extrabold text-[20px]">{c.name || 'Customer'}</h2>
                <button
                  onClick={handleToggleVip}
                  className={`text-[11px] font-bold px-2.5 py-1 rounded-full border transition flex items-center gap-1 cursor-pointer active:scale-95 ${
                    c.vip
                      ? 'bg-amber-50 text-amber-700 border-amber-300 hover:bg-amber-100 shadow-xs'
                      : 'bg-gray-100 text-gray-600 border-gray-300 hover:bg-gray-200'
                  }`}
                  title="Click to toggle VIP Membership in MongoDB Atlas"
                >
                  <Crown className={`w-3 h-3 ${c.vip ? 'text-amber-500 fill-amber-400' : 'text-gray-400'}`} />
                  {c.vip ? 'VIP Member (Active)' : 'Upgrade to VIP'}
                </button>
              </div>
              <p className="text-[#64748B] text-[13px]">{c.mobile || 'No Mobile'} · {c.email || 'No Email'}</p>
              <p className="text-[#64748B] text-[12px]">Member since {c.joinedDate || '10 Oct 2024'}</p>
            </div>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-3 gap-3 mt-5">
            <div className="bg-[#F7F8FA] rounded-[14px] p-3 text-center">
              <p className="text-[#64748B] text-[10px] font-medium">Total Spent</p>
              <p className="text-[#0B1527] font-extrabold text-[15px]">₹{customerSpent.toLocaleString('en-IN')}</p>
            </div>
            <div className="bg-[#FEF5E7] rounded-[14px] p-3 text-center">
              <p className="text-[#64748B] text-[10px] font-medium">Loyalty Pts</p>
              <p className="text-[#F59E0B] font-extrabold text-[15px]">⭐ {customerPoints}</p>
            </div>
            <div className={`${customerOutstanding > 0 ? 'bg-[#FFEBEC]' : 'bg-[#EDF7F0]'} rounded-[14px] p-3 text-center`}>
              <p className="text-[#64748B] text-[10px] font-medium">Outstanding</p>
              <p className={`font-extrabold text-[15px] ${customerOutstanding > 0 ? 'text-[#FF3B4A]' : 'text-[#2BB159]'}`}>
                {customerOutstanding > 0 ? `₹${customerOutstanding.toLocaleString('en-IN')}` : '✓ Clear'}
              </p>
            </div>
          </div>

          {/* Reward Progress */}
          <div className="mt-4">
            <div className="flex justify-between items-center mb-1.5">
              <p className="text-[#64748B] text-[12px] font-medium">₹1L Reward Progress</p>
              <p className="text-[#0B1527] font-bold text-[12px]">{progressPercent}%</p>
            </div>
            <div className="h-2.5 bg-[#E2E8F0] rounded-full overflow-hidden">
              <div className="h-full rounded-full bg-gradient-to-r from-[#FF3B4A] to-[#E51020] transition-all duration-500"
                style={{ width: `${progressPercent}%` }} />
            </div>
          </div>
        </SectionCard>

        {/* Loyalty Card Management */}
        <SectionCard className="p-5">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-[#0B1527] font-bold text-[14px]">Physical Loyalty Card</h3>
              <p className="text-[#64748B] text-[11px] mt-0.5">Link a pre-printed card number to this account.</p>
            </div>
            {!isEditingCard && (
              <button onClick={() => { setEditCardNumber(c.loyaltyCardNumber || ''); setIsEditingCard(true); }} className="text-[#3B82F6] text-[12px] font-bold flex items-center gap-1 hover:underline">
                <Edit2 className="w-3 h-3" /> Edit
              </button>
            )}
          </div>
          
          {isEditingCard ? (
            <div className="flex gap-2">
              <input 
                type="text" 
                value={editCardNumber}
                onChange={e => setEditCardNumber(e.target.value.toUpperCase())}
                placeholder="Enter 12-Digit Card No"
                className="flex-1 bg-[#F7F8FA] border border-[#E2E8F0] rounded-[10px] px-3 py-2 text-[13px] font-mono text-[#0B1527] focus:border-[#3B82F6] outline-none uppercase"
              />
              <button onClick={handleSaveCardNumber} className="bg-[#2BB159] text-white px-4 py-2 rounded-[10px] font-bold text-[13px] hover:bg-[#228B47]">
                Save
              </button>
              <button onClick={() => setIsEditingCard(false)} className="bg-[#F1E5DB] text-[#0B1527] px-3 py-2 rounded-[10px] hover:bg-[#E5D5C5]">
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="bg-[#F7F8FA] border border-[#E2E8F0] rounded-[10px] p-3 flex items-center gap-3">
              <CreditCard className="w-5 h-5 text-[#64748B]" />
              {c.loyaltyCardNumber ? (
                <span className="font-mono font-bold text-[#0B1527] tracking-wider">{c.loyaltyCardNumber}</span>
              ) : (
                <span className="text-[#64748B] text-[13px] italic">No physical card linked</span>
              )}
            </div>
          )}
        </SectionCard>

        {/* Purchases */}
        <SectionCard>
          <SectionHeader 
            title="Purchase History" 
            subtitle={`${customerPurchases.length} bills recorded`} 
            action={
              <button 
                onClick={() => {
                  setBillForm({
                    invoiceNumber: `VYP-${Date.now().toString().slice(-4)}`,
                    description: '',
                    totalAmount: '',
                    paymentStatus: 'paid',
                    amountPaid: '',
                    pointsToAward: '',
                    billDate: new Date().toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' }),
                  });
                  setIsAddingBill(true);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-[12px] bg-gradient-to-r from-[#FF3B4A] to-[#E51020] text-white text-[12px] font-bold shadow-sm hover:shadow-md hover:shadow-red-200 transition-all cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Add Bill / Purchase
              </button>
            }
          />

          {/* Add Purchase / Bill Modal */}
          {isAddingBill && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
              <div className="bg-white rounded-[24px] max-w-lg w-full p-6 shadow-2xl border border-[#F1E5DB] max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between pb-4 border-b border-[#F1E5DB]">
                  <div>
                    <h3 className="text-[#0B1527] font-extrabold text-[18px]">Add Customer Purchase</h3>
                    <p className="text-[#64748B] text-[12px] mt-0.5">Recording for: <span className="font-bold text-[#0B1527]">{c.name}</span> ({c.mobile || c.email})</p>
                  </div>
                  <button 
                    onClick={() => setIsAddingBill(false)} 
                    className="w-8 h-8 rounded-full bg-[#F7F8FA] flex items-center justify-center text-[#64748B] hover:text-[#0B1527] hover:bg-[#E2E8F0] transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <form onSubmit={handleAddBill} className="space-y-4 mt-5">
                  {/* Invoice Number & Date */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[12px] text-[#64748B] font-semibold block mb-1">Vyapar Bill No.</label>
                      <input 
                        type="text"
                        placeholder="e.g. VYP-1042"
                        value={billForm.invoiceNumber}
                        onChange={e => setBillForm(f => ({ ...f, invoiceNumber: e.target.value.toUpperCase() }))}
                        className="w-full bg-[#F7F8FA] border border-[#E2E8F0] rounded-[12px] px-3.5 py-2.5 text-[13px] font-mono text-[#0B1527] focus:outline-none focus:border-[#FF3B4A]"
                      />
                    </div>
                    <div>
                      <label className="text-[12px] text-[#64748B] font-semibold block mb-1">Bill Date</label>
                      <input 
                        type="text"
                        value={billForm.billDate}
                        onChange={e => setBillForm(f => ({ ...f, billDate: e.target.value }))}
                        className="w-full bg-[#F7F8FA] border border-[#E2E8F0] rounded-[12px] px-3.5 py-2.5 text-[13px] text-[#0B1527] focus:outline-none focus:border-[#FF3B4A]"
                      />
                    </div>
                  </div>

                  {/* Description / Item */}
                  <div>
                    <label className="text-[12px] text-[#64748B] font-semibold block mb-1">Product Description / Items <span className="text-[#FF3B4A]">*</span></label>
                    <input 
                      type="text"
                      required
                      placeholder="e.g. Samsung 43 Inch 4K Smart TV / Havells Fan"
                      value={billForm.description}
                      onChange={e => setBillForm(f => ({ ...f, description: e.target.value }))}
                      className="w-full bg-[#F7F8FA] border border-[#E2E8F0] rounded-[12px] px-3.5 py-2.5 text-[13px] text-[#0B1527] focus:outline-none focus:border-[#FF3B4A]"
                    />
                  </div>

                  {/* Bill Amount */}
                  <div>
                    <label className="text-[12px] text-[#64748B] font-semibold block mb-1">Total Bill Amount (₹) <span className="text-[#FF3B4A]">*</span></label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-2.5 text-[#64748B] font-bold text-[14px]">₹</span>
                      <input 
                        type="number"
                        required
                        min="1"
                        placeholder="e.g. 35000"
                        value={billForm.totalAmount}
                        onChange={e => setBillForm(f => ({ ...f, totalAmount: e.target.value }))}
                        className="w-full bg-[#F7F8FA] border border-[#E2E8F0] rounded-[12px] pl-8 pr-3.5 py-2.5 text-[15px] font-bold text-[#0B1527] focus:outline-none focus:border-[#FF3B4A]"
                      />
                    </div>
                  </div>

                  {/* Payment Status Switcher */}
                  <div>
                    <label className="text-[12px] text-[#64748B] font-semibold block mb-1.5">Payment Status</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setBillForm(f => ({ ...f, paymentStatus: 'paid', amountPaid: '' }))}
                        className={`py-2 px-3 rounded-[12px] text-[12px] font-bold border transition-all ${
                          billForm.paymentStatus === 'paid'
                            ? 'bg-[#EDF7F0] border-[#2BB159] text-[#2BB159]'
                            : 'bg-[#F7F8FA] border-[#E2E8F0] text-[#64748B]'
                        }`}
                      >
                        ✓ Paid in Full
                      </button>
                      <button
                        type="button"
                        onClick={() => setBillForm(f => ({ ...f, paymentStatus: 'partial', amountPaid: f.amountPaid || '0' }))}
                        className={`py-2 px-3 rounded-[12px] text-[12px] font-bold border transition-all ${
                          billForm.paymentStatus === 'partial'
                            ? 'bg-[#FFEBEC] border-[#FF3B4A] text-[#FF3B4A]'
                            : 'bg-[#F7F8FA] border-[#E2E8F0] text-[#64748B]'
                        }`}
                      >
                        ⚠️ Partial / EMI Due
                      </button>
                    </div>
                  </div>

                  {/* Partial / EMI Fields */}
                  {billForm.paymentStatus === 'partial' && (
                    <div className="bg-[#FFF5F5] border border-[#FFD0D4] rounded-[14px] p-3.5 space-y-2.5">
                      <div>
                        <label className="text-[11px] text-[#64748B] font-semibold block mb-1">Amount Paid Now (₹)</label>
                        <input 
                          type="number"
                          min="0"
                          placeholder="e.g. 10000"
                          value={billForm.amountPaid}
                          onChange={e => setBillForm(f => ({ ...f, amountPaid: e.target.value }))}
                          className="w-full bg-white border border-[#E2E8F0] rounded-[10px] px-3 py-2 text-[13px] font-bold text-[#0B1527] focus:outline-none focus:border-[#FF3B4A]"
                        />
                      </div>
                      <div className="flex justify-between items-center text-[12px]">
                        <span className="text-[#64748B]">Remaining Outstanding Due:</span>
                        <span className="font-extrabold text-[#FF3B4A]">
                          ₹{Math.max(0, (Number(billForm.totalAmount) || 0) - (Number(billForm.amountPaid) || 0)).toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Manual Loyalty Points */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-[12px] text-[#64748B] font-semibold">Loyalty Points to Award (Manual)</label>
                      <span className="text-[11px] text-[#F59E0B] font-medium">Leave 0 if none</span>
                    </div>
                    <div className="relative">
                      <span className="absolute left-3.5 top-2.5 text-[#F59E0B] font-bold text-[14px]">⭐</span>
                      <input 
                        type="number"
                        min="0"
                        placeholder="e.g. 350"
                        value={billForm.pointsToAward}
                        onChange={e => setBillForm(f => ({ ...f, pointsToAward: e.target.value }))}
                        className="w-full bg-[#F7F8FA] border border-[#E2E8F0] rounded-[12px] pl-9 pr-3.5 py-2.5 text-[14px] font-bold text-[#0B1527] focus:outline-none focus:border-[#FF3B4A]"
                      />
                    </div>
                  </div>

                  {/* Real-time Target Progress & Impact Preview */}
                  {Number(billForm.totalAmount) > 0 && (
                    <div className="bg-[#F7F8FA] border border-[#E2E8F0] rounded-[16px] p-4 space-y-2">
                      <p className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider">Preview of Impact</p>
                      <div className="grid grid-cols-3 gap-2 text-center">
                        <div className="bg-white p-2 rounded-[10px] border border-[#E2E8F0]">
                          <p className="text-[10px] text-[#64748B]">New Spent</p>
                          <p className="text-[13px] font-extrabold text-[#0B1527]">
                            ₹{(customerSpent + (Number(billForm.totalAmount) || 0)).toLocaleString('en-IN')}
                          </p>
                        </div>
                        <div className="bg-white p-2 rounded-[10px] border border-[#E2E8F0]">
                          <p className="text-[10px] text-[#64748B]">₹1L Target</p>
                          <p className="text-[13px] font-extrabold text-[#FF3B4A]">
                            {Math.min(100, Math.round(((customerSpent + (Number(billForm.totalAmount) || 0)) / 100000) * 100))}%
                          </p>
                        </div>
                        <div className="bg-white p-2 rounded-[10px] border border-[#E2E8F0]">
                          <p className="text-[10px] text-[#64748B]">New Balance</p>
                          <p className="text-[13px] font-extrabold text-[#F59E0B]">
                            {customerPoints + (Number(billForm.pointsToAward) || 0)} pts
                          </p>
                        </div>
                      </div>
                      {customerSpent + (Number(billForm.totalAmount) || 0) >= 100000 && (
                        <div className="bg-[#EDF7F0] text-[#2BB159] text-[11px] font-bold p-2 rounded-[8px] text-center">
                          🎉 Milestone Reached: Customer unlocks ₹1 Lakh Reward Gift!
                        </div>
                      )}
                    </div>
                  )}

                  {/* Success feedback */}
                  {billSuccess && (
                    <div className="bg-[#EDF7F0] border border-[#D5EEDB] rounded-[12px] p-3 text-center text-[#2BB159] font-bold text-[13px] flex items-center justify-center gap-2">
                      <Check className="w-4 h-4" />
                      Bill Recorded & Target Progress Updated!
                    </div>
                  )}

                  {/* Form Buttons */}
                  <div className="flex gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsAddingBill(false)}
                      className="flex-1 py-3 rounded-[12px] border border-[#E2E8F0] font-bold text-[13px] text-[#64748B] hover:bg-[#F7F8FA]"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={billSaving || !billForm.description.trim() || !billForm.totalAmount}
                      className="flex-1 py-3 rounded-[12px] bg-gradient-to-r from-[#FF3B4A] to-[#E51020] text-white font-bold text-[13px] shadow hover:shadow-lg hover:shadow-red-200 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                    >
                      {billSaving ? 'Saving...' : 'Save Bill & Update Target'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          <div className="divide-y divide-[#F7F8FA]">
            {customerPurchases.length > 0 ? (
              customerPurchases.map((p, idx) => {
                const pAmt = Number(p.amount ?? p.totalAmount ?? (typeof p.amt === 'string' ? p.amt.replace(/[^0-9]/g, '') : p.amt) ?? 0);
                const pPaid = Number(p.paid ?? p.paidAmount ?? p.amountPaid ?? pAmt);
                const pDue = Number(p.due ?? p.remainingAmount ?? Math.max(0, pAmt - pPaid));
                const pItems = p.items || p.item || (p.products && p.products.map(pr => pr.name).join(', ')) || 'Store Purchase';
                const pInvoice = p.invoiceNumber || p.invoiceNo || p.id || `INV-${idx + 1}`;
                const pStatus = p.status || (pDue > 0 ? 'Pending' : 'Paid');

                return (
                  <div key={p.id || p._id || pInvoice || idx} className="px-5 py-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-[#0B1527] font-semibold text-[13px]">{pItems}</p>
                        <p className="text-[#64748B] text-[11px] mt-0.5">{pInvoice} · {p.date || 'Recent'}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[#0B1527] font-bold text-[14px]">₹{pAmt.toLocaleString('en-IN')}</p>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md inline-block mt-0.5 ${
                          pStatus === 'Paid' ? 'bg-[#EDF7F0] text-[#2BB159]' :
                          pStatus === 'Pending' ? 'bg-[#FFEBEC] text-[#FF3B4A]' :
                          'bg-[#FEF5E7] text-[#F59E0B]'
                        }`}>{pStatus}</span>
                      </div>
                    </div>
                    {pPaid < pAmt && (
                      <div className="mt-2 flex justify-between text-[11px]">
                        <span className="text-[#64748B]">Paid: <span className="text-[#2BB159] font-semibold">₹{pPaid.toLocaleString('en-IN')}</span></span>
                        <span className="text-[#64748B]">Due: <span className="text-[#FF3B4A] font-semibold">₹{pDue.toLocaleString('en-IN')}</span></span>
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="p-6 text-center text-[#64748B] text-[13px]">
                No purchase bills recorded for this customer yet.
              </div>
            )}
          </div>
        </SectionCard>

        {/* Points Panel */}
        <SectionCard>
          {/* Tab switcher */}
          <div className="flex border-b border-[#F1E5DB]">
            {[['give', '⭐ Give Points'], ['history', '📜 Point History']].map(([t, label]) => (
              <button key={t} onClick={() => setPointsTab(t)}
                className={`flex-1 py-3.5 text-[13px] font-bold transition-colors ${pointsTab === t
                  ? 'text-[#FF3B4A] border-b-2 border-[#FF3B4A]'
                  : 'text-[#64748B]'}`}>
                {label}
              </button>
            ))}
          </div>

          {/* Give Points Form */}
          {pointsTab === 'give' && (
            <div className="p-5 space-y-4">
              <div className="bg-[#FEF5E7] rounded-[14px] p-4 flex items-center gap-3">
                <Star className="w-6 h-6 text-[#F59E0B]" fill="#F59E0B" />
                <div>
                  <p className="text-[#64748B] text-[11px] font-medium">Current Balance</p>
                  <p className="text-[#0B1527] font-extrabold text-[22px]">{customerPoints} <span className="text-[14px] font-semibold text-[#F59E0B]">points</span></p>
                </div>
              </div>

              {/* Quick Point Presets based on purchase amounts */}
              <div>
                <p className="text-[#64748B] text-[12px] font-medium mb-2">Quick add (based on purchase):</p>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { label: '₹5K', pts: 50 }, { label: '₹10K', pts: 100 },
                    { label: '₹25K', pts: 250 }, { label: '₹50K', pts: 500 },
                  ].map(preset => (
                    <button key={preset.pts}
                      onClick={() => setPointsForm(f => ({ ...f, amount: String(preset.pts) }))}
                      className={`py-2 rounded-[10px] text-[12px] font-bold border transition-all ${
                        pointsForm.amount === String(preset.pts)
                          ? 'bg-[#0B1527] text-white border-[#0B1527]'
                          : 'bg-[#F7F8FA] border-[#E2E8F0] text-[#64748B] hover:border-[#0B1527]'
                      }`}>
                      <span className="block text-center">{preset.pts} pts</span>
                      <span className="block text-center text-[10px] opacity-70">{preset.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[12px] text-[#64748B] font-medium block mb-1.5">Points to add</label>
                <input
                  type="number"
                  placeholder="Enter points (e.g. 150)"
                  value={pointsForm.amount}
                  onChange={e => setPointsForm(f => ({ ...f, amount: e.target.value }))}
                  className="w-full border-2 border-[#E2E8F0] rounded-[12px] px-4 py-3 text-[16px] font-bold text-center focus:outline-none focus:border-[#FF3B4A] transition-colors"
                />
                {pointsForm.amount && (
                  <p className="text-[#2BB159] text-[12px] font-semibold text-center mt-1.5">
                    New balance will be: {customerPoints + Number(pointsForm.amount)} pts
                  </p>
                )}
              </div>

              <div>
                <label className="text-[12px] text-[#64748B] font-medium block mb-1.5">Reason (required)</label>
                <input
                  placeholder="e.g. Purchase of Samsung TV, Festive bonus, etc."
                  value={pointsForm.reason}
                  onChange={e => setPointsForm(f => ({ ...f, reason: e.target.value }))}
                  className="w-full border border-[#E2E8F0] rounded-[12px] px-3 py-2.5 text-[13px] focus:outline-none focus:border-[#FF3B4A]"
                />
              </div>

              {pointsSaved && (
                <div className="bg-[#EDF7F0] border border-[#D5EEDB] rounded-[12px] px-4 py-3 flex items-center gap-2">
                  <Check className="w-5 h-5 text-[#2BB159]" />
                  <p className="text-[#2BB159] font-semibold text-[13px]">Points added successfully!</p>
                </div>
              )}

              <button
                onClick={handleGivePoints}
                disabled={!pointsForm.amount || !pointsForm.reason}
                className="w-full py-3.5 bg-gradient-to-r from-[#FF3B4A] to-[#E51020] text-white font-bold rounded-[14px] text-[15px] disabled:opacity-40 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-red-200 transition-all flex items-center justify-center gap-2">
                <Star className="w-5 h-5 fill-white" />
                Give {pointsForm.amount || '—'} Points to {(c.name || 'Customer').split(' ')[0]}
              </button>
            </div>
          )}

          {/* Point History */}
          {pointsTab === 'history' && (
            <div className="divide-y divide-[#F7F8FA]">
              {customerHistory.length > 0 ? (
                customerHistory.map((tx, i) => {
                  const pts = Number(tx.pts) || 0;
                  return (
                    <div key={i} className="px-5 py-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center text-[14px] flex-shrink-0 ${
                          tx.type === 'manual' ? 'bg-[#FEF5E7]' : pts < 0 ? 'bg-[#FFEBEC]' : 'bg-[#EDF7F0]'
                        }`}>
                          {tx.type === 'manual' ? '✨' : pts < 0 ? '↓' : '⭐'}
                        </div>
                        <div>
                          <p className="text-[#0B1527] font-semibold text-[13px]">{tx.reason || 'Points reward'}</p>
                          <p className="text-[#64748B] text-[11px]">{tx.date || 'Recent'} · by {tx.by || 'Admin'}</p>
                        </div>
                      </div>
                      <p className={`font-extrabold text-[15px] ${pts < 0 ? 'text-[#FF3B4A]' : 'text-[#2BB159]'}`}>
                        {pts > 0 ? '+' : ''}{pts}
                      </p>
                    </div>
                  );
                })
              ) : (
                <div className="p-6 text-center text-[#64748B] text-[13px]">
                  No points transaction history found.
                </div>
              )}
            </div>
          )}
        </SectionCard>
      </div>
    );
  }

  // ─── Customer List View ───
  return (
    <div className="space-y-4">
      {/* Search Bar & Filters */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search customers by name, phone, email, or loyalty card ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-[#E2E8F0] rounded-[16px] pl-10 pr-10 py-3 text-[14px] text-[#0B1527] placeholder:text-[#94A3B8] shadow-sm focus:outline-none focus:border-[#FF3B4A] focus:ring-2 focus:ring-[#FF3B4A]/10 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-[#64748B] transition-colors"
              title="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex gap-2">
            {['all','vip','outstanding'].map(f => (
              <button key={f} onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-full text-[13px] font-semibold capitalize transition-all ${filter===f ? 'bg-[#0B1527] text-white' : 'bg-white border border-[#E2E8F0] text-[#64748B] hover:border-[#0B1527]'}`}>
                {f === 'outstanding' ? '⚠️ Outstanding' : f === 'vip' ? '👑 VIP Only' : 'All'}
              </button>
            ))}
          </div>
          {searchQuery && (
            <span className="text-[12px] font-medium text-[#64748B]">
              Found <strong className="text-[#0B1527]">{filtered.length}</strong> matching "{searchQuery}"
            </span>
          )}
        </div>
      </div>

      <SectionCard>
        <div className="flex flex-wrap items-center justify-between gap-3 p-5 border-b border-[#F1E5DB]">
          <div>
            <div className="flex items-center gap-2.5">
              <h2 className="text-[#0B1527] font-bold text-[18px]">{filtered.length} Customers</h2>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                Live Atlas Database
              </span>
            </div>
            <p className="text-[#64748B] text-[13px] mt-0.5">Tap a customer to view details, award points & add bills</p>
          </div>
          <button
            onClick={() => fetchCustomersFromDb(true)}
            disabled={isRefreshing}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-[#0B1527] bg-[#F7F8FA] hover:bg-gray-100 border border-gray-200 rounded-xl transition shadow-xs cursor-pointer active:scale-95"
            title="Force refresh from MongoDB Atlas"
          >
            <RotateCcw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-[#FF3B4A]' : 'text-gray-600'}`} />
            {isRefreshing ? 'Syncing...' : 'Refresh'}
          </button>
        </div>
        <div className="divide-y divide-[#F7F8FA]">
          {filtered.length > 0 ? (
            filtered.map((c) => (
              <div key={c.id}
                onClick={() => { setSelectedCustomer(c); setPointsTab('give'); setPointsSaved(false); setPointsForm({ amount: '', reason: '', note: '' }); }}
                className="px-5 py-4 flex items-center justify-between hover:bg-[#FFF5F5] transition-colors cursor-pointer group">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FF3B4A] to-[#0B1527] flex items-center justify-center text-white font-bold text-[15px]">
                    {c.name ? c.name[0] : 'U'}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-[#0B1527] font-semibold text-[14px]">{c.name}</p>
                      {c.vip && <span className="text-[9px] font-bold bg-[#FEF5E7] text-[#F59E0B] px-1.5 py-0.5 rounded-full">👑 VIP</span>}
                    </div>
                    <p className="text-[#64748B] text-[12px]">
                      {c.mobile || 'No Phone'} {c.loyaltyCardNumber ? `· ${c.loyaltyCardNumber}` : ''} · ⭐ {c.points || 0} pts
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-[#0B1527] font-bold text-[14px]">₹{(Number(c.spent) || 0).toLocaleString('en-IN')}</p>
                    {c.outstanding > 0 && <p className="text-[#FF3B4A] font-semibold text-[11px]">Due: ₹{c.outstanding.toLocaleString('en-IN')}</p>}
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#CBD5E1] group-hover:text-[#FF3B4A] transition-colors" />
                </div>
              </div>
            ))
          ) : (
            <div className="p-10 text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto text-gray-400">
                <Search className="w-6 h-6" />
              </div>
              <p className="text-[14px] font-bold text-[#0B1527]">No customers found</p>
              <p className="text-[12px] text-[#64748B]">
                {searchQuery ? `No matching customers for "${searchQuery}". Try a different name, phone, or email.` : 'No customers in this category.'}
              </p>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="mt-2 text-[12px] font-semibold text-[#FF3B4A] hover:underline cursor-pointer"
                >
                  Clear search query
                </button>
              )}
            </div>
          )}
        </div>
      </SectionCard>
    </div>
  );
};


// ── SECTION: Categories
const CategoriesSection = () => {
  const [cats, setCats] = useState(() => {
    const saved = localStorage.getItem('ADMIN_SYNC_CATS_RAW');
    if (saved) return JSON.parse(saved);

    // Construct from mockData so we don't lose the original large dataset
    return CATEGORIES.map(cat => ({
      id: cat.id,
      name: cat.name,
      image: cat.image,
      description: `Explore all ${cat.name}`,
      items: PRODUCTS.filter(p => p.category.toLowerCase() === cat.name.toLowerCase()).map(p => ({
        ...p,
        mrp: p.mrp || p.price * 1.2,
        stock: 10
      }))
    }));
  });

  React.useEffect(() => {
    localStorage.setItem('ADMIN_SYNC_CATS_RAW', JSON.stringify(cats));
    
    const transformedCats = cats.map(c => ({
      id: c.id,
      name: c.name,
      image: c.image,
      itemCount: c.items.length,
      featured: true,
    }));
    
    let transformedProducts = [];
    cats.forEach(c => {
      c.items.forEach(item => {
        const img = item.image || (item.images && item.images[0]) || 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80';
        const imgList = item.images && item.images.length > 0 ? item.images : [img];
        const mrp = Number(item.mrp) || Math.round(Number(item.price) * 1.2);
        const price = Number(item.price);
        
        transformedProducts.push({
          ...item,
          price,
          originalPrice: mrp,
          mrp,
          images: imgList,
          category: c.name, // Vital for frontend filters
          rating: item.rating || 4.5,
          reviews: item.reviews || 12,
          isDeal: item.isDeal !== undefined ? item.isDeal : true,
          discountPercent: item.discountPercent || (mrp > price ? Math.round(((mrp - price) / mrp) * 100) : 10),
          emiStartingAt: item.emiStartingAt || Math.round(price / 12)
        });
      });
    });

    localStorage.setItem('ADMIN_SYNC_CATEGORIES', JSON.stringify(transformedCats));
    localStorage.setItem('ADMIN_SYNC_PRODUCTS', JSON.stringify(transformedProducts));
  }, [cats]);

  // Category-level state
  const [editingCat, setEditingCat]   = useState(null);
  const [catForm, setCatForm]         = useState({});
  const [addingCat, setAddingCat]     = useState(false);
  const [newCat, setNewCat]           = useState({ name: '', image: '', description: '' });

  // Item-level state
  const [expandedCat, setExpandedCat] = useState(null); // which cat is showing items
  const [addingItem, setAddingItem]   = useState(null); // catId being added to
  const [editingItem, setEditingItem] = useState(null); // {catId, itemId}
  const [itemForm, setItemForm]       = useState({});
  const [newItem, setNewItem]         = useState({ name: '', brand: '', price: '', mrp: '', stock: '', image: '' });

  // ─ Category CRUD
  const startEditCat = (cat) => { setEditingCat(cat.id); setCatForm({ ...cat }); };
  const saveEditCat  = () => {
    setCats(prev => prev.map(c => c.id === editingCat ? { ...c, ...catForm } : c));
    setEditingCat(null);
  };
  const deleteCat = (id) => setCats(prev => prev.filter(c => c.id !== id));
  const addCategory = () => {
    if (!newCat.name.trim()) return;
    setCats(prev => [...prev, { id: `cat-${Date.now()}`, ...newCat, items: [] }]);
    setNewCat({ name: '', image: '', description: '' });
    setAddingCat(false);
  };

  // ─ Item CRUD
  const startEditItem = (catId, item) => { setEditingItem({ catId, itemId: item.id }); setItemForm({ ...item }); };
  const saveEditItem  = () => {
    setCats(prev => prev.map(c => c.id === editingItem.catId
      ? { ...c, items: c.items.map(i => i.id === editingItem.itemId ? { ...i, ...itemForm } : i) } : c));
    setEditingItem(null);
  };
  const deleteItem = (catId, itemId) => {
    setCats(prev => prev.map(c => c.id === catId ? { ...c, items: c.items.filter(i => i.id !== itemId) } : c));
  };
  const addItem = (catId) => {
    if (!newItem.name.trim()) return;
    const item = { id: `item-${Date.now()}`, ...newItem, price: Number(newItem.price), mrp: Number(newItem.mrp), stock: Number(newItem.stock) };
    setCats(prev => prev.map(c => c.id === catId ? { ...c, items: [...c.items, item] } : c));
    setNewItem({ name: '', brand: '', price: '', mrp: '', stock: '', image: '' });
    setAddingItem(null);
  };

  const inputCls = "w-full border border-[#E2E8F0] rounded-[12px] px-3 py-2.5 text-[13px] focus:outline-none focus:border-[#FF3B4A]";

  return (
    <div className="space-y-3">
      {/* Top Bar */}
      <div className="flex justify-between items-center">
        <p className="text-[#64748B] text-[13px]">{cats.length} categories · {cats.reduce((a,c)=>a+c.items.length,0)} total items</p>
        <Btn onClick={() => setAddingCat(true)} size="sm"><Plus className="w-4 h-4" />Add Category</Btn>
      </div>

      {/* Add New Category Form */}
      {addingCat && (
        <SectionCard className="p-5 border-2 border-[#FF3B4A]">
          <h4 className="text-[#0B1527] font-bold text-[15px] mb-3">New Category</h4>
          <div className="space-y-2.5">
            <input placeholder="Category Name (e.g. Speakers)" value={newCat.name}
              onChange={e => setNewCat({...newCat, name: e.target.value})} className={inputCls} />
            <input placeholder="Image URL" value={newCat.image}
              onChange={e => setNewCat({...newCat, image: e.target.value})} className={inputCls} />
            <input placeholder="Description" value={newCat.description}
              onChange={e => setNewCat({...newCat, description: e.target.value})} className={inputCls} />
          </div>
          <div className="flex gap-2 mt-3">
            <Btn onClick={addCategory} variant="success"><Check className="w-4 h-4" />Add Category</Btn>
            <Btn onClick={() => setAddingCat(false)} variant="ghost"><X className="w-4 h-4" />Cancel</Btn>
          </div>
        </SectionCard>
      )}

      {/* Category List */}
      {cats.map(cat => (
        <SectionCard key={cat.id}>
          {/* ─ Category Edit Mode */}
          {editingCat === cat.id ? (
            <div className="p-5 space-y-3">
              <p className="font-bold text-[#0B1527] text-[15px]">Editing: {cat.name}</p>
              <div>
                <label className="text-[12px] text-[#64748B] font-medium block mb-1">Category Name</label>
                <input value={catForm.name} onChange={e => setCatForm({...catForm, name: e.target.value})} className={inputCls} />
              </div>
              <div>
                <label className="text-[12px] text-[#64748B] font-medium block mb-1">Image URL</label>
                <input value={catForm.image} onChange={e => setCatForm({...catForm, image: e.target.value})} className={inputCls} />
              </div>
              <div>
                <label className="text-[12px] text-[#64748B] font-medium block mb-1">Description</label>
                <input value={catForm.description} onChange={e => setCatForm({...catForm, description: e.target.value})} className={inputCls} />
              </div>
              <div className="flex gap-2">
                <Btn onClick={saveEditCat} variant="success"><Check className="w-4 h-4" />Save</Btn>
                <Btn onClick={() => setEditingCat(null)} variant="ghost"><X className="w-4 h-4" />Cancel</Btn>
              </div>
            </div>
          ) : (
            <>
              {/* ─ Category Row */}
              <div className="flex items-center gap-4 p-4">
                <img src={cat.image} alt={cat.name} className="w-14 h-14 rounded-[12px] object-cover flex-shrink-0"
                  onError={e => e.target.src='https://via.placeholder.com/56'} />
                <div className="flex-1 min-w-0">
                  <p className="text-[#0B1527] font-bold text-[15px]">{cat.name}</p>
                  <p className="text-[#64748B] text-[12px] truncate">{cat.description}</p>
                  <p className="text-[#AF1024] text-[11px] font-semibold mt-0.5">{cat.items.length} items</p>
                </div>
                <div className="flex items-center gap-1.5">
                  <button onClick={() => setExpandedCat(expandedCat === cat.id ? null : cat.id)}
                    className="px-3 py-1.5 bg-[#F7F8FA] border border-[#E2E8F0] rounded-[10px] text-[11px] font-semibold text-[#0B1527] hover:bg-[#E8EDF4] transition-colors whitespace-nowrap">
                    {expandedCat === cat.id ? '▲ Hide' : '▼ Items'}
                  </button>
                  <button onClick={() => startEditCat(cat)} className="w-8 h-8 flex items-center justify-center bg-[#F7F8FA] border border-[#E2E8F0] rounded-[10px] hover:bg-[#E8EDF4]">
                    <Edit2 className="w-3.5 h-3.5 text-[#64748B]" />
                  </button>
                  <button onClick={() => deleteCat(cat.id)} className="w-8 h-8 flex items-center justify-center bg-[#FFEBEC] rounded-[10px] hover:bg-[#FFD5D8]">
                    <Trash2 className="w-3.5 h-3.5 text-[#FF3B4A]" />
                  </button>
                </div>
              </div>

              {/* ─ Items Panel */}
              {expandedCat === cat.id && (
                <div className="border-t border-[#F1E5DB] bg-[#F9FAFB] rounded-b-[20px]">
                  <div className="flex justify-between items-center px-4 py-3">
                    <p className="text-[#0B1527] font-bold text-[13px]">Items in {cat.name}</p>
                    <Btn onClick={() => { setAddingItem(cat.id); setNewItem({ name: '', brand: '', price: '', mrp: '', stock: '', image: '' }); }} size="sm">
                      <Plus className="w-3.5 h-3.5" />Add Item
                    </Btn>
                  </div>

                  {/* Add Item Form */}
                  {addingItem === cat.id && (
                    <div className="mx-4 mb-4 p-4 bg-white rounded-[14px] border-2 border-[#FF3B4A] space-y-2.5">
                      <p className="text-[#0B1527] font-bold text-[13px]">New Item in {cat.name}</p>
                      {[
                        ['name',  'Product Name (e.g. Samsung 65" TV)'],
                        ['brand', 'Brand (e.g. Samsung, LG)'],
                        ['image', 'Product Image URL'],
                      ].map(([k, ph]) => (
                        <input key={k} placeholder={ph} value={newItem[k]}
                          onChange={e => setNewItem({...newItem, [k]: e.target.value})} className={inputCls} />
                      ))}
                      <div className="grid grid-cols-3 gap-2">
                        <input placeholder="MRP (₹)" type="number" value={newItem.mrp}
                          onChange={e => setNewItem({...newItem, mrp: e.target.value})} className={inputCls} />
                        <input placeholder="Sale Price (₹)" type="number" value={newItem.price}
                          onChange={e => setNewItem({...newItem, price: e.target.value})} className={inputCls} />
                        <input placeholder="Stock" type="number" value={newItem.stock}
                          onChange={e => setNewItem({...newItem, stock: e.target.value})} className={inputCls} />
                      </div>
                      {newItem.price && newItem.mrp && (
                        <p className="text-[#2BB159] text-[12px] font-semibold">
                          Discount: {Math.round((1 - newItem.price/newItem.mrp)*100)}% off
                        </p>
                      )}
                      <div className="flex gap-2">
                        <Btn onClick={() => addItem(cat.id)} variant="success"><Check className="w-3.5 h-3.5" />Save Item</Btn>
                        <Btn onClick={() => setAddingItem(null)} variant="ghost"><X className="w-3.5 h-3.5" />Cancel</Btn>
                      </div>
                    </div>
                  )}

                  {/* Items List */}
                  {cat.items.length === 0 && addingItem !== cat.id && (
                    <div className="px-4 pb-4 text-center">
                      <p className="text-[#94A3B8] text-[13px]">No items yet. Tap "Add Item" to get started.</p>
                    </div>
                  )}
                  {cat.items.map(item => (
                    <div key={item.id} className="mx-4 mb-3 bg-white rounded-[14px] border border-[#E2E8F0] overflow-hidden">
                      {editingItem?.itemId === item.id ? (
                        <div className="p-4 space-y-2.5">
                          <p className="text-[#0B1527] font-bold text-[13px]">Editing: {item.name}</p>
                          {[['name','Product Name'],['brand','Brand'],['image','Image URL']].map(([k,ph]) => (
                            <input key={k} placeholder={ph} value={itemForm[k]}
                              onChange={e => setItemForm({...itemForm, [k]: e.target.value})} className={inputCls} />
                          ))}
                          <div className="grid grid-cols-3 gap-2">
                            <input placeholder="MRP" type="number" value={itemForm.mrp}
                              onChange={e => setItemForm({...itemForm, mrp: Number(e.target.value)})} className={inputCls} />
                            <input placeholder="Sale Price" type="number" value={itemForm.price}
                              onChange={e => setItemForm({...itemForm, price: Number(e.target.value)})} className={inputCls} />
                            <input placeholder="Stock" type="number" value={itemForm.stock}
                              onChange={e => setItemForm({...itemForm, stock: Number(e.target.value)})} className={inputCls} />
                          </div>
                          <div className="flex gap-2">
                            <Btn onClick={saveEditItem} variant="success" size="sm"><Check className="w-3.5 h-3.5" />Save</Btn>
                            <Btn onClick={() => setEditingItem(null)} variant="ghost" size="sm"><X className="w-3.5 h-3.5" />Cancel</Btn>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center gap-3 p-3">
                          <img src={item.image} alt={item.name}
                            className="w-12 h-12 rounded-[10px] object-cover flex-shrink-0"
                            onError={e => e.target.src='https://via.placeholder.com/48'} />
                          <div className="flex-1 min-w-0">
                            <p className="text-[#0B1527] font-semibold text-[13px] truncate">{item.name}</p>
                            <p className="text-[#64748B] text-[11px]">{item.brand}</p>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-[#FF3B4A] font-bold text-[12px]">₹{Number(item.price).toLocaleString('en-IN')}</span>
                              <span className="text-[#94A3B8] line-through text-[10px]">₹{Number(item.mrp).toLocaleString('en-IN')}</span>
                              <span className="text-[#64748B] text-[10px]">· {item.stock} in stock</span>
                            </div>
                          </div>
                          <div className="flex gap-1">
                            <button onClick={() => startEditItem(cat.id, item)} className="w-7 h-7 flex items-center justify-center bg-[#F7F8FA] border border-[#E2E8F0] rounded-[8px] hover:bg-[#E8EDF4]">
                              <Edit2 className="w-3 h-3 text-[#64748B]" />
                            </button>
                            <button onClick={() => deleteItem(cat.id, item.id)} className="w-7 h-7 flex items-center justify-center bg-[#FFEBEC] rounded-[8px] hover:bg-[#FFD5D8]">
                              <Trash2 className="w-3 h-3 text-[#FF3B4A]" />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </SectionCard>
      ))}
    </div>
  );
};

// ── SECTION: Loyalty Points
const LoyaltySection = () => {
  const [rule, setRule] = useState({ amountPerPoint: 100, label: '₹100 = 1 Point' });
  const [editing, setEditing] = useState(false);
  const [val, setVal] = useState(100);
  const [saved, setSaved] = useState(false);

  const save = () => {
    setRule({ amountPerPoint: val, label: `₹${val} = 1 Point` });
    setEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const presets = [50, 100, 200, 500];

  return (
    <div className="space-y-4">
      <SectionCard className="p-5">
        <div className="flex items-center gap-4 mb-5">
          <div className="w-12 h-12 rounded-full bg-[#FEF5E7] flex items-center justify-center">
            <Star className="w-6 h-6 text-[#F59E0B]" fill="#F59E0B" />
          </div>
          <div>
            <h3 className="text-[#0B1527] font-bold text-[17px]">Points Earning Rule</h3>
            <p className="text-[#64748B] text-[13px]">Configure how customers earn loyalty points per purchase</p>
          </div>
        </div>

        <div className="bg-[#F7F8FA] rounded-[16px] p-4 text-center mb-4">
          <p className="text-[#64748B] text-[13px] font-medium">Current Active Rule</p>
          <p className="text-[#0B1527] font-extrabold text-[32px] tracking-tight mt-1">{rule.label}</p>
          {saved && <p className="text-[#2BB159] text-[13px] font-semibold mt-1">✓ Rule saved successfully!</p>}
        </div>

        {editing ? (
          <div className="space-y-3">
            <label className="text-[13px] text-[#64748B] font-medium block">Spend Amount per 1 Point (₹)</label>
            <input
              type="number"
              value={val}
              onChange={e => setVal(Number(e.target.value))}
              className="w-full border-2 border-[#FF3B4A] rounded-[12px] px-4 py-3 text-[18px] font-bold text-center focus:outline-none"
            />
            <div className="flex gap-2 flex-wrap">
              {presets.map(p => (
                <button key={p} onClick={() => setVal(p)}
                  className={`px-4 py-1.5 rounded-full text-[12px] font-semibold border transition-colors ${val === p ? 'bg-[#0B1527] text-white border-[#0B1527]' : 'border-[#E2E8F0] text-[#64748B] hover:border-[#0B1527]'}`}>
                  ₹{p}
                </button>
              ))}
            </div>
            <p className="text-[#64748B] text-[12px]">Preview: A ₹10,000 purchase = <span className="font-bold text-[#0B1527]">{Math.floor(10000/val)} points</span></p>
            <div className="flex gap-2">
              <Btn onClick={save} variant="success"><Check className="w-4 h-4" />Save Rule</Btn>
              <Btn onClick={() => setEditing(false)} variant="ghost"><X className="w-4 h-4" />Cancel</Btn>
            </div>
          </div>
        ) : (
          <Btn onClick={() => setEditing(true)} variant="ghost" className="w-full justify-center py-3">
            <Edit2 className="w-4 h-4" /> Change Rule
          </Btn>
        )}
      </SectionCard>

      <SectionCard className="p-5">
        <h4 className="text-[#0B1527] font-bold text-[15px] mb-3">Points Impact Preview</h4>
        <div className="space-y-2">
          {[5000, 10000, 25000, 50000, 100000].map(amt => (
            <div key={amt} className="flex justify-between items-center py-2 border-b border-[#F7F8FA] last:border-0">
              <span className="text-[#64748B] text-[13px]">Purchase of ₹{amt.toLocaleString('en-IN')}</span>
              <span className="text-[#0B1527] font-bold text-[13px]">{Math.floor(amt / rule.amountPerPoint)} pts</span>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
};

// ── SECTION: Wheel Gifts
const RewardsSection = () => {
  const [prizes, setPrizes] = useState([
    { id: 'p1', name: 'Premium Earbuds',  mrp: 3999, active: true,  image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=400&q=80' },
    { id: 'p2', name: 'Smart Watch',       mrp: 4499, active: true,  image: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&w=400&q=80' },
    { id: 'p3', name: 'Soundbar 100W',     mrp: 6999, active: true,  image: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=400&q=80' },
    { id: 'p4', name: '₹2,000 Voucher',   mrp: 2000, active: false, image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=400&q=80' },
    { id: 'p5', name: 'Air Fryer',         mrp: 5999, active: true,  image: 'https://images.unsplash.com/photo-1585672840488-825488177dfb?auto=format&fit=crop&w=400&q=80' },
    { id: 'p6', name: 'Electric Kettle',   mrp: 1899, active: true,  image: 'https://images.unsplash.com/photo-1594213114663-ddf4f140e087?auto=format&fit=crop&w=400&q=80' },
  ]);
  const [adding, setAdding] = useState(false);
  const [newPrize, setNewPrize] = useState({ name: '', mrp: '', image: '' });

  const toggle = (id) => setPrizes(prev => prev.map(p => p.id === id ? { ...p, active: !p.active } : p));
  const remove = (id) => setPrizes(prev => prev.filter(p => p.id !== id));
  const addPrize = () => {
    if (!newPrize.name) return;
    setPrizes(prev => [...prev, { id: `p${Date.now()}`, ...newPrize, mrp: Number(newPrize.mrp), active: true }]);
    setNewPrize({ name: '', mrp: '', image: '' });
    setAdding(false);
  };

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <p className="text-[#64748B] text-[13px]">{prizes.filter(p=>p.active).length} active gifts on the wheel</p>
        <Btn onClick={() => setAdding(true)} size="sm"><Plus className="w-4 h-4" />Add Gift</Btn>
      </div>

      {adding && (
        <SectionCard className="p-5 border-2 border-[#FF3B4A]">
          <h4 className="text-[#0B1527] font-bold mb-3">New Wheel Gift</h4>
          <div className="space-y-3">
            <input placeholder="Gift name (e.g. Smart Speaker)" value={newPrize.name} onChange={e => setNewPrize({...newPrize, name: e.target.value})}
              className="w-full border border-[#E2E8F0] rounded-[12px] px-3 py-2.5 text-[13px] focus:outline-none focus:border-[#FF3B4A]" />
            <input type="number" placeholder="MRP value (₹)" value={newPrize.mrp} onChange={e => setNewPrize({...newPrize, mrp: e.target.value})}
              className="w-full border border-[#E2E8F0] rounded-[12px] px-3 py-2.5 text-[13px] focus:outline-none focus:border-[#FF3B4A]" />
            <input placeholder="Image URL" value={newPrize.image} onChange={e => setNewPrize({...newPrize, image: e.target.value})}
              className="w-full border border-[#E2E8F0] rounded-[12px] px-3 py-2.5 text-[13px] focus:outline-none focus:border-[#FF3B4A]" />
            <div className="flex gap-2">
              <Btn onClick={addPrize} variant="success"><Check className="w-4 h-4" />Add</Btn>
              <Btn onClick={() => setAdding(false)} variant="ghost"><X className="w-4 h-4" />Cancel</Btn>
            </div>
          </div>
        </SectionCard>
      )}

      {prizes.map(p => (
        <SectionCard key={p.id}>
          <div className="flex items-center gap-4 p-4">
            <img src={p.image} alt={p.name} className="w-14 h-14 rounded-[12px] object-cover flex-shrink-0" onError={e => e.target.src='https://via.placeholder.com/56'} />
            <div className="flex-1 min-w-0">
              <p className="text-[#0B1527] font-bold text-[14px]">{p.name}</p>
              <p className="text-[#64748B] text-[12px]">MRP ₹{Number(p.mrp).toLocaleString('en-IN')}</p>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full inline-block mt-1 ${p.active ? 'bg-[#EDF7F0] text-[#2BB159]' : 'bg-[#F1E5DB] text-[#64748B]'}`}>
                {p.active ? '● Active on Wheel' : '○ Hidden'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => toggle(p.id)} className="p-2 rounded-[10px] hover:bg-[#F7F8FA] transition-colors">
                {p.active ? <ToggleRight className="w-6 h-6 text-[#2BB159]" /> : <ToggleLeft className="w-6 h-6 text-[#94A3B8]" />}
              </button>
              <button onClick={() => remove(p.id)} className="p-2 rounded-[10px] hover:bg-[#FFEBEC] transition-colors">
                <Trash2 className="w-4 h-4 text-[#FF3B4A]" />
              </button>
            </div>
          </div>
        </SectionCard>
      ))}
    </div>
  );
};

// ── SECTION: Today's Deals
const DealsSection = () => {
  const [deals, setDeals] = useState([
    { id: 'd1', title: 'Samsung 4K Smart TV 43"', originalPrice: 45000, dealPrice: 38000, discount: 15, endDate: '2026-10-07', active: true,  image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=250&q=80' },
    { id: 'd2', title: 'LG Frost Free Fridge 310L',originalPrice: 28000, dealPrice: 23000, discount: 18, endDate: '2026-10-08', active: true,  image: 'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?auto=format&fit=crop&w=250&q=80' },
    { id: 'd3', title: 'Whirlpool 7kg Washer',     originalPrice: 32000, dealPrice: 27000, discount: 16, endDate: '2026-10-06', active: false, image: 'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?auto=format&fit=crop&w=250&q=80' },
  ]);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({ title: '', originalPrice: '', dealPrice: '', endDate: '', image: '' });

  const toggle = (id) => setDeals(prev => prev.map(d => d.id === id ? { ...d, active: !d.active } : d));
  const remove = (id) => setDeals(prev => prev.filter(d => d.id !== id));
  const addDeal = () => {
    if (!form.title) return;
    const discount = Math.round((1 - form.dealPrice / form.originalPrice) * 100);
    setDeals(prev => [...prev, { id: `d${Date.now()}`, ...form, originalPrice: Number(form.originalPrice), dealPrice: Number(form.dealPrice), discount, active: true }]);
    setForm({ title: '', originalPrice: '', dealPrice: '', endDate: '', image: '' });
    setAdding(false);
  };

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <p className="text-[#64748B] text-[13px]">{deals.filter(d=>d.active).length} active deals live now</p>
        <Btn onClick={() => setAdding(true)} size="sm"><Plus className="w-4 h-4" />Add Deal</Btn>
      </div>

      {adding && (
        <SectionCard className="p-5 border-2 border-[#FF3B4A]">
          <h4 className="text-[#0B1527] font-bold mb-3">New Today's Deal</h4>
          <div className="space-y-2.5">
            {[['title','Product Name'],['image','Image URL'],['originalPrice','Original Price (₹)'],['dealPrice','Deal Price (₹)'],['endDate','End Date']].map(([k,ph]) => (
              <input key={k} type={k.includes('Price') ? 'number' : k==='endDate' ? 'date' : 'text'} placeholder={ph}
                value={form[k]} onChange={e => setForm({...form, [k]: e.target.value})}
                className="w-full border border-[#E2E8F0] rounded-[12px] px-3 py-2.5 text-[13px] focus:outline-none focus:border-[#FF3B4A]" />
            ))}
            <div className="flex gap-2">
              <Btn onClick={addDeal} variant="success"><Check className="w-4 h-4" />Add Deal</Btn>
              <Btn onClick={() => setAdding(false)} variant="ghost"><X className="w-4 h-4" />Cancel</Btn>
            </div>
          </div>
        </SectionCard>
      )}

      {deals.map(deal => (
        <SectionCard key={deal.id}>
          <div className="flex items-center gap-4 p-4">
            <div className="relative flex-shrink-0">
              <img src={deal.image} alt={deal.title} className="w-16 h-16 rounded-[12px] object-cover" onError={e => e.target.src='https://via.placeholder.com/64'} />
              <span className="absolute -top-1.5 -right-1.5 bg-[#FF3B4A] text-white text-[9px] font-bold rounded-full px-1.5 py-0.5">{deal.discount}%</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[#0B1527] font-bold text-[13px] leading-tight">{deal.title}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[#FF3B4A] font-bold text-[13px]">₹{Number(deal.dealPrice).toLocaleString('en-IN')}</span>
                <span className="text-[#94A3B8] line-through text-[11px]">₹{Number(deal.originalPrice).toLocaleString('en-IN')}</span>
              </div>
              <p className="text-[#64748B] text-[11px] mt-0.5">Ends: {deal.endDate}</p>
            </div>
            <div className="flex items-center gap-1.5">
              <button onClick={() => toggle(deal.id)} className="p-2 rounded-[10px] hover:bg-[#F7F8FA]">
                {deal.active ? <ToggleRight className="w-6 h-6 text-[#2BB159]" /> : <ToggleLeft className="w-6 h-6 text-[#94A3B8]" />}
              </button>
              <button onClick={() => remove(deal.id)} className="p-2 rounded-[10px] hover:bg-[#FFEBEC]">
                <Trash2 className="w-4 h-4 text-[#FF3B4A]" />
              </button>
            </div>
          </div>
        </SectionCard>
      ))}
    </div>
  );
};

// ── SECTION: Hero Banners
const BannersSection = () => {
  const [banners, setBanners] = useState([
    { id: 'b1', title: 'Summer Sale',           subtitle: 'Up to 40% off on ACs', cta: 'Shop Now', image: 'https://images.unsplash.com/photo-1614633833026-062045952f44?auto=format&fit=crop&w=800&q=80', active: true },
    { id: 'b2', title: 'New Arrivals',           subtitle: 'Latest smartphones are here', cta: 'Explore', image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80', active: true },
    { id: 'b3', title: 'Trade-in Offer',         subtitle: 'Exchange & save ₹5,000', cta: 'Know More', image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=800&q=80', active: false },
  ]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({});
  const [adding, setAdding] = useState(false);
  const [newBanner, setNewBanner] = useState({ title: '', subtitle: '', cta: '', image: '' });

  const toggle = (id) => setBanners(prev => prev.map(b => b.id === id ? { ...b, active: !b.active } : b));
  const remove = (id) => setBanners(prev => prev.filter(b => b.id !== id));
  const startEdit = (b) => { setEditing(b.id); setForm({ ...b }); };
  const saveEdit = () => {
    setBanners(prev => prev.map(b => b.id === editing ? { ...b, ...form } : b));
    setEditing(null);
  };
  const addBanner = () => {
    if (!newBanner.title) return;
    setBanners(prev => [...prev, { id: `b${Date.now()}`, ...newBanner, active: true }]);
    setNewBanner({ title: '', subtitle: '', cta: '', image: '' });
    setAdding(false);
  };

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <p className="text-[#64748B] text-[13px]">{banners.filter(b=>b.active).length} banners showing on home screen</p>
        <Btn onClick={() => setAdding(true)} size="sm"><Plus className="w-4 h-4" />Add Banner</Btn>
      </div>

      {adding && (
        <SectionCard className="p-5 border-2 border-[#FF3B4A]">
          <h4 className="text-[#0B1527] font-bold mb-3">New Hero Banner</h4>
          <div className="space-y-2.5">
            {[['title','Headline (e.g. Summer Sale)'],['subtitle','Subtitle text'],['cta','Button Text (e.g. Shop Now)'],['image','Banner Image URL']].map(([k,ph]) => (
              <input key={k} placeholder={ph} value={newBanner[k]} onChange={e => setNewBanner({...newBanner, [k]: e.target.value})}
                className="w-full border border-[#E2E8F0] rounded-[12px] px-3 py-2.5 text-[13px] focus:outline-none focus:border-[#FF3B4A]" />
            ))}
            <div className="flex gap-2">
              <Btn onClick={addBanner} variant="success"><Check className="w-4 h-4" />Add Banner</Btn>
              <Btn onClick={() => setAdding(false)} variant="ghost"><X className="w-4 h-4" />Cancel</Btn>
            </div>
          </div>
        </SectionCard>
      )}

      {banners.map(b => (
        <SectionCard key={b.id}>
          {editing === b.id ? (
            <div className="p-5 space-y-3">
              <p className="font-bold text-[#0B1527]">Editing Banner</p>
              {[['title','Headline'],['subtitle','Subtitle'],['cta','Button Text'],['image','Image URL']].map(([k,ph]) => (
                <input key={k} placeholder={ph} value={form[k]} onChange={e => setForm({...form, [k]: e.target.value})}
                  className="w-full border border-[#E2E8F0] rounded-[12px] px-3 py-2.5 text-[13px] focus:outline-none focus:border-[#FF3B4A]" />
              ))}
              <div className="flex gap-2">
                <Btn onClick={saveEdit} variant="success"><Check className="w-4 h-4" />Save</Btn>
                <Btn onClick={() => setEditing(null)} variant="ghost"><X className="w-4 h-4" />Cancel</Btn>
              </div>
            </div>
          ) : (
            <div>
              <div className="relative h-28 overflow-hidden rounded-t-[20px]">
                <img src={b.image} alt={b.title} className="w-full h-full object-cover" onError={e => e.target.src='https://via.placeholder.com/400x112'} />
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent flex flex-col justify-center px-5">
                  <p className="text-white font-extrabold text-[16px]">{b.title}</p>
                  <p className="text-white/80 text-[12px]">{b.subtitle}</p>
                  <span className="mt-1 bg-white/20 text-white text-[11px] font-semibold px-3 py-1 rounded-full w-fit border border-white/30">{b.cta} →</span>
                </div>
                {!b.active && <div className="absolute inset-0 bg-black/40 flex items-center justify-center"><span className="bg-black/60 text-white text-[12px] font-semibold px-3 py-1.5 rounded-full">Hidden</span></div>}
              </div>
              <div className="flex items-center justify-between p-4">
                <p className="text-[#64748B] text-[12px]">{b.active ? '● Showing on app' : '○ Hidden'}</p>
                <div className="flex gap-1.5">
                  <button onClick={() => startEdit(b)} className="p-2 rounded-[10px] bg-[#F7F8FA] hover:bg-[#E8EDF4]">
                    <Edit2 className="w-4 h-4 text-[#64748B]" />
                  </button>
                  <button onClick={() => toggle(b.id)} className="p-2 rounded-[10px] bg-[#F7F8FA] hover:bg-[#E8EDF4]">
                    {b.active ? <ToggleRight className="w-5 h-5 text-[#2BB159]" /> : <ToggleLeft className="w-5 h-5 text-[#94A3B8]" />}
                  </button>
                  <button onClick={() => remove(b.id)} className="p-2 rounded-[10px] bg-[#FFEBEC] hover:bg-[#FFD5D8]">
                    <Trash2 className="w-4 h-4 text-[#FF3B4A]" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </SectionCard>
      ))}
    </div>
  );
};

// ── MAIN ADMIN DASHBOARD
export const AdminDashboardScreen = () => {
  const { navigateTo } = useApp();
  const [activeTab, setActiveTab] = useState('overview');
  const active = NAV.find(n => n.id === activeTab);

  const SECTIONS = {
    overview:   <OverviewSection />,
    customers:  <CustomersSection />,
    categories: <CategoriesSection />,
    loyalty:    <LoyaltySection />,
    rewards:    <RewardsSection />,
    deals:      <DealsSection />,
    banners:    <BannersSection />,
  };

  return (
    <div className="min-h-screen bg-[#F7F8FA] pb-8">
      {/* Top Header */}
      <div className="bg-gradient-to-r from-[#0B1527] to-[#1A253C] px-5 pt-14 pb-6 rounded-b-[28px] sticky top-0 z-40 shadow-xl">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white font-bold">A</div>
            <div>
              <p className="text-white/70 text-[11px] font-medium uppercase tracking-widest">Admin Panel</p>
              <h1 className="text-white font-extrabold text-[18px] leading-tight">New Ajeet Vision</h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => navigateTo('home')} className="bg-white/10 border border-white/20 text-white text-[11px] font-semibold px-3 py-1.5 rounded-full hover:bg-white/20 transition-colors">
              View App
            </button>
            <button onClick={() => navigateTo('admin_login')} className="bg-[#FF3B4A]/80 border border-[#FF3B4A] text-white text-[11px] font-semibold px-3 py-1.5 rounded-full hover:bg-[#FF3B4A] transition-colors">
              Logout
            </button>
          </div>
        </div>

        {/* Tab Bar */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none -mx-1 px-1">
          {NAV.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-[12px] font-semibold whitespace-nowrap flex-shrink-0 transition-all ${activeTab === tab.id ? 'bg-white text-[#0B1527] shadow-sm' : 'bg-white/10 text-white/80 hover:bg-white/20'}`}>
              <tab.icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Section Content */}
      <div className="px-4 pt-5">
        <div className="flex items-center gap-2 mb-4">
          <active.icon className="w-5 h-5 text-[#FF3B4A]" />
          <h2 className="text-[#0B1527] font-extrabold text-[20px]">{active.label}</h2>
        </div>
        {SECTIONS[activeTab]}
      </div>
    </div>
  );
};
