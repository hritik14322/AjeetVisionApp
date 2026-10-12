const express = require('express');
const router = express.Router();
const { getDashboardStats, getDashboardCustomers } = require('../controllers/adminDashboardController');

router.route('/stats').get(getDashboardStats);
router.route('/customers').get(getDashboardCustomers);

module.exports = router;
