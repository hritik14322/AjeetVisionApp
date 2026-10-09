const asyncHandler = require('express-async-handler');
const Reward = require('../models/Reward');
const User = require('../models/User');

// @desc    Get user's reward progress
// @route   GET /api/rewards/progress
// @access  Private
const getRewardProgress = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate('rewardProgress.assignedRewardId');
  if (user) {
    res.json(user.rewardProgress);
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Claim unlocked reward
// @route   POST /api/rewards/claim
// @access  Private
const claimReward = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  if (!user.rewardProgress.isUnlocked) {
    res.status(400);
    throw new Error('Reward is not unlocked yet. Keep shopping!');
  }

  if (user.rewardProgress.claimStatus === 'claimed' || user.rewardProgress.assignedRewardId) {
    res.status(400);
    throw new Error('Reward has already been claimed.');
  }

  // Find an active reward with inventory
  // In a real app, logic might be random spin result determined securely by server
  const availableRewards = await Reward.find({ isActive: true, inventory: { $gt: 0 } });

  if (availableRewards.length === 0) {
    res.status(400);
    throw new Error('No rewards currently available in inventory. Please try again later.');
  }

  // Randomly select one
  const randomIndex = Math.floor(Math.random() * availableRewards.length);
  const selectedReward = availableRewards[randomIndex];

  // Assign it to user
  user.rewardProgress.assignedRewardId = selectedReward._id;
  user.rewardProgress.claimStatus = 'claimed';
  
  // Optionally reset the target to allow them to start earning again
  // user.rewardProgress.currentAmount -= user.rewardProgress.targetAmount;
  // user.rewardProgress.isUnlocked = false;
  // user.rewardProgress.claimStatus = 'locked';

  await user.save();

  // Decrement inventory
  selectedReward.inventory -= 1;
  await selectedReward.save();

  res.json({
    message: 'Reward claimed successfully!',
    reward: selectedReward,
  });
});

// @desc    Create a reward
// @route   POST /api/admin/rewards
// @access  Private/Admin
const createReward = asyncHandler(async (req, res) => {
  const { title, description, image, inventory, isActive } = req.body;
  const reward = new Reward({ title, description, image, inventory, isActive });
  const createdReward = await reward.save();
  res.status(201).json(createdReward);
});

// @desc    Get all rewards
// @route   GET /api/admin/rewards
// @access  Private/Admin
const getRewards = asyncHandler(async (req, res) => {
  const rewards = await Reward.find({});
  res.json(rewards);
});

module.exports = {
  getRewardProgress,
  claimReward,
  createReward,
  getRewards,
};
