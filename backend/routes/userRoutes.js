const express = require('express');
const router = express.Router();
const {
  getUserProfile,
  updateUserProfile,
  getUsers,
} = require('../controllers/userController');
const { protect, adminOnly } = require('../middlewares/authMiddleware');

router.route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

// Note: In server.js we will mount this on /api/users
// So this becomes GET /api/users/admin
// Actually let's just make it GET /api/users/ for admin
router.route('/')
  .get(protect, adminOnly, getUsers);

module.exports = router;
