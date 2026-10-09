const express = require('express');
const router = express.Router();
const { createOffer, getActiveOffers } = require('../controllers/offerController');
const { protect, adminOnly } = require('../middlewares/authMiddleware');

router.route('/active').get(getActiveOffers);
router.route('/').post(protect, adminOnly, createOffer);

module.exports = router;
