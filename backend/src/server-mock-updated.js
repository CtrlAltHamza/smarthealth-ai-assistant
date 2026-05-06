const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Mock storage
const verificationCodes = {};
let mockAppointments = [];

// Mock doctors data
const mockDoctors = [
  {
    id: 'doc-1',
    specialization: 'Cardiologist',
    experience: 8,
    consultationFee: 500,
    rating: 4.8,
    bio: 'Expert cardiologist with 8 years of experience',
    user: {
      id: 'user-1',
      name: 'Dr. Rajesh Kumar',
      avatar: '👨‍⚕️',
      phone: '+91-9876543210',
      email: 'rajesh@smarthealth.com',
    },
  },
  {
    id: 'doc-2',
    specialization: 'Dermatologist',
    experience: 6,
    consultationFee: 400,
    rating: 4.6,
    bio: 'Specialized in skin care and treatment',
    user: {
      id: 'user-2',
      name: 'Dr. Priya Sharma',
      avatar: '👩‍⚕️',
      phone: '+91-9876543211',
      email: 'priya@smarthealth.com',
    },
  },
  {
    id: 'doc-3',
    specialization: 'Orthopedic Surgeon',
    experience: 10,
    consultationFee: 600,
    rating: 4.9,
    bio: 'Experienced in joint and bone treatment',
    user: {
      id: 'user-3',
      name: 'Dr. Arun Singh',
      avatar: '👨‍⚕️',
      phone: '+91-9876543212',
      email: 'arun@smarthealth.com',
    },
  },
  {
    id: 'doc-4',
    specialization: 'Pediatrician',
    experience: 7,
    consultationFee: 350,
    rating: 4.7,
    bio: 'Specialized in child healthcare',
    user: {
      id: 'user-4',
      name: 'Dr. Neha Gupta',
      avatar: '👩‍⚕️',
      phone: '+91-9876543213',
      email: 'neha@smarthealth.com',
    },
  },
];

// DOCTOR ENDPOINTS
app.get('/api/doctors', (req, res) => {
  res.json({
    success: true,
    data: mockDoctors,
    message: 'Doctors retrieved successfully',
  });
});

app.get('/api/doctors/:id', (req, res) => {
  const doctor = mockDoctors.find((d) => d.id === req.params.id);
  if (!doctor) {
    return res.status(404).json({
      success: false,
      message: 'Doctor not found',
    });
  }
  res.json({
    success: true,
    data: doctor,
    message: 'Doctor retrieved successfully',
  });
});

// APPOINTMENT ENDPOINTS
app.post('/api/appointments/book', (req, res) => {
  const { doctorId, scheduledAt, duration, type, reason } = req.body;

  if (!doctorId || !scheduledAt || !reason) {
    return res.status(400).json({
      success: false,
      message: 'Missing required fields',
    });
  }

  const appointment = {
    id: 'apt-' + Date.now(),
    patientId: 'patient-1',
    doctorId,
    scheduledAt,
    duration: duration || 30,
    type: type || 'video',
    reason,
    status: 'pending',
    createdAt: new Date(),
  };

  mockAppointments.push(appointment);

  res.status(201).json({
    success: true,
    data: appointment,
    message: 'Appointment booked successfully!',
  });
});

app.get('/api/appointments', (req, res) => {
  res.json({
    success: true,
    data: mockAppointments,
    message: 'Appointments retrieved successfully',
  });
});

// EMAIL VERIFICATION ENDPOINTS
app.post('/api/email/send-verification', (req, res) => {
  const { email } = req.body;

  if (!email || !email.includes('@')) {
    return res.status(400).json({
      success: false,
      message: 'Please provide a valid email address',
    });
  }

  const code = Math.floor(100000 + Math.random() * 900000).toString();
  verificationCodes[email] = {
    code,
    attempts: 0,
    expiresAt: Date.now() + 10 * 60 * 1000,
  };

  console.log(`📧 Verification code for ${email}: ${code}`);

  res.status(200).json({
    success: true,
    message: 'Verification email sent successfully',
    data: {
      email,
      codeLength: 6,
      expiresIn: '10 minutes',
    },
  });
});

app.post('/api/email/verify-token', (req, res) => {
  const { email, token } = req.body;

  if (!verificationCodes[email]) {
    return res.status(400).json({
      success: false,
      message: 'No verification code found. Please request a new one.',
    });
  }

  const { code, attempts, expiresAt } = verificationCodes[email];

  if (Date.now() > expiresAt) {
    delete verificationCodes[email];
    return res.status(400).json({
      success: false,
      message: 'Verification code expired. Please request a new one.',
    });
  }

  if (attempts >= 3) {
    delete verificationCodes[email];
    return res.status(400).json({
      success: false,
      message: 'Too many failed attempts. Please request a new code.',
    });
  }

  if (code !== token) {
    verificationCodes[email].attempts++;
    const remaining = 3 - verificationCodes[email].attempts;
    return res.status(400).json({
      success: false,
      message: `Invalid code. ${remaining} attempts remaining.`,
    });
  }

  delete verificationCodes[email];
  console.log(`✅ Email verified: ${email}`);

  res.status(200).json({
    success: true,
    message: 'Email verified successfully',
    data: { email, verified: true },
  });
});

// HEALTH CHECK
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Mock server running' });
});

app.listen(PORT, () => {
  console.log(`\n✅ Mock API server running on http://localhost:${PORT}`);
  console.log(`📊 Available endpoints:`);
  console.log(`   GET  /api/doctors`);
  console.log(`   POST /api/email/send-verification`);
  console.log(`   POST /api/email/verify-token`);
  console.log(`   POST /api/appointments/book\n`);
});
