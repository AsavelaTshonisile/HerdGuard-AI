# HerdGuard AI 🇿🇦
**Intelligent Livestock Health Monitoring, Disease-Risk Awareness & Agricultural Intelligence Platform**

[![Python 3.14+](https://img.shields.io/badge/Python-3.14%2B-blue.svg)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.110%2B-009688.svg)](https://fastapi.tiangolo.com/)
[![React 19](https://img.shields.io/badge/React-19-61DAFB.svg)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC.svg)](https://tailwindcss.com/)
[![SQLite](https://img.shields.io/badge/Database-SQLite-003B57.svg)](https://www.sqlite.org/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

---

## 1. Project Overview & Vision

**HerdGuard AI** is a production-minded, full-stack digital livestock health monitoring and disease-risk intelligence web application engineered specifically for **South Africa**. With an initial focus on **cattle** (extensible to sheep and goats), the platform bridges smallholder, communal, and commercial livestock farmers with authorized agricultural extension officers and registered veterinary professionals.

The system addresses critical agricultural challenges in South Africa:
- Delayed identification and reporting of unusual livestock symptoms.
- Inadequate visibility into individual animal health and statutory vaccination histories.
- Limited access to timely, localized biosecurity and disease outbreak alerts.
- High barriers to digital tools for communal and smallholder livestock keepers.

### Statutory Positioning & Medical Guardrails
- **Complementary Positioning**: HerdGuard AI complements statutory reporting under the South African **Animal Diseases Act (Act No. 35 of 1984)**. It does not replace the Department of Agriculture, Land Reform and Rural Development (DALRRD) or provincial veterinary services.
- **No Prescriptions or Confirmed Diagnoses**: AI assessments are designated as **preliminary decision-support indicators**. The system does not prescribe veterinary medicines, antimicrobial dosages, or clinical treatments.
- **Strict Verification Hierarchy**: Disease incidents are classified into `Suspected`, `Professionally Reviewed`, and `Official Outbreak` to prevent misinformation.

---

## 2. Technology Stack

### Frontend
- **Framework**: React.js 19 (JavaScript) + Vite 8
- **Styling**: Tailwind CSS 3.4 (Custom South African agricultural palette: Forest greens, fresh emeralds, warm cream backgrounds, charcoal text)
- **Routing**: React Router DOM 7
- **HTTP Client**: Axios with Bearer token interceptor and automatic 401 session expiration handling
- **Icons**: Lucide React
- **Data Visualizations**: Recharts (Pie charts, bar charts, and 7-day incident line charts)
- **Geographical Mapping**: Leaflet & React Leaflet with OpenStreetMap tiles

### Backend
- **Language & Runtime**: Python 3.14
- **Web Framework**: FastAPI (Asynchronous REST API)
- **Database & ORM**: SQLite + SQLAlchemy 2.0 (Relational data model with foreign keys and cascade rules)
- **Data Validation & Schemas**: Pydantic v2 & Pydantic-Settings
- **Security & Authentication**: Bcrypt (direct 72-byte safe password hashing) + PyJWT (JSON Web Tokens)
- **ASGI Server**: Uvicorn

### AI & Machine Learning
- **Syndromic Risk Engine**: Rule-based clinical pattern recognition evaluating cattle syndromic clusters (Foot and Mouth Disease suspect patterns, acute tick-borne infections, Lumpy Skin Disease, Blackquarter, Bovine Respiratory Disease Complex).
- **Agricultural Assistant (RAG)**: Retrieval-Augmented Generation using Scikit-Learn `TfidfVectorizer` and cosine similarity over official South African veterinary documents (DALRRD, ARC Onderstepoort, SAVA).

---

## 3. Demonstration Credentials

The database comes pre-seeded with realistic demonstration accounts across all 3 supported platform roles:

| Role | Email Address | Password | Organization / Jurisdiction |
|---|---|---|---|
| **Farmer** | `farmer@herdguard.co.za` | `Password123!` | Mthembu Family Farm (Free State) |
| **Veterinary Professional** | `vet@herdguard.co.za` | `Password123!` | Eastern Cape Provincial Vet Services |
| **System Administrator** | `admin@herdguard.co.za` | `Password123!` | HerdGuard AI Operations (Gauteng) |

> **Note**: The login interface features quick-fill buttons that automatically populate demonstration credentials for rapid role switching.

---

## 4. Application Architecture

```
HerdGuardAI/
├── frontend/
│   ├── src/
│   │   ├── components/       # StatusBadge, StatCard, DisclaimerBanner, Navbar, Sidebar, Footer, etc.
│   │   ├── context/          # AuthContext (JWT authentication state)
│   │   ├── layouts/          # MainLayout (Dashboard) & PublicLayout
│   │   ├── pages/
│   │   │   ├── public/       # Landing, About, Features, Contact, Login, Register
│   │   │   ├── farmer/       # Dashboard, Farms, Livestock, AnimalProfile, Reports, SubmitReport, Vacs, Map, AI
│   │   │   ├── professional/ # Vet Dashboard & Review Queue
│   │   │   └── admin/        # Admin Dashboard, Users, Incidents, Knowledge, Activity Logs
│   │   ├── services/         # Axios API client (/api)
│   │   ├── App.jsx           # Client-side router configuration
│   │   ├── main.jsx          # Entry point with Leaflet styles
│   │   └── index.css         # Tailwind base and custom directives
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
│
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   ├── routes/       # auth, users, farms, animals, health_reports, vaccinations, incidents, ai, dashboard
│   │   │   └── deps.py       # RBAC role guards and database dependencies
│   │   ├── ai/
│   │   │   ├── risk_assessment_engine.py  # Transparent syndromic risk assessment
│   │   │   └── assistant_rag.py           # RAG retrieval over DALRRD knowledge
│   │   ├── core/             # config.py, security.py (bcrypt + pyjwt)
│   │   ├── database/         # session.py, init_db.py
│   │   ├── models/           # SQLAlchemy entity models (User, Farm, Animal, Report, Review, etc.)
│   │   ├── schemas/          # Pydantic v2 request/response schemas
│   │   ├── services/         # Activity audit logger & notification service
│   │   └── main.py           # FastAPI application entry point
│   ├── tests/                # Automated Pytest suite (18 test cases)
│   ├── seed_data.py          # Demonstration seed data generator
│   ├── requirements.txt      # Python dependencies
│   └── .env.example
│
├── docs/                     # ARCHITECTURE.md, API_DOCUMENTATION.md, REGULATORY_ALIGNMENT.md
├── .gitignore
└── README.md
```

---

## 5. Getting Started & Installation

### Prerequisites
- **Python**: Version 3.10+ (Tested on Python 3.14)
- **Node.js**: Version 18+ (Tested on Node v24)
- **npm**: Version 9+

---

### Step 1: Clone and Inspect Repository
```bash
git clone https://github.com/YourUsername/HerdGuardAI.git
cd HerdGuardAI
```

---

### Step 2: Backend Setup

1. **Navigate to the backend directory**:
   ```bash
   cd backend
   ```

2. **Create and activate a virtual environment**:
   - **Windows (PowerShell)**:
     ```powershell
     python -m venv venv
     .\venv\Scripts\Activate.ps1
     ```
   - **Linux / macOS**:
     ```bash
     python3 -m venv venv
     source venv/bin/activate
     ```

3. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure environment variables**:
   ```bash
   # Copy sample environment configuration
   cp .env.example .env
   ```

5. **Initialize database tables and seed demonstration data**:
   ```bash
   python seed_data.py
   ```
   *(This creates `herdguard.db` and populates sample farms, cattle, vaccinations, reports, and knowledge documents).*

6. **Start the FastAPI backend server**:
   ```bash
   python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
   ```
   The backend API will be live at `http://127.0.0.1:8000` with Swagger docs at `http://127.0.0.1:8000/docs`.

---

### Step 3: Frontend Setup

1. **Open a new terminal and navigate to the frontend directory**:
   ```bash
   cd frontend
   ```

2. **Install frontend dependencies**:
   ```bash
   npm install
   ```

3. **Start the Vite development server**:
   ```bash
   npm run dev
   ```
   The frontend will be live at `http://127.0.0.1:5173`.

---

## 6. Access Control & Built-in Credentials

HerdGuard AI enforces strict biosecurity and veterinary credential governance:
- **Farmers**: Can register via public self-signup at `/register`.
- **Veterinary Professionals**: **Cannot self-register**. Due to statutory verification and veterinary board integrity, veterinarians must be **provisioned exclusively by the platform Administrator**, who assigns their initial login credentials.
- **System Administrator**: Guaranteed automatically by the backend on database initialization.

### Built-in & Provisioned Credentials

| Role | Email | Password | Provisioning Method | Access Portal |
|---|---|---|---|---|
| **System Administrator** | `admin@herdguard.co.za` | `Password123!` | Automatic (Built-in on startup) | `/admin` |
| **Veterinary Professional** | `vet@herdguard.co.za` | `Password123!` | Provisioned by Admin | `/professional` |
| **Livestock Farmer** | `farmer@herdguard.co.za` | `Password123!` | Public Self-Signup or Seed | `/dashboard` |

> **Admin Vet Provisioning Workflow**: The Administrator navigates to `/admin/users` and clicks **"+ Add Veterinary Professional"**. The admin enters the veterinarian's name, email, official practice/directorate, province, and assigns their initial password (or generates a secure one). The credentials can be copied with one click and provided to the veterinarian to sign in at `/login`.

---

## 7. Running Automated Tests

A comprehensive automated test suite is implemented using **Pytest**, covering authentication, role-based authorization restrictions, farm and cattle CRUD, duplicate ear tag enforcement, AI risk assessment execution, veterinary review workflows, vaccination lifecycle, dashboard analytics, and admin vet provisioning with credential assignment.

Run the test suite from the `backend/` directory:

```bash
cd backend
.\venv\Scripts\python -m pytest -v
```

### Test Suite Summary (22 Passing Tests)
```
tests/test_auth.py::test_register_user PASSED                            [  4%]
tests/test_auth.py::test_register_duplicate_email PASSED                 [  9%]
tests/test_auth.py::test_login_success PASSED                            [ 13%]
tests/test_auth.py::test_login_invalid_password PASSED                   [ 18%]
tests/test_auth.py::test_get_current_user_me PASSED                      [ 22%]
tests/test_auth.py::test_public_registration_rejects_professional_role PASSED [ 27%]
tests/test_auth.py::test_builtin_admin_login PASSED                      [ 31%]
tests/test_auth.py::test_admin_provision_vet_and_vet_login PASSED        [ 36%]
tests/test_auth.py::test_farmer_cannot_provision_vet PASSED              [ 40%]
tests/test_authorization_dashboard.py::test_role_authorization_restrictions PASSED [ 45%]
tests/test_authorization_dashboard.py::test_farmer_dashboard_statistics PASSED [ 50%]
tests/test_authorization_dashboard.py::test_professional_dashboard_statistics PASSED [ 54%]
tests/test_authorization_dashboard.py::test_admin_dashboard_statistics PASSED [ 59%]
tests/test_farms_animals.py::test_create_and_get_farm PASSED             [ 63%]
tests/test_farms_animals.py::test_animal_registration_and_duplicate_check PASSED [ 68%]
tests/test_farms_animals.py::test_animal_profile_and_filters PASSED      [ 72%]
tests/test_health_and_ai.py::test_submit_health_report_with_ai_assessment PASSED [ 77%]
tests/test_health_and_ai.py::test_professional_review_report PASSED      [ 81%]
tests/test_health_and_ai.py::test_standalone_ai_health_assessment PASSED [ 86%]
tests/test_health_and_ai.py::test_ai_agricultural_assistant_rag PASSED   [ 90%]
tests/test_vaccinations_incidents.py::test_vaccination_lifecycle PASSED  [ 95%]
tests/test_vaccinations_incidents.py::test_disease_incident_and_map_endpoint PASSED [100%]

======================= 22 passed in 8.78s =======================
```

---

## 8. Core Application Modules

### Module 1: Authentication & User Management
- Secure registration and login with bcrypt password hashing and 24-hour JWT tokens.
- Strict Role-Based Access Control (`farmer`, `professional`, `admin`).
- Admin-only provisioning of veterinary professionals with assigned passwords.
- User profile updates and status activation/deactivation controls.

### Module 2: Real-Time Farmer Dashboard
- Live database queries computing total livestock, healthy cattle, animals requiring attention, and active reports.
- Interactive Recharts components:
  - Donut chart: Health condition distribution (Healthy, Monitoring, Sick, Quarantined).
  - Bar chart: Cattle breed distribution (Bonsmara, Nguni, Brahman, etc.).
  - Line chart: 7-day symptom reporting timeline.
- Vaccination compliance indicators and recent farm activity audit feed.

### Module 3: Farm Parcel Management
- Register and edit agricultural parcels across South Africa's 9 provinces and local municipalities.
- Numerical latitude and longitude GPS coordinates stored for mapping.
- Categorization by farm type: Smallholder, Communal Pasture, or Commercial.

### Module 4: Individual Livestock Records
- Unique ear tag number validation and indexing.
- Comprehensive cattle attributes: breed, sex, approximate age in months, weight in kilograms, and health status.
- Dedicated **Animal Profile Page** displaying chronological medical history, submitted reports, and vaccination logs.

### Module 5: Livestock Health Monitoring
- Structured symptom reporting interface covering 14 clinical categories (fever, mouth lesions, excessive salivation, lameness, diarrhoea, etc.).
- Automated reference numbering (`HG-YYYY-XXXX`).
- Multi-step report lifecycle: `Submitted` ➔ `Under Review` ➔ `Professional Review Required` ➔ `Action Recommended` ➔ `Resolved` ➔ `Closed`.

### Module 6: AI-Assisted Preliminary Risk Assessment Engine
- Evaluates symptom combinations against documented cattle clinical syndromes.
- Risk classification: `Low Risk`, `Moderate Risk`, `High Risk`, and `Urgent Attention Required`.
- Explanations of triggering symptoms, potential syndromic concerns, and recommended next steps.
- Prominent statutory disclaimers recommending immediate veterinary referral for high-threat reports.

### Module 7: Disease Risk Intelligence & GIS Mapping
- Interactive Leaflet OpenStreetMap centered over South Africa.
- Color-coded incident markers distinguishing between:
  - ⚠ **Suspected** (amber)
  - 🔍 **Professionally Reviewed** (blue)
  - ⛔ **Official Outbreak** (red)
  - ⌂ **Farm Parcels** (forest green)
- Incident filtering by province and verification status with full metadata popups.

### Module 8: Vaccination & Preventive Health
- Log statutory and core cattle vaccines (Anthrax, Brucellosis S19, Blackquarter, Lumpy Skin Disease, Rift Valley Fever, Botulism).
- Automated tracking of upcoming due dates (within 30 days) and overdue booster alerts.

### Module 9: Notifications & Biosecurity Alerts
- In-app alerts stored directly in SQLite.
- Categorized notifications: Health report reviews, vaccine reminders, and municipal biosecurity warnings.
- Real-time unread counter and one-click "Mark All as Read".

### Module 10: HerdGuard AI Assistant (RAG)
- Conversational agricultural assistant grounded in South African veterinary guidelines (DALRRD, ARC Onderstepoort, SAVA).
- TF-IDF semantic vector retrieval over curated documentation.
- Formatted citations to source institutions and contextual follow-up questions.

---

## 8. Regulatory Alignment & Medical Ethics

HerdGuard AI enforces strict medical ethics and legal compliance:
1. **Non-Replacement Principle**: The platform does not claim to replace government systems, statutory disease reporting under Act 35 of 1984, or veterinary examinations.
2. **No Prescription of Drugs**: Does not recommend antimicrobial dosages or prescription stock remedies.
3. **Transparent AI**: Clear disclaimers stating assessments are preliminary decision-support indicators. No fabricated diagnostic accuracy percentages.

---

## 9. License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
