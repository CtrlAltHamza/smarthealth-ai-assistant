# SmartHealth Database Design - ERD

## Database Schema Overview

### Entity Relationship Diagram (Text-based)

```
                    ┌─────────────────┐
                    │      USER       │
                    ├─────────────────┤
                    │ id (PK)         │
                    │ name            │
                    │ email (UNIQUE)  │
                    │ password        │
                    │ role            │
                    │ phone           │
                    │ avatar          │
                    │ isActive        │
                    │ isVerified      │
                    │ lastLogin       │
                    │ refreshToken    │
                    │ createdAt       │
                    │ updatedAt       │
                    └────────┬────────┘
                             │
                ┌────────────┼────────────┐
                │            │            │
                ▼            ▼            ▼
        ┌──────────────┐ ┌──────────┐ ┌────────────┐
        │   PATIENT    │ │  DOCTOR  │ │ ADMIN_USER │
        ├──────────────┤ ├──────────┤ └────────────┘
        │ id (PK)      │ │ id (PK)  │
        │ userId (FK)◄─┼─┼─userId  │
        │ DOB          │ │(FK)◄─────┤
        │ gender       │ │SpecialZ  │
        │ bloodType    │ │ Qualif   │
        │ height       │ │ Experien │
        │ weight       │ │ License  │
        │ allergies    │ │ ConsultFee
        │ chronicCond  │ │ Availab  │
        │ emergency    │ │ rating   │
        │ address      │ │ reviews  │
        │              │ │ bio      │
        └──────┬───────┘ └────┬─────┘
               │               │
               └───────┬───────┘
                       │
                       ▼
            ┌──────────────────────┐
            │   APPOINTMENT        │
            ├──────────────────────┤
            │ id (PK)              │
            │ patientId (FK)       │
            │ doctorId (FK)        │
            │ scheduledAt          │
            │ duration             │
            │ type (in-person...)  │
            │ status               │
            │ reason               │
            │ notes                │
            │ meetingLink          │
            │ cancelReason         │
            │ createdAt            │
            │ updatedAt            │
            └──────────────────────┘

        ┌────────────────────────┐
        │       SYMPTOM          │
        ├────────────────────────┤
        │ id (PK)                │
        │ patientId (FK)         │
        │ rawInput (TEXT)        │
        │ extractedSymptoms (ARRAY)
        │ severity               │
        │ duration               │
        │ sessionId              │
        │ createdAt              │
        │ updatedAt              │
        └─────────┬──────────────┘
                  │
                  ▼
        ┌────────────────────────────┐
        │  DISEASE_PREDICTION        │
        ├────────────────────────────┤
        │ id (PK)                    │
        │ patientId (FK)             │
        │ symptomId (FK)             │
        │ predictedDiseases (JSONB)  │
        │ recommendedSpecialists     │
        │ confidence                 │
        │ modelVersion               │
        │ actionTaken                │
        │ createdAt                  │
        │ updatedAt                  │
        └────────────────────────────┘

        ┌────────────────────────┐
        │   MEDICAL_RECORD       │
        ├────────────────────────┤
        │ id (PK)                │
        │ patientId (FK)         │
        │ appointmentId (FK)     │
        │ doctorId (FK)          │
        │ diagnosis (TEXT)       │
        │ prescription (JSONB)   │
        │ labResults (JSONB)     │
        │ attachments (ARRAY)    │
        │ notes (TEXT)           │
        │ followUpDate           │
        │ createdAt              │
        │ updatedAt              │
        └────────────────────────┘

        ┌────────────────────────┐
        │    NOTIFICATION        │
        ├────────────────────────┤
        │ id (PK)                │
        │ userId (FK)            │
        │ type                   │
        │ title                  │
        │ message                │
        │ isRead                 │
        │ data (JSONB)           │
        │ createdAt              │
        │ updatedAt              │
        └────────────────────────┘

        ┌────────────────────────┐
        │       REVIEW           │
        ├────────────────────────┤
        │ id (PK)                │
        │ patientId (FK)         │
        │ doctorId (FK)          │
        │ appointmentId (FK)     │
        │ rating (1-5)           │
        │ comment                │
        │ createdAt              │
        │ updatedAt              │
        └────────────────────────┘

        ┌────────────────────────┐
        │     AUDIT_LOG          │
        ├────────────────────────┤
        │ id (PK)                │
        │ userId (FK)            │
        │ action                 │
        │ entity                 │
        │ entityId               │
        │ oldValues (JSONB)      │
        │ newValues (JSONB)      │
        │ ipAddress              │
        │ userAgent              │
        │ createdAt              │
        └────────────────────────┘
```

## Table Details

### USER
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('patient', 'doctor', 'admin') DEFAULT 'patient',
  phone VARCHAR(20),
  avatar TEXT,
  isActive BOOLEAN DEFAULT true,
  isVerified BOOLEAN DEFAULT false,
  lastLogin TIMESTAMP,
  refreshToken TEXT,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deletedAt TIMESTAMP (soft delete)
);
```

### PATIENT
```sql
CREATE TABLE patients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  userId UUID UNIQUE NOT NULL REFERENCES users(id),
  dateOfBirth DATE,
  gender ENUM('male', 'female', 'other'),
  bloodType ENUM('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'),
  height FLOAT,
  weight FLOAT,
  allergies TEXT[] DEFAULT '{}',
  chronicConditions TEXT[] DEFAULT '{}',
  emergencyContact JSONB,
  address JSONB,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### DOCTOR
```sql
CREATE TABLE doctors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  userId UUID UNIQUE NOT NULL REFERENCES users(id),
  specialization VARCHAR(100) NOT NULL,
  qualifications TEXT[] DEFAULT '{}',
  experience INTEGER DEFAULT 0,
  licenseNumber VARCHAR(50) UNIQUE,
  consultationFee DECIMAL(10, 2) DEFAULT 0,
  availability JSONB DEFAULT '{}',
  rating FLOAT DEFAULT 0,
  totalReviews INTEGER DEFAULT 0,
  bio TEXT,
  isAvailable BOOLEAN DEFAULT true,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### APPOINTMENT
```sql
CREATE TABLE appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patientId UUID NOT NULL REFERENCES patients(id),
  doctorId UUID NOT NULL REFERENCES doctors(id),
  scheduledAt TIMESTAMP NOT NULL,
  duration INTEGER DEFAULT 30,
  type ENUM('in-person', 'video', 'phone') DEFAULT 'in-person',
  status ENUM('pending', 'confirmed', 'completed', 'cancelled', 'no-show'),
  reason TEXT,
  notes TEXT,
  meetingLink TEXT,
  cancelReason TEXT,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deletedAt TIMESTAMP
);
```

### SYMPTOM
```sql
CREATE TABLE symptoms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patientId UUID NOT NULL REFERENCES patients(id),
  rawInput TEXT NOT NULL,
  extractedSymptoms TEXT[] DEFAULT '{}',
  severity ENUM('mild', 'moderate', 'severe') DEFAULT 'mild',
  duration VARCHAR(100),
  sessionId UUID,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### DISEASE_PREDICTION
```sql
CREATE TABLE disease_predictions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patientId UUID NOT NULL REFERENCES patients(id),
  symptomId UUID REFERENCES symptoms(id),
  predictedDiseases JSONB DEFAULT '[]',
  recommendedSpecialists TEXT[] DEFAULT '{}',
  confidence FLOAT,
  modelVersion VARCHAR(20),
  actionTaken VARCHAR(50),
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### MEDICAL_RECORD
```sql
CREATE TABLE medical_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patientId UUID NOT NULL REFERENCES patients(id),
  appointmentId UUID REFERENCES appointments(id),
  doctorId UUID REFERENCES doctors(id),
  diagnosis TEXT,
  prescription JSONB,
  labResults JSONB,
  attachments TEXT[] DEFAULT '{}',
  notes TEXT,
  followUpDate DATE,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### NOTIFICATION
```sql
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  userId UUID NOT NULL REFERENCES users(id),
  type ENUM('appointment', 'reminder', 'result', 'system', 'message'),
  title VARCHAR(200) NOT NULL,
  message TEXT NOT NULL,
  isRead BOOLEAN DEFAULT false,
  data JSONB DEFAULT '{}',
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### REVIEW
```sql
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patientId UUID NOT NULL REFERENCES patients(id),
  doctorId UUID NOT NULL REFERENCES doctors(id),
  appointmentId UUID REFERENCES appointments(id),
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### AUDIT_LOG
```sql
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  userId UUID REFERENCES users(id),
  action VARCHAR(100) NOT NULL,
  entity VARCHAR(50),
  entityId UUID,
  oldValues JSONB,
  newValues JSONB,
  ipAddress VARCHAR(45),
  userAgent TEXT,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Key Relationships

1. **USER → PATIENT** (1:1)
   - One user can have one patient profile
   
2. **USER → DOCTOR** (1:1)
   - One user can have one doctor profile
   
3. **PATIENT → APPOINTMENT** (1:N)
   - One patient can have multiple appointments
   
4. **DOCTOR → APPOINTMENT** (1:N)
   - One doctor can have multiple appointments
   
5. **PATIENT → SYMPTOM** (1:N)
   - One patient can log multiple symptom entries
   
6. **SYMPTOM → DISEASE_PREDICTION** (1:1)
   - One symptom entry produces one prediction
   
7. **PATIENT → MEDICAL_RECORD** (1:N)
   - One patient can have multiple medical records
   
8. **DOCTOR → MEDICAL_RECORD** (1:N)
   - One doctor can create multiple records
   
9. **APPOINTMENT → MEDICAL_RECORD** (1:1)
   - One appointment can generate one record
   
10. **USER → NOTIFICATION** (1:N)
    - One user can have multiple notifications
    
11. **DOCTOR → REVIEW** (1:N)
    - One doctor can have multiple reviews

## Indexes

```sql
CREATE INDEX idx_user_email ON users(email);
CREATE INDEX idx_patient_userId ON patients(userId);
CREATE INDEX idx_doctor_userId ON doctors(userId);
CREATE INDEX idx_appointment_patientId ON appointments(patientId);
CREATE INDEX idx_appointment_doctorId ON appointments(doctorId);
CREATE INDEX idx_symptom_patientId ON symptoms(patientId);
CREATE INDEX idx_prediction_patientId ON disease_predictions(patientId);
CREATE INDEX idx_medical_record_patientId ON medical_records(patientId);
CREATE INDEX idx_notification_userId ON notifications(userId);
CREATE INDEX idx_review_doctorId ON reviews(doctorId);
```

## Data Types Used

- **UUID**: Primary keys and relationships
- **ENUM**: For status, role, gender, blood type, etc.
- **JSONB**: For flexible structured data (address, availability, etc.)
- **TEXT[]**: For arrays (allergies, qualifications, etc.)
- **TIMESTAMP**: For audit trail
- **DECIMAL(10,2)**: For consultation fees
- **FLOAT**: For ratings and medical measurements

## Notes
- Soft deletes implemented with deletedAt column
- All tables have timestamps for audit
- Foreign keys ensure referential integrity
- Unique constraints prevent duplicates
- Check constraints validate data ranges
