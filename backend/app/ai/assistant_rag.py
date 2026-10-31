"""
HerdGuard AI Assistant - Agricultural Intelligence & RAG Engine
Provides contextual agricultural guidance grounded in official South African veterinary
and agricultural extension knowledge (DALRRD, ARC, SAVC, WOAH).
"""

import re
from typing import List, Dict, Any, Optional
from sqlalchemy.orm import Session
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from app.models.knowledge import KnowledgeResource
from app.core.config import settings

ASSISTANT_DISCLAIMER = (
    "HerdGuard AI Assistant provides general agricultural and biosecurity advisory information based on "
    "South African veterinary guidelines. This guidance does not substitute for on-site veterinary inspection or diagnosis. "
    "In veterinary emergencies or suspect notifiable disease outbreaks, contact your local State Veterinary Office immediately."
)

DEFAULT_KNOWLEDGE_DOCS = [
    {
        "title": "Foot and Mouth Disease (FMD) Biosecurity & Recognition",
        "source_organization": "Department of Agriculture, Land Reform and Rural Development (DALRRD)",
        "category": "Biosecurity & Notifiable Diseases",
        "source_url": "https://www.dalrrd.gov.za/branches/agricultural-production-biosecurity-natural-resources-management/animal-health",
        "content": (
            "Foot and Mouth Disease (FMD) is a highly contagious viral disease affecting cloven-hoofed animals including cattle, sheep, goats, and pigs. "
            "Key signs include excessive salivation, lip smacking, vesicles (blisters) and ulcers on the tongue, gums, dental pad, and interdigital cleft of feet, leading to sudden severe lameness. "
            "In milk cows, a dramatic decrease in milk production occurs. FMD is a controlled and notifiable disease under South African legislation (Animal Diseases Act 35 of 1984). "
            "If suspected, farmers MUST IMMEDIATELY isolate the herd, stop all animal, vehicle, and fodder movement off the farm, and notify the nearest State Veterinarian or Animal Health Technician. "
            "Never move suspect animals to auctions or communal grazing areas."
        ),
        "summary": "Essential guide on FMD signs (blisters, drooling, lameness) and immediate movement stoppage protocol under DALRRD."
    },
    {
        "title": "Lumpy Skin Disease (LSD) Prevention and Vector Control",
        "source_organization": "Agricultural Research Council (ARC) - Onderstepoort Veterinary Research",
        "category": "Vaccination & Vector Management",
        "source_url": "https://www.arc.agric.za/arc-ovr",
        "content": (
            "Lumpy Skin Disease (LSD) is caused by a capripoxvirus transmitted predominantly by biting insects such as mosquitoes, stable flies, and biting midges. "
            "In cattle, it causes persistent fever, followed by the eruption of characteristic firm, round, raised nodules (2 to 5 cm) across the skin, muzzle, neck, and perineum. "
            "Swelling of the limbs and dewlap, enlarged lymph nodes, and secondary bacterial infections frequently follow. "
            "Prevention relies on annual prophylactic vaccination in spring before summer vector population peaks using the live attenuated Neethling strain vaccine. "
            "Control measures include strict vector reduction, quarantine of newly purchased cattle for 21 days, and applying approved pour-on ectoparasiticides."
        ),
        "summary": "LSD symptom recognition (skin nodules, limb swelling) and annual spring vaccination protocols."
    },
    {
        "title": "South African Cattle Core Vaccination Schedule",
        "source_organization": "South African Veterinary Association (SAVA) / DALRRD",
        "category": "Vaccination",
        "source_url": "https://sava.co.za",
        "content": (
            "A structured herd health and vaccination program is vital for cattle productivity and disease prevention across South African provinces. "
            "Mandatory and core vaccines include: "
            "1. Anthrax: Annual state or farmer vaccination of all cattle. "
            "2. Brucellosis (Contagious Abortion): Inoculation of all heifers between 4 and 8 months of age with S19 or RB51 vaccine. Heifer vaccination is legally compulsory in South Africa. "
            "3. Clostridial Diseases (Blackquarter / Sponsbloed): Vaccinate calves from 3-4 months with annual booster, especially prior to seasonal soil disturbance or heavy rains. "
            "4. Lumpy Skin Disease & Rift Valley Fever: Annual booster in spring prior to insect breeding seasons. "
            "5. Botulism (Lamsiekte): Essential in phosphate-deficient veld areas where cattle engage in pica (bone chewing). "
            "Always store vaccines in a monitored cold chain between 2°C and 8°C."
        ),
        "summary": "Overview of essential SA cattle vaccinations: Anthrax, Brucellosis, Blackquarter, LSD, and Botulism."
    },
    {
        "title": "Tick-Borne Diseases: Redwater, Heartwater, and Anaplasmosis",
        "source_organization": "Agricultural Research Council (ARC)",
        "category": "Disease Identification",
        "source_url": "https://www.arc.agric.za",
        "content": (
            "Tick-borne diseases account for significant cattle mortality in South Africa. "
            "1. African and Asiatic Redwater (Babesiosis): Transmitted by blue ticks (Rhipicephalus decoloratus/microplus). Symptoms include high fever, severe anaemia, jaundice, dark red-to-brown urine (haemoglobinuria), and weakness. "
            "2. Heartwater (Ehrlichia ruminantium): Transmitted by the bont tick (Amblyomma hebraeum). Symptoms include sudden high fever, respiratory distress, and nervous signs (high-stepping gait, twitching eyelids, circling, tongue poking). "
            "3. Anaplasmosis (Gallsiekte): Characterized by progressive anaemia, depression, constipation, and yellow mucous membranes (jaundice) without red urine. "
            "Strategic acaricide dipping, rotational pasture management, and breeding adapted cattle (such as Nguni and Bonsmara) form the cornerstone of sustainable tick management."
        ),
        "summary": "Identification and management of Redwater, Heartwater, and Anaplasmosis tick-borne diseases in cattle."
    },
    {
        "title": "HerdGuard AI Platform Usage & Health Reporting Guide",
        "source_organization": "HerdGuard AI Agricultural Support",
        "category": "Platform Guidance",
        "source_url": "https://herdguard.ai/docs",
        "content": (
            "How to use HerdGuard AI: "
            "1. Register your farm with accurate province and municipality coordinates to receive regional disease alerts. "
            "2. Register individual cattle with their unique ear tag numbers, breed, sex, and date of birth. "
            "3. Submit a Health Report whenever an animal exhibits unusual symptoms. Select observed symptoms from the checklist, set the severity, and indicate duration. "
            "4. Review the instant preliminary AI risk assessment to understand the severity level and recommended next steps. "
            "5. Local Animal Health Technicians and registered veterinarians can review submitted reports, add professional clinical notes, and provide follow-up guidance."
        ),
        "summary": "Step-by-step instructions for farm registration, animal tagging, and health report submission on HerdGuard AI."
    }
]

class HerdGuardAssistant:
    """
    RAG Assistant using local vector search over validated agricultural documentation
    with optional fallback to external LLMs when configured.
    """

    @classmethod
    def _get_corpus(cls, db: Optional[Session] = None) -> List[Dict[str, str]]:
        docs = []
        # Add database resources if available
        if db:
            try:
                db_resources = db.query(KnowledgeResource).filter(KnowledgeResource.is_active == True).all()
                for r in db_resources:
                    docs.append({
                        "title": r.title,
                        "source_organization": r.source_organization,
                        "category": r.category,
                        "content": r.content,
                        "summary": r.summary,
                        "source_url": r.source_url or ""
                    })
            except Exception:
                pass

        # If DB had no docs or was empty, use default curated agricultural docs
        if not docs:
            docs = DEFAULT_KNOWLEDGE_DOCS

        return docs

    @classmethod
    def answer_query(cls, query: str, db: Optional[Session] = None, category_filter: Optional[str] = None) -> Dict[str, Any]:
        cleaned_query = query.strip()
        corpus = cls._get_corpus(db)

        if category_filter:
            filtered = [d for d in corpus if category_filter.lower() in d.get("category", "").lower()]
            if filtered:
                corpus = filtered

        # Build corpus texts for TF-IDF
        doc_texts = [f"{d['title']} {d['category']} {d['summary']} {d['content']}" for d in corpus]

        vectorizer = TfidfVectorizer(stop_words='english', max_features=1000)
        try:
            tfidf_matrix = vectorizer.fit_transform(doc_texts)
            query_vec = vectorizer.transform([cleaned_query])
            similarities = cosine_similarity(query_vec, tfidf_matrix).flatten()
            top_indices = similarities.argsort()[::-1]
        except Exception:
            top_indices = list(range(len(corpus)))
            similarities = [0.5] * len(corpus)

        # Select top relevant documents (similarity > 0.05 or at least top 2)
        relevant_docs = []
        citations = []
        for idx in top_indices:
            score = similarities[idx] if len(similarities) > idx else 0
            if score > 0.05 or len(relevant_docs) == 0:
                doc = corpus[idx]
                relevant_docs.append(doc)
                citations.append({
                    "title": doc["title"],
                    "source_organization": doc["source_organization"],
                    "source_url": doc.get("source_url")
                })
            if len(relevant_docs) >= 3:
                break

        # Generate synthesis answer based on matched knowledge
        if not relevant_docs:
            answer = (
                "Thank you for contacting HerdGuard AI Assistant. For your inquiry regarding cattle health or farm management, "
                "please ensure your livestock has access to clean drinking water, high-quality forage, and appropriate mineral supplementation. "
                "If an animal displays fever, drooling, lesions, or lameness, submit a Health Report through the HerdGuard AI dashboard "
                "so our risk engine and local agricultural officers can review the case."
            )
            suggested_followups = [
                "What are the symptoms of Foot and Mouth Disease?",
                "Which vaccinations are compulsory in South Africa?",
                "How do I submit an animal health report?"
            ]
        else:
            primary_doc = relevant_docs[0]
            answer_paragraphs = [
                f"**Information from {primary_doc['source_organization']} ({primary_doc['title']}):**",
                primary_doc['content']
            ]
            if len(relevant_docs) > 1:
                secondary = relevant_docs[1]
                answer_paragraphs.append(f"\n**Additional Guidance ({secondary['title']}):**\n{secondary['summary']}")

            answer = "\n\n".join(answer_paragraphs)

            # Contextual suggestions
            q_lower = cleaned_query.lower()
            if "vaccin" in q_lower:
                suggested_followups = [
                    "What is the recommended age for Brucellosis S19 vaccination?",
                    "How should cattle vaccines be stored?",
                    "When should Blackquarter vaccine be administered?"
                ]
            elif "foot" in q_lower or "mouth" in q_lower or "fmd" in q_lower:
                suggested_followups = [
                    "What biosecurity measures stop FMD spread?",
                    "Who is my local State Veterinarian for reporting?",
                    "Can sheep and goats catch FMD?"
                ]
            elif "tick" in q_lower or "redwater" in q_lower or "heartwater" in q_lower:
                suggested_followups = [
                    "How can I tell Redwater apart from Heartwater?",
                    "What dipping frequency is recommended in summer?",
                    "Which cattle breeds are most tick-resistant in South Africa?"
                ]
            else:
                suggested_followups = [
                    "How do I record a new vaccination on HerdGuard AI?",
                    "What should I do if an animal has a sudden high fever?",
                    "How do I interpret my preliminary health risk assessment?"
                ]

        return {
            "answer": answer,
            "citations": citations,
            "advisory_notice": ASSISTANT_DISCLAIMER,
            "suggested_followups": suggested_followups
        }
