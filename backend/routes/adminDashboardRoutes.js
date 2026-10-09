const express = require('express');
const router = express.Router();
const { getDashboardStats } = require('../controllers/adminDashboardController');
const { protect, adminOnly } = require('../middlewares/authMiddleware');

router.route('/stats').get(protect, adminOnly, getDashboardStats);

module.exports = router;
