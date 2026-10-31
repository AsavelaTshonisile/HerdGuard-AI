def test_register_user(client):
    res = client.post("/api/auth/register", json={
        "email": "new_farmer@example.com",
        "password": "SecurePassword123!",
        "full_name": "New Farmer",
        "phone_number": "+27 82 555 1234",
        "role": "farmer",
        "province": "KwaZulu-Natal"
    })
    assert res.status_code == 201
    data = res.json()
    assert "access_token" in data
    assert data["user"]["email"] == "new_farmer@example.com"
    assert data["user"]["role"] == "farmer"

def test_register_duplicate_email(client):
    res = client.post("/api/auth/register", json={
        "email": "test_farmer@example.com",
        "password": "Password123!",
        "full_name": "Duplicate Farmer",
        "role": "farmer"
    })
    assert res.status_code == 400
    assert "already exists" in res.json()["detail"]

def test_login_success(client):
    res = client.post("/api/auth/login", json={
        "email": "test_farmer@example.com",
        "password": "TestPass123!"
    })
    assert res.status_code == 200
    data = res.json()
    assert "access_token" in data
    assert data["user"]["email"] == "test_farmer@example.com"

def test_login_invalid_password(client):
    res = client.post("/api/auth/login", json={
        "email": "test_farmer@example.com",
        "password": "WrongPassword!"
    })
    assert res.status_code == 401
    assert "Incorrect email or password" in res.json()["detail"]

def test_get_current_user_me(client, farmer_auth_headers):
    res = client.get("/api/auth/me", headers=farmer_auth_headers)
    assert res.status_code == 200
    data = res.json()
    assert data["email"] == "test_farmer@example.com"
    assert data["role"] == "farmer"

def test_public_registration_rejects_professional_role(client):
    res = client.post("/api/auth/register", json={
        "email": "unauthorized_vet@example.com",
        "password": "Password123!",
        "full_name": "Attempted Self Register Vet",
        "role": "professional",
        "province": "Gauteng"
    })
    assert res.status_code == 400
    assert "strictly reserved for farmers" in res.json()["detail"]

def test_builtin_admin_login(client):
    from app.core.config import settings
    res = client.post("/api/auth/login", json={
        "email": settings.DEFAULT_ADMIN_EMAIL,
        "password": settings.DEFAULT_ADMIN_PASSWORD
    })
    assert res.status_code == 200
    data = res.json()
    assert "access_token" in data
    assert data["user"]["email"] == settings.DEFAULT_ADMIN_EMAIL.lower()
    assert data["user"]["role"] == "admin"

def test_admin_provision_vet_and_vet_login(client, admin_auth_headers):
    # 1. Admin provisions vet with assigned credentials
    assigned_email = "provisioned_vet@herdguard.co.za"
    assigned_password = "VetAssignedPass2026!"

    res = client.post("/api/users/professional", headers=admin_auth_headers, json={
        "email": assigned_email,
        "password": assigned_password,
        "full_name": "Dr. Nomvula Sithole, BVSc",
        "phone_number": "+27 82 999 4321",
        "province": "Limpopo",
        "organization_or_practice": "State Veterinary Directorate"
    })
    assert res.status_code == 201
    created_vet = res.json()
    assert created_vet["email"] == assigned_email
    assert created_vet["role"] == "professional"
    assert created_vet["full_name"] == "Dr. Nomvula Sithole, BVSc"

    # 2. Vet logs in using admin-assigned password
    login_res = client.post("/api/auth/login", json={
        "email": assigned_email,
        "password": assigned_password
    })
    assert login_res.status_code == 200
    login_data = login_res.json()
    assert "access_token" in login_data
    assert login_data["user"]["email"] == assigned_email
    assert login_data["user"]["role"] == "professional"

    # 3. Vet can access their /me endpoint
    vet_token = login_data["access_token"]
    me_res = client.get("/api/auth/me", headers={"Authorization": f"Bearer {vet_token}"})
    assert me_res.status_code == 200
    assert me_res.json()["role"] == "professional"

def test_farmer_cannot_provision_vet(client, farmer_auth_headers):
    res = client.post("/api/users/professional", headers=farmer_auth_headers, json={
        "email": "rogue_vet@herdguard.co.za",
        "password": "Password123!",
        "full_name": "Rogue Vet",
        "province": "Gauteng"
    })
    assert res.status_code == 403

