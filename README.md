# HerdGuard AI 🇿🇦
**Intelligent Livestock Health Monitoring, Disease-Risk Awareness & Agricultural Intelligence Platform**

[![Python 3.14+](https://img.shields.io/badge/Python-3.14%2B-blue.svg)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.110%2B-009688.svg)](https://fastapi.tiangolo.com/)
[![React 19](https://img.shields.io/badge/React-19-61DAFB.svg)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC.svg)](https://tailwindcss.com/)
[![SQLite](https://img.shields.io/badge/Database-SQLite-003B57.svg)](https://www.sqlite.org/)
[![Pytest](https://img.shields.io/badge/Tests-22%20Passing-success.svg)](backend/tests/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

---

## 1. About the Project

**HerdGuard AI** is a production-minded, full-stack digital livestock health monitoring and disease-risk intelligence web application engineered specifically for the **South African agricultural ecosystem**. With an initial focus on **cattle** (extensible to sheep and goats), the platform bridges communal, smallholder, and commercial livestock farmers with authorized agricultural extension officers and registered veterinary professionals.

The platform addresses critical livestock biosecurity challenges in South Africa:
- **Early Detection**: Delayed reporting of unusual symptoms (e.g. Foot and Mouth Disease, Lumpy Skin Disease, African Redwater) leading to rapid localized outbreaks.
- **Traceability & Health Records**: Lack of centralized, accessible digital records for individual animals, ear tags, and statutory vaccination histories.
- **Biosecurity Governance**: The need to prevent public misinformation while ensuring qualified veterinarians have an authoritative channel to review reports and issue verified advisories.
- **Accessibility**: Simple, clean interfaces optimized for communal and smallholder farmers operating across South Africa's 9 provinces.

### Statutory Alignment & Medical Ethics
- **Complementary Positioning**: HerdGuard AI is designed to complement existing statutory reporting under the **Animal Diseases Act (Act No. 35 of 1984)**. It does not replace the Department of Agriculture, Land Reform and Rural Development (DALRRD) or official state veterinary services.
- **No Prescriptions or Clinical Dosages**: AI assessments are designated as **preliminary decision-support indicators**. The system does not prescribe veterinary medicines, antimicrobial dosages, or clinical treatments.
- **Verification Hierarchy**: Incidents are strictly classified as `Suspected`, `Professionally Reviewed`, or `Official Outbreak` to ensure data integrity.

---

## 2. Technology Stack

### Frontend
- **Framework**: React.js 19 (JavaScript) with Vite 8 build tool
- **Styling**: Tailwind CSS 3.4 (Custom South African palette: Forest greens, emerald highlights, warm cream backgrounds, charcoal text)
- **Routing**: React Router DOM 7
- **HTTP Client**: Axios with Bearer token interceptor and automatic 401 session expiration handling
- **Icons**: Lucide React
- **Data Visualizations**: Recharts (Dynamic breed distribution pie charts, herd health bar charts, and 7-day incident timeline charts)
- **Geographical Mapping**: Leaflet & React Leaflet with OpenStreetMap tiles centered on South Africa

### Backend
- **Language & Runtime**: Python 3.14+
- **Web Framework**: FastAPI (Asynchronous REST API)
- **Database & ORM**: SQLite + SQLAlchemy 2.0 (Relational schema with foreign keys, indexes, and cascades)
- **Data Validation**: Pydantic v2 & Pydantic-Settings
- **Security & Authentication**: Bcrypt (direct 72-byte safe password hashing) + PyJWT (JSON Web Tokens with 24-hour expiration)
- **ASGI Server**: Uvicorn

### AI & Machine Learning
- **Syndromic Risk Assessment Engine**: Rule-based clinical pattern recognition evaluating cattle syndromic clusters (Foot and Mouth suspect patterns, tick-borne diseases, Lumpy Skin Disease, Blackquarter, Bovine Respiratory Disease Complex). Generates risk tiers: `Low Risk`, `Moderate Risk`, `High Risk`, and `Urgent Attention Required`.
- **Agricultural Assistant (RAG)**: Retrieval-Augmented Generation using Scikit-Learn `TfidfVectorizer` and cosine similarity over curated South African veterinary knowledge documents (DALRRD, ARC Onderstepoort, SAVA).

---

## 3. Platform User Roles & Permissions

HerdGuard AI implements strict Role-Based Access Control (RBAC) across three distinct user roles:

```
                  ┌──────────────────────────────────────────────┐
                  │               System Users                   │
                  └───────┬──────────────┬──────────────┬────────┘
                          │              │              │
              ┌───────────▼──┐   ┌───────▼──────┐   ┌───▼────────────┐
              │    Farmer    │   │  Veterinary  │   │ Administrator  │
              │   (Public)   │   │(Provisioned) │   │  (Built-In)    │
              └──────────────┘   └──────────────┘   └────────────────┘
```

### 1. Livestock Farmer (`farmer`)
- **Registration**: Public self-registration at `/register`.
- **Farm Parcel Management**: Register multiple farms with GPS coordinates, province, and farm type (Smallholder, Communal, Commercial).
- **Animal Profiles**: Register cattle with unique ear tag numbers, breed (Bonsmara, Nguni, Brahman, etc.), sex, age, weight, and status.
- **Symptom Reporting**: Submit structured health reports using a 14-symptom clinical checklist and receive instant AI preliminary risk assessments.
- **Vaccination Tracking**: Log compulsory and core vaccines (Anthrax, Brucellosis S19, Blackquarter, LSD) with automated overdue alerts.
- **Disease Mapping**: View interactive OpenStreetMap displaying suspected and confirmed disease alerts.
- **RAG Assistant**: Ask biosecurity and livestock health questions grounded in DALRRD guidelines.

### 2. Veterinary Professional (`professional`)
- **Registration**: **Cannot self-register**. Must be **provisioned exclusively by a System Administrator** who assigns their login credentials. This guarantees statutory veterinary council verification and prevents unauthorized clinical impersonation.
- **Clinical Review Queue**: Dedicated dashboard at `/professional` displaying pending farmer reports.
- **Professional Assessment**: Add clinical observations, recommend action plans, and transition report statuses (`Under Review` ➔ `Action Recommended` ➔ `Resolved`).
- **Disease Surveillance**: Monitor provincial incident clusters and report verified disease findings.

### 3. System Administrator (`admin`)
- **Credentials**: Guaranteed automatically on system startup (`admin@herdguard.co.za` / `Password123!`).
- **User Management**: Oversight of all platform users at `/admin/users`, including account deactivation and reactivation.
- **Veterinary Provisioning**: Add veterinary professionals with official practice details, assign their initial passwords (or generate secure ones), and copy credentials to transmit securely.
- **Disease Incident Oversight**: Verify disease incidents and escalate statuses (`Suspected` ➔ `Professionally Reviewed` ➔ `Official Outbreak`).
- **Knowledge Base Management**: Publish and curate authoritative extension guidelines.
- **Activity Audit Trail**: View immutable audit logs tracking logins, report submissions, and clinical reviews.

---

## 4. Built-in & Demonstration Credentials

The application is pre-configured with the following credentials:

| Role | Email Address | Password | Provisioning Method | Portal Route |
|---|---|---|---|---|
| **System Administrator** | `admin@herdguard.co.za` | `Password123!` | Built-in automatically on startup | `/admin` |
| **Veterinary Professional** | `vet@herdguard.co.za` | `Password123!` | Provisioned by Admin (Seed) | `/professional` |
| **Livestock Farmer** | `farmer@herdguard.co.za` | `Password123!` | Public Self-Signup or Seed | `/dashboard` |

> **Note**: The `/login` page includes quick-fill buttons for rapid demonstration and evaluation.

---

## 5. Application Structure

```
HerdGuardAI/
├── backend/
│   ├── app/
│   │   ├── ai/
│   │   │   ├── risk_assessment_engine.py  # Syndromic pattern recognition
│   │   │   └── assistant_rag.py           # RAG retrieval over DALRRD guidelines
│   │   ├── api/
│   │   │   ├── routes/                    # auth, users, farms, animals, reports, vacs, incidents, ai, dashboard
│   │   │   └── deps.py                    # RBAC dependencies (require_admin, require_professional, etc.)
│   │   ├── core/                          # config.py, security.py (bcrypt + pyjwt)
│   │   ├── database/                      # session.py, init_db.py (auto admin sync)
│   │   ├── models/                        # SQLAlchemy models (User, Farm, Animal, Report, Review, etc.)
│   │   ├── schemas/                       # Pydantic v2 schemas
│   │   ├── services/                      # activity_service.py, notification_service.py
│   │   └── main.py                        # FastAPI application entry point
│   ├── tests/                             # 22 automated Pytest unit and integration tests
│   ├── requirements.txt                   # Backend Python dependencies
│   ├── seed_data.py                       # Demonstration data generator
│   └── pytest.ini                         # Pytest configuration
│
├── frontend/
│   ├── public/
│   │   ├── cattle-hero.jpg                # High-resolution hero pasture background
│   │   └── favicon.svg                    # Brand favicon
│   ├── src/
│   │   ├── assets/                        # Static brand assets
│   │   ├── components/                    # StatusBadge, StatCard, DisclaimerBanner, Navbar, Sidebar, etc.
│   │   ├── context/                       # AuthContext (JWT authentication state)
│   │   ├── layouts/                       # MainLayout (Dashboard) & PublicLayout
│   │   ├── pages/
│   │   │   ├── public/                    # LandingPage, AboutPage, FeaturesPage, ContactPage, LoginPage, RegisterPage
│   │   │   ├── farmer/                    # Dashboard, Farms, Livestock, AnimalProfile, Reports, Vaccinations, DiseaseMap, Assistant
│   │   │   ├── professional/              # ProfessionalDashboard (Clinical Review Queue)
│   │   │   └── admin/                     # AdminDashboard, AdminUsersPage, AdminIncidentsPage, AdminKnowledgePage, AdminActivityLogsPage
│   │   ├── services/                      # Axios API client (/api)
│   │   ├── App.jsx                        # Client-side router configuration
│   │   ├── main.jsx                       # Entry point with Leaflet styles
│   │   └── index.css                      # Tailwind base and custom utilities
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
│
├── docs/                                  # ARCHITECTURE.md, API_DOCUMENTATION.md, REGULATORY_ALIGNMENT.md
├── LICENSE                                # MIT License
└── README.md                              # Project documentation
```

---

## 6. Installation & How to Run

### Prerequisites
- **Python**: Version 3.10+ (Tested on Python 3.14)
- **Node.js**: Version 18+ (Tested on Node v20/v24)
- **npm**: Version 9+
- **Git**

---

### Step 1: Clone the Repository
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

3. **Install Python dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Initialize database tables and synchronize built-in administrator**:
   ```bash
   python -m app.database.init_db
   ```
   *(This creates `herdguard.db` and ensures `admin@herdguard.co.za` exists with password `Password123!`)*

5. **(Optional) Seed demonstration data**:
   ```bash
   python seed_data.py
   ```
   *(Populates sample South African farms, cattle with ear tags, vaccination records, health reports, and knowledge base documents).*

6. **Start the FastAPI backend server**:
   ```bash
   python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
   ```
   The backend API will be live at `http://127.0.0.1:8000`.  
   Interactive Swagger documentation is available at `http://127.0.0.1:8000/docs`.

---

### Step 3: Frontend Setup

1. **Open a new terminal and navigate to the frontend directory**:
   ```bash
   cd frontend
   ```

2. **Install frontend packages**:
   ```bash
   npm install
   ```

3. **Start the Vite development server**:
   ```bash
   npm run dev
   ```
   The frontend application will be live at `http://localhost:5173`.

---

## 7. How to Test the Complete User Workflow

### 1. Farmer Journey
1. Open `http://localhost:5173/register` and register a new farmer account.
2. Go to **"Farms"** and register a new farm parcel with GPS coordinates (e.g. Free State, latitude `-28.2`, longitude `27.5`).
3. Go to **"Livestock"** and register cattle with a unique ear tag (e.g. `ZA-FS-2026-001`).
4. Click **"Report Illness"** on the animal profile, select symptoms (e.g. *fever*, *mouth blisters*, *excessive salivation*), and submit.
5. Review the instant AI preliminary risk assessment flagging high risk and recommending veterinary referral.

### 2. Administrator Provisioning Journey
1. Sign in at `http://localhost:5173/login` using `admin@herdguard.co.za` / `Password123!`.
2. Go to **"User Accounts"** (`/admin/users`).
3. Click **"+ Add Veterinary Professional"**.
4. Enter the doctor's name, email, province, practice, and assign an initial password.
5. Click **"Provision Vet Account"** and copy the generated credentials.

### 3. Veterinary Professional Journey
1. Open an incognito browser window at `http://localhost:5173/login`.
2. Log in using the credentials assigned by the Administrator.
3. Access the **Professional Review Queue** (`/professional`).
4. Select the farmer's health report submitted in Step 1.
5. Add official clinical observations, specify treatment recommendations, and update the review status.
6. The farmer immediately receives an in-app notification with the veterinarian's findings.

---

## 8. Running Automated Tests

HerdGuard AI includes a suite of 22 automated Pytest unit and integration tests covering authentication, public registration restrictions, admin vet provisioning, vet login, farm and cattle CRUD, ear tag uniqueness, AI risk assessment, and dashboard analytics.

Run the test suite from the `backend/` directory:

```bash
cd backend
.\venv\Scripts\python -m pytest -v
```

### Pytest Execution Output
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

======================= 22 passed in 7.02s =======================
```

---

## 9. Regulatory Alignment & Medical Ethics

HerdGuard AI strictly complies with statutory biosecurity boundaries:
1. **Non-Replacement Principle**: The system does not claim to replace government traceability systems or statutory disease reporting under the Animal Diseases Act (Act 35 of 1984).
2. **No Drug Prescription**: The application never suggests antimicrobial dosages, prescription schedules, or restricted veterinary pharmaceuticals.
3. **Transparent Decision Support**: AI risk assessments are clearly labeled with mandatory safety disclaimers requiring official veterinary confirmation.

---

## 10. License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
