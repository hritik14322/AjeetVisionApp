const asyncHandler = require('express-async-handler');
const Purchase = require('../models/Purchase');
const User = require('../models/User');
const Product = require('../models/Product');

const getDashboardStats = asyncHandler(async (req, res) => {
  let customerCount = await User.countDocuments({ role: 'customer' });
  let vipCount = await User.countDocuments({ 'vipMembership.isActive': true });
  let totalPurchases = await Purchase.aggregate([{ $group: { _id: null, totalSales: { $sum: '$totalAmount' }, totalOutstanding: { $sum: '$remainingAmount' } } }]);
  let recentPurchases = await Purchase.find().sort({ createdAt: -1 }).limit(5).populate('customer', 'name');

  let sales = totalPurchases[0]?.totalSales || 0;
  let outstanding = totalPurchases[0]?.totalOutstanding || 0;

  // When database has 0 customer records, ensure demo customer Hritik Kumar reflects in the dashboard
  if (customerCount === 0) {
    customerCount = 1;
    vipCount = 1;
    sales = 48990;
    outstanding = 0;
    recentPurchases = [
      {
        _id: 'demo_pur_hritik_001',
        invoiceNumber: 'NAV-2024-001',
        customer: { name: 'Hritik Kumar' },
        totalAmount: 48990,
        paidAmount: 48990,
        remainingAmount: 0,
        status: 'completed',
        createdAt: new Date(),
      }
    ];
  }

  res.json({
    totalSales: sales,
    totalOutstanding: outstanding,
    totalCustomers: customerCount,
    totalVipMembers: vipCount,
    recentPurchases
  });
});

const getDashboardCustomers = asyncHandler(async (req, res) => {
  const users = await User.find({ role: 'customer' }).sort({ createdAt: -1 }).lean();
  
  const customerList = await Promise.all(users.map(async (u) => {
    const userPurchases = await Purchase.find({ customer: u._id }).sort({ createdAt: -1 }).lean();
    const spent = userPurchases.reduce((acc, p) => acc + (p.paidAmount || p.totalAmount || 0), 0);
    const outstanding = userPurchases.reduce((acc, p) => acc + (p.remainingAmount || 0), 0);

    return {
      id: u._id.toString(),
      _id: u._id.toString(),
      name: u.name || 'Valued Customer',
      mobile: u.mobile || '',
      email: u.email || '',
      points: u.loyaltyPoints || 0,
      vip: Boolean(u.vipMembership?.isActive),
      isVipMember: Boolean(u.vipMembership?.isActive),
      dob: u.dob || null,
      outstanding,
      spent: spent || (u.rewardProgress?.currentAmount || 0),
      rewardProgress: Math.min(100, Math.round(((spent || u.rewardProgress?.currentAmount || 0) / 100000) * 100)),
      joinedDate: u.createdAt ? new Date(u.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Recent',
      loyaltyCardNumber: `NAV-${new Date(u.createdAt || Date.now()).getFullYear()}-${u._id.toString().slice(-4).toUpperCase()}`,
      purchases: userPurchases.map(p => ({
        _id: p._id.toString(),
        id: p.invoiceNumber || p._id.toString(),
        invoiceNumber: p.invoiceNumber || 'INV-001',
        invoiceNo: p.invoiceNumber || 'INV-001',
        name: u.name,
        items: p.items?.[0]?.productName || p.description || 'Showroom Purchase',
        amount: p.totalAmount || 0,
        totalAmount: p.totalAmount || 0,
        paid: p.paidAmount || 0,
        due: p.remainingAmount || 0,
        date: new Date(p.createdAt || Date.now()).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
        status: p.status || 'Paid',
      })),
    };
  }));

  res.json({ success: true, count: customerList.length, customers: customerList });
});

const giveCustomerPoints = asyncHandler(async (req, res) => {
  const { customerId, email, points } = req.body;
  let user = null;
  if (customerId && customerId.length === 24) {
    user = await User.findById(customerId);
  }
  if (!user && email) {
    user = await User.findOne({ email: email.trim().toLowerCase() });
  }
  if (!user) {
    res.status(404);
    throw new Error('Customer not found in database');
  }

  const addedPts = Number(points) || 0;
  user.loyaltyPoints = Math.max(0, (user.loyaltyPoints || 0) + addedPts);
  await user.save();

  res.json({
    success: true,
    message: `Added ${addedPts} points to ${user.name}`,
    points: user.loyaltyPoints,
    customer: {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      points: user.loyaltyPoints,
    }
  });
});

const toggleCustomerVip = asyncHandler(async (req, res) => {
  const { customerId, email, isVip } = req.body;
  let user = null;
  if (customerId && customerId.length === 24) {
    user = await User.findById(customerId);
  }
  if (!user && email) {
    user = await User.findOne({ email: email.trim().toLowerCase() });
  }
  if (!user) {
    res.status(404);
    throw new Error('Customer not found in database');
  }

  const nextVip = isVip !== undefined ? Boolean(isVip) : !Boolean(user.vipMembership?.isActive);
  user.vipMembership = user.vipMembership || {};
  user.vipMembership.isActive = nextVip;
  if (nextVip) {
    const expiry = new Date();
    expiry.setFullYear(expiry.getFullYear() + 1);
    user.vipMembership.expiryDate = expiry;
  }
  await user.save();

  res.json({
    success: true,
    message: `${user.name} VIP status is now ${nextVip ? 'ACTIVE' : 'INACTIVE'}`,
    vip: nextVip,
    isVipMember: nextVip,
    customer: {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      vip: nextVip,
      isVipMember: nextVip,
    }
  });
});

module.exports = { getDashboardStats, getDashboardCustomers, giveCustomerPoints, toggleCustomerVip };
