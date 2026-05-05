# Sprint 2 Implementation Guide

## Overview
Sprint 2 focuses on user management, enhanced authentication, appointment system, and doctor profile management.

## 7 Stories Implemented

### SHAI-12: Patient Registration with Email Verification
**Endpoints:**
- `POST /api/email/send-verification` - Send verification email
- `POST /api/email/verify-token` - Verify email with token

**Files Created:**
- `backend/src/controllers/email.controller.js` - Email controller
- `backend/src/routes/email.routes.js` - Email routes
- `backend/src/utils/email.js` - Email utility functions
- `frontend/src/pages/VerifyEmailPage.tsx` - Verification UI

**Database Changes:**
- Added `verificationToken` and `verificationTokenExpiry` to User model

---

### SHAI-13: Password Reset & Account Recovery
**Endpoints:**
- `POST /api/email/forgot-password` - Request password reset
- `POST /api/email/reset-password` - Reset password with token

**Files Created:**
- Email endpoints in `backend/src/controllers/email.controller.js`
- `frontend/src/pages/ResetPasswordPage.tsx` - Password reset UI

**Database Changes:**
- Added `resetPasswordToken` and `resetPasswordTokenExpiry` to User model

---

### SHAI-14: Doctor Profile Setup & Management
**Status:** Foundation in place (Doctor model exists with all fields)
**Key Fields:**
- Specialization, Qualifications, Experience
- License Number, Consultation Fee
- Availability (JSONB), Rating, Bio

**Endpoints Needed:**
- `PUT /api/doctors/:id/profile` - Update doctor profile
- `GET /api/doctors/:id` - Get doctor details

---

### SHAI-15: Appointment Booking System (Patient)
**Endpoints:**
- `POST /api/appointments/book` - Book appointment
- `GET /api/appointments` - Get user's appointments (paginated)
- `GET /api/appointments/:id` - Get appointment details

**Files Created:**
- Enhanced `backend/src/controllers/appointment.controller.js`
- `frontend/src/pages/BookAppointmentPage.tsx` - Booking UI

**Features:**
- Conflict detection (prevents double-booking)
- Email confirmation to patient
- Doctor notification via Socket.io
- Support for in-person, video, phone appointments

---

### SHAI-16: Doctor Dashboard - Patient Appointments
**Endpoints:**
- `PATCH /api/appointments/:id/confirm` - Confirm appointment
- `PATCH /api/appointments/:id/complete` - Complete appointment (create medical record)
- `PATCH /api/appointments/:id/cancel` - Cancel appointment

**Features:**
- Doctor can view upcoming appointments
- Confirm appointments with meeting links
- Complete appointments and create medical records
- Cancel appointments with reason

---

### SHAI-17: Enhanced Symptom Checker Integration
**Status:** Ready for AI service integration
**Current State:**
- Symptom extraction endpoint exists
- NLP/ML pipeline connected in backend
- Ready for full implementation

**Next Steps:**
- Connect to AI service health endpoint
- Implement disease prediction workflow
- Add specialist recommendations

---

### SHAI-18: Patient Medical History View
**Endpoints Needed:**
- `GET /api/patients/:id/medical-records` - Get all medical records
- `GET /api/medical-records/:id` - Get specific record
- `GET /api/patients/:id/appointments` - Appointment history

**Foundation:**
- MedicalRecord model with complete schema
- Doctor can create records after appointment completion

---

## Installation & Setup

### 1. Backend Dependencies
```bash
npm install nodemailer
```

### 2. Environment Variables
Update `.env` with email configuration:
```
SMTP_SERVICE=gmail
SMTP_USER=your@email.com
SMTP_PASSWORD=your_app_password
SMTP_FROM=SmartHealth <noreply@smarthealth.com>
FRONTEND_URL=http://localhost:3000
```

### 3. Database Sync
Database will auto-sync new User model fields on server start.

### 4. Frontend Routes
Add to your App.tsx router:
```typescript
<Route path="/verify-email" element={<VerifyEmailPage />} />
<Route path="/reset-password" element={<ResetPasswordPage />} />
<Route path="/book-appointment" element={<ProtectedRoute><BookAppointmentPage /></ProtectedRoute>} />
```

---

## API Testing

### Verify Email
```bash
# Send verification
curl -X POST http://localhost:5000/api/email/send-verification \
  -H "Content-Type: application/json" \
  -d '{"email":"patient@demo.com"}'

# Verify token (token from email)
curl -X POST http://localhost:5000/api/email/verify-token \
  -H "Content-Type: application/json" \
  -d '{"token":"<token_from_email>"}'
```

### Password Reset
```bash
# Request reset
curl -X POST http://localhost:5000/api/email/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email":"patient@demo.com"}'

# Reset password
curl -X POST http://localhost:5000/api/email/reset-password \
  -H "Content-Type: application/json" \
  -d '{"token":"<token_from_email>","newPassword":"NewPass123!"}'
```

### Book Appointment
```bash
curl -X POST http://localhost:5000/api/appointments/book \
  -H "Authorization: Bearer <access_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "doctorId":"<doctor_uuid>",
    "scheduledAt":"2026-05-10T14:00:00Z",
    "duration":30,
    "type":"in-person",
    "reason":"Regular checkup"
  }'
```

### Complete Appointment (Doctor)
```bash
curl -X PATCH http://localhost:5000/api/appointments/<appointment_id>/complete \
  -H "Authorization: Bearer <access_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "diagnosis":"Hypertension",
    "prescription":{"medicine":"Lisinopril","dosage":"10mg","frequency":"daily"},
    "notes":"Follow-up in 2 weeks",
    "labResults":{"bloodPressure":"140/90"}
  }'
```

---

## Email Configuration

### Gmail Setup
1. Enable 2-Factor Authentication
2. Generate App Password: https://myaccount.google.com/apppasswords
3. Use app password in `.env` as `SMTP_PASSWORD`

### Other Email Services
- SendGrid: Update SMTP_SERVICE to "sendgrid"
- Mailgun: Update SMTP_SERVICE to "mailgun"
- Custom SMTP: Update host, port, auth settings

---

## Next Steps for Sprint 2+

1. **Doctor Profile Updates** - Create PUT endpoint for doctor profile
2. **Medical Records UI** - Create frontend for viewing records
3. **Appointment Rescheduling** - Add reschedule endpoint
4. **Video Call Integration** - Add Jitsi/Zoom meeting links
5. **Payment Integration** - Add appointment payment processing
6. **Analytics Dashboard** - Doctor statistics and patient charts
7. **Notification Preferences** - Email/SMS/In-app notification settings

---

## Testing Checklist

- [ ] Email verification flow works end-to-end
- [ ] Password reset sends email correctly
- [ ] Appointment booking prevents conflicts
- [ ] Doctor receives notifications
- [ ] Medical records created after appointment completion
- [ ] All new fields sync in database
- [ ] Frontend pages load without errors
- [ ] API responses match expected format

