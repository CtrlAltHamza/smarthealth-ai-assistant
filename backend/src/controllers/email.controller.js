const crypto = require('crypto');
const { User } = require('../models');
const { sendVerificationEmail, sendPasswordResetEmail } = require('../utils/email');
const logger = require('../utils/logger');

/**
 * Send verification email
 * POST /api/email/send-verification
 */
exports.sendVerificationEmail = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: 'User already verified' });
    }

    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto
      .createHash('sha256')
      .update(verificationToken)
      .digest('hex');

    // Store hashed token and expiry in user record
    user.verificationToken = hashedToken;
    user.verificationTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000);
    await user.save();

    // Send email
    const emailSent = await sendVerificationEmail(email, verificationToken);

    if (!emailSent) {
      return res.status(500).json({ message: 'Failed to send verification email' });
    }

    logger.info(`Verification email sent to ${email}`);
    res.status(200).json({ message: 'Verification email sent successfully' });
  } catch (error) {
    logger.error('Error in sendVerificationEmail:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * Verify email token
 * POST /api/email/verify-token
 */
exports.verifyEmailToken = async (req, res) => {
  try {
    const { token } = req.body;

    const hashedToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    const user = await User.findOne({
      where: {
        verificationToken: hashedToken,
        verificationTokenExpiry: {
          [require('sequelize').Op.gt]: new Date(),
        },
      },
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired verification token' });
    }

    // Mark user as verified
    user.isVerified = true;
    user.verificationToken = null;
    user.verificationTokenExpiry = null;
    await user.save();

    logger.info(`User ${user.email} verified successfully`);
    res.status(200).json({ message: 'Email verified successfully' });
  } catch (error) {
    logger.error('Error in verifyEmailToken:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * Send password reset email
 * POST /api/email/forgot-password
 */
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    // Store hashed token and expiry
    user.resetPasswordToken = hashedToken;
    user.resetPasswordTokenExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
    await user.save();

    // Send email
    const emailSent = await sendPasswordResetEmail(email, resetToken);

    if (!emailSent) {
      return res.status(500).json({ message: 'Failed to send password reset email' });
    }

    logger.info(`Password reset email sent to ${email}`);
    res.status(200).json({ message: 'Password reset email sent successfully' });
  } catch (error) {
    logger.error('Error in forgotPassword:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * Reset password with token
 * POST /api/email/reset-password
 */
exports.resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    const hashedToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    const user = await User.findOne({
      where: {
        resetPasswordToken: hashedToken,
        resetPasswordTokenExpiry: {
          [require('sequelize').Op.gt]: new Date(),
        },
      },
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired reset token' });
    }

    // Update password
    const bcrypt = require('bcryptjs');
    user.password = await bcrypt.hash(newPassword, 12);
    user.resetPasswordToken = null;
    user.resetPasswordTokenExpiry = null;
    await user.save();

    logger.info(`Password reset for user ${user.email}`);
    res.status(200).json({ message: 'Password reset successfully' });
  } catch (error) {
    logger.error('Error in resetPassword:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
