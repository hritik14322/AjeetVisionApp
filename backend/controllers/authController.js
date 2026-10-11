const asyncHandler = require('express-async-handler');
const admin = require('../config/firebase');
const User = require('../models/User');
const Otp = require('../models/Otp');
const generateToken = require('../utils/generateToken');
const { sendOtpEmail } = require('../utils/emailService');

// @desc    Verify Firebase token and login/register user
// @route   POST /api/auth/verify-firebase
// @access  Public
const verifyFirebaseToken = asyncHandler(async (req, res) => {
  const { idToken, mobile } = req.body;

  if (!idToken) {
    res.status(400);
    throw new Error('No ID token provided');
  }

  let decodedToken;
  try {
    decodedToken = await admin.auth().verifyIdToken(idToken);
  } catch (error) {
    res.status(401);
    throw new Error('Invalid Firebase token');
  }

  const { uid, phone_number } = decodedToken;
  const verifiedMobile = phone_number || mobile;

  if (!verifiedMobile) {
    res.status(400);
    throw new Error('Phone number not found in token');
  }

  let user = await User.findOne({ firebaseUid: uid });

  if (!user) {
    user = await User.findOne({ mobile: verifiedMobile });
    if (user) {
      user.firebaseUid = uid;
      await user.save();
    } else {
      user = await User.create({
        firebaseUid: uid,
        mobile: verifiedMobile,
      });
    }
  }

  generateToken(res, user._id);

  res.status(200).json({
    _id: user._id,
    name: user.name,
    mobile: user.mobile,
    role: user.role,
    vipMembership: user.vipMembership,
    loyaltyPoints: user.loyaltyPoints,
  });
});

// @desc    Send OTP to email (for signup or password reset)
// @route   POST /api/auth/send-email-otp
// @access  Public
const sendEmailOtp = asyncHandler(async (req, res) => {
  const { email, type = 'signup' } = req.body;

  if (!email || !email.includes('@')) {
    res.status(400);
    throw new Error('Please enter a valid Gmail / Email address');
  }

  const cleanEmail = email.trim().toLowerCase();

  // If signup, check if email already registered
  if (type === 'signup') {
    const existing = await User.findOne({ email: cleanEmail });
    if (existing) {
      res.status(400);
      throw new Error('An account with this email address already exists. Please sign in instead.');
    }
  }

  // If forgot_password, check if email exists
  if (type === 'forgot_password') {
    const existing = await User.findOne({ email: cleanEmail });
    if (!existing) {
      res.status(404);
      throw new Error('No registered account found with this email address.');
    }
  }

  // Generate 6-digit numeric OTP
  const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

  // Delete previous OTP for this email
  await Otp.deleteMany({ email: cleanEmail });

  // Store new OTP
  await Otp.create({
    email: cleanEmail,
    otp: otpCode,
  });

  // Send email via nodemailer
  const sendResult = await sendOtpEmail(cleanEmail, otpCode, type);

  res.status(200).json({
    success: true,
    message: `Verification OTP has been sent to ${cleanEmail}`,
    email: cleanEmail,
    previewOtp: sendResult.previewOtp || undefined,
  });
});

// @desc    Verify OTP for an email
// @route   POST /api/auth/verify-email-otp
// @access  Public
const verifyEmailOtp = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    res.status(400);
    throw new Error('Email and OTP code are required');
  }

  const cleanEmail = email.trim().toLowerCase();
  const cleanOtp = otp.toString().trim();

  const record = await Otp.findOne({ email: cleanEmail, otp: cleanOtp });
  if (!record) {
    res.status(400);
    throw new Error('Invalid or expired OTP code. Please check your Gmail or request a new OTP.');
  }

  res.status(200).json({
    success: true,
    message: 'Gmail verified successfully',
  });
});

// @desc    Register a new user (Sign Up) with verified OTP
// @route   POST /api/auth/register
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, mobile, email, password, otp } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error('Please fill in all required fields');
  }

  const cleanEmail = email.trim().toLowerCase();

  const userExists = await User.findOne({ email: cleanEmail });
  if (userExists) {
    res.status(400);
    throw new Error('User already exists with this email address');
  }

  // Verify OTP if passed or check active OTP record
  if (otp) {
    const validOtp = await Otp.findOne({ email: cleanEmail, otp: otp.toString().trim() });
    if (!validOtp) {
      res.status(400);
      throw new Error('Invalid or expired OTP code. Please verify your Gmail first.');
    }
    // Delete used OTP
    await Otp.deleteMany({ email: cleanEmail });
  }

  const user = await User.create({
    name: name.trim(),
    mobile: mobile || '',
    email: cleanEmail,
    password,
  });

  if (user) {
    const token = generateToken(res, user._id);
    res.status(201).json({
      _id: user._id,
      name: user.name,
      mobile: user.mobile,
      email: user.email,
      role: user.role,
      vipMembership: user.vipMembership,
      loyaltyPoints: user.loyaltyPoints,
      token,
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// @desc    Authenticate user & get token (Sign In)
// @route   POST /api/auth/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email: email.toLowerCase() });

  if (user && (user.password === password || !user.password)) {
    const token = generateToken(res, user._id);
    res.status(200).json({
      _id: user._id,
      name: user.name,
      mobile: user.mobile,
      email: user.email,
      role: user.role,
      vipMembership: user.vipMembership,
      loyaltyPoints: user.loyaltyPoints,
      token,
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
});

// @desc    Forgot Password - Send OTP to email
// @route   POST /api/auth/forgot-password
// @access  Public
const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  if (!email || !email.includes('@')) {
    res.status(400);
    throw new Error('Please enter a valid Gmail / Email address');
  }

  const cleanEmail = email.trim().toLowerCase();
  const user = await User.findOne({ email: cleanEmail });
  if (!user) {
    res.status(404);
    throw new Error('No account found with this email address.');
  }

  const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
  await Otp.deleteMany({ email: cleanEmail });
  await Otp.create({ email: cleanEmail, otp: otpCode });

  const sendResult = await sendOtpEmail(cleanEmail, otpCode, 'forgot_password');

  res.status(200).json({
    success: true,
    message: `Password reset OTP has been sent to ${cleanEmail}`,
    email: cleanEmail,
    previewOtp: sendResult.previewOtp || undefined,
  });
});

// @desc    Reset password using verified email OTP
// @route   POST /api/auth/reset-password
// @access  Public
const resetPasswordWithOtp = asyncHandler(async (req, res) => {
  const { email, otp, newPassword } = req.body;

  if (!email || !otp || !newPassword) {
    res.status(400);
    throw new Error('Email, OTP, and new password are required');
  }

  if (newPassword.length < 6) {
    res.status(400);
    throw new Error('Password must be at least 6 characters long');
  }

  const cleanEmail = email.trim().toLowerCase();
  const validOtp = await Otp.findOne({ email: cleanEmail, otp: otp.toString().trim() });

  if (!validOtp) {
    res.status(400);
    throw new Error('Invalid or expired OTP code.');
  }

  const user = await User.findOne({ email: cleanEmail });
  if (!user) {
    res.status(404);
    throw new Error('No user found with this email.');
  }

  user.password = newPassword;
  await user.save();
  await Otp.deleteMany({ email: cleanEmail });

  res.status(200).json({
    success: true,
    message: 'Password reset successfully! You can now sign in with your new password.',
  });
});

// @desc    Logout user / clear cookie
// @route   POST /api/auth/logout
// @access  Public
const logoutUser = asyncHandler(async (req, res) => {
  res.cookie('jwt', '', {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ message: 'Logged out successfully' });
});

module.exports = {
  verifyFirebaseToken,
  sendEmailOtp,
  verifyEmailOtp,
  registerUser,
  loginUser,
  forgotPassword,
  resetPasswordWithOtp,
  logoutUser,
};
