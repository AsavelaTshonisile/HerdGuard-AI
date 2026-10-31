def test_create_and_get_farm(client, farmer_auth_headers):
    # Create farm
    res = client.post("/api/farms", headers=farmer_auth_headers, json={
        "name": "Sunshine Cattle Ranch",
        "province": "Free State",
        "municipality": "Mangaung",
        "latitude": -29.1,
        "longitude": 26.2,
        "farm_type": "commercial",
        "total_area_hectares": 350.0
    })
    assert res.status_code == 201
    farm = res.json()
    assert farm["name"] == "Sunshine Cattle Ranch"
    farm_id = farm["id"]

    # List farms
    res_list = client.get("/api/farms", headers=farmer_auth_headers)
    assert res_list.status_code == 200
    farms = res_list.json()
    assert any(f["id"] == farm_id for f in farms)

def test_animal_registration_and_duplicate_check(client, farmer_auth_headers):
    # First get or create a farm
    res_farm = client.post("/api/farms", headers=farmer_auth_headers, json={
        "name": "Bonsmara Breeding Farm",
        "province": "Free State",
        "municipality": "Mangaung",
        "farm_type": "smallholder"
    })
    farm_id = res_farm.json()["id"]

    # Register animal
    res_animal = client.post("/api/animals", headers=farmer_auth_headers, json={
        "tag_number": "TEST-TAG-001",
        "name": "Bessie",
        "farm_id": farm_id,
        "species": "cattle",
        "breed": "Bonsmara",
        "sex": "Female",
        "approximate_age_months": 24,
        "health_status": "healthy"
    })
    assert res_animal.status_code == 201
    animal = res_animal.json()
    assert animal["tag_number"] == "TEST-TAG-001"
    assert animal["farm_name"] == "Bonsmara Breeding Farm"

    # Attempt duplicate registration with same tag_number
    res_dup = client.post("/api/animals", headers=farmer_auth_headers, json={
        "tag_number": "TEST-TAG-001",
        "name": "Another Bessie",
        "farm_id": farm_id,
        "species": "cattle",
        "breed": "Nguni",
        "sex": "Female",
        "health_status": "healthy"
    })
    assert res_dup.status_code == 400
    assert "already registered" in res_dup.json()["detail"]

def test_animal_profile_and_filters(client, farmer_auth_headers):
    # List animals with search
    res = client.get("/api/animals?search=TEST-TAG-001", headers=farmer_auth_headers)
    assert res.status_code == 200
    data = res.json()
    assert len(data) >= 1
    animal_id = data[0]["id"]

    # Get animal profile
    res_profile = client.get(f"/api/animals/{animal_id}", headers=farmer_auth_headers)
    assert res_profile.status_code == 200
    profile = res_profile.json()
    assert "animal" in profile
    assert profile["animal"]["tag_number"] == "TEST-TAG-001"
    assert "health_reports" in profile
    assert "vaccinations" in profile
