# JIRA Sprint 2 Setup Instructions

## Prerequisites
- Jira Project: **SHAI** (SmartHealth AI Assistant)
- Access: https://smarthealthaiassistant.atlassian.net/jira/software/projects/SHAI/boards/2

---

## Step 1: Create Sprint 2

1. Go to **Backlog** tab
2. Click **Create Sprint** button (below Sprint 1)
3. Name it: `Sprint 2 - User Management & Appointments`
4. Click **Create**

---

## Step 2: Create 7 Stories

### Story SHAI-12: Patient Registration with Email Verification
**Type:** Story  
**Epic:** Authentication System  
**Story Points:** 5  
**Description:**
```
As a patient, I want to register with email verification 
so that only legitimate users can access the system.

Acceptance Criteria:
- User receives verification email after registration
- Email contains unique verification link
- Link is valid for 24 hours
- After verification, user can log in
- Unverified users cannot access the application

Technical Details:
- POST /api/email/send-verification
- POST /api/email/verify-token
- Email templates with branding
- Token expiry validation
```

**Subtasks:**
- [ ] Create email controller with verification logic
- [ ] Add email routes
- [ ] Update User model with token fields
- [ ] Create React verification component
- [ ] Test email sending
- [ ] Test token validation

---

### Story SHAI-13: Password Reset & Account Recovery
**Type:** Story  
**Epic:** Authentication System  
**Story Points:** 5  
**Description:**
```
As a user, I want to reset my password via email 
so that I can regain access if I forget my credentials.

Acceptance Criteria:
- User can request password reset via email
- Email contains secure reset link
- Reset link valid for 1 hour only
- User can set new password via link
- Password must be hashed before storage
- Old password required for reset attempt

Technical Details:
- POST /api/email/forgot-password
- POST /api/email/reset-password
- Secure token generation (crypto)
- Password validation rules
```

**Subtasks:**
- [ ] Create forgot-password endpoint
- [ ] Create reset-password endpoint
- [ ] Add token validation logic
- [ ] Create password reset UI
- [ ] Add password strength validation
- [ ] Test recovery flow

---

### Story SHAI-14: Doctor Profile Setup & Management
**Type:** Story  
**Epic:** User Management  
**Story Points:** 5  
**Description:**
```
As a doctor, I want to set up and manage my profile 
so that patients can view my credentials and qualifications.

Acceptance Criteria:
- Doctor can update specialization
- Doctor can add qualifications (array)
- Doctor can set consultation fee
- Doctor can manage availability calendar
- Doctor can update bio and avatar
- Changes are reflected immediately

Technical Details:
- PUT /api/doctors/:id/profile
- Validate fee (decimal, 2 places)
- Availability as JSONB schedule
- Doctor model fully utilized
```

**Subtasks:**
- [ ] Create PUT endpoint for doctor profile
- [ ] Add validation for all fields
- [ ] Create doctor profile update UI
- [ ] Add profile image upload
- [ ] Test profile updates
- [ ] Add audit logging

---

### Story SHAI-15: Appointment Booking System (Patient)
**Type:** Story  
**Epic:** Appointment Management  
**Story Points:** 8  
**Description:**
```
As a patient, I want to book appointments with doctors 
so that I can schedule medical consultations.

Acceptance Criteria:
- Patient can see available doctors
- Patient can select doctor and time
- System prevents double-booking
- Confirmation email sent to patient
- Doctor notified via notification
- Appointment shows in patient's calendar
- Support in-person, video, and phone appointments

Technical Details:
- POST /api/appointments/book
- Conflict detection logic
- Email confirmation template
- Socket.io notification to doctor
```

**Subtasks:**
- [ ] Implement conflict detection
- [ ] Create book appointment endpoint
- [ ] Send confirmation emails
- [ ] Create doctor notification
- [ ] Create appointment booking UI
- [ ] Add calendar view
- [ ] Test booking workflow

---

### Story SHAI-16: Doctor Dashboard - Patient Appointments
**Type:** Story  
**Epic:** Appointment Management  
**Story Points:** 8  
**Description:**
```
As a doctor, I want to manage patient appointments 
so that I can confirm, complete, or cancel them.

Acceptance Criteria:
- Doctor sees list of appointment requests
- Doctor can confirm appointment with meeting link
- Doctor can mark appointment as completed
- Doctor can add diagnosis and prescription
- Medical record created automatically
- Patient notified of all status changes
- Doctor can cancel with reason

Technical Details:
- PATCH /api/appointments/:id/confirm
- PATCH /api/appointments/:id/complete
- PATCH /api/appointments/:id/cancel
- Create MedicalRecord on completion
- Socket.io notifications to patient
```

**Subtasks:**
- [ ] Create confirm appointment endpoint
- [ ] Create complete appointment endpoint
- [ ] Create cancel appointment endpoint
- [ ] Create medical record on completion
- [ ] Create doctor dashboard UI
- [ ] Add appointment status filters
- [ ] Test workflow end-to-end

---

### Story SHAI-17: Enhanced Symptom Checker Integration
**Type:** Story  
**Epic:** AI Integration  
**Story Points:** 8  
**Description:**
```
As a patient, I want to check my symptoms against AI predictions 
so that I can get preliminary guidance before seeing a doctor.

Acceptance Criteria:
- Patient can input symptoms in natural language
- System extracts symptoms using NLP
- AI model predicts possible diseases
- System recommends specialist types
- Results saved to patient history
- Patient can book appointment based on results

Technical Details:
- POST /api/symptoms/analyze (with NLP)
- POST /api/predict/diseases (with ML)
- Integration with AI service (FastAPI)
- spaCy for NLP processing
- scikit-learn for predictions
```

**Subtasks:**
- [ ] Integrate with AI service health endpoint
- [ ] Test NLP extraction
- [ ] Test ML predictions
- [ ] Create results display UI
- [ ] Add specialist recommendations
- [ ] Save results to database
- [ ] Test full symptom analysis flow

---

### Story SHAI-18: Patient Medical History View
**Type:** Story  
**Epic:** Patient Records  
**Story Points:** 5  
**Description:**
```
As a patient, I want to view my complete medical history 
so that I can track my health journey and share with providers.

Acceptance Criteria:
- Patient sees all past appointments
- Patient sees all medical records
- Medical records show diagnosis and prescription
- Patient can download medical records as PDF
- Records are chronologically ordered
- Patient can view symptoms history

Technical Details:
- GET /api/patients/:id/medical-records
- GET /api/medical-records/:id
- GET /api/patients/:id/appointments?history=true
- PDF export functionality
```

**Subtasks:**
- [ ] Create medical records endpoint
- [ ] Create appointments history endpoint
- [ ] Create medical history UI
- [ ] Add PDF download feature
- [ ] Add date filtering
- [ ] Add search functionality
- [ ] Test data retrieval

---

## Step 3: Add Stories to Sprint 2

1. Select all 7 stories from Backlog
2. Drag them into **Sprint 2** section
3. Or: Right-click each story → **Move to Sprint 2**

---

## Step 4: Configure Sprint Settings

1. Go to **Sprint 2** → **Sprint Settings**
2. Set **Sprint Goal:**
   ```
   Implement user management, email authentication, appointment booking, 
   and doctor profile management with full email notifications
   ```
3. Set **Duration:** 2 weeks (typical sprint)
4. Click **Save**

---

## Step 5: Update Story Links

Link stories to **Epics:**

**Authentication System Epic (SHAI-2):**
- SHAI-12: Patient Registration ✅
- SHAI-13: Password Reset ✅

**User Management Epic (SHAI-3):**
- SHAI-14: Doctor Profile ✅

**Appointment Management Epic (SHAI-4):**
- SHAI-15: Patient Booking ✅
- SHAI-16: Doctor Dashboard ✅

**AI Integration Epic (SHAI-5):**
- SHAI-17: Symptom Checker ✅

**Patient Records Epic (SHAI-1):**
- SHAI-18: Medical History ✅

---

## Step 6: Start Sprint 2

1. Go to **Backlog** tab
2. Click **Start Sprint** button for Sprint 2
3. Confirm: Click **Start Sprint** again
4. Board automatically switches to Sprint 2 view

---

## Step 7: Update Existing Sprint 1 (Mark Complete)

1. Go to **Backlog** tab
2. Scroll to **Sprint 1** section
3. Click **⋯** (three dots) → **Complete Sprint**
4. Review completed issues
5. Click **Complete Sprint**
6. Burndown chart will show 100% completion ✅

---

## Sprint 2 View

After starting, your board will show:

```
┌─────────────────────────────────────────────────┐
│ To Do (Ready) │ In Progress │ In Review │ Done │
├───────────────┼─────────────┼───────────┼──────┤
│ SHAI-12 (5)   │             │           │      │
│ SHAI-13 (5)   │             │           │      │
│ SHAI-14 (5)   │             │           │      │
│ SHAI-15 (8)   │             │           │      │
│ SHAI-16 (8)   │             │           │      │
│ SHAI-17 (8)   │             │           │      │
│ SHAI-18 (5)   │             │           │      │
└───────────────┴─────────────┴───────────┴──────┘
Total Points: 44
```

---

## Development Workflow

1. **Pick a Story:** Select SHAI-12 to start
2. **Create Branch:** `git checkout -b feat/SHAI-12`
3. **Work:** Implement email verification
4. **Commit:** `git commit -m "feat(SHAI-12): email verification"`
5. **Move to In Progress:** Drag story on board
6. **Create PR:** Push branch, create pull request
7. **Move to Review:** Drag story to "In Review"
8. **Merge PR:** After approval
9. **Move to Done:** Drag story to "Done"

---

## Testing Checklist per Story

### SHAI-12 ✓
- [ ] Can register new user
- [ ] Verification email received
- [ ] Link works and verifies user
- [ ] Unverified user blocked from login

### SHAI-13 ✓
- [ ] Can request password reset
- [ ] Email contains reset link
- [ ] Can reset password via link
- [ ] New password works on login

### SHAI-14 ✓
- [ ] Doctor can update profile
- [ ] All fields persist correctly
- [ ] Profile visible to patients

### SHAI-15 ✓
- [ ] Can book appointment
- [ ] Cannot double-book same doctor
- [ ] Confirmation email sent
- [ ] Doctor notified

### SHAI-16 ✓
- [ ] Doctor sees appointment requests
- [ ] Can confirm appointment
- [ ] Can complete with diagnosis
- [ ] Medical record created

### SHAI-17 ✓
- [ ] Symptom input works
- [ ] NLP extracts symptoms
- [ ] ML predicts diseases
- [ ] Results saved

### SHAI-18 ✓
- [ ] Can view appointment history
- [ ] Can view medical records
- [ ] Records sorted by date
- [ ] PDF export works

---

## GitHub & Jira Integration

Stories auto-link to commits:

```bash
# Commit message format
git commit -m "feat(SHAI-12): add email verification

- Implement verification endpoint
- Add email templates
- Create React component

Closes SHAI-12"
```

Jira will auto-link commit and show in story timeline.

---

## Dashboard & Reporting

**Sprint 2 Metrics:**
- **Total Points:** 44
- **Target Velocity:** 40-50 points/sprint
- **Backlog:** Any remaining items go to Sprint 3
- **Burndown:** Should decrease linearly over sprint

**Useful Reports:**
1. **Sprint Report** - Progress overview
2. **Burndown Chart** - Velocity tracking
3. **Velocity Report** - Compare Sprint 1 vs 2
4. **Release Report** - Roadmap view

---

## Common Commands

```bash
# View all Jira issues for a sprint
jira issue list --jql="project = SHAI AND sprint = 'Sprint 2'"

# View stories in To Do
jira issue list --jql="project = SHAI AND sprint = 'Sprint 2' AND status = 'To Do'"

# Create issue from CLI
jira issue create --project SHAI --type Story --summary "Story Title"

# Transition issue
jira issue move SHAI-12 --to "In Progress"
```

