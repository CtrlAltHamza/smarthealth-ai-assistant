# SmartHealth AI Assistant 🏥

> Intelligent Healthcare Symptom Analysis & Appointment Management System

**Course:** Software Project Management | **Team:** 3 Members | **Jira Project Key:** `SHAI`

---

## Architecture

```
smarthealth/
├── frontend/          # React 18 + TypeScript + Redux Toolkit
├── backend/           # Node.js + Express + Sequelize + PostgreSQL
├── ai-service/        # Python + FastAPI + scikit-learn + spaCy
├── docker-compose.yml # Full stack orchestration
└── .github/workflows/ # CI/CD with GitHub Actions
```

---

## Quick Start (Docker)

```bash
# 1. Clone and setup environment
git clone <repo-url> && cd smarthealth
cp .env.example .env        # edit as needed

# 2. Start everything
docker compose up --build

# 3. Access services
# Frontend:   http://localhost:3000
# Backend:    http://localhost:5000
# API Docs:   http://localhost:5000/api/docs
# AI Service: http://localhost:8000/docs
```

---

## Manual Setup (Development)

### Backend
```bash
cd backend
npm install
cp ../.env.example .env       # configure DB credentials
npx sequelize-cli db:create
npx sequelize-cli db:migrate
npx sequelize-cli db:seed:all
npm run dev                    # runs on :5000
```

### AI Service
```bash
cd ai-service
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
python -m spacy download en_core_web_sm
uvicorn main:app --reload      # runs on :8000
```

### Frontend
```bash
cd frontend
npm install
npm start                      # runs on :3000
```

---

## Jira Sprint Plan

| Sprint | Focus                        | Status   |
|--------|------------------------------|----------|
| 1      | Setup, Architecture, Docker  | ✅ Done   |
| 2      | Authentication + RBAC        | 🔄 Active |
| 3      | Database & CRUD APIs         | ⏳ Next   |
| 4      | AI Symptom Analysis (NLP)    | ⏳        |
| 5      | Disease Prediction (ML)      | ⏳        |
| 6      | Appointments & Notifications | ⏳        |
| 7      | Dashboard & Testing          | ⏳        |
| 8      | Deployment & Documentation   | ⏳        |

---

## Tech Stack

| Layer       | Technology                                      |
|-------------|--------------------------------------------------|
| Frontend    | React 18, TypeScript, Redux Toolkit, React Router |
| Backend     | Node.js, Express, Sequelize ORM, PostgreSQL       |
| AI Service  | Python, FastAPI, scikit-learn, spaCy, NLTK        |
| DevOps      | Docker, Docker Compose, GitHub Actions            |
| Testing     | Jest, Supertest, Pytest, Cypress                  |
| Docs        | Swagger/OpenAPI at `/api/docs`                    |

---

## API Endpoints

| Method | Path                         | Auth     | Description              |
|--------|------------------------------|----------|--------------------------|
| POST   | `/api/auth/register`         | None     | Register new user        |
| POST   | `/api/auth/login`            | None     | Login + get JWT          |
| POST   | `/api/auth/refresh`          | None     | Refresh access token     |
| GET    | `/api/auth/me`               | Bearer   | Get current user         |
| GET    | `/api/appointments`          | Bearer   | List appointments        |
| POST   | `/api/appointments`          | Patient  | Book appointment         |
| PATCH  | `/api/appointments/:id/status` | Bearer | Update appointment       |
| POST   | `/symptoms/analyze`          | None     | NLP symptom extraction   |
| POST   | `/predict/disease`           | None     | Disease prediction       |

Full Swagger docs: `http://localhost:5000/api/docs`

---

## Team Roles (Jira)

- **Member 1** — Backend lead (Epics 2, 3, 4)
- **Member 2** — AI/ML lead (Epics 6, 7)
- **Member 3** — Frontend lead (Epics 3, 9)

---

## License
Academic use only — Software Project Management Final Year Project.
