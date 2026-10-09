const express = require('express');
const router = express.Router();
const {
  createLoyaltyCards,
  assignCard,
  manualPointsAdjustment,
  redeemPoints,
} = require('../controllers/loyaltyController');
const { protect, adminOnly } = require('../middlewares/authMiddleware');

// Customer
router.post('/redeem', protect, redeemPoints);

// Admin
router.post('/cards', protect, adminOnly, createLoyaltyCards);
router.post('/assign', protect, adminOnly, assignCard);
router.post('/transaction', protect, adminOnly, manualPointsAdjustment);

module.exports = router;
