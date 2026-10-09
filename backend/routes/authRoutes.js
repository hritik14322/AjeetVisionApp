const express = require('express');
const router = express.Router();
const { verifyFirebaseToken, registerUser, loginUser, forgotPassword, logoutUser } = require('../controllers/authController');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/forgot-password', forgotPassword);
router.post('/verify-firebase', verifyFirebaseToken);
router.post('/logout', logoutUser);

module.exports = router;
