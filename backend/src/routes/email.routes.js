const express = require('express');
const emailController = require('../controllers/email.controller');
const authMiddleware = require('../middleware/auth.middleware');

const router = express.Router();

// Public routes
router.post('/send-verification', emailController.sendVerificationEmail);
router.post('/verify-token', emailController.verifyEmailToken);
router.post('/forgot-password', emailController.forgotPassword);
router.post('/reset-password', emailController.resetPassword);

module.exports = router;
