const express = require('express');
const router = express.Router();
const { toggleWishlist, getWishlist } = require('../controllers/wishlistController');
const { protect } = require('../middlewares/authMiddleware');

router.route('/').get(protect, getWishlist);
router.route('/toggle').post(protect, toggleWishlist);

module.exports = router;
