const express = require('express');
const router = express.Router();
const {
  createVipOrder,
  verifyVipPayment,
  getVipStatus,
  activateVipDirectly,
} = require('../controllers/vipController');
const { protect } = require('../middlewares/authMiddleware');

router.post('/activate', activateVipDirectly);
router.post('/create-order', createVipOrder);
router.post('/verify-payment', verifyVipPayment);
router.get('/status', getVipStatus);

module.exports = router;
