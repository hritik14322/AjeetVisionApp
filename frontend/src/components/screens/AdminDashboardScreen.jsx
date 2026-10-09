import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { LayoutDashboard, Users, ShoppingBag, Gift, Tag, Image, Star,
  TrendingUp, CreditCard, UserCheck, ArrowUpRight, ChevronRight,
  Edit2, Save, X, Plus, Trash2, Settings, ToggleLeft, ToggleRight,
  Package, Megaphone, Zap, Crown, ArrowLeft, Check, Upload, DollarSign
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

// ── SECTION: Overview
const OverviewSection = () => {
  const stats = [
    { label: 'Total Sales',      value: '₹24.5L', sub: '+12% this month', icon: TrendingUp, bg: 'bg-[#E8EDF4]',  ic: 'text-[#0B1527]' },
    { label: 'Outstanding',      value: '₹1.2L',  sub: '8 pending bills',  icon: CreditCard,  bg: 'bg-[#FFEBEC]',  ic: 'text-[#FF3B4A]' },
    { label: 'Total Customers',  value: '1,250',  sub: '+32 this week',   icon: Users,       bg: 'bg-[#EBF3FF]',  ic: 'text-[#3B82F6]' },
    { label: 'VIP Members',      value: '340',    sub: '₹499/yr each',    icon: Crown,       bg: 'bg-[#FEF5E7]',  ic: 'text-[#F59E0B]' },
  ];

  const recent = [
    { name: 'Rahul Sharma',  id: 'NAV-001', amt: '₹45,000', status: 'Paid',    tag: 'bg-[#EDF7F0] text-[#2BB159]' },
    { name: 'Sneha Gupta',   id: 'NAV-002', amt: '₹85,000', status: 'EMI',     tag: 'bg-[#FEF5E7] text-[#F59E0B]' },
    { name: 'Amit Patel',    id: 'NAV-003', amt: '₹12,000', status: 'Pending', tag: 'bg-[#FFEBEC] text-[#FF3B4A]' },
    { name: 'Priya Singh',   id: 'NAV-004', amt: '₹32,500', status: 'Paid',    tag: 'bg-[#EDF7F0] text-[#2BB159]' },
    { name: 'Vikram Das',    id: 'NAV-005', amt: '₹18,000', status: 'Pending', tag: 'bg-[#FFEBEC] text-[#FF3B4A]' },
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
        <div className="divide-y divide-[#F7F8FA]">
          {recent.map(r => (
            <div key={r.id} className="flex items-center justify-between px-5 py-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#F1E5DB] flex items-center justify-center font-bold text-[#0B1527] text-[14px]">
                  {r.name[0]}
                </div>
                <div>
                  <p className="text-[#0B1527] font-semibold text-[14px]">{r.name}</p>
                  <p className="text-[#64748B] text-[11px]">{r.id}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[#0B1527] font-bold text-[14px]">{r.amt}</p>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${r.tag}`}>{r.status}</span>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
};

// ── SECTION: Customers
const CustomersSection = () => {
  const [filter, setFilter] = useState('all');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [pointsForm, setPointsForm] = useState({ amount: '', reason: '', note: '' });
  const [pointsSaved, setPointsSaved] = useState(false);
  const [pointsTab, setPointsTab] = useState('give'); // 'give' | 'history'
  
  const [editCardNumber, setEditCardNumber] = useState('');
  const [isEditingCard, setIsEditingCard] = useState(false);

  const [customers, setCustomers] = useState(() => {
    const defaultList = [
      {
        id: 'c-hritik', name: 'Hritik Kumar', mobile: '98765-43210', email: 'hritik@email.com',
        points: 950, vip: true, outstanding: 0, spent: 72500,
        rewardProgress: 72, joinedDate: 'Oct 2026', loyaltyCardNumber: 'NAV-987654',
        purchases: [
          { id: 'NAV-2026-001', date: '7 Oct 2026', items: 'Godrej AC 1.5 Ton, Smart TV', amount: 72500, paid: 72500, status: 'Paid' },
        ],
        pointHistory: [
          { date: '7 Oct 2026', type: 'earn', pts: 950, reason: 'Showroom signup & purchase bonus', by: 'System' },
        ],
      },
      {
        id: 'c1', name: 'Rahul Sharma',  mobile: '98765-43210', email: 'rahul@email.com',
        points: 450, vip: true, outstanding: 0, spent: 245000,
        rewardProgress: 72, joinedDate: 'Jan 2024',
        purchases: [
          { id: 'NAV-001', date: '12 Sep 2026', items: 'Samsung 55" TV', amount: 45000, paid: 45000, status: 'Paid' },
          { id: 'NAV-008', date: '3 Jun 2026',  items: 'iPhone 15, Earbuds', amount: 89000, paid: 75000, status: 'EMI' },
          { id: 'NAV-015', date: '18 Jan 2026', items: 'LG Fridge 310L', amount: 28000, paid: 28000, status: 'Paid' },
        ],
        pointHistory: [
          { date: '12 Sep 2026', type: 'earn',   pts: 450, reason: 'Purchase NAV-001', by: 'System' },
          { date: '3 Jun 2026',  type: 'manual', pts: 100, reason: 'Bonus – Festive gift', by: 'Admin' },
          { date: '18 Jan 2026', type: 'earn',   pts: 280, reason: 'Purchase NAV-015', by: 'System' },
        ],
      },
      {
        id: 'c2', name: 'Sneha Gupta',   mobile: '91234-56789', email: 'sneha@email.com',
        points: 280, vip: true, outstanding: 12000, spent: 185000,
        rewardProgress: 55, joinedDate: 'Mar 2024',
        purchases: [
          { id: 'NAV-002', date: '5 Oct 2026',  items: 'AC 1.5 Ton Split', amount: 42000, paid: 30000, status: 'EMI' },
          { id: 'NAV-009', date: '14 Jul 2026', items: 'Washing Machine', amount: 32000, paid: 32000, status: 'Paid' },
        ],
        pointHistory: [
          { date: '5 Oct 2026',  type: 'earn',   pts: 420, reason: 'Purchase NAV-002', by: 'System' },
          { date: '14 Jul 2026', type: 'earn',   pts: 320, reason: 'Purchase NAV-009', by: 'System' },
          { date: '14 Jul 2026', type: 'redeem', pts: -200, reason: 'Points redeemed', by: 'System' },
        ],
      },
      {
        id: 'c3', name: 'Amit Patel',    mobile: '97654-32109', email: 'amit@email.com',
        points: 120, vip: false, outstanding: 8500, spent: 78000,
        rewardProgress: 20, joinedDate: 'Aug 2024',
        purchases: [
          { id: 'NAV-003', date: '1 Oct 2026',  items: 'Ceiling Fan x3', amount: 12000, paid: 3500, status: 'Pending' },
          { id: 'NAV-010', date: '20 Aug 2026', items: 'Mixer Grinder', amount: 4500, paid: 4500, status: 'Paid' },
        ],
        pointHistory: [
          { date: '1 Oct 2026',  type: 'earn', pts: 120, reason: 'Purchase NAV-003', by: 'System' },
        ],
      },
      {
        id: 'c4', name: 'Priya Singh',   mobile: '88888-77777', email: 'priya@email.com',
        points: 890, vip: true, outstanding: 0, spent: 320000,
        rewardProgress: 100, joinedDate: 'Nov 2023',
        purchases: [
          { id: 'NAV-004', date: '22 Sep 2026', items: 'OLED TV 65"', amount: 95000, paid: 95000, status: 'Paid' },
        ],
        pointHistory: [
          { date: '22 Sep 2026', type: 'earn',   pts: 950, reason: 'Purchase NAV-004', by: 'System' },
          { date: '15 Sep 2026', type: 'manual', pts: 200, reason: 'VIP Bonus', by: 'Admin' },
        ],
      },
      {
        id: 'c5', name: 'Vikram Das',    mobile: '99900-11122', email: 'vikram@email.com',
        points: 60,  vip: false, outstanding: 3200, spent: 42000,
        rewardProgress: 10, joinedDate: 'May 2025',
        purchases: [
          { id: 'NAV-005', date: '30 Sep 2026', items: 'Air Cooler', amount: 8500, paid: 5300, status: 'Pending' },
        ],
        pointHistory: [
          { date: '30 Sep 2026', type: 'earn', pts: 85, reason: 'Purchase NAV-005', by: 'System' },
        ],
      },
      {
        id: 'c6', name: 'Sunita Rao',    mobile: '80001-23456', email: 'sunita@email.com',
        points: 310, vip: false, outstanding: 0, spent: 112000,
        rewardProgress: 32, joinedDate: 'Feb 2025',
        purchases: [
          { id: 'NAV-006', date: '10 Sep 2026', items: 'Geyser + Chimney', amount: 18000, paid: 18000, status: 'Paid' },
          { id: 'NAV-011', date: '5 Apr 2026',  items: 'Microwave', amount: 9500, paid: 9500, status: 'Paid' },
        ],
        pointHistory: [
          { date: '10 Sep 2026', type: 'earn', pts: 180, reason: 'Purchase NAV-006', by: 'System' },
          { date: '5 Apr 2026',  type: 'earn', pts: 95,  reason: 'Purchase NAV-011', by: 'System' },
        ],
      },
    ];

    const saved = localStorage.getItem('ADMIN_SYNC_CUSTOMERS');
    let list = saved ? JSON.parse(saved) : defaultList;

    // Retrieve active logged in user profile & registered users db
    const activeUser = JSON.parse(localStorage.getItem('nav_user_profile') || 'null');
    const dbUsers = JSON.parse(localStorage.getItem('nav_users_db') || '[]');

    const extraUsers = [];
    if (activeUser && activeUser.name) extraUsers.push(activeUser);
    dbUsers.forEach(u => {
      if (u && u.name && !extraUsers.some(x => (x.email && x.email === u.email) || (x.mobile && x.mobile === u.mobile))) {
        extraUsers.push(u);
      }
    });

    extraUsers.forEach(u => {
      const exists = list.some(c => 
        (c.email && u.email && c.email.toLowerCase() === u.email.toLowerCase()) ||
        (c.mobile && u.mobile && c.mobile.replace(/\D/g, '') === u.mobile.replace(/\D/g, '')) ||
        (c.name && c.name.toLowerCase() === u.name.toLowerCase())
      );

      if (!exists) {
        list.unshift({
          id: `usr-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
          name: u.name,
          mobile: u.mobile || '98765-43210',
          email: u.email || 'customer@email.com',
          points: u.loyaltyPoints || 950,
          vip: u.isVipMember || false,
          outstanding: 0,
          spent: 72500,
          rewardProgress: 72,
          joinedDate: 'Oct 2026',
          loyaltyCardNumber: u.loyaltyCardNumber || '',
          purchases: [
            { id: 'NAV-2026-001', date: '7 Oct 2026', items: 'Godrej AC 1.5 Ton, Smart TV', amount: 72500, paid: 72500, status: 'Paid' },
          ],
          pointHistory: [
            { date: '7 Oct 2026', type: 'earn', pts: 950, reason: 'Account creation & purchase bonus', by: 'System' },
          ],
        });
      }
    });

    return list;
  });

  React.useEffect(() => {
    localStorage.setItem('ADMIN_SYNC_CUSTOMERS', JSON.stringify(customers));
  }, [customers]);

  const filtered = filter === 'vip'
    ? customers.filter(c => c.vip)
    : filter === 'outstanding'
    ? customers.filter(c => c.outstanding > 0)
    : customers;

  const handleGivePoints = () => {
    if (!pointsForm.amount || Number(pointsForm.amount) <= 0) return;
    const pts = Number(pointsForm.amount);
    const updatedCustomers = customers.map(c => {
      if (c.id !== selectedCustomer.id) return c;
      return {
        ...c,
        points: c.points + pts,
        pointHistory: [
          { date: new Date().toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' }), type: 'manual', pts, reason: pointsForm.reason || 'Manual bonus by admin', by: 'Admin' },
          ...c.pointHistory,
        ],
      };
    });
    setCustomers(updatedCustomers);
    localStorage.setItem('ADMIN_SYNC_CUSTOMERS', JSON.stringify(updatedCustomers));

    const newTotal = selectedCustomer.points + pts;
    setSelectedCustomer(prev => ({ ...prev, points: newTotal,
      pointHistory: [
        { date: new Date().toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' }), type: 'manual', pts, reason: pointsForm.reason || 'Manual bonus by admin', by: 'Admin' },
        ...prev.pointHistory,
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

  // ─── Customer Detail View ───
  if (selectedCustomer) {
    const c = selectedCustomer;
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
              {c.name[0]}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-[#0B1527] font-extrabold text-[20px]">{c.name}</h2>
                {c.vip && <span className="bg-gradient-to-r from-[#F59E0B] to-[#D97706] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">👑 VIP</span>}
              </div>
              <p className="text-[#64748B] text-[13px]">{c.mobile} · {c.email}</p>
              <p className="text-[#64748B] text-[12px]">Member since {c.joinedDate}</p>
            </div>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-3 gap-3 mt-5">
            <div className="bg-[#F7F8FA] rounded-[14px] p-3 text-center">
              <p className="text-[#64748B] text-[10px] font-medium">Total Spent</p>
              <p className="text-[#0B1527] font-extrabold text-[15px]">₹{c.spent.toLocaleString('en-IN')}</p>
            </div>
            <div className="bg-[#FEF5E7] rounded-[14px] p-3 text-center">
              <p className="text-[#64748B] text-[10px] font-medium">Loyalty Pts</p>
              <p className="text-[#F59E0B] font-extrabold text-[15px]">⭐ {c.points}</p>
            </div>
            <div className={`${c.outstanding > 0 ? 'bg-[#FFEBEC]' : 'bg-[#EDF7F0]'} rounded-[14px] p-3 text-center`}>
              <p className="text-[#64748B] text-[10px] font-medium">Outstanding</p>
              <p className={`font-extrabold text-[15px] ${c.outstanding > 0 ? 'text-[#FF3B4A]' : 'text-[#2BB159]'}`}>
                {c.outstanding > 0 ? `₹${c.outstanding.toLocaleString('en-IN')}` : '✓ Clear'}
              </p>
            </div>
          </div>

          {/* Reward Progress */}
          <div className="mt-4">
            <div className="flex justify-between items-center mb-1.5">
              <p className="text-[#64748B] text-[12px] font-medium">₹1L Reward Progress</p>
              <p className="text-[#0B1527] font-bold text-[12px]">{c.rewardProgress}%</p>
            </div>
            <div className="h-2.5 bg-[#E2E8F0] rounded-full overflow-hidden">
              <div className="h-full rounded-full bg-gradient-to-r from-[#FF3B4A] to-[#E51020] transition-all duration-500"
                style={{ width: `${c.rewardProgress}%` }} />
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
          <SectionHeader title="Purchase History" subtitle={`${c.purchases.length} bills`} />
          <div className="divide-y divide-[#F7F8FA]">
            {c.purchases.map(p => (
              <div key={p.id} className="px-5 py-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-[#0B1527] font-semibold text-[13px]">{p.items}</p>
                    <p className="text-[#64748B] text-[11px] mt-0.5">{p.id} · {p.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[#0B1527] font-bold text-[14px]">₹{p.amount.toLocaleString('en-IN')}</p>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md inline-block mt-0.5 ${
                      p.status === 'Paid' ? 'bg-[#EDF7F0] text-[#2BB159]' :
                      p.status === 'Pending' ? 'bg-[#FFEBEC] text-[#FF3B4A]' :
                      'bg-[#FEF5E7] text-[#F59E0B]'
                    }`}>{p.status}</span>
                  </div>
                </div>
                {p.paid < p.amount && (
                  <div className="mt-2 flex justify-between text-[11px]">
                    <span className="text-[#64748B]">Paid: <span className="text-[#2BB159] font-semibold">₹{p.paid.toLocaleString('en-IN')}</span></span>
                    <span className="text-[#64748B]">Due: <span className="text-[#FF3B4A] font-semibold">₹{(p.amount - p.paid).toLocaleString('en-IN')}</span></span>
                  </div>
                )}
              </div>
            ))}
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
                  <p className="text-[#0B1527] font-extrabold text-[22px]">{c.points} <span className="text-[14px] font-semibold text-[#F59E0B]">points</span></p>
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
                    New balance will be: {c.points + Number(pointsForm.amount)} pts
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
                Give {pointsForm.amount || '—'} Points to {c.name.split(' ')[0]}
              </button>
            </div>
          )}

          {/* Point History */}
          {pointsTab === 'history' && (
            <div className="divide-y divide-[#F7F8FA]">
              {c.pointHistory.map((tx, i) => (
                <div key={i} className="px-5 py-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center text-[14px] flex-shrink-0 ${
                      tx.type === 'manual' ? 'bg-[#FEF5E7]' : tx.pts < 0 ? 'bg-[#FFEBEC]' : 'bg-[#EDF7F0]'
                    }`}>
                      {tx.type === 'manual' ? '✨' : tx.pts < 0 ? '↓' : '⭐'}
                    </div>
                    <div>
                      <p className="text-[#0B1527] font-semibold text-[13px]">{tx.reason}</p>
                      <p className="text-[#64748B] text-[11px]">{tx.date} · by {tx.by}</p>
                    </div>
                  </div>
                  <p className={`font-extrabold text-[15px] ${tx.pts < 0 ? 'text-[#FF3B4A]' : 'text-[#2BB159]'}`}>
                    {tx.pts > 0 ? '+' : ''}{tx.pts}
                  </p>
                </div>
              ))}
            </div>
          )}
        </SectionCard>
      </div>
    );
  }

  // ─── Customer List View ───
  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {['all','vip','outstanding'].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-full text-[13px] font-semibold capitalize transition-all ${filter===f ? 'bg-[#0B1527] text-white' : 'bg-white border border-[#E2E8F0] text-[#64748B] hover:border-[#0B1527]'}`}>
            {f === 'outstanding' ? '⚠️ Outstanding' : f === 'vip' ? '👑 VIP Only' : 'All'}
          </button>
        ))}
      </div>
      <SectionCard>
        <SectionHeader title={`${filtered.length} Customers`} subtitle="Tap a customer to view details & give points" />
        <div className="divide-y divide-[#F7F8FA]">
          {filtered.map((c) => (
            <div key={c.id}
              onClick={() => { setSelectedCustomer(c); setPointsTab('give'); setPointsSaved(false); setPointsForm({ amount: '', reason: '', note: '' }); }}
              className="px-5 py-4 flex items-center justify-between hover:bg-[#FFF5F5] transition-colors cursor-pointer group">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FF3B4A] to-[#0B1527] flex items-center justify-center text-white font-bold text-[15px]">
                  {c.name[0]}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-[#0B1527] font-semibold text-[14px]">{c.name}</p>
                    {c.vip && <span className="text-[9px] font-bold bg-[#FEF5E7] text-[#F59E0B] px-1.5 py-0.5 rounded-full">👑 VIP</span>}
                  </div>
                  <p className="text-[#64748B] text-[12px]">{c.mobile} · ⭐ {c.points} pts</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-[#0B1527] font-bold text-[14px]">₹{c.spent.toLocaleString('en-IN')}</p>
                  {c.outstanding > 0 && <p className="text-[#FF3B4A] font-semibold text-[11px]">Due: ₹{c.outstanding.toLocaleString('en-IN')}</p>}
                </div>
                <ChevronRight className="w-4 h-4 text-[#CBD5E1] group-hover:text-[#FF3B4A] transition-colors" />
              </div>
            </div>
          ))}
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
