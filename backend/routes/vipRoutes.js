const express = require('express');
const router = express.Router();
const {
  createVipOrder,
  verifyVipPayment,
  checkOrderStatus,
  verifyRecentPayment,
  handleRazorpayWebhook,
  getVipStatus,
  activateVipDirectly,
} = require('../controllers/vipController');
const { protect } = require('../middlewares/authMiddleware');

router.post('/activate', activateVipDirectly);
router.post('/create-order', createVipOrder);
router.post('/verify-payment', verifyVipPayment);
router.post('/check-order-status', checkOrderStatus);
router.post('/verify-recent-payment', verifyRecentPayment);
router.post('/webhook', handleRazorpayWebhook);
router.get('/status', getVipStatus);

module.exports = router;
