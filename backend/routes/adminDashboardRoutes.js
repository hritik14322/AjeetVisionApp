const express = require('express');
const router = express.Router();
const { getDashboardStats, getDashboardCustomers, giveCustomerPoints, toggleCustomerVip } = require('../controllers/adminDashboardController');

router.route('/stats').get(getDashboardStats);
router.route('/customers').get(getDashboardCustomers);
router.route('/customers/give-points').post(giveCustomerPoints);
router.route('/customers/toggle-vip').post(toggleCustomerVip);

module.exports = router;
