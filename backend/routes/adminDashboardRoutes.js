const express = require('express');
const router = express.Router();
const { getDashboardStats } = require('../controllers/adminDashboardController');

router.route('/stats').get(getDashboardStats);

module.exports = router;
