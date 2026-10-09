const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    firebaseUid: {
      type: String,
      default: function() { return `uid_${Date.now()}_${Math.random().toString(36).substring(2)}`; },
    },
    role: {
      type: String,
      enum: ['customer', 'admin'],
      default: 'customer',
    },
    name: {
      type: String,
      default: '',
    },
    mobile: {
      type: String,
      default: '',
    },
    email: {
      type: String,
      default: '',
    },
    password: {
      type: String,
      default: '',
    },
    address: {
      street: { type: String, default: '' },
      city: { type: String, default: '' },
      state: { type: String, default: '' },
      zipCode: { type: String, default: '' },
    },
    dob: {
      type: Date,
    },
    profileImage: {
      type: String,
      default: '',
    },
    vipMembership: {
      isActive: { type: Boolean, default: false },
      expiryDate: { type: Date },
    },
    loyaltyPoints: {
      type: Number,
      default: 0,
    },
    rewardProgress: {
      currentAmount: { type: Number, default: 0 },
      targetAmount: { type: Number, default: 100000 },
      isUnlocked: { type: Boolean, default: false },
      assignedRewardId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Reward',
      },
      claimStatus: {
        type: String,
        enum: ['locked', 'unlocked', 'claimed'],
        default: 'locked',
      },
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model('User', userSchema);

module.exports = User;
