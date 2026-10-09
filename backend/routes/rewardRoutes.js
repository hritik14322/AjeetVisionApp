const express = require('express');
const router = express.Router();
const {
  getRewardProgress,
  claimReward,
  createReward,
  getRewards,
} = require('../controllers/rewardController');
const { protect, adminOnly } = require('../middlewares/authMiddleware');

// Customer routes
router.route('/progress').get(protect, getRewardProgress);
router.route('/claim').post(protect, claimReward);

// Admin routes (Will mount to /api/admin/rewards)
router.route('/')
  .post(protect, adminOnly, createReward)
  .get(protect, adminOnly, getRewards);

module.exports = router;
