const asyncHandler = require('express-async-handler');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const User = require('../models/User');

const getRazorpayInstance = () => {
  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
};

// @desc    Create Razorpay Order for VIP Membership
// @route   POST /api/vip/create-order
// @access  Public / User
const createVipOrder = asyncHandler(async (req, res) => {
  let user = req.user;
  if (!user && req.body.email) {
    user = await User.findOne({ email: req.body.email.toLowerCase() });
  }
  if (!user && req.body.customerId) {
    user = await User.findById(req.body.customerId);
  }

  const rzp = getRazorpayInstance();

  const options = {
    amount: 499 * 100, // 499 INR in paise
    currency: 'INR',
    receipt: `rcpt_vip_${user ? user._id : Date.now()}`,
    notes: {
      userId: user ? user._id.toString() : 'guest',
      email: user ? user.email : (req.body.email || ''),
      name: user ? user.name : 'Valued Customer',
    }
  };

  try {
    const order = await rzp.orders.create(options);
    res.json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
      businessName: 'New Ajeet Vision',
      description: 'VIP Club Membership (1 Year)',
    });
  } catch (error) {
    console.error('Razorpay order creation error:', error);
    res.status(500);
    throw new Error('Failed to create Razorpay order');
  }
});

// @desc    Verify Razorpay Payment and Activate VIP
// @route   POST /api/vip/verify-payment
// @access  Public / User
const verifyVipPayment = asyncHandler(async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, email, customerId } = req.body;

  let user = req.user;
  if (!user && customerId) {
    user = await User.findById(customerId);
  }
  if (!user && email) {
    user = await User.findOne({ email: email.toLowerCase() });
  }

  const body = razorpay_order_id + "|" + razorpay_payment_id;

  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || 'dummy_secret')
    .update(body.toString())
    .digest('hex');

  const isAuthentic = expectedSignature === razorpay_signature;

  if (isAuthentic) {
    if (user) {
      const expiry = new Date();
      expiry.setFullYear(expiry.getFullYear() + 1);

      user.vipMembership = {
        isActive: true,
        expiryDate: expiry,
      };

      await user.save();
    }

    res.json({
      success: true,
      message: 'VIP Membership Activated Successfully!',
      vipMembership: user ? user.vipMembership : { isActive: true },
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

// @desc    Activate VIP Directly for customer
// @route   POST /api/vip/activate
// @access  Public / User
const activateVipDirectly = asyncHandler(async (req, res) => {
  const { email, customerId } = req.body;
  let user = null;
  if (req.user) {
    user = await User.findById(req.user._id);
  }
  if (!user && customerId && customerId.length === 24) {
    user = await User.findById(customerId);
  }
  if (!user && email) {
    user = await User.findOne({ email: email.toLowerCase() });
  }
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  const expiry = new Date();
  expiry.setFullYear(expiry.getFullYear() + 1);
  user.vipMembership = {
    isActive: true,
    expiryDate: expiry,
  };
  await user.save();

  res.json({
    success: true,
    message: 'VIP Membership Activated Successfully in MongoDB Atlas!',
    vipMembership: user.vipMembership,
    loyaltyPoints: user.loyaltyPoints,
  });
});

module.exports = {
  createVipOrder,
  verifyVipPayment,
  getVipStatus,
  activateVipDirectly,
};
