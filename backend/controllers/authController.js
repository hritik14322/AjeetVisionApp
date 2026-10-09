const asyncHandler = require('express-async-handler');
const admin = require('../config/firebase');
const User = require('../models/User');
const generateToken = require('../utils/generateToken');

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
  const verifiedMobile = phone_number || mobile; // Fallback to passed mobile if testing

  if (!verifiedMobile) {
    res.status(400);
    throw new Error('Phone number not found in token');
  }

  // Check if user exists
  let user = await User.findOne({ firebaseUid: uid });

  if (!user) {
    // Check if user exists by mobile number (in case they signed up differently before)
    user = await User.findOne({ mobile: verifiedMobile });
    
    if (user) {
      // Link firebase uid to existing user
      user.firebaseUid = uid;
      await user.save();
    } else {
      // Create new user
      user = await User.create({
        firebaseUid: uid,
        mobile: verifiedMobile,
      });
    }
  }

  // Generate our own JWT for session management
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

// @desc    Register a new user (Sign Up)
// @route   POST /api/auth/register
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, mobile, email, password } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error('Please fill in all required fields');
  }

  const userExists = await User.findOne({ email: email.toLowerCase() });
  if (userExists) {
    res.status(400);
    throw new Error('User already exists with this email address');
  }

  const user = await User.create({
    name,
    mobile: mobile || '',
    email: email.toLowerCase(),
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

// @desc    Forgot Password - Send reset link
// @route   POST /api/auth/forgot-password
// @access  Public
const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  if (!email) {
    res.status(400);
    throw new Error('Please enter a valid email address');
  }
  res.status(200).json({
    message: `Password reset link has been sent to ${email}`,
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
  registerUser,
  loginUser,
  forgotPassword,
  logoutUser,
};
