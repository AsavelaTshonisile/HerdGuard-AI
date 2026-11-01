# 🐄 HerdGuard AI

> **South Africa's Intelligent Livestock Health Monitoring & Disease-Risk Platform**

[![Python](https://img.shields.io/badge/Python-3.11+-3776AB?logo=python&logoColor=white)](https://python.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115+-009688?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-6+-646CFF?logo=vite&logoColor=white)](https://vitejs.dev)
[![SQLite](https://img.shields.io/badge/SQLite-3-003B57?logo=sqlite&logoColor=white)](https://sqlite.org)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-3-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

---

## 📋 Table of Contents

1. [Project Overview & Vision](#-project-overview--vision)
2. [The Problem](#-the-problem)
3. [The Solution](#-the-solution)
4. [Key Features](#-key-features)
5. [User Roles & Responsibilities](#-user-roles--responsibilities)
6. [Technology Stack](#-technology-stack)
7. [Project Structure](#-project-structure)
8. [Getting Started — Clone & Run Locally](#-getting-started--clone--run-locally)
9. [Built-in Credentials](#-built-in-credentials)
10. [API Documentation](#-api-documentation)
11. [Running Tests](#-running-tests)
12. [Regulatory Alignment](#-regulatory-alignment)
13. [Disclaimer](#-disclaimer)

---

## 🌍 Project Overview & Vision

**HerdGuard AI** is a full-stack, AI-assisted livestock health monitoring and disease-risk awareness platform purpose-built for South African farmers, veterinary professionals, and agricultural authorities.

The system brings together real-time animal health data, machine-learning-powered syndromic risk assessment, a veterinary review pipeline, geospatial disease incident mapping, and a curated knowledge base — all in one unified digital platform.

**Our vision** is to modernise South African livestock management by giving every farmer — regardless of size or location — access to the same level of intelligent health monitoring and early-warning capability previously only available to large commercial operations. By connecting farmers directly to registered veterinary professionals and surfacing AI-generated risk alerts early, HerdGuard AI aims to reduce livestock mortality, improve biosecurity, and support the long-term food security of South Africa.

---

## ⚠️ The Problem

South African livestock farming faces a persistent and costly set of challenges:

- **Late disease detection** — Many livestock diseases such as Foot-and-Mouth Disease (FMD), African Swine Fever, and Lumpy Skin Disease spread rapidly before farmers recognise the clinical signs. By the time a vet is consulted, the outbreak has often already propagated across multiple herds.

- **Disconnected communication** — There is no centralised digital channel connecting smallholder and commercial farmers to veterinary professionals or disease surveillance authorities (DALRRD, provincial veterinary services).

- **Poor record-keeping** — Most farms rely on paper-based health records or no records at all, making vaccination histories, health trends, and incident timelines nearly impossible to reconstruct.

- **Limited AI & data literacy** — Farmers lack access to data-driven decision-support tools that could flag patterns in their herd's health long before clinical signs are obvious.

- **Geographic barriers** — Rural farmers often cannot access in-person veterinary services quickly, particularly in remote provinces such as Limpopo, Northern Cape, and the Eastern Cape.

- **Fragmented outbreak reporting** — Disease incidents are rarely reported to a central digital system, making rapid spatial analysis and early-warning alerts impossible.

---

## ✅ The Solution

HerdGuard AI addresses each of these challenges with a cohesive, role-aware digital platform:

| Challenge | HerdGuard AI Solution |
|---|---|
| Late disease detection | AI syndromic risk engine that scores every submitted health report in real time |
| Disconnected communication | Integrated veterinary review pipeline — farmers submit reports, vets review and respond online |
| Poor record-keeping | Structured digital records for every animal, health event, and vaccination |
| Limited data tools | Risk dashboards, trend charts, and an AI knowledge assistant powered by DALRRD documents |
| Geographic barriers | Remote vet consultations via the platform; no in-person visit required for initial assessment |
| Fragmented outbreak reporting | Geospatial Leaflet disease map aggregating all reported incidents by province and type |

---

## ✨ Key Features

### 🧠 AI Risk Assessment Engine
- Syndromic risk scoring on every farmer-submitted health report
- Multi-factor analysis: symptoms, affected count, species, province, recent outbreak history
- Risk levels: **Low / Moderate / High / Critical**
- Differential diagnosis suggestions with confidence scores
- Recommended immediate actions (always non-prescriptive; no dosages)
- Mandatory veterinary disclaimer on all AI outputs

### 🐄 Animal & Farm Management
- Register unlimited farms across multiple provinces
- Add, edit, and track individual animals with species, breed, age, sex, and tag number
- Full health timeline per animal
- Vaccination schedule tracking with next-due date alerts

### 📋 Health Report Submission
- Structured symptom reporting (fever, lameness, discharge, respiratory distress, skin lesions, etc.)
- Affected animal count and severity input
- Automatic AI assessment triggered on submission
- Reports queued for veterinary professional review

### 🩺 Veterinary Review Pipeline
- Vets receive a prioritised queue of pending health reports
- Add clinical notes and recommendations to each report
- Reports are marked reviewed with professional notes visible to farmers
- Notifications sent to farmers when a vet responds

### 🗺️ Disease Incident Map
- Interactive Leaflet map showing all reported disease incidents
- Filter by disease type, province, and date range
- Colour-coded severity markers
- Popup details with incident summary

### 🔔 Notification System
- In-app notifications for AI risk alerts, vet responses, and admin announcements
- Read/unread state with badge count in the sidebar

### 📚 Knowledge Base
- Curated articles on common South African livestock diseases
- DALRRD-aligned disease information: FMD, LSD, Brucellosis, Anthrax, Rift Valley Fever, and more
- Admin-managed resource library

### 🛡️ Admin Control Panel
- Platform-wide statistics and activity dashboard
- Provision veterinary professionals with admin-assigned credentials (vets cannot self-register)
- Activate and deactivate user accounts
- Review all disease incidents with override capability
- Full platform activity log (who did what and when)

### 📊 Data Visualisations
- Recharts bar and line graphs on all dashboards
- Health report trends, vaccination completion rates, risk level distribution

---

## 👥 User Roles & Responsibilities

HerdGuard AI operates a **three-tier role model**. Each role has distinct permissions and a distinct portal.

---

### 🌾 Farmer

**Who they are**: Smallholder and commercial livestock farmers across South Africa.

**How they register**: Self-registration via the public **Register Your Farm** form. Registration is restricted to the Farmer role — no other role can be self-registered.

**What they can do**:
- Register and manage their farms (name, province, GPS coordinates, size)
- Add and manage individual animals per farm (species, breed, tag, age, sex, weight)
- Submit detailed health reports describing observed symptoms in their animals
- Receive an instant AI risk assessment with risk score, differential diagnoses, and recommended actions
- Track vaccination records and upcoming due dates
- Report disease incidents on the interactive map
- View and search the disease knowledge base
- Receive in-app notifications when a vet responds to their report
- Consult the AI assistant with agricultural health questions
- Manage their own profile

**What they cannot do**:
- Access other farmers' data
- Review or modify health reports submitted by others
- Access the admin or veterinary panels

---

### 🩺 Veterinary Professional (Vet)

**Who they are**: Registered veterinary professionals authorised to provide clinical review within the platform.

**How they are added**: Vets **cannot self-register**. They are **provisioned exclusively by the Admin** via the Admin Users panel. The admin assigns a full name, email, and secure password. The vet then logs in using those admin-assigned credentials.

**What they can do**:
- Log in with admin-assigned credentials
- View and manage their professional profile
- Access the pending health reports queue (all reports requiring professional review)
- Add clinical notes and professional recommendations to farmer-submitted reports
- Mark reports as reviewed
- Notify farmers of their clinical findings (via the notification system)
- View all disease incidents across the platform

**What they cannot do**:
- Create or delete farms or animals
- Access admin functions or user management
- Issue drug prescriptions or dosages through the platform

---

### 🛡️ Admin (Platform Administrator)

**Who they are**: The HerdGuard AI platform administrator responsible for managing the system.

**How they access the system**: Admin credentials are **built into the system** and provisioned automatically at startup. The admin does not register through the public form.

**Built-in admin credentials**:
- **Email**: `admin@herdguard.co.za`
- **Password**: `Password123!`

> ⚠️ Change the admin password in your `.env` file before deploying to production.

**What they can do**:
- Access the full admin dashboard with platform-wide statistics
- **Add veterinary professionals** — assign name, email, and secure password; the vet uses these credentials to log in
- Activate and deactivate any user account (farmer or vet)
- Manage all disease incidents (review, update status)
- Manage the knowledge base (add, edit, delete articles)
- View the complete platform activity log
- Monitor all notifications across the system

**What they cannot do**:
- Submit farm health reports (admin is a platform manager, not a farming user)

---

## 🛠️ Technology Stack

### Backend

| Technology | Purpose |
|---|---|
| **Python 3.11+** | Core backend language |
| **FastAPI 0.115+** | RESTful API framework with automatic OpenAPI documentation |
| **SQLAlchemy 2.0** | ORM for database modelling and query management |
| **SQLite 3** | Lightweight embedded relational database (no external DB server required) |
| **Pydantic v2** | Request/response data validation and serialisation |
| **bcrypt** | Password hashing (direct bcrypt — not passlib, for Python 3.14+ compatibility) |
| **PyJWT** | JSON Web Token generation and validation for stateless authentication |
| **Uvicorn** | ASGI production-grade server |
| **Scikit-learn** | TF-IDF vectorisation for the RAG AI knowledge assistant |
| **Pytest** | Automated test suite (22 tests) |

### Frontend

| Technology | Purpose |
|---|---|
| **React 19** | UI component library |
| **Vite 6** | Lightning-fast frontend build tool and dev server |
| **Tailwind CSS 3** | Utility-first CSS framework |
| **React Router DOM 7** | Client-side routing and navigation |
| **Axios** | HTTP client for all API calls to the FastAPI backend |
| **Recharts** | Chart library for data visualisations on dashboards |
| **Leaflet / React-Leaflet** | Interactive geospatial disease incident map |
| **Lucide React** | Icon library |
| **react-hot-toast** | Toast notification UI |

### Developer Tools

| Tool | Purpose |
|---|---|
| **Git** | Version control |
| **pnpm / npm** | Node.js package management |
| **python-dotenv** | Environment variable management |
| **ESLint** | JavaScript linting |

---

## 📁 Project Structure

```
HerdGuardAI/
│
├── backend/                        # FastAPI backend
│   ├── app/
│   │   ├── main.py                 # Application entry point & router registration
│   │   ├── core/
│   │   │   ├── config.py           # Environment settings & built-in admin config
│   │   │   └── security.py        # bcrypt password hashing & JWT token utilities
│   │   ├── database/
│   │   │   ├── session.py         # SQLAlchemy engine & session factory
│   │   │   └── init_db.py         # DB initialisation & built-in admin provisioning
│   │   ├── models/                 # SQLAlchemy ORM models
│   │   │   ├── user.py
│   │   │   ├── farm.py
│   │   │   ├── animal.py
│   │   │   ├── health_report.py
│   │   │   ├── professional_review.py
│   │   │   ├── vaccination.py
│   │   │   ├── disease_incident.py
│   │   │   ├── notification.py
│   │   │   ├── knowledge_resource.py
│   │   │   └── activity_log.py
│   │   ├── schemas/                # Pydantic request/response schemas
│   │   ├── api/
│   │   │   ├── deps.py            # Auth dependencies (require_admin, require_farmer, etc.)
│   │   │   └── routes/            # Route handlers for every feature
│   │   ├── ai/
│   │   │   ├── risk_assessment_engine.py   # Syndromic AI risk scoring
│   │   │   └── assistant_rag.py            # TF-IDF RAG knowledge assistant
│   │   └── services/
│   │       ├── activity_service.py
│   │       └── notification_service.py
│   ├── tests/                      # Pytest test suite (22 tests)
│   ├── requirements.txt
│   ├── seed_data.py               # Demo data seeder
│   ├── .env                       # Environment variables (not committed to git)
│   └── .env.example               # Template for environment variables
│
├── frontend/                       # React + Vite frontend
│   ├── public/
│   │   └── cattle-hero.jpg        # Hero background image
│   ├── src/
│   │   ├── App.jsx                # Root router and route definitions
│   │   ├── main.jsx               # React entry point
│   │   ├── context/
│   │   │   └── AuthContext.jsx    # JWT auth state management
│   │   ├── services/
│   │   │   └── api.js             # Axios API client
│   │   ├── layouts/
│   │   │   ├── PublicLayout.jsx   # Public page wrapper with navbar
│   │   │   └── MainLayout.jsx     # Dashboard wrapper with sidebar
│   │   ├── components/            # Reusable UI components
│   │   ├── pages/
│   │   │   ├── public/            # LandingPage, LoginPage, RegisterPage, About, Features, Contact
│   │   │   ├── farmer/            # Full farmer portal (12 pages)
│   │   │   ├── professional/      # Vet dashboard and review pages
│   │   │   └── admin/             # Admin dashboard, user management, incidents, knowledge, logs
│   │   └── assets/
│   ├── vite.config.js             # Vite config with /api proxy to backend
│   ├── tailwind.config.js
│   └── package.json
│
├── docs/
│   ├── API_DOCUMENTATION.md
│   ├── ARCHITECTURE.md
│   └── REGULATORY_ALIGNMENT.md
│
└── README.md
```

---

## 🚀 Getting Started — Clone & Run Locally

Follow these steps to run HerdGuard AI on your local machine. The entire stack runs locally — no cloud account or external database is required.

### Prerequisites

Make sure you have the following installed before you begin:

| Tool | Minimum Version | Download |
|---|---|---|
| **Git** | any | https://git-scm.com |
| **Python** | 3.11+ | https://python.org/downloads |
| **Node.js** | 18+ | https://nodejs.org |
| **npm** | 9+ | (bundled with Node.js) |

---

### Step 1 — Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/HerdGuardAI.git
cd HerdGuardAI
```

---

### Step 2 — Set Up the Backend

#### 2a. Create and activate a Python virtual environment

**On Windows (PowerShell):**
```powershell
cd backend
python -m venv venv
.\venv\Scripts\Activate.ps1
```

**On macOS / Linux:**
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
```

#### 2b. Install Python dependencies

```bash
pip install -r requirements.txt
```

#### 2c. Configure environment variables

Copy the example environment file and edit it with your settings:

```bash
cp .env.example .env
```

Open `.env` and review the values. For a local development run, the defaults work out of the box:

```env
# Application
APP_NAME=HerdGuard AI
SECRET_KEY=your-secret-key-change-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440

# Built-in Admin (auto-provisioned on startup)
DEFAULT_ADMIN_EMAIL=admin@herdguard.co.za
DEFAULT_ADMIN_PASSWORD=Password123!
DEFAULT_ADMIN_NAME=HerdGuard Administrator

# Database
DATABASE_URL=sqlite:///./herdguard.db
```

> ⚠️ Always change `SECRET_KEY` and `DEFAULT_ADMIN_PASSWORD` before deploying to any public server.

#### 2d. (Optional) Seed demo data

If you want the database pre-populated with demo farms, animals, and health reports for exploration:

```bash
python seed_data.py
```

#### 2e. Start the backend server

**On Windows (PowerShell):**
```powershell
.\venv\Scripts\python.exe -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```

**On macOS / Linux:**
```bash
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```

The backend will be available at: **http://127.0.0.1:8000**

The built-in admin account is created automatically the first time the server starts. You do not need to run any additional scripts.

---

### Step 3 — Set Up the Frontend

Open a **new terminal window** and navigate to the frontend directory:

```bash
cd frontend
```

#### 3a. Install Node.js dependencies

```bash
npm install
```

#### 3b. Start the frontend development server

```bash
npm run dev -- --host 127.0.0.1 --port 5173
```

The frontend will be available at: **http://127.0.0.1:5173**

---

### Step 4 — Open the Application

With both servers running, open your browser and go to:

```
http://127.0.0.1:5173
```

You will land on the HerdGuard AI homepage. From here you can:
- **Register** as a farmer
- **Sign in** using the built-in admin credentials
- **Explore** the AI dashboard, disease map, and knowledge base

---

### Step 5 — Add a Vet to the System (Admin Workflow)

Veterinary professionals **cannot self-register**. To add a vet:

1. Sign in as Admin (`admin@herdguard.co.za` / `Password123!`)
2. Navigate to **Admin → Manage Users**
3. Click **"Add Veterinary Professional"**
4. Fill in the vet's full name, email, province, phone, and practice name
5. Assign a secure password (or use the built-in password generator)
6. Click **"Create Veterinary Account"**
7. Share the assigned email and password with the vet
8. The vet logs in at `http://127.0.0.1:5173/login` using those credentials

---

## 🔑 Built-in Credentials

The following credentials are available immediately after starting the server (with or without seeding):

| Role | Email | Password | Notes |
|---|---|---|---|
| **Admin** | `admin@herdguard.co.za` | `Password123!` | Auto-provisioned on startup |
| **Demo Farmer** | `thabo@example.com` | `FarmerPass123!` | Only available after running `seed_data.py` |
| **Demo Vet** | `dr.nomsa@vetclinic.co.za` | `VetPass123!` | Only available after running `seed_data.py` |

---

## 📖 API Documentation

Once the backend is running, FastAPI automatically generates interactive API documentation:

| Format | URL |
|---|---|
| **Swagger UI** (interactive) | http://127.0.0.1:8000/docs |
| **ReDoc** (readable) | http://127.0.0.1:8000/redoc |
| **OpenAPI JSON** | http://127.0.0.1:8000/openapi.json |

Key API endpoint groups:

| Prefix | Description |
|---|---|
| `POST /api/auth/register` | Public farmer self-registration |
| `POST /api/auth/login` | Login for all roles (returns JWT) |
| `GET /api/users/me` | Get current user profile |
| `POST /api/users/professional` | Admin-only: provision a new vet |
| `GET/POST /api/farms` | Farm management |
| `GET/POST /api/animals` | Animal management |
| `GET/POST /api/health-reports` | Health report submission & retrieval |
| `GET/POST /api/vaccinations` | Vaccination records |
| `GET/POST /api/disease-incidents` | Disease incident reporting & map data |
| `POST /api/ai/assess` | Run AI risk assessment on a report |
| `POST /api/ai/assistant` | Ask the AI knowledge assistant a question |
| `GET /api/dashboard/stats` | Dashboard statistics for the current user |
| `GET /api/notifications` | Fetch notifications for the current user |
| `GET /api/knowledge` | Fetch knowledge base articles |
| `GET /api/activity-logs` | Admin-only: platform activity log |

---

## 🧪 Running Tests

The backend includes an automated test suite covering authentication, authorisation, farm/animal CRUD, health report AI assessment, and vet provisioning.

```bash
cd backend
.\venv\Scripts\Activate.ps1      # Windows
# or: source venv/bin/activate   # macOS/Linux

python -m pytest -v
```

**Expected output:**

```
tests/test_auth.py::test_public_registration_farmer_success PASSED
tests/test_auth.py::test_public_registration_rejects_professional_role PASSED
tests/test_auth.py::test_builtin_admin_login PASSED
tests/test_auth.py::test_admin_provision_vet_and_vet_login PASSED
tests/test_auth.py::test_farmer_cannot_provision_vet PASSED
...
22 passed in ~7s
```

---

## ⚖️ Regulatory Alignment

HerdGuard AI is designed in alignment with South African agricultural and veterinary legislation:

| Legislation | Relevance |
|---|---|
| **Animal Diseases Act 35 of 1984** | Mandatory reporting of notifiable diseases (FMD, Anthrax, ASF, etc.) |
| **Veterinary and Para-Veterinary Professions Act 19 of 1982** | Only registered professionals may provide veterinary diagnoses |
| **DALRRD Guidelines** | Knowledge base articles sourced from DALRRD disease fact sheets |
| **POPIA (Protection of Personal Information Act)** | Farmer and animal data is stored locally; no third-party sharing |

> **Important**: HerdGuard AI AI assessments are decision-support tools only. They are never confirmed veterinary diagnoses. All AI outputs carry a mandatory disclaimer directing users to consult a registered veterinary professional.

---

## ⚠️ Disclaimer

The AI-generated risk assessments and recommendations provided by HerdGuard AI are for **informational and early-warning purposes only**. They do **not** constitute veterinary diagnoses, prescriptions, or professional medical advice for animals. Always consult a registered veterinary professional (as required under the Veterinary and Para-Veterinary Professions Act 19 of 1982) before making any treatment, quarantine, or disposal decisions regarding your livestock.

---

## 📄 License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.

---

*Built with ❤️ for South African agriculture — HerdGuard AI © 2024*
