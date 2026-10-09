const asyncHandler = require('express-async-handler');
const LoyaltyCard = require('../models/LoyaltyCard');
const LoyaltyTransaction = require('../models/LoyaltyTransaction');
const User = require('../models/User');

// @desc    Generate/Create new loyalty cards (Admin)
// @route   POST /api/loyalty/cards
// @access  Private/Admin
const createLoyaltyCards = asyncHandler(async (req, res) => {
  const { count } = req.body; // How many to generate
  const cards = [];

  for (let i = 0; i < count; i++) {
    const randomStr = Math.random().toString(36).substring(2, 8).toUpperCase();
    const cardNumber = `NAV-${Date.now()}-${randomStr}`;
    const qrValue = `QR-${cardNumber}`;
    
    cards.push({
      cardNumber,
      qrValue,
    });
  }

  const createdCards = await LoyaltyCard.insertMany(cards);
  res.status(201).json(createdCards);
});

// @desc    Assign a card to a customer
// @route   POST /api/loyalty/assign
// @access  Private/Admin
const assignCard = asyncHandler(async (req, res) => {
  const { cardNumber, customerId } = req.body;

  const card = await LoyaltyCard.findOne({ cardNumber });
  if (!card) {
    res.status(404);
    throw new Error('Card not found');
  }

  if (card.customer) {
    res.status(400);
    throw new Error('Card is already assigned to a customer. Cannot transfer ownership.');
  }

  const user = await User.findById(customerId);
  if (!user) {
    res.status(404);
    throw new Error('Customer not found');
  }

  card.customer = customerId;
  card.assignedAt = Date.now();
  await card.save();

  res.json({ message: 'Card assigned successfully', card });
});

// @desc    Manual Points Adjustment (Admin)
// @route   POST /api/loyalty/transaction
// @access  Private/Admin
const manualPointsAdjustment = asyncHandler(async (req, res) => {
  const { customerId, type, points, reason } = req.body;
  // type can be 'manual_add' or 'manual_deduct'

  const user = await User.findById(customerId);
  if (!user) {
    res.status(404);
    throw new Error('Customer not found');
  }

  const transaction = new LoyaltyTransaction({
    customer: customerId,
    type,
    reason,
    pointsAdded: type === 'manual_add' ? points : 0,
    pointsDeducted: type === 'manual_deduct' ? points : 0,
    createdBy: req.user._id,
  });

  if (type === 'manual_deduct' && user.loyaltyPoints < points) {
    res.status(400);
    throw new Error('Insufficient points balance for deduction');
  }

  await transaction.save();

  // Update user balance
  if (type === 'manual_add') {
    user.loyaltyPoints += points;
  } else if (type === 'manual_deduct') {
    user.loyaltyPoints -= points;
  }

  await user.save();

  res.json({
    message: 'Points manually adjusted successfully',
    loyaltyPoints: user.loyaltyPoints,
    transaction,
  });
});

// @desc    Redeem Points (Customer Request)
// @route   POST /api/loyalty/redeem
// @access  Private
const redeemPoints = asyncHandler(async (req, res) => {
  const { pointsToRedeem } = req.body;
  const user = await User.findById(req.user._id);

  if (user.loyaltyPoints < pointsToRedeem) {
    res.status(400);
    throw new Error('Insufficient points balance');
  }

  const transaction = new LoyaltyTransaction({
    customer: user._id,
    type: 'redeem',
    pointsDeducted: pointsToRedeem,
    reason: 'Customer requested redemption',
  });

  await transaction.save();

  user.loyaltyPoints -= pointsToRedeem;
  await user.save();

  res.json({
    message: 'Points redeemed successfully',
    remainingPoints: user.loyaltyPoints,
  });
});

module.exports = {
  createLoyaltyCards,
  assignCard,
  manualPointsAdjustment,
  redeemPoints,
};
