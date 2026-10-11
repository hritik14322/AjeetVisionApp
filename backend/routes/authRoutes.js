const express = require('express');
const router = express.Router();
const {
  verifyFirebaseToken,
  sendEmailOtp,
  verifyEmailOtp,
  registerUser,
  loginUser,
  forgotPassword,
  resetPasswordWithOtp,
  logoutUser,
} = require('../controllers/authController');

router.post('/send-email-otp', sendEmailOtp);
router.post('/verify-email-otp', verifyEmailOtp);
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPasswordWithOtp);
router.post('/verify-firebase', verifyFirebaseToken);
router.post('/logout', logoutUser);

module.exports = router;
