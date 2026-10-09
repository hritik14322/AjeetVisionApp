const asyncHandler = require('express-async-handler');
const Purchase = require('../models/Purchase');
const User = require('../models/User');
const Product = require('../models/Product');

const getDashboardStats = asyncHandler(async (req, res) => {
  const totalPurchases = await Purchase.aggregate([{ $group: { _id: null, totalSales: { $sum: '$totalAmount' }, totalOutstanding: { $sum: '$remainingAmount' } } }]);
  const customerCount = await User.countDocuments({ role: 'customer' });
  const vipCount = await User.countDocuments({ 'vipMembership.isActive': true });
  const recentPurchases = await Purchase.find().sort({ createdAt: -1 }).limit(5).populate('customer', 'name');

  res.json({
    totalSales: totalPurchases[0]?.totalSales || 0,
    totalOutstanding: totalPurchases[0]?.totalOutstanding || 0,
    totalCustomers: customerCount,
    totalVipMembers: vipCount,
    recentPurchases
  });
});

module.exports = { getDashboardStats };
