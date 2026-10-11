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

module.exports = { getDashboardStats };
