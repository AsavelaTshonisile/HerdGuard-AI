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
