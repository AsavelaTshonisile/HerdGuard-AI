def test_role_authorization_restrictions(client, farmer_auth_headers, vet_auth_headers, admin_auth_headers):
    # Farmer attempting to access admin-only users list
    res_forbidden = client.get("/api/users", headers=farmer_auth_headers)
    assert res_forbidden.status_code == 403
    assert "Operation not permitted" in res_forbidden.json()["detail"]

    # Farmer attempting to access admin dashboard
    res_dash_forbidden = client.get("/api/dashboard/admin", headers=farmer_auth_headers)
    assert res_dash_forbidden.status_code == 403

    # Admin accessing users list
    res_admin_ok = client.get("/api/users", headers=admin_auth_headers)
    assert res_admin_ok.status_code == 200

    # Unauthenticated request
    res_no_auth = client.get("/api/auth/me")
    assert res_no_auth.status_code == 401

def test_farmer_dashboard_statistics(client, farmer_auth_headers):
    res = client.get("/api/dashboard/farmer", headers=farmer_auth_headers)
    assert res.status_code == 200
    data = res.json()
    assert "total_livestock" in data
    assert "healthy_animals" in data
    assert "submitted_reports" in data
    assert "health_status_distribution" in data
    assert "breed_distribution" in data
    assert "reports_timeline" in data

def test_professional_dashboard_statistics(client, vet_auth_headers):
    res = client.get("/api/dashboard/professional", headers=vet_auth_headers)
    assert res.status_code == 200
    data = res.json()
    assert "pending_reviews_count" in data
    assert "recent_reports" in data
    assert "incidents_by_province" in data

def test_admin_dashboard_statistics(client, admin_auth_headers):
    res = client.get("/api/dashboard/admin", headers=admin_auth_headers)
    assert res.status_code == 200
    data = res.json()
    assert "total_users" in data
    assert "total_farms" in data
    assert "total_livestock" in data
    assert "total_health_reports" in data
