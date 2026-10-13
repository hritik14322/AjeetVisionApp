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
  if (!user && req.body.customerId && req.body.customerId.length === 24) {
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
  if (!user && customerId && customerId.length === 24) {
    user = await User.findById(customerId);
  }
  if (!user && email) {
    user = await User.findOne({ email: email.trim().toLowerCase() });
  }

  const rzp = getRazorpayInstance();

  // 1. Check signature if provided
  let isAuthentic = false;
  if (razorpay_order_id && razorpay_payment_id && razorpay_signature) {
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || 'dummy_secret')
      .update(body.toString())
      .digest('hex');
    isAuthentic = (expectedSignature === razorpay_signature);
  }

  // 2. Direct Razorpay API verification fallback
  if (!isAuthentic && razorpay_payment_id) {
    try {
      const payment = await rzp.payments.fetch(razorpay_payment_id);
      if (payment && (payment.status === 'captured' || payment.status === 'authorized')) {
        isAuthentic = true;
        if (!user && payment.email) {
          user = await User.findOne({ email: payment.email.trim().toLowerCase() });
        }
      }
    } catch (fetchErr) {
      console.error('Razorpay payment fetch error in verifyVipPayment:', fetchErr);
    }
  }

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

    return res.json({
      success: true,
      message: 'VIP Membership Activated Successfully!',
      vipMembership: user ? user.vipMembership : { isActive: true },
      user: user ? {
        id: user._id,
        name: user.name,
        email: user.email,
        vip: true,
        isVipMember: true,
      } : null,
    });
  } else {
    res.status(400);
    throw new Error('Invalid payment signature. Payment verification failed.');
  }
});

// @desc    Check Razorpay Order Status directly via Razorpay API and Activate VIP if paid
// @route   POST /api/vip/check-order-status
// @access  Public / User
const checkOrderStatus = asyncHandler(async (req, res) => {
  const { orderId, email, customerId } = req.body;
  if (!orderId) {
    res.status(400);
    throw new Error('Order ID is required');
  }

  let user = req.user;
  if (!user && customerId && customerId.length === 24) {
    user = await User.findById(customerId);
  }
  if (!user && email) {
    user = await User.findOne({ email: email.trim().toLowerCase() });
  }

  const rzp = getRazorpayInstance();

  try {
    const payments = await rzp.orders.fetchPayments(orderId);
    const successfulPayment = payments?.items?.find(
      (p) => p.status === 'captured' || p.status === 'authorized'
    );

    if (successfulPayment) {
      if (!user && successfulPayment.email) {
        user = await User.findOne({ email: successfulPayment.email.trim().toLowerCase() });
      }

      if (user) {
        const expiry = new Date();
        expiry.setFullYear(expiry.getFullYear() + 1);
        user.vipMembership = {
          isActive: true,
          expiryDate: expiry,
        };
        await user.save();
      }

      return res.json({
        success: true,
        isVip: true,
        status: 'PAID',
        paymentId: successfulPayment.id,
        message: 'Payment verified successfully! VIP Membership is Active.',
        vipMembership: user ? user.vipMembership : { isActive: true },
        user: user ? {
          id: user._id,
          name: user.name,
          email: user.email,
          vip: true,
          isVipMember: true,
        } : null,
      });
    }

    return res.json({
      success: false,
      isVip: Boolean(user?.vipMembership?.isActive),
      status: 'PENDING',
      message: 'Payment has not been completed or captured yet.',
    });
  } catch (error) {
    console.error('Razorpay check-order-status error:', error);
    res.status(500);
    throw new Error('Failed to verify order status with Razorpay');
  }
});

// @desc    Verify recent successful Razorpay payments for a customer email and activate VIP
// @route   POST /api/vip/verify-recent-payment
// @access  Public / User
const verifyRecentPayment = asyncHandler(async (req, res) => {
  const { email, customerId } = req.body;
  let user = req.user;
  if (!user && customerId && customerId.length === 24) {
    user = await User.findById(customerId);
  }
  if (!user && email) {
    user = await User.findOne({ email: email.trim().toLowerCase() });
  }

  if (!user) {
    res.status(404);
    throw new Error('Customer not found');
  }

  // If already active in database, return success
  if (user.vipMembership?.isActive) {
    return res.json({
      success: true,
      isVip: true,
      message: 'Customer is already a verified VIP Club member.',
      vipMembership: user.vipMembership,
    });
  }

  const rzp = getRazorpayInstance();

  try {
    const paymentsList = await rzp.payments.all({ count: 20 });
    const targetEmail = (user.email || email || '').trim().toLowerCase();

    const match = paymentsList?.items?.find((p) => {
      const isPaid = (p.status === 'captured' || p.status === 'authorized');
      const emailMatches = p.email && p.email.toLowerCase() === targetEmail;
      const amountMatches = p.amount === 49900;
      return isPaid && (emailMatches || amountMatches);
    });

    if (match) {
      const expiry = new Date();
      expiry.setFullYear(expiry.getFullYear() + 1);
      user.vipMembership = {
        isActive: true,
        expiryDate: expiry,
      };
      await user.save();

      return res.json({
        success: true,
        isVip: true,
        paymentId: match.id,
        message: 'Verified successfully! VIP Membership activated.',
        vipMembership: user.vipMembership,
      });
    }

    return res.json({
      success: false,
      isVip: false,
      message: 'No captured ₹499 payment found for this account.',
    });
  } catch (err) {
    console.error('Error fetching Razorpay payments:', err);
    res.status(500);
    throw new Error('Failed to query Razorpay payments');
  }
});

// @desc    Razorpay Webhook Handler
// @route   POST /api/vip/webhook
// @access  Public
const handleRazorpayWebhook = asyncHandler(async (req, res) => {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET || process.env.RAZORPAY_KEY_SECRET;
  const signature = req.headers['x-razorpay-signature'];

  if (secret && signature) {
    try {
      const shasum = crypto.createHmac('sha256', secret);
      shasum.update(JSON.stringify(req.body));
      const digest = shasum.digest('hex');
      if (digest !== signature) {
        return res.status(400).json({ status: 'invalid signature' });
      }
    } catch (e) {
      console.warn('Webhook signature check skipped:', e.message);
    }
  }

  const event = req.body?.event;
  const paymentPayload = req.body?.payload?.payment?.entity;
  const orderPayload = req.body?.payload?.order?.entity;

  if (event === 'payment.captured' || event === 'order.paid') {
    const email = paymentPayload?.email || orderPayload?.notes?.email;
    const userId = paymentPayload?.notes?.userId || orderPayload?.notes?.userId;

    let user = null;
    if (userId && userId.length === 24) {
      user = await User.findById(userId);
    }
    if (!user && email) {
      user = await User.findOne({ email: email.toLowerCase() });
    }

    if (user) {
      const expiry = new Date();
      expiry.setFullYear(expiry.getFullYear() + 1);
      user.vipMembership = {
        isActive: true,
        expiryDate: expiry,
      };
      await user.save();
      console.log(`[WEBHOOK] VIP membership activated for ${user.email}`);
    }
  }

  res.status(200).json({ status: 'ok' });
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
  checkOrderStatus,
  verifyRecentPayment,
  handleRazorpayWebhook,
  getVipStatus,
  activateVipDirectly,
};
