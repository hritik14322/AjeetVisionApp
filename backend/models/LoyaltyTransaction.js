const mongoose = require('mongoose');

const loyaltyTransactionSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    card: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'LoyaltyCard', // Optional: Can earn points via mobile number
    },
    purchase: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Purchase', // Optional: For manual adjustments
    },
    pointsAdded: {
      type: Number,
      default: 0,
    },
    pointsDeducted: {
      type: Number,
      default: 0,
    },
    type: {
      type: String,
      enum: ['earn_purchase', 'redeem', 'manual_add', 'manual_deduct'],
      required: true,
    },
    reason: {
      type: String,
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Usually the admin who did it, or system for purchases
    },
  },
  {
    timestamps: true,
  }
);

const LoyaltyTransaction = mongoose.model('LoyaltyTransaction', loyaltyTransactionSchema);

module.exports = LoyaltyTransaction;
