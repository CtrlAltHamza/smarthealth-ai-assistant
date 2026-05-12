# SmartHealth AI Assistant

[![React](https://img.shields.io/badge/React-18-blue.svg)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-green.svg)](https://nodejs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-Python-teal.svg)](https://fastapi.tiangolo.com/)
[![SQLite](https://img.shields.io/badge/Database-SQLite-blue.svg)](https://sqlite.org/)
[![Vercel](https://img.shields.io/badge/Deployed-Vercel-black.svg)](https://smarthealth-ai-assistant.vercel.app/)

**🚀 Live Demo:** [https://smarthealth-ai-assistant.vercel.app/](https://smarthealth-ai-assistant.vercel.app/)

SmartHealth is an intelligent, full-stack medical appointment and symptom analysis platform. It leverages advanced Natural Language Processing (NLP) and machine learning to analyze patient symptoms, predict potential conditions, and automatically match patients with the most appropriate medical specialists.

## 🌟 Key Features

*   **🧠 AI Symptom Checker:** Describe your symptoms in natural language, and our FastAPI Python backend uses NLP (spaCy) and predictive models to generate a clinical insight report.
*   **🩺 Intelligent Specialist Routing:** Based on the AI prediction, the system automatically recommends the most relevant medical specialist for your condition.
*   **📅 Seamless Appointment Booking:** Real-time scheduling system for patients to book consultations with doctors.
*   **📊 Health Records Dashboard:** A beautifully designed, glassmorphism-inspired patient dashboard to track medical history, AI insights, and upcoming appointments.
*   **🔐 Secure Authentication:** JWT-based role authentication (Patient vs. Admin/Doctor).

---

## 🏗️ System Architecture

The application is built on a modern, 3-tier microservices architecture to ensure scalability and clear separation of concerns.

```mermaid
graph TD
    %% Presentation Layer
    subgraph Frontend [Presentation Layer - React/Vite]
        UI[React User Interface]
        State[State Management]
        Router[React Router]
    end

    %% Application Layer
    subgraph Backend [Application Layer - Node.js/Express]
        API[Express REST API]
        Auth[JWT Authentication]
        Controllers[Business Logic]
        ORM[Sequelize ORM]
    end

    %% AI / ML Layer
    subgraph AI_Service [AI / ML Layer - Python/FastAPI]
        FastAPI[FastAPI Endpoints]
        NLP[spaCy NLP Pipeline]
        ML[Predictive Models]
    end

    %% Data Layer
    subgraph Database [Data Layer]
        SQLite[(SQLite / PostgreSQL)]
    end

    %% Connections
    UI <-->|HTTP/REST| API
    API <-->|HTTP/REST| FastAPI
    API <-->|Read/Write| ORM
    ORM <--> SQLite
    FastAPI <-->|Inference| NLP
    FastAPI <-->|Prediction| ML
```

---

## 🗄️ Database Design (ERD)

The core application data is modeled relationally to support patient profiles, role management, and health records.

```mermaid
erDiagram
    USER ||--o{ APPOINTMENT : books
    USER ||--o| PROFILE : has
    USER {
        int id PK
        string name
        string email
        string password
        string role "patient | admin"
        datetime createdAt
        datetime updatedAt
    }
    
    PROFILE {
        int id PK
        int userId FK
        int age
        string gender
        string medicalHistory
        string bloodType
        string allergies
        string emergencyContact
    }
    
    APPOINTMENT {
        int id PK
        int patientId FK
        string doctorName
        string specialistType
        datetime appointmentDate
        string status "scheduled | completed | cancelled"
        string symptoms
        string llmInsight
        string priority
    }
```

---

## 📸 Application Gallery

Here is a visual tour of the SmartHealth interface:

> **AI Symptom Diagnostics**
> 
> ![Symptom Check 1](./assets/Screenshot%202026-05-12%20090129.png)
> ![Symptom Check 2](./assets/Screenshot%202026-05-12%20090139.png)
> ![Symptom Check 3](./assets/Screenshot%202026-05-12%20090150.png)

> **Patient Dashboards & Appointments**
> 
> ![Dashboard 1](./assets/Screenshot%202026-05-12%20090155.png)
> ![Dashboard 2](./assets/Screenshot%202026-05-12%20090211.png)
> ![Dashboard 3](./assets/Screenshot%202026-05-12%20090215.png)

> **Additional Views**
> 
> ![View 1](./assets/Screenshot%202026-05-12%20090234.png)
> ![View 2](./assets/Screenshot%202026-05-12%20090242.png)
> ![View 3](./assets/Screenshot%202026-05-12%20090349.png)
> ![View 4](./assets/Screenshot%202026-05-12%20090400.png)
> ![View 5](./assets/Screenshot%202026-05-12%20091313.png)

---

## 🚀 Local Development Setup

To run this application locally, you will need to start all three services simultaneously.

### Prerequisites
*   Node.js (v18+)
*   Python (v3.10 or v3.12) - *Note: Python 3.13 is currently unsupported on Windows due to missing C++ compiler wheels for `spacy`.*
*   Git

### 1. Backend Service (Node.js)
```bash
cd backend
npm install
npm run dev
```
*The backend API will start on `http://localhost:5000`*

### 2. AI Diagnostics Service (Python FastAPI)
It is highly recommended to run this in **WSL** (Linux) or ensure you are using **Python 3.10** on Windows.
```bash
cd ai-services
python3 -m venv venv

# Activate on Linux/WSL:
source venv/bin/activate
# OR Activate on Windows PowerShell:
.\venv\Scripts\Activate.ps1

# Install requirements
pip install -r requirements.txt

# Download the NLP Model (Required!)
python -m spacy download en_core_web_sm

# Start the server
python -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```
*The AI service will start on `http://localhost:8000`*

### 3. Frontend Web App (React/Vite)
```bash
cd frontend
npm install
npm run dev
```
*The web interface will start on `http://localhost:5173`*

---

## 🛠️ Technology Stack
*   **Frontend:** React 18, TypeScript, Vite, TailwindCSS (Custom Glassmorphism styling), React Router v6.
*   **Backend:** Node.js, Express, Sequelize ORM, SQLite.
*   **AI Microservice:** Python, FastAPI, spaCy (NLP), scikit-learn.
*   **Deployment Integration:** Vercel (Frontend), Docker (Production Ready).
