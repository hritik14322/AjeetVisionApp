const express = require('express');
const router = express.Router();
const { getDashboardStats, getDashboardCustomers, giveCustomerPoints } = require('../controllers/adminDashboardController');

router.route('/stats').get(getDashboardStats);
router.route('/customers').get(getDashboardCustomers);
router.route('/customers/give-points').post(giveCustomerPoints);

module.exports = router;
