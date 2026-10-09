const express = require('express');
const router = express.Router();
const {
  createVipOrder,
  verifyVipPayment,
  getVipStatus,
} = require('../controllers/vipController');
const { protect } = require('../middlewares/authMiddleware');

router.post('/create-order', protect, createVipOrder);
router.post('/verify-payment', protect, verifyVipPayment);
router.get('/status', protect, getVipStatus);

module.exports = router;
