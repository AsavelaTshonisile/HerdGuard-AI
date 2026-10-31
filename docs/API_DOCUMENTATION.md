# HerdGuard AI - REST API Specifications & Reference

All API routes are prefixed under `/api`. Interactive OpenAPI / Swagger UI documentation is available at `http://127.0.0.1:8000/docs`.

---

## 1. Authentication (`/api/auth`)

| Endpoint | Method | Role | Description |
|---|---|---|---|
| `/api/auth/register` | `POST` | Public | Register farmer account and obtain JWT access token |
| `/api/auth/login` | `POST` | Public | Authenticate with email and password |
| `/api/auth/me` | `GET` | Authenticated | Retrieve current user profile and role |

---

## 2. Farm Management (`/api/farms`)

| Endpoint | Method | Role | Description |
|---|---|---|---|
| `/api/farms` | `POST` | Farmer / Admin | Register a new farm parcel with coordinates |
| `/api/farms` | `GET` | Authenticated | List farms (Farmers see own; Vets/Admins see all) |
| `/api/farms/{farm_id}` | `GET` | Authenticated | Get farm parcel details and cattle count |
| `/api/farms/{farm_id}` | `PUT` | Owner / Admin | Update farm parcel information |
| `/api/farms/{farm_id}` | `DELETE` | Owner / Admin | Delete farm parcel record |

---

## 3. Livestock Management (`/api/animals`)

| Endpoint | Method | Role | Description |
|---|---|---|---|
| `/api/animals` | `POST` | Farmer / Admin | Register cattle with unique ear tag number |
| `/api/animals` | `GET` | Authenticated | List animals with filters (`farm_id`, `status`, `search`) |
| `/api/animals/{animal_id}` | `GET` | Authenticated | Individual animal profile, health reports, & vaccinations |
| `/api/animals/{animal_id}` | `PUT` | Owner / Admin | Update animal details or clinical health status |
| `/api/animals/{animal_id}` | `DELETE` | Owner / Admin | Soft-deactivate animal to preserve historical records |

---

## 4. Livestock Health Reports (`/api/health-reports`)

| Endpoint | Method | Role | Description |
|---|---|---|---|
| `/api/health-reports` | `POST` | Farmer / Admin | Submit symptom report; triggers AI risk assessment |
| `/api/health-reports` | `GET` | Authenticated | List reports with filters (`risk_category`, `status`) |
| `/api/health-reports/{report_id}` | `GET` | Authenticated | Full report details, AI explanation, & reviews |
| `/api/health-reports/{report_id}` | `PUT` | Owner / Admin | Update report observations |
| `/api/health-reports/{report_id}/review` | `POST` | Professional / Admin | Add professional clinical observations & update status |

---

## 5. Vaccinations (`/api/vaccinations`)

| Endpoint | Method | Role | Description |
|---|---|---|---|
| `/api/vaccinations` | `POST` | Authenticated | Log immunization; calculates upcoming/overdue status |
| `/api/vaccinations` | `GET` | Authenticated | List vaccination history with farm and animal filters |
| `/api/vaccinations/{id}` | `PUT` | Authenticated | Update vaccination record |
| `/api/vaccinations/{id}` | `DELETE` | Authenticated | Delete vaccination entry |

---

## 6. Disease Incidents & GIS Surveillance (`/api/disease-incidents`)

| Endpoint | Method | Role | Description |
|---|---|---|---|
| `/api/disease-incidents` | `POST` | Authenticated | Report suspected or investigated disease incident |
| `/api/disease-incidents` | `GET` | Authenticated | List incidents with province and verification filters |
| `/api/disease-incidents/map` | `GET` | Authenticated | Optimized GeoJSON/marker payload for Leaflet map |
| `/api/disease-incidents/{id}` | `PUT` | Professional / Admin | Update incident verification status or containment |

---

## 7. AI & Agricultural Intelligence (`/api/ai`)

| Endpoint | Method | Role | Description |
|---|---|---|---|
| `/api/ai/health-assessment` | `POST` | Authenticated | Interactive syndromic risk assessment |
| `/api/ai/assistant` | `POST` | Authenticated | RAG conversational assistant with DALRRD citations |

---

## 8. Dashboard Analytics (`/api/dashboard`)

| Endpoint | Method | Role | Description |
|---|---|---|---|
| `/api/dashboard/farmer` | `GET` | Farmer | Real-time database metrics, Recharts trends, & activity |
| `/api/dashboard/professional` | `GET` | Professional / Admin | Review queue, urgent reports, & provincial surveillance |
| `/api/dashboard/admin` | `GET` | Admin | Overall user, farm, cattle, and system audit statistics |

---

## 9. Knowledge Resources & Audit (`/api/knowledge-resources`, `/api/activity-logs`)

| Endpoint | Method | Role | Description |
|---|---|---|---|
| `/api/knowledge-resources` | `GET` | Public / Auth | Browse verified DALRRD & ARC guidelines |
| `/api/knowledge-resources` | `POST` | Professional / Admin | Add new verified knowledge document |
| `/api/activity-logs` | `GET` | Admin | Retrieve immutable platform event audit logs |

---

## 10. User & Veterinary Account Provisioning (`/api/users`)

| Endpoint | Method | Role | Description |
|---|---|---|---|
| `/api/users` | `GET` | Admin | List all registered and provisioned accounts |
| `/api/users/{user_id}` | `GET` | Owner / Admin | Retrieve individual user profile |
| `/api/users/{user_id}` | `PUT` | Owner / Admin | Update user details or activate/deactivate account |
| `/api/users/professional` | `POST` | Admin | Provision veterinary professional account with admin-assigned credentials |

