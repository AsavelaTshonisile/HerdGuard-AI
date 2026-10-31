"""
HerdGuard AI - Development & Demonstration Seed Data Script
Creates demonstration accounts, farms, livestock, vaccination records, health reports,
disease incidents, notifications, and knowledge resources.

DEMONSTRATION CREDENTIALS:
1. Farmer:
   Email: farmer@herdguard.co.za
   Password: Password123!
   Role: farmer

2. Agricultural Professional / Veterinarian:
   Email: vet@herdguard.co.za
   Password: Password123!
   Role: professional

3. System Administrator:
   Email: admin@herdguard.co.za
   Password: Password123!
   Role: admin
"""

import json
from datetime import date, datetime, timedelta, timezone
from app.database.session import SessionLocal
from app.database.init_db import init_db
from app.core.security import get_password_hash
from app.models.user import User
from app.models.farm import Farm
from app.models.animal import Animal
from app.models.health_report import HealthReport
from app.models.professional_review import ProfessionalReview
from app.models.vaccination import Vaccination
from app.models.disease_incident import DiseaseIncident
from app.models.notification import Notification
from app.models.knowledge import KnowledgeResource
from app.models.activity_log import ActivityLog
from app.ai.risk_assessment_engine import RiskAssessmentEngine
from app.ai.assistant_rag import DEFAULT_KNOWLEDGE_DOCS

def seed():
    print("Initializing database tables...")
    init_db()
    db = SessionLocal()

    try:
        # Check if already seeded
        existing_admin = db.query(User).filter(User.email == "admin@herdguard.co.za").first()
        if existing_admin:
            print("Database already contains seed data. Skipping seed script.")
            return

        print("Seeding demonstration users...")
        pw_hash = get_password_hash("Password123!")

        # 1. Administrator
        admin_user = User(
            email="admin@herdguard.co.za",
            hashed_password=pw_hash,
            full_name="Kagiso Modise (System Admin)",
            phone_number="+27 82 100 0001",
            role="admin",
            organization_or_practice="HerdGuard AI Operations",
            province="Gauteng",
            is_active=True
        )
        db.add(admin_user)

        # 2. Agricultural Professional / Veterinarian
        vet_user = User(
            email="vet@herdguard.co.za",
            hashed_password=pw_hash,
            full_name="Dr. Thabo Ndlovu, BVSc",
            phone_number="+27 83 200 0002",
            role="professional",
            organization_or_practice="Eastern Cape Provincial Veterinary Services",
            province="Eastern Cape",
            is_active=True
        )
        db.add(vet_user)

        # 3. Farmer
        farmer_user = User(
            email="farmer@herdguard.co.za",
            hashed_password=pw_hash,
            full_name="Sipho Mthembu",
            phone_number="+27 84 300 0003",
            role="farmer",
            organization_or_practice="Mthembu Family Livestock Enterprise",
            province="Free State",
            is_active=True
        )
        db.add(farmer_user)

        db.commit()
        db.refresh(admin_user)
        db.refresh(vet_user)
        db.refresh(farmer_user)

        print("Seeding demonstration farms...")
        # Farm 1 (Free State - Mangaung)
        farm_1 = Farm(
            name="Vredehoek Cattle Farm",
            owner_id=farmer_user.id,
            province="Free State",
            municipality="Mangaung Metropolitan",
            address="Plot 14, Bainsvlei District, Bloemfontein",
            latitude=-29.0852,
            longitude=26.1596,
            farm_type="commercial",
            total_area_hectares=450.0
        )
        db.add(farm_1)

        # Farm 2 (Eastern Cape - Chris Hani)
        farm_2 = Farm(
            name="Zwelitsha Communal Pastures",
            owner_id=farmer_user.id,
            province="Eastern Cape",
            municipality="Chris Hani District",
            address="R61 Corridor, Cofimvaba Area",
            latitude=-32.0028,
            longitude=27.5819,
            farm_type="communal",
            total_area_hectares=120.0
        )
        db.add(farm_2)

        db.commit()
        db.refresh(farm_1)
        db.refresh(farm_2)

        print("Seeding demonstration cattle records...")
        cattle_data = [
            # Farm 1
            {
                "tag_number": "ZA-FS-2024-001",
                "name": "Bonsmara Heifer Alpha",
                "farm_id": farm_1.id,
                "breed": "Bonsmara",
                "sex": "Heifer",
                "date_of_birth": date(2023, 4, 15),
                "approximate_age_months": 30,
                "weight_kg": 420.5,
                "health_status": "healthy",
                "additional_notes": "First calf expected autumn. Fully vaccinated."
            },
            {
                "tag_number": "ZA-FS-2024-002",
                "name": "Bonsmara Cow Brenda",
                "farm_id": farm_1.id,
                "breed": "Bonsmara",
                "sex": "Cow",
                "date_of_birth": date(2021, 9, 10),
                "approximate_age_months": 49,
                "weight_kg": 540.0,
                "health_status": "healthy",
                "additional_notes": "High milk producer. Mother of tag ZA-FS-2024-001."
            },
            {
                "tag_number": "ZA-FS-2024-003",
                "name": "Stud Bull Goliath",
                "farm_id": farm_1.id,
                "breed": "Bonsmara",
                "sex": "Bull",
                "date_of_birth": date(2020, 11, 20),
                "approximate_age_months": 59,
                "weight_kg": 810.0,
                "health_status": "healthy",
                "additional_notes": "Registered stud bull. Inspected by breed society."
            },
            {
                "tag_number": "ZA-FS-2024-004",
                "name": "Nguni Steer Dumisa",
                "farm_id": farm_1.id,
                "breed": "Nguni",
                "sex": "Steer",
                "date_of_birth": date(2023, 2, 8),
                "approximate_age_months": 32,
                "weight_kg": 380.0,
                "health_status": "monitoring",
                "additional_notes": "Recovered from mild stiffness last week."
            },
            # Farm 2
            {
                "tag_number": "ZA-EC-2024-010",
                "name": "Nguni Cow Nolwazi",
                "farm_id": farm_2.id,
                "breed": "Nguni",
                "sex": "Cow",
                "date_of_birth": date(2022, 6, 12),
                "approximate_age_months": 40,
                "weight_kg": 410.0,
                "health_status": "sick",
                "additional_notes": "Observed with fever and lameness."
            },
            {
                "tag_number": "ZA-EC-2024-011",
                "name": "Brahman Cross Jabulani",
                "farm_id": farm_2.id,
                "breed": "Brahman Cross",
                "sex": "Bull",
                "date_of_birth": date(2022, 8, 30),
                "approximate_age_months": 38,
                "weight_kg": 590.0,
                "health_status": "healthy",
                "additional_notes": "Strong hardy communal grazing bull."
            }
        ]

        created_animals = []
        for c in cattle_data:
            animal = Animal(
                tag_number=c["tag_number"],
                name=c["name"],
                farm_id=c["farm_id"],
                species="cattle",
                breed=c["breed"],
                sex=c["sex"],
                date_of_birth=c["date_of_birth"],
                approximate_age_months=c["approximate_age_months"],
                weight_kg=c["weight_kg"],
                health_status=c["health_status"],
                additional_notes=c["additional_notes"],
                is_active=True
            )
            db.add(animal)
            created_animals.append(animal)

        db.commit()
        for a in created_animals:
            db.refresh(a)

        print("Seeding demonstration vaccination records...")
        today = date.today()
        vac_records = [
            Vaccination(
                animal_id=created_animals[0].id,
                farm_id=farm_1.id,
                vaccine_name="Anthrax Spore Vaccine (Onderstepoort)",
                batch_number="ANT-2024-08",
                vaccination_date=today - timedelta(days=120),
                next_due_date=today + timedelta(days=245),
                administering_professional="Dr. Thabo Ndlovu",
                notes="Annual booster administered without side effects.",
                status="completed"
            ),
            Vaccination(
                animal_id=created_animals[0].id,
                farm_id=farm_1.id,
                vaccine_name="Brucellosis S19 Strain",
                batch_number="BRU-2023-41",
                vaccination_date=today - timedelta(days=500),
                next_due_date=today + timedelta(days=365),
                administering_professional="Eastern Cape State Vet",
                notes="Compulsory heifer inoculation completed.",
                status="completed"
            ),
            Vaccination(
                animal_id=created_animals[1].id,
                farm_id=farm_1.id,
                vaccine_name="Blackquarter (Clostridium chauvoei)",
                batch_number="BQ-2024-11",
                vaccination_date=today - timedelta(days=340),
                next_due_date=today + timedelta(days=25),  # Upcoming within 30 days!
                administering_professional="Sipho Mthembu",
                notes="Booster scheduled for next month before rainy season.",
                status="completed"
            ),
            Vaccination(
                animal_id=created_animals[3].id,
                farm_id=farm_1.id,
                vaccine_name="Lumpy Skin Disease (Neethling strain)",
                batch_number="LSD-2023-99",
                vaccination_date=today - timedelta(days=380),
                next_due_date=today - timedelta(days=15),  # Overdue!
                administering_professional=None,
                notes="Annual spring booster was delayed due to transport logistics.",
                status="overdue"
            ),
            Vaccination(
                animal_id=created_animals[4].id,
                farm_id=farm_2.id,
                vaccine_name="Rift Valley Fever (Clone 13)",
                batch_number="RVF-2024-03",
                vaccination_date=today - timedelta(days=90),
                next_due_date=today + timedelta(days=275),
                administering_professional="Dr. Thabo Ndlovu",
                notes="Routine herd protection for communal pasturage.",
                status="completed"
            )
        ]
        for v in vac_records:
            db.add(v)
        db.commit()

        print("Seeding demonstration health reports and AI assessments...")
        # Report 1: Mild monitoring report
        syms_1 = ["loss_of_appetite", "reduced_milk_production"]
        assessment_1 = RiskAssessmentEngine.assess_health_risk(
            symptoms=syms_1,
            severity="mild",
            duration_days=2,
            species="cattle",
            breed="Bonsmara",
            province="Free State"
        )
        report_1 = HealthReport(
            reference_number="HG-2026-1042",
            farm_id=farm_1.id,
            animal_id=created_animals[1].id,
            reporter_id=farmer_user.id,
            symptoms=json.dumps(syms_1),
            first_noticed_date=today - timedelta(days=5),
            severity="mild",
            duration_days=2,
            additional_observations="Milk yield dropped by approximately 4 litres over two milkings.",
            risk_category=assessment_1["risk_category"],
            ai_assessment_json=json.dumps(assessment_1),
            status="Under Review"
        )
        db.add(report_1)

        # Report 2: Urgent Attention Required report (LSD / Lameness / Mouth lesions suspect pattern)
        syms_2 = ["mouth_lesions", "excessive_salivation", "lameness"]
        assessment_2 = RiskAssessmentEngine.assess_health_risk(
            symptoms=syms_2,
            severity="severe",
            duration_days=3,
            species="cattle",
            breed="Nguni",
            province="Eastern Cape"
        )
        report_2 = HealthReport(
            reference_number="HG-2026-1088",
            farm_id=farm_2.id,
            animal_id=created_animals[4].id,
            reporter_id=farmer_user.id,
            symptoms=json.dumps(syms_2),
            first_noticed_date=today - timedelta(days=3),
            severity="severe",
            duration_days=3,
            additional_observations="Animal isolated in holding camp. Excessive frothing at mouth and reluctant to step with front left foot.",
            risk_category=assessment_2["risk_category"],
            ai_assessment_json=json.dumps(assessment_2),
            status="Action Recommended"
        )
        db.add(report_2)
        db.commit()
        db.refresh(report_1)
        db.refresh(report_2)

        # Add professional review for Report 2
        rev = ProfessionalReview(
            report_id=report_2.id,
            reviewer_id=vet_user.id,
            observations=(
                "Visited Zwelitsha holding pen on site. Inspected oral cavity and coronet band. "
                "Superficial mucosal erosions noted. Epithelial swabs collected for formal provincial diagnostic laboratory submission. "
                "Initial differential: Bovine Papular Stomatitis vs notifiable vesicular consideration."
            ),
            recommended_actions=(
                "1. Strictly maintain quarantine of affected camp.\n"
                "2. Apply disinfectant footbath at camp entrance.\n"
                "3. Monitor remaining herd twice daily for salivation or lameness.\n"
                "4. Awaiting regional laboratory confirmatory PCR result."
            ),
            follow_up_date=today + timedelta(days=2),
            new_report_status="Action Recommended",
            official_case_reference="EC-VET-2026-CH-044"
        )
        db.add(rev)
        db.commit()

        print("Seeding demonstration disease incident records...")
        incidents = [
            DiseaseIncident(
                disease_name="Lumpy Skin Disease",
                farm_id=farm_1.id,
                reporter_id=vet_user.id,
                province="Free State",
                municipality="Mangaung Metropolitan",
                latitude=-29.1100,
                longitude=26.2200,
                reported_date=today - timedelta(days=14),
                verification_status="Professionally Reviewed",
                affected_count=4,
                death_count=0,
                description="Cluster of nodular skin eruptions observed following recent heavy rainfall and high mosquito activity.",
                status="Contained",
                official_notice_url="https://www.dalrrd.gov.za"
            ),
            DiseaseIncident(
                disease_name="Foot and Mouth Disease (Suspected Investigation)",
                farm_id=farm_2.id,
                reporter_id=vet_user.id,
                province="Eastern Cape",
                municipality="Chris Hani District",
                latitude=-32.0150,
                longitude=27.5600,
                reported_date=today - timedelta(days=3),
                verification_status="Suspected",
                affected_count=2,
                death_count=0,
                description="Precautionary containment zone activated pending provincial veterinary laboratory confirmation.",
                status="Active",
                official_notice_url=None
            ),
            DiseaseIncident(
                disease_name="African Redwater (Babesiosis)",
                farm_id=None,
                reporter_id=vet_user.id,
                province="KwaZulu-Natal",
                municipality="uMgungundlovu District",
                latitude=-29.6006,
                longitude=30.3794,
                reported_date=today - timedelta(days=22),
                verification_status="Professionally Reviewed",
                affected_count=6,
                death_count=1,
                description="Outbreak in non-immune dairy stock moved into high blue-tick area. Acaricide dipping regimen initiated.",
                status="Resolved",
                official_notice_url=None
            ),
            DiseaseIncident(
                disease_name="Rift Valley Fever (Preventive Surveillance)",
                farm_id=None,
                reporter_id=admin_user.id,
                province="Northern Cape",
                municipality="Pixley ka Seme",
                latitude=-30.6500,
                longitude=24.0000,
                reported_date=today - timedelta(days=45),
                verification_status="Official Outbreak",
                affected_count=8,
                death_count=2,
                description="Official seasonal surveillance notice issued by DALRRD following pan flooding.",
                status="Contained",
                official_notice_url="https://www.dalrrd.gov.za/branches/animal-health"
            )
        ]
        for inc in incidents:
            db.add(inc)
        db.commit()

        print("Seeding curated agricultural knowledge resources...")
        for doc in DEFAULT_KNOWLEDGE_DOCS:
            kr = KnowledgeResource(
                title=doc["title"],
                source_organization=doc["source_organization"],
                category=doc["category"],
                content=doc["content"],
                summary=doc["summary"],
                source_url=doc.get("source_url"),
                publication_date=today - timedelta(days=180),
                verification_status="Verified Official",
                is_active=True
            )
            db.add(kr)
        db.commit()

        print("Seeding initial notifications...")
        notifications_data = [
            Notification(
                user_id=farmer_user.id,
                title="Vaccination Due Soon: Blackquarter",
                message="Booster vaccination for Bonsmara Cow Brenda (ZA-FS-2024-002) is due in 25 days.",
                category="vaccination",
                reference_id=str(vac_records[2].id),
                is_read=False
            ),
            Notification(
                user_id=farmer_user.id,
                title="Professional Review Completed",
                message="Dr. Thabo Ndlovu submitted observations for report HG-2026-1088. Please review the recommendations.",
                category="health_report",
                reference_id=str(report_2.id),
                is_read=False
            ),
            Notification(
                user_id=farmer_user.id,
                title="Biosecurity Notice: Eastern Cape",
                message="Suspected vesicular investigation in Chris Hani District. Review herd biosecurity guidelines.",
                category="disease_alert",
                reference_id=str(incidents[1].id),
                is_read=True
            ),
            Notification(
                user_id=vet_user.id,
                title="Urgent Health Report Assigned",
                message="Health Report HG-2026-1088 has an Urgent Attention Required risk rating in your district.",
                category="disease_alert",
                reference_id=str(report_2.id),
                is_read=False
            )
        ]
        for n in notifications_data:
            db.add(n)
        db.commit()

        # Seed initial activity logs
        activities = [
            ActivityLog(user_id=farmer_user.id, action="LOGIN", entity_type="User", entity_id=str(farmer_user.id), details="Demonstration farmer logged in"),
            ActivityLog(user_id=farmer_user.id, action="CREATE_FARM", entity_type="Farm", entity_id=str(farm_1.id), details="Created Vredehoek Cattle Farm"),
            ActivityLog(user_id=farmer_user.id, action="CREATE_ANIMAL", entity_type="Animal", entity_id=str(created_animals[0].id), details="Registered tag ZA-FS-2024-001"),
            ActivityLog(user_id=farmer_user.id, action="SUBMIT_HEALTH_REPORT", entity_type="HealthReport", entity_id=str(report_2.id), details="Submitted urgent report HG-2026-1088"),
            ActivityLog(user_id=vet_user.id, action="REVIEW_HEALTH_REPORT", entity_type="HealthReport", entity_id=str(report_2.id), details="Professional review added by Dr. Thabo Ndlovu")
        ]
        for a in activities:
            db.add(a)
        db.commit()

        print("Database seeded successfully with professional demonstration data!")

    finally:
        db.close()

if __name__ == "__main__":
    seed()
