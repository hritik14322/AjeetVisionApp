const mongoose = require('mongoose');

const loyaltyCardSchema = new mongoose.Schema(
  {
    cardNumber: {
      type: String,
      required: true,
      unique: true,
    },
    qrValue: {
      type: String,
      required: true,
      unique: true,
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null, // null means unassigned
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'lost'],
      default: 'active',
    },
    assignedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

const LoyaltyCard = mongoose.model('LoyaltyCard', loyaltyCardSchema);

module.exports = LoyaltyCard;
