"""
HerdGuard AI - Preliminary Livestock Health Risk Assessment Engine
Designed specifically for South African livestock health context (cattle focus).

SAFETY & REGULATORY NOTICE:
- Assessments produced by this engine are PRELIMINARY and AI-ASSISTED.
- This engine DOES NOT make confirmed diagnoses and DOES NOT prescribe medicines or dosages.
- It identifies clinical risk patterns to alert farmers and guide prompt veterinary consultation.
"""

from typing import List, Dict, Any, Optional

# Structured symptom definitions
SYMPTOM_DEFINITIONS = {
    "loss_of_appetite": "Loss of appetite / Inappetence",
    "fever": "Elevated body temperature / High fever",
    "excessive_salivation": "Excessive salivation / Drooling / Foaming",
    "mouth_lesions": "Blisters, ulcers, or lesions on mouth, muzzle, or tongue",
    "lameness": "Lameness, limping, or reluctance to stand/walk",
    "diarrhoea": "Diarrhoea / Scouring (watery, dark or bloody)",
    "respiratory_difficulties": "Rapid breathing, coughing, or nasal discharge",
    "unusual_behaviour": "Unusual behaviour, circling, disorientation, or aggression",
    "reduced_milk_production": "Sudden sharp drop in milk yield",
    "swelling": "Localized swelling (dewlap, brisket, limbs, skin nodules)",
    "sudden_weakness": "Sudden weakness, recumbency, or collapse",
    "bleeding_or_dark_urine": "Dark red/brown urine or unexplained bleeding",
    "skin_nodules": "Firm, raised nodules or lumps across skin/hide",
    "other_symptoms": "Other unlisted non-specific symptoms"
}

# Clinical syndromic risk patterns relevant to South African cattle health
CLINICAL_SYNDROMES = [
    {
        "id": "vesicular_fmd_pattern",
        "name": "Suspected Vesicular / Foot-and-Mouth Pattern",
        "key_symptoms": {"mouth_lesions", "excessive_salivation", "lameness"},
        "min_matches": 2,
        "base_risk": "Urgent Attention Required",
        "concern": "Notifiable Vesicular Disease Pattern (e.g. Foot and Mouth Disease / Bovine Viral Diarrhea)",
        "recommendation": "IMMEDIATELY isolate the animal and restrict all movement of livestock onto or off the farm. Notify your local State Veterinary Office or Animal Health Technician without delay. Do not move animals to auction or communal pastures.",
        "requires_vet": True,
        "is_notifiable": True,
    },
    {
        "id": "acute_tick_borne_pattern",
        "name": "Acute Tick-Borne Disease Pattern",
        "key_symptoms": {"fever", "loss_of_appetite", "bleeding_or_dark_urine", "sudden_weakness"},
        "min_matches": 2,
        "base_risk": "Urgent Attention Required",
        "concern": "Tick-Borne Haemic Infection (e.g., Redwater / Babesiosis, Anaplasmosis, or Heartwater)",
        "recommendation": "Seek immediate veterinary attention or consult your Animal Health Technician. Keep the animal in shaded, quiet surroundings with fresh water. Avoid undue stress and check the herd for heavy tick infestation.",
        "requires_vet": True,
        "is_notifiable": False,
    },
    {
        "id": "nodular_skin_pattern",
        "name": "Nodular Dermatosis / Pox Pattern",
        "key_symptoms": {"skin_nodules", "fever", "swelling", "reduced_milk_production"},
        "min_matches": 2,
        "base_risk": "High Risk",
        "concern": "Lumpy Skin Disease (LSD) or severe cutaneous infection",
        "recommendation": "Isolate affected animals in a designated quarantine paddock to prevent vector/fly transmission. Contact your veterinarian for clinical confirmation and inspect herd vaccination history.",
        "requires_vet": True,
        "is_notifiable": True,
    },
    {
        "id": "bovine_respiratory_pattern",
        "name": "Bovine Respiratory Disease Complex (BRD)",
        "key_symptoms": {"respiratory_difficulties", "fever", "loss_of_appetite"},
        "min_matches": 2,
        "base_risk": "High Risk",
        "concern": "Bovine Respiratory Disease / Infectious Bovine Rhinotracheitis (IBR) / Pasteurellosis",
        "recommendation": "Move affected cattle into clean, well-ventilated, dry shelter away from dust and extreme weather. Request a veterinary examination for auscultation and prescribed supportive treatment.",
        "requires_vet": True,
        "is_notifiable": False,
    },
    {
        "id": "clostridial_swelling_pattern",
        "name": "Acute Clostridial / Muscle Necrosis Pattern",
        "key_symptoms": {"swelling", "lameness", "sudden_weakness", "fever"},
        "min_matches": 2,
        "base_risk": "Urgent Attention Required",
        "concern": "Suspected Clostridial Infection (e.g. Blackquarter / Clostridium chauvoei or Malignant Oedema)",
        "recommendation": "Urgent veterinary assessment required. Do not cut or open swollen muscles. Isolate immediately and verify vaccination status of all young stock in the herd.",
        "requires_vet": True,
        "is_notifiable": False,
    },
    {
        "id": "enteritis_scours_pattern",
        "name": "Gastrointestinal Enteritis / Scours Pattern",
        "key_symptoms": {"diarrhoea", "loss_of_appetite", "sudden_weakness"},
        "min_matches": 2,
        "base_risk": "Moderate Risk",
        "concern": "Infectious or Parasitic Enteritis (e.g., Coccidiosis, Salmonellosis, Internal Parasites)",
        "recommendation": "Provide oral electrolyte rehydration solutions and clean drinking water to prevent dehydration. Separate sick calves or cattle from communal water troughs. Contact an animal health professional if diarrhoea persists over 24-48 hours.",
        "requires_vet": True,
        "is_notifiable": False,
    },
    {
        "id": "neurological_pattern",
        "name": "Neurological / Nervous Syndrome",
        "key_symptoms": {"unusual_behaviour", "sudden_weakness", "fever"},
        "min_matches": 2,
        "base_risk": "Urgent Attention Required",
        "concern": "Neurological syndrome (e.g. Heartwater nervous stage, Rabies suspicion, or plant toxicity)",
        "recommendation": "Handle with extreme caution and do not insert bare hands into the animal's mouth. Alert a State Veterinarian immediately for safety precautions.",
        "requires_vet": True,
        "is_notifiable": True,
    }
]

SAFETY_DISCLAIMER = (
    "DISCLAIMER: HerdGuard AI provides preliminary risk assessments for decision-support and awareness purposes only. "
    "This assessment does NOT constitute a confirmed veterinary diagnosis, does not prescribe medication, and cannot "
    "replace an on-site clinical examination by a registered veterinarian or authorized South African Animal Health Technician. "
    "For severe, sudden, or notifiable conditions, contact your nearest State Veterinary Office immediately."
)

class RiskAssessmentEngine:
    """
    Transparent, modular clinical assessment engine.
    Structured to allow future machine learning (Scikit-Learn/XGBoost) model integration.
    """

    @classmethod
    def assess_health_risk(
        cls,
        symptoms: List[str],
        severity: str = "moderate",
        duration_days: int = 1,
        species: str = "cattle",
        breed: Optional[str] = None,
        age_months: Optional[int] = None,
        province: Optional[str] = None
    ) -> Dict[str, Any]:
        normalized_symptoms = [s.strip().lower() for s in symptoms if s]
        sym_set = set(normalized_symptoms)

        matched_syndromes = []
        triggering_symptoms = []
        possible_concerns = []
        recommended_steps = []
        max_risk_level = "Low Risk"
        veterinary_referral_advisable = False

        # Rank levels for comparison
        risk_rank = {
            "Low Risk": 1,
            "Moderate Risk": 2,
            "High Risk": 3,
            "Urgent Attention Required": 4
        }

        current_rank = 1

        # Evaluate against syndromes
        for syndrome in CLINICAL_SYNDROMES:
            overlap = sym_set.intersection(syndrome["key_symptoms"])
            if len(overlap) >= syndrome["min_matches"]:
                matched_syndromes.append(syndrome)
                triggering_symptoms.extend(list(overlap))
                possible_concerns.append(syndrome["concern"])
                recommended_steps.append(syndrome["recommendation"])
                
                s_rank = risk_rank[syndrome["base_risk"]]
                if s_rank > current_rank:
                    current_rank = s_rank
                if syndrome["requires_vet"]:
                    veterinary_referral_advisable = True

        # Escalate based on severity and duration
        if severity.lower() == "severe":
            current_rank = max(current_rank, risk_rank["High Risk"])
            if current_rank == risk_rank["High Risk"] and duration_days >= 3:
                current_rank = risk_rank["Urgent Attention Required"]
            veterinary_referral_advisable = True
        elif severity.lower() == "moderate" and duration_days >= 4:
            current_rank = max(current_rank, risk_rank["Moderate Risk"] + 1)
            veterinary_referral_advisable = True
        elif len(normalized_symptoms) >= 3 and current_rank < risk_rank["Moderate Risk"]:
            current_rank = risk_rank["Moderate Risk"]
            veterinary_referral_advisable = True

        # Map back to category name
        inv_risk_rank = {v: k for k, v in risk_rank.items()}
        risk_category = inv_risk_rank.get(current_rank, "Moderate Risk")

        # Fallback if no specific syndrome matched
        if not possible_concerns:
            if current_rank >= risk_rank["High Risk"]:
                possible_concerns.append("Acute non-specific livestock infection or systemic distress requiring prompt clinical review")
                recommended_steps.append("Separate affected animal from the main herd, provide clean water and shade, and arrange a veterinary inspection.")
                veterinary_referral_advisable = True
            elif current_rank == risk_rank["Moderate Risk"]:
                possible_concerns.append("Subacute illness, nutritional stress, or early-stage infection")
                recommended_steps.append("Monitor animal twice daily for worsening symptoms, check temperature if possible, and note changes in rumination or feed intake.")
                veterinary_referral_advisable = True
            else:
                possible_concerns.append("Mild physiological variation or minor stressor")
                recommended_steps.append("Continue regular herd observation and ensure access to clean feed, mineral licks, and uncontaminated water.")
                veterinary_referral_advisable = False

        # Clean duplicates
        unique_triggers = list(dict.fromkeys(triggering_symptoms if triggering_symptoms else normalized_symptoms))
        unique_concerns = list(dict.fromkeys(possible_concerns))
        unique_steps = list(dict.fromkeys(recommended_steps))

        readable_triggers = [SYMPTOM_DEFINITIONS.get(s, s.replace('_', ' ').title()) for s in unique_triggers]

        explanation_parts = [
            f"Based on {len(normalized_symptoms)} reported symptom(s) with {severity.lower()} severity over {duration_days} day(s), "
            f"HerdGuard AI classified the condition as {risk_category}."
        ]
        if matched_syndromes:
            names = ", ".join(s["name"] for s in matched_syndromes)
            explanation_parts.append(f"Clinical patterns detected: {names}.")
        else:
            explanation_parts.append("No specific high-threat syndromic pattern was uniquely identified, but monitoring is advised.")

        explanation = " ".join(explanation_parts)

        return {
            "risk_category": risk_category,
            "triggering_symptoms": readable_triggers,
            "possible_concerns": unique_concerns,
            "recommended_steps": unique_steps,
            "veterinary_referral_advisable": veterinary_referral_advisable,
            "explanation": explanation,
            "safety_disclaimer": SAFETY_DISCLAIMER
        }
