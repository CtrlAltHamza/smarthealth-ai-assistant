# SmartHealth AI Assistant - System Architecture

## Overview
SmartHealth is a healthcare platform that uses AI to analyze patient symptoms and recommend specialists. The system consists of three main components:
- Frontend (React)
- Backend (Node.js + Express)
- AI Service (Python + FastAPI)

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                     CLIENT LAYER                             │
│  ┌──────────────────────────────────────────────────────┐   │
│  │         React Frontend (Port 3000)                   │   │
│  │  - Patient Dashboard                                │   │
│  │  - Doctor Portal                                    │   │
│  │  - Symptom Checker                                 │   │
│  │  - Admin Panel                                     │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                           │
                    HTTP/Socket.io
                           │
┌─────────────────────────────────────────────────────────────┐
│                 BACKEND API LAYER                            │
│  ┌──────────────────────────────────────────────────────┐   │
│  │      Node.js + Express Server (Port 5000)           │   │
│  │  - Authentication (JWT)                             │   │
│  │  - User Management                                  │   │
│  │  - Appointment Scheduling                          │   │
│  │  - Medical Records                                 │   │
│  │  - Notifications                                   │   │
│  └──────────────────────────────────────────────────────┘   │
│           │                          │                       │
│    ┌──────▼──────┐           ┌──────▼──────┐               │
│    │  PostgreSQL │           │   AI API    │               │
│    │  Database   │           │  (FastAPI)  │               │
│    │ (Port 5432) │           │ (Port 8000) │               │
│    └─────────────┘           └─────────────┘               │
└─────────────────────────────────────────────────────────────┘
```

## Component Details

### Frontend (React + TypeScript)
- **Location**: `/frontend`
- **Port**: 3000
- **Framework**: React 18, Redux Toolkit, React Router
- **Key Pages**:
  - LoginPage - User authentication
  - DashboardPage - Main patient/doctor dashboard
  - SymptomCheckerPage - AI symptom analysis
  - AppointmentsPage - Appointment management
  - AdminPage - Admin controls

### Backend (Node.js + Express)
- **Location**: `/backend`
- **Port**: 5000
- **Database**: PostgreSQL (port 5432)
- **Key Features**:
  - REST API with Swagger documentation
  - JWT-based authentication
  - Role-Based Access Control (Patient, Doctor, Admin)
  - Real-time notifications using Socket.io
  - Database: Sequelize ORM + PostgreSQL

### AI Service (Python + FastAPI)
- **Location**: `/ai-service`
- **Port**: 8000
- **Tech Stack**: FastAPI, spaCy, scikit-learn
- **Capabilities**:
  - NLP-based symptom extraction
  - Disease prediction using ML models
  - Specialist recommendations

### Database (PostgreSQL)
- **Port**: 5432
- **Database Name**: smarthealth
- **ORM**: Sequelize

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh` - Refresh JWT token

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile

### Patients
- `GET /api/patients/:id` - Get patient details
- `PUT /api/patients/:id` - Update patient profile

### Doctors
- `GET /api/doctors` - List all doctors
- `GET /api/doctors/:id` - Get doctor details

### Appointments
- `POST /api/appointments` - Create appointment
- `GET /api/appointments` - List appointments
- `PUT /api/appointments/:id` - Update appointment

### Symptoms & Predictions
- `POST /api/symptoms/analyze` - Analyze symptoms (calls AI service)
- `GET /api/predictions/:patientId` - Get predictions

### AI Service Endpoints
- `POST /ai/symptom/extract` - Extract symptoms from text
- `POST /ai/predict/diseases` - Predict diseases
- `GET /ai/health` - Health check

## Data Flow

### Symptom Analysis Flow
1. User enters symptoms in frontend
2. Frontend sends symptoms to backend: `POST /api/symptoms/analyze`
3. Backend forwards to AI service: `POST /ai/symptom/extract`
4. AI service processes using NLP pipeline
5. AI service returns extracted symptoms
6. Backend saves to database
7. Backend calls disease prediction: `POST /ai/predict/diseases`
8. AI service returns disease predictions with specialist recommendations
9. Frontend displays results to user

### Authentication Flow
1. User logs in with email/password
2. Backend validates credentials against database
3. Backend generates JWT access token + refresh token
4. Frontend stores tokens in localStorage
5. All subsequent requests include JWT in Authorization header
6. Backend validates token before processing request

## Deployment Architecture

### Docker Containers
```
docker-compose up
├── frontend (Node.js dev server)
├── backend (Express.js API)
├── ai-service (FastAPI)
└── postgres (PostgreSQL database)
```

## Security Considerations
- JWT tokens for authentication
- Password hashing using bcrypt
- Environment variables for sensitive data
- CORS enabled only for frontend
- Rate limiting on auth endpoints
- Helmet.js for security headers
- SQL injection prevention via ORM

## Scalability Notes
- Frontend: Can be served from CDN or S3
- Backend: Can be horizontally scaled with load balancer
- Database: Connection pooling configured
- AI Service: Can run multiple instances for parallel processing

## Development Workflow
1. Frontend runs on `http://localhost:3000`
2. Backend API runs on `http://localhost:5000`
3. AI Service runs on `http://localhost:8000`
4. PostgreSQL runs on `localhost:5432`
5. All services can be started with `docker-compose up`

## Environment Variables
See `.env.example` for configuration details.
