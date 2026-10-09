const express = require('express');
const router = express.Router();
const {
  createPurchase,
  getMyPurchases,
  getPurchaseById,
  addPayment,
  getPurchases
} = require('../controllers/purchaseController');
const { protect, adminOnly } = require('../middlewares/authMiddleware');

router.route('/')
  .post(protect, adminOnly, createPurchase)
  .get(protect, adminOnly, getPurchases);

router.route('/my-purchases').get(protect, getMyPurchases);

router.route('/:id').get(protect, getPurchaseById);

router.route('/:id/pay').put(protect, adminOnly, addPayment);

module.exports = router;
