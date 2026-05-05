const nodemailer = require('nodemailer');

// Create email transporter
const transporter = nodemailer.createTransport({
  service: process.env.SMTP_SERVICE || 'gmail',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

/**
 * Send verification email
 */
async function sendVerificationEmail(email, verificationToken) {
  try {
    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;
    
    const mailOptions = {
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: email,
      subject: 'Verify Your Email - SmartHealth',
      html: `
        <h2>Welcome to SmartHealth!</h2>
        <p>Please verify your email address by clicking the link below:</p>
        <a href="${verificationUrl}" style="background-color: #4A90E2; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
          Verify Email
        </a>
        <p>Or copy this link: ${verificationUrl}</p>
        <p>This link will expire in 24 hours.</p>
        <p>If you didn't create this account, please ignore this email.</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Error sending verification email:', error);
    return false;
  }
}

/**
 * Send password reset email
 */
async function sendPasswordResetEmail(email, resetToken) {
  try {
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
    
    const mailOptions = {
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: email,
      subject: 'Reset Your Password - SmartHealth',
      html: `
        <h2>Password Reset Request</h2>
        <p>You requested to reset your password. Click the link below to proceed:</p>
        <a href="${resetUrl}" style="background-color: #FF6B6B; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
          Reset Password
        </a>
        <p>Or copy this link: ${resetUrl}</p>
        <p>This link will expire in 1 hour.</p>
        <p>If you didn't request this, please ignore this email.</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Error sending password reset email:', error);
    return false;
  }
}

/**
 * Send appointment confirmation email
 */
async function sendAppointmentConfirmation(email, appointmentDetails) {
  try {
    const mailOptions = {
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: email,
      subject: `Appointment Confirmed - ${appointmentDetails.doctorName}`,
      html: `
        <h2>Appointment Confirmation</h2>
        <p>Your appointment has been confirmed with:</p>
        <p><strong>Doctor:</strong> ${appointmentDetails.doctorName}</p>
        <p><strong>Specialization:</strong> ${appointmentDetails.specialization}</p>
        <p><strong>Date & Time:</strong> ${new Date(appointmentDetails.scheduledAt).toLocaleString()}</p>
        <p><strong>Duration:</strong> ${appointmentDetails.duration} minutes</p>
        <p><strong>Type:</strong> ${appointmentDetails.type}</p>
        ${appointmentDetails.meetingLink ? `<p><strong>Meeting Link:</strong> <a href="${appointmentDetails.meetingLink}">${appointmentDetails.meetingLink}</a></p>` : ''}
        <p>Please arrive 10 minutes early for in-person appointments.</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Error sending appointment confirmation:', error);
    return false;
  }
}

module.exports = {
  sendVerificationEmail,
  sendPasswordResetEmail,
  sendAppointmentConfirmation,
};
