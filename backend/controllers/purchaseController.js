const asyncHandler = require('express-async-handler');
const Purchase = require('../models/Purchase');
const Product = require('../models/Product');
const User = require('../models/User');
const LoyaltyTransaction = require('../models/LoyaltyTransaction');

// @desc    Create new purchase
// @route   POST /api/purchases
// @access  Private/Admin
const createPurchase = asyncHandler(async (req, res) => {
  const { customerId, orderItems, initialPayment, paymentMethod, loyaltyCardId } = req.body;

  if (orderItems && orderItems.length === 0) {
    res.status(400);
    throw new Error('No order items');
  }

  // 1. Calculate prices securely on backend
  let calculatedTotal = 0;
  const verifiedProducts = [];

  for (const item of orderItems) {
    const product = await Product.findById(item.product);
    if (!product) {
      res.status(404);
      throw new Error(`Product not found: ${item.product}`);
    }
    
    // Check stock
    if (product.stock < item.quantity) {
      res.status(400);
      throw new Error(`Insufficient stock for ${product.name}`);
    }

    const itemPrice = product.price.sellingPrice;
    calculatedTotal += itemPrice * item.quantity;
    
    verifiedProducts.push({
      product: product._id,
      name: product.name,
      quantity: item.quantity,
      price: itemPrice
    });

    // Reduce stock
    product.stock -= item.quantity;
    await product.save();
  }

  const remainingAmount = calculatedTotal - (initialPayment || 0);

  // Generate a random invoice number for now
  const invoiceNumber = `INV-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

  const purchase = new Purchase({
    customer: customerId,
    invoiceNumber,
    products: verifiedProducts,
    totalAmount: calculatedTotal,
    amountPaid: initialPayment || 0,
    remainingAmount,
    paymentHistory: initialPayment > 0 ? [{ amount: initialPayment, method: paymentMethod || 'Cash' }] : []
  });

  const createdPurchase = await purchase.save();

  // Update Customer's Reward Progress & Loyalty Points
  const user = await User.findById(customerId);
  if (user) {
    // Reward Progress
    user.rewardProgress.currentAmount += calculatedTotal;
    
    if (user.rewardProgress.currentAmount >= user.rewardProgress.targetAmount && !user.rewardProgress.isUnlocked) {
      user.rewardProgress.isUnlocked = true;
      user.rewardProgress.claimStatus = 'unlocked';
    }
    
    // Loyalty Points Logic (1 point per ₹100)
    const pointsEarned = Math.floor(calculatedTotal / 100);
    
    if (pointsEarned > 0) {
      const transaction = new LoyaltyTransaction({
        customer: customerId,
        card: loyaltyCardId || null,
        purchase: createdPurchase._id,
        pointsAdded: pointsEarned,
        type: 'earn_purchase',
        reason: 'Points earned from purchase',
        createdBy: req.user._id,
      });
      await transaction.save();

      user.loyaltyPoints += pointsEarned;
    }
    
    await user.save();
  }

  res.status(201).json(createdPurchase);
});

// @desc    Get logged in user purchases
// @route   GET /api/purchases/my-purchases
// @access  Private
const getMyPurchases = asyncHandler(async (req, res) => {
  const purchases = await Purchase.find({ customer: req.user._id }).sort({ createdAt: -1 });
  res.json(purchases);
});

// @desc    Get purchase by ID
// @route   GET /api/purchases/:id
// @access  Private
const getPurchaseById = asyncHandler(async (req, res) => {
  const purchase = await Purchase.findById(req.params.id).populate('customer', 'name email mobile');

  if (purchase) {
    // Ensure only the owner or an admin can view it
    if (purchase.customer._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      res.status(403);
      throw new Error('Not authorized to view this purchase');
    }
    res.json(purchase);
  } else {
    res.status(404);
    throw new Error('Purchase not found');
  }
});

// @desc    Add payment to purchase
// @route   PUT /api/purchases/:id/pay
// @access  Private/Admin
const addPayment = asyncHandler(async (req, res) => {
  const { amount, method } = req.body;
  const purchase = await Purchase.findById(req.params.id);

  if (purchase) {
    if (amount > purchase.remainingAmount) {
      res.status(400);
      throw new Error('Payment amount exceeds remaining amount');
    }

    purchase.amountPaid += Number(amount);
    purchase.remainingAmount -= Number(amount);
    
    purchase.paymentHistory.push({
      amount: Number(amount),
      method: method || 'Cash',
      date: Date.now()
    });

    const updatedPurchase = await purchase.save();
    res.json(updatedPurchase);
  } else {
    res.status(404);
    throw new Error('Purchase not found');
  }
});

// @desc    Get all purchases (Admin)
// @route   GET /api/purchases
// @access  Private/Admin
const getPurchases = asyncHandler(async (req, res) => {
  const purchases = await Purchase.find({}).populate('customer', 'name mobile').sort({ createdAt: -1 });
  res.json(purchases);
});

module.exports = {
  createPurchase,
  getMyPurchases,
  getPurchaseById,
  addPayment,
  getPurchases
};
