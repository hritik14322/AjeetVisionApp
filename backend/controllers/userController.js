const asyncHandler = require('express-async-handler');
const User = require('../models/User');

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      mobile: user.mobile,
      address: user.address,
      dob: user.dob,
      profileImage: user.profileImage,
      vipMembership: user.vipMembership,
      loyaltyPoints: user.loyaltyPoints,
      rewardProgress: user.rewardProgress,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.dob = req.body.dob || user.dob;
    user.profileImage = req.body.profileImage || user.profileImage;
    
    if (req.body.address) {
      user.address = {
        street: req.body.address.street || user.address.street,
        city: req.body.address.city || user.address.city,
        state: req.body.address.state || user.address.state,
        zipCode: req.body.address.zipCode || user.address.zipCode,
      };
    }

    // Note: Mobile number shouldn't be easily updated as it's tied to Firebase Auth.
    // If they want to change mobile, they need to re-verify OTP.

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      mobile: updatedUser.mobile,
      address: updatedUser.address,
      dob: updatedUser.dob,
      profileImage: updatedUser.profileImage,
      vipMembership: updatedUser.vipMembership,
      loyaltyPoints: updatedUser.loyaltyPoints,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({});
  res.json(users);
});

module.exports = {
  getUserProfile,
  updateUserProfile,
  getUsers,
};
