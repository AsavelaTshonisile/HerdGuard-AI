import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.database.session import Base
from app.api.deps import get_db as deps_get_db
from app.database.session import get_db as session_get_db
from app.core.security import create_access_token, get_password_hash
from app.models.user import User

# In-memory or temporary SQLite database for testing
TEST_DATABASE_URL = "sqlite:///./tests/test_herdguard.db"

engine = create_engine(TEST_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

@pytest.fixture(scope="session", autouse=True)
def setup_test_db():
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    db = TestingSessionLocal()
    
    # Create test users
    pw = get_password_hash("TestPass123!")
    farmer = User(
        email="test_farmer@example.com",
        hashed_password=pw,
        full_name="Test Farmer",
        role="farmer",
        province="Free State",
        is_active=True
    )
    vet = User(
        email="test_vet@example.com",
        hashed_password=pw,
        full_name="Dr. Test Vet",
        role="professional",
        province="Eastern Cape",
        is_active=True
    )
    admin = User(
        email="test_admin@example.com",
        hashed_password=pw,
        full_name="Test Admin",
        role="admin",
        province="Gauteng",
        is_active=True
    )
    from app.core.config import settings
    builtin_admin = User(
        email=settings.DEFAULT_ADMIN_EMAIL.lower(),
        hashed_password=get_password_hash(settings.DEFAULT_ADMIN_PASSWORD),
        full_name=settings.DEFAULT_ADMIN_NAME,
        role="admin",
        province="Gauteng",
        is_active=True
    )
    db.add_all([farmer, vet, admin, builtin_admin])
    db.commit()
    db.close()
    yield
    Base.metadata.drop_all(bind=engine)

def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()

from app.main import app

app.dependency_overrides[deps_get_db] = override_get_db
app.dependency_overrides[session_get_db] = override_get_db

@pytest.fixture
def client():
    return TestClient(app)

@pytest.fixture
def farmer_token():
    db = TestingSessionLocal()
    user = db.query(User).filter(User.email == "test_farmer@example.com").first()
    db.close()
    return create_access_token(subject=user.id, role="farmer")

@pytest.fixture
def vet_token():
    db = TestingSessionLocal()
    user = db.query(User).filter(User.email == "test_vet@example.com").first()
    db.close()
    return create_access_token(subject=user.id, role="professional")

@pytest.fixture
def admin_token():
    db = TestingSessionLocal()
    user = db.query(User).filter(User.email == "test_admin@example.com").first()
    db.close()
    return create_access_token(subject=user.id, role="admin")

@pytest.fixture
def farmer_auth_headers(farmer_token):
    return {"Authorization": f"Bearer {farmer_token}"}

@pytest.fixture
def vet_auth_headers(vet_token):
    return {"Authorization": f"Bearer {vet_token}"}

@pytest.fixture
def admin_auth_headers(admin_token):
    return {"Authorization": f"Bearer {admin_token}"}
