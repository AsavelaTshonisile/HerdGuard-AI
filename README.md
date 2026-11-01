# 🐄 HerdGuard AI 🇿🇦

### Intelligent Livestock Health Monitoring, Disease-Risk Awareness & Agricultural Intelligence Platform

**HerdGuard AI** is a full-stack digital platform designed to support livestock farmers in South Africa through animal health monitoring, disease-risk awareness, digital livestock records and agricultural intelligence.

The platform initially focuses on cattle, with the potential to expand to sheep and goats. It aims to connect smallholder, communal and commercial farmers with agricultural professionals through accessible digital tools.

---

## 📋 Table of Contents

1. [Project Overview](#-project-overview)
2. [The Problem](#-the-problem)
3. [The Solution](#-the-solution)
4. [Key Features](#-key-features)
5. [User Roles](#-user-roles)
6. [Technology Stack](#-technology-stack)
7. [AI and Intelligent Features](#-ai-and-intelligent-features)
8. [Getting Started](#-getting-started)
9. [API Documentation](#-api-documentation)
10. [Testing](#-testing)
11. [Regulatory Alignment](#-regulatory-alignment)
12. [Disclaimer](#-disclaimer)

---

## 🌍 Project Overview

Livestock farming plays an important role in South Africa's agricultural economy and food security. However, farmers can experience challenges identifying early signs of animal diseases, maintaining accurate livestock records and accessing reliable agricultural information.

HerdGuard AI aims to address these challenges by providing a centralized digital platform where farmers can:

- Register and manage their livestock.
- Maintain digital animal health records.
- Report unusual symptoms and health concerns.
- Receive preliminary AI-assisted disease-risk assessments.
- Monitor vaccination records.
- View reported disease incidents geographically.
- Access agricultural information through an intelligent assistant.

The project is designed with South African farming conditions in mind, particularly the needs of smallholder and communal livestock farmers.

## ⚠️ The Problem

Livestock farmers face several challenges that can affect animal health, productivity and food security.

**1. Delayed Disease Awareness**

Unusual symptoms may go unnoticed or unreported, increasing the risk of disease transmission within and between livestock populations.

**2. Limited Digital Record-Keeping**

Some farmers rely on paper-based records, making it difficult to maintain accessible animal histories, identification details and vaccination information.

**3. Limited Access to Agricultural Information**

Farmers may struggle to access understandable and reliable information about livestock diseases, prevention and animal health management.

**4. Disease Monitoring and Communication**

The absence of accessible digital reporting and monitoring tools can make it difficult to identify patterns in reported livestock health concerns.

## 💡 The Solution

HerdGuard AI provides an integrated livestock management and health-monitoring platform.

It combines digital livestock records, symptom reporting, preliminary disease-risk assessment, geographical incident monitoring and agricultural knowledge retrieval.

The goal is to improve access to useful information, encourage timely reporting and support better-informed livestock management decisions.

## 🚀 Key Features

| Feature | Description |
|---|---|
| User Authentication | Secure registration, login and role-based access. |
| Farm Management | Register farms and manage farm information and locations. |
| Livestock Management | Register cattle using identification details such as ear-tag numbers. |
| Health Reporting | Submit animal health reports and observed symptoms. |
| AI-Assisted Risk Assessment | Generate preliminary health-risk assessments from reported symptoms. |
| Vaccination Tracking | Record and monitor livestock vaccination information. |
| Disease Incident Mapping | Display reported livestock health incidents geographically. |
| Agricultural AI Assistant | Retrieve relevant information from a curated agricultural knowledge base. |
| Notifications | Provide relevant updates about reports and platform activities. |
| Administrative Dashboard | Support platform administration, user management and report oversight. |

## 👥 User Roles

HerdGuard AI supports different user roles with distinct responsibilities.

**Farmer**
- Manage farm information.
- Register and manage livestock.
- Submit animal health reports.
- View preliminary risk assessments.
- Maintain vaccination records.
- Access agricultural information.

**Veterinary / Agricultural Professional**
- Access assigned or authorized health reports.
- Review reported animal health concerns.
- Provide professional feedback where authorized.
- Support responsible livestock health monitoring.

**Administrator**
- Manage platform users and access permissions.
- Oversee reported incidents.
- Manage platform information and resources.
- Monitor administrative activities.

## 🛠️ Technology Stack

### Frontend
- React.js
- Vite
- JavaScript
- Tailwind CSS
- React Router
- Axios
- Recharts
- Leaflet / React Leaflet
- Lucide React

### Backend
- Python
- FastAPI
- SQLAlchemy
- Pydantic
- PyJWT
- bcrypt
- Uvicorn

### Database
- SQLite
- SQLAlchemy ORM

### AI and Data Processing
- Scikit-learn
- TF-IDF Vectorization
- Cosine Similarity
- Rule-based symptom and disease-risk assessment

### Testing
- Pytest

## 🤖 AI and Intelligent Features

HerdGuard AI incorporates two main intelligent components.

**1. Preliminary Disease-Risk Assessment**

The platform uses a rule-based approach to evaluate submitted symptoms and identify potential livestock health concerns.

The initial knowledge scope includes conditions such as:

- Foot-and-Mouth Disease (FMD)
- Lumpy Skin Disease
- African Redwater
- Blackquarter
- Bovine Respiratory Disease Complex

The assessment provides preliminary risk information to support awareness and reporting. It does not establish a veterinary diagnosis.

**2. Agricultural Knowledge Assistant**

The platform uses information retrieval techniques to help users access relevant agricultural and livestock health information.

The retrieval process uses:
- TF-IDF vectorization.
- Cosine similarity.
- A curated agricultural knowledge base.

The intention is to make relevant agricultural information easier for farmers to find and understand.

## 💻 Getting Started

Follow these steps to run the project locally.

### Prerequisites

Make sure you have installed:

- Python
- Node.js and npm
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR-USERNAME/HerdGuard-AI.git
```

```bash
cd HerdGuard-AI
```

### 2. Set Up the Backend

Navigate to the backend directory:

```bash
cd backend
```

Create a virtual environment:

```bash
python -m venv venv
```

Activate it on Windows:

```powershell
venv\Scripts\activate
```

Install the dependencies:

```bash
pip install -r requirements.txt
```

Configure the environment variables using the project's `.env.example` file, if provided.

Start the backend:

```bash
uvicorn app.main:app --reload
```

### 3. Set Up the Frontend

Open another terminal and navigate to the frontend directory:

```bash
cd frontend
```

Install the dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

**Note:** Confirm the directory names, entry point and commands against the actual project structure before publishing this setup guide.

## 📚 API Documentation

HerdGuard AI uses FastAPI to provide backend API services.

When the backend is running, the interactive Swagger documentation is normally available at:

```text
http://127.0.0.1:8000/docs
```

The alternative ReDoc documentation is normally available at:

```text
http://127.0.0.1:8000/redoc
```

## 🧪 Testing

The backend uses Pytest for automated testing.

Run the tests from the backend directory:

```bash
pytest
```

Tests should be run before making claims about the project's test coverage or passing test count.

## 🇿🇦 Regulatory Alignment

HerdGuard AI is designed with South African livestock health and agricultural reporting considerations in mind.

The platform aims to complement existing agricultural and veterinary reporting processes, not replace official government systems or qualified veterinary professionals.

Reported disease concerns should be handled responsibly, and suspected outbreaks must not be presented as officially confirmed without appropriate verification from the relevant authority.

## ⚕️ Disclaimer

HerdGuard AI is an agricultural information and livestock health-monitoring platform.

Its AI-assisted assessments are preliminary and are not substitutes for professional veterinary diagnosis, treatment or advice.

Farmers should contact a qualified veterinary professional or the relevant state veterinary authority when they observe concerning symptoms or suspect a notifiable animal disease.

The platform does not independently confirm disease outbreaks or authorize veterinary treatment.

---

## 🔮 Future Enhancements

Potential future improvements include:

- Support for sheep and goat livestock records.
- Mobile-friendly and offline reporting capabilities.
- Multilingual support for South African farmers.
- Improved geographical disease-monitoring capabilities.
- Integration with verified agricultural and veterinary information sources.
- Additional livestock analytics and reporting tools.

## 🤝 Contributing

Contributions, suggestions and feedback are welcome.

If you would like to contribute:

1. Fork the repository.
2. Create a new feature branch.
3. Make your changes.
4. Test your changes.
5. Submit a pull request.

## 📄 License

This project is intended to be distributed under the MIT License.

Add a `LICENSE` file containing the MIT License before publishing this claim as an active project license.

---

**HerdGuard AI 🇿🇦 — Supporting smarter livestock management and agricultural intelligence in South Africa.**
