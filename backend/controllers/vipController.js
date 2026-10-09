const asyncHandler = require('express-async-handler');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const User = require('../models/User');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'dummy_key',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'dummy_secret',
});

// @desc    Create Razorpay Order for VIP Membership
// @route   POST /api/vip/create-order
// @access  Private
const createVipOrder = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  const options = {
    amount: 499 * 100, // 499 INR in paise
    currency: 'INR',
    receipt: `receipt_vip_${user._id}`,
  };

  try {
    const order = await razorpay.orders.create(options);
    res.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (error) {
    res.status(500);
    throw new Error('Failed to create Razorpay order');
  }
});

// @desc    Verify Razorpay Payment and Activate VIP
// @route   POST /api/vip/verify-payment
// @access  Private
const verifyVipPayment = asyncHandler(async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  const body = razorpay_order_id + "|" + razorpay_payment_id;

  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || 'dummy_secret')
    .update(body.toString())
    .digest('hex');

  const isAuthentic = expectedSignature === razorpay_signature;

  if (isAuthentic) {
    const user = await User.findById(req.user._id);
    
    // Activate membership for 1 year
    const expiry = new Date();
    expiry.setFullYear(expiry.getFullYear() + 1);

    user.vipMembership = {
      isActive: true,
      expiryDate: expiry,
    };

    await user.save();

    res.json({
      message: 'VIP Membership Activated Successfully!',
      vipMembership: user.vipMembership,
    });
  } else {
    res.status(400);
    throw new Error('Invalid payment signature. Payment verification failed.');
  }
});

// @desc    Get VIP Status
// @route   GET /api/vip/status
// @access  Private
const getVipStatus = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  res.json(user.vipMembership);
});

module.exports = {
  createVipOrder,
  verifyVipPayment,
  getVipStatus,
};
