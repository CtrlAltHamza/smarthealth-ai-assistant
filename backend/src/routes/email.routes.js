const express = require('express');
const router = express.Router();
const logger = require('../utils/logger');

// Mock storage
const verificationCodes = {};

// Send verification email
router.post('/send-verification', (req, res) => {
  try {
    const { email } = req.body;

    if (!email || !email.includes('@')) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address',
      });
    }

    // Generate 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    verificationCodes[email] = {
      code,
      attempts: 0,
      expiresAt: Date.now() + 10 * 60 * 1000, // 10 minutes
    };

    logger.info(`Verification code for ${email}: ${code}`);

    res.status(200).json({
      success: true,
      message: 'Verification email sent successfully',
      data: {
        email,
        codeLength: 6,
        expiresIn: '10 minutes',
      },
    });
  } catch (error) {
    logger.error('Error sending verification:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send verification email',
    });
  }
});

// Verify email token
router.post('/verify-token', (req, res) => {
  try {
    const { email, token } = req.body;

    if (!verificationCodes[email]) {
      return res.status(400).json({
        success: false,
        message: 'No verification code found. Please request a new one.',
      });
    }

    const { code, attempts, expiresAt } = verificationCodes[email];

    // Check expiry
    if (Date.now() > expiresAt) {
      delete verificationCodes[email];
      return res.status(400).json({
        success: false,
        message: 'Verification code expired. Please request a new one.',
      });
    }

    // Check attempts
    if (attempts >= 3) {
      delete verificationCodes[email];
      return res.status(400).json({
        success: false,
        message: 'Too many failed attempts. Please request a new code.',
      });
    }

    // Verify code
    if (code !== token) {
      verificationCodes[email].attempts++;
      return res.status(400).json({
        success: false,
        message: `Invalid code. ${3 - attempts} attempts remaining.`,
      });
    }

    // Success
    delete verificationCodes[email];
    logger.info(`Email verified: ${email}`);

    res.status(200).json({
      success: true,
      message: 'Email verified successfully',
      data: { email, verified: true },
    });
  } catch (error) {
    logger.error('Error verifying token:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to verify email',
    });
  }
});

// Forgot password
router.post('/forgot-password', (req, res) => {
  try {
    const { email } = req.body;
    res.status(200).json({
      success: true,
      message: 'Password reset email sent successfully',
    });
  } catch (error) {
    logger.error('Error in forgot password:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send reset email',
    });
  }
});

// Reset password
router.post('/reset-password', (req, res) => {
  try {
    const { token, password } = req.body;
    res.status(200).json({
      success: true,
      message: 'Password reset successfully',
    });
  } catch (error) {
    logger.error('Error resetting password:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to reset password',
    });
  }
});

module.exports = router;
