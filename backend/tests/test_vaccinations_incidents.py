from datetime import date, timedelta

def test_vaccination_lifecycle(client, farmer_auth_headers):
    # Farm & animal
    res_farm = client.post("/api/farms", headers=farmer_auth_headers, json={
        "name": "Vac Test Farm",
        "province": "Free State",
        "municipality": "Mangaung"
    })
    farm_id = res_farm.json()["id"]

    res_an = client.post("/api/animals", headers=farmer_auth_headers, json={
        "tag_number": "VAC-TAG-101",
        "farm_id": farm_id,
        "breed": "Bonsmara",
        "sex": "Bull"
    })
    animal_id = res_an.json()["id"]

    # Record vaccination
    today = date.today()
    res_vac = client.post("/api/vaccinations", headers=farmer_auth_headers, json={
        "animal_id": animal_id,
        "farm_id": farm_id,
        "vaccine_name": "Anthrax Spore Vaccine",
        "batch_number": "BATCH-99",
        "vaccination_date": today.isoformat(),
        "next_due_date": (today + timedelta(days=365)).isoformat(),
        "administering_professional": "Dr. Test Vet",
        "status": "completed"
    })
    assert res_vac.status_code == 201
    vac = res_vac.json()
    assert vac["vaccine_name"] == "Anthrax Spore Vaccine"
    assert vac["animal_tag"] == "VAC-TAG-101"

    # Verify notification created
    res_notif = client.get("/api/notifications", headers=farmer_auth_headers)
    assert res_notif.status_code == 200
    notifs = res_notif.json()
    assert any("Vaccination Recorded" in n["title"] for n in notifs)

def test_disease_incident_and_map_endpoint(client, vet_auth_headers, farmer_auth_headers):
    today = date.today()
    res_inc = client.post("/api/disease-incidents", headers=vet_auth_headers, json={
        "disease_name": "Lumpy Skin Disease",
        "province": "Free State",
        "municipality": "Mangaung",
        "latitude": -29.1,
        "longitude": 26.2,
        "reported_date": today.isoformat(),
        "verification_status": "Professionally Reviewed",
        "affected_count": 3,
        "death_count": 0,
        "description": "Localized nodular outbreak.",
        "status": "Active"
    })
    assert res_inc.status_code == 201
    inc = res_inc.json()
    assert inc["disease_name"] == "Lumpy Skin Disease"

    # Check map data
    res_map = client.get("/api/disease-incidents/map", headers=farmer_auth_headers)
    assert res_map.status_code == 200
    map_data = res_map.json()
    assert "incidents" in map_data
    assert "farms" in map_data
    assert any(i["disease_name"] == "Lumpy Skin Disease" for i in map_data["incidents"])
