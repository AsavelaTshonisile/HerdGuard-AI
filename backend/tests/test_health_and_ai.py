from datetime import date

def test_submit_health_report_with_ai_assessment(client, farmer_auth_headers):
    # Create farm
    res_farm = client.post("/api/farms", headers=farmer_auth_headers, json={
        "name": "Health Test Farm",
        "province": "Eastern Cape",
        "municipality": "Chris Hani",
        "farm_type": "communal"
    })
    farm_id = res_farm.json()["id"]

    # Submit health report with acute vesicular pattern
    res_rep = client.post("/api/health-reports", headers=farmer_auth_headers, json={
        "farm_id": farm_id,
        "symptoms": ["mouth_lesions", "excessive_salivation", "lameness"],
        "first_noticed_date": date.today().isoformat(),
        "severity": "severe",
        "duration_days": 2,
        "additional_observations": "Severe drooling and lip smacking."
    })
    assert res_rep.status_code == 201
    report = res_rep.json()
    assert report["reference_number"].startswith("HG-")
    assert report["risk_category"] == "Urgent Attention Required"
    assert report["status"] == "Professional Review Required"
    assert report["ai_assessment"] is not None
    assert "safety_disclaimer" in report["ai_assessment"] or "disclaimer" in report["ai_assessment"]
    assert report["ai_assessment"]["veterinary_referral_advisable"] is True

def test_professional_review_report(client, farmer_auth_headers, vet_auth_headers):
    # Farmer submits report
    res_farm = client.post("/api/farms", headers=farmer_auth_headers, json={
        "name": "Review Test Farm",
        "province": "Eastern Cape",
        "municipality": "Chris Hani"
    })
    farm_id = res_farm.json()["id"]

    res_rep = client.post("/api/health-reports", headers=farmer_auth_headers, json={
        "farm_id": farm_id,
        "symptoms": ["loss_of_appetite", "fever"],
        "first_noticed_date": date.today().isoformat(),
        "severity": "moderate",
        "duration_days": 1
    })
    report_id = res_rep.json()["id"]

    # Professional reviews the report
    res_rev = client.post(f"/api/health-reports/{report_id}/review", headers=vet_auth_headers, json={
        "observations": "Inspected animal; mucosal temperature 40.2C. Suspect mild tick-borne challenge.",
        "recommended_actions": "Administer approved antipyretic supportive care and observe rumination.",
        "new_report_status": "Action Recommended",
        "official_case_reference": "VET-REF-001"
    })
    assert res_rev.status_code == 200
    rev_data = res_rev.json()
    assert rev_data["status"] == "Action Recommended"
    assert len(rev_data["reviews"]) >= 1
    assert rev_data["reviews"][0]["observations"].startswith("Inspected animal")

def test_standalone_ai_health_assessment(client, farmer_auth_headers):
    res = client.post("/api/ai/health-assessment", headers=farmer_auth_headers, json={
        "symptoms": ["skin_nodules", "fever", "swelling"],
        "severity": "severe",
        "duration_days": 3,
        "species": "cattle",
        "breed": "Bonsmara"
    })
    assert res.status_code == 200
    data = res.json()
    assert data["risk_category"] in ["High Risk", "Urgent Attention Required"]
    assert data["veterinary_referral_advisable"] is True
    assert "DISCLAIMER" in data["safety_disclaimer"].upper()

def test_ai_agricultural_assistant_rag(client, farmer_auth_headers):
    res = client.post("/api/ai/assistant", headers=farmer_auth_headers, json={
        "query": "What are the common signs of Foot and Mouth Disease in cattle?",
        "category": "Biosecurity"
    })
    assert res.status_code == 200
    data = res.json()
    assert "answer" in data
    assert len(data["answer"]) > 20
    assert len(data["citations"]) >= 1
    assert "advisory_notice" in data
    assert len(data["suggested_followups"]) >= 1
