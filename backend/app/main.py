from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.database.init_db import init_db
from app.api.routes import (
    auth,
    users,
    farms,
    animals,
    health_reports,
    vaccinations,
    disease_incidents,
    notifications,
    ai,
    dashboard,
    knowledge,
    activity_logs
)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Ensure database tables exist on startup
    init_db()
    yield

app = FastAPI(
    title="HerdGuard AI API",
    description=(
        "Intelligent Livestock Health Monitoring, Disease-Risk Awareness & Agricultural Intelligence Platform "
        "designed to support South African farmers, agricultural extension officers, and veterinary professionals."
    ),
    version="1.0.0",
    lifespan=lifespan
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all in development, configurable via settings in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register API routes
app.include_router(auth.router, prefix=settings.API_V1_STR)
app.include_router(users.router, prefix=settings.API_V1_STR)
app.include_router(farms.router, prefix=settings.API_V1_STR)
app.include_router(animals.router, prefix=settings.API_V1_STR)
app.include_router(health_reports.router, prefix=settings.API_V1_STR)
app.include_router(vaccinations.router, prefix=settings.API_V1_STR)
app.include_router(disease_incidents.router, prefix=settings.API_V1_STR)
app.include_router(notifications.router, prefix=settings.API_V1_STR)
app.include_router(ai.router, prefix=settings.API_V1_STR)
app.include_router(dashboard.router, prefix=settings.API_V1_STR)
app.include_router(knowledge.router, prefix=settings.API_V1_STR)
app.include_router(activity_logs.router, prefix=settings.API_V1_STR)

@app.get("/")
def root():
    return {
        "project": "HerdGuard AI",
        "description": "Livestock Health Monitoring & Disease-Risk Intelligence Platform for South Africa",
        "status": "online",
        "docs_url": "/docs",
        "version": "1.0.0"
    }

@app.get("/api/health")
def health_check():
    return {"status": "healthy", "service": "HerdGuard AI Backend"}
