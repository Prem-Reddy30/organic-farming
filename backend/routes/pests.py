import base64
from fastapi import APIRouter, HTTPException, UploadFile, File, Form
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from backend.routes.chat import rag_engine

router = APIRouter(prefix="/api/pests", tags=["Pest & Disease Management"])

PEST_DATABASE = [
    {
        "id": "cotton_pink_bollworm",
        "crop": "Cotton",
        "pest_name": "Pink Bollworm (Pectinophora gossypiella)",
        "symptoms": "Rosette flowers with petals twisted together; green bolls showing entry holes sealed by larval frass; eaten seeds and stained lint inside bolls.",
        "preventive_controls": [
            "Observe closed season of at least 3 months between cotton crops.",
            "Install Gossyplure sleeve pheromone traps @ 5 traps/acre at 45 DAS.",
            "Destroy crop residues and do deep summer ploughing to kill diapausing pupae."
        ],
        "biological_controls": [
            "Release Trichogramma chilonis egg parasitoids @ 60,000 eggs (3-4 cards)/acre weekly for 4-5 releases.",
            "Spray Bacillus thuringiensis (Bt var. kurstaki) @ 400 g/acre in evening hours.",
            "Release Chrysoperla carnea green lacewing larvae @ 4,000/acre."
        ],
        "botanical_sprays": [
            "Spray Neem Seed Kernel Extract (NSKE 5%) or 1500 ppm Neem Oil @ 5 ml/liter water.",
            "Spray Agniastra (neem, garlic, chilli, cow urine decoction) @ 30 ml/10 L water."
        ],
        "expert_advisory": "If larval infestation exceeds 10% rosette flowers or 8 moths/trap/night for 3 consecutive nights, immediately consult your local Krishi Vigyan Kendra (KVK) or CICR extension team."
    },
    {
        "id": "tomato_early_blight",
        "crop": "Tomato",
        "pest_name": "Early Blight (Alternaria solani) & Fungal Leaf Spot",
        "symptoms": "Dark brown circular spots with concentric target-board rings on older lower leaves. Leaves yellow around spots and drop prematurely. Sunken dark spots at stem base.",
        "preventive_controls": [
            "Solarize nursery soil with 25-micron polythene sheet for 4-6 weeks in summer.",
            "Seed treatment with Trichoderma viride @ 10 g/kg seed.",
            "Stake plants with bamboo poles to keep foliage off the ground.",
            "Prune lower 30 cm bottom leaves at 45 DAT to stop rain-splash infection."
        ],
        "biological_controls": [
            "Foliar spray of Pseudomonas fluorescens @ 5 g/liter (1 kg/acre in 200 L water).",
            "Soil application of Trichoderma viride enriched vermicompost (5 kg in 100 kg compost)."
        ],
        "botanical_sprays": [
            "Fermented Sour Buttermilk (Khatti Chhachh) spray @ 50 ml per liter of water (5% concentration) every 10 days.",
            "Panchagavya 3% spray to induce systemic acquired resistance (SAR)."
        ],
        "expert_advisory": "Ensure good drainage. If disease rapidly spreads across entire canopy under continuous rains, consult KVK horticultural experts for approved organic copper salts (Bordeaux mixture 1%)."
    },
    {
        "id": "paddy_stem_borer",
        "crop": "Paddy / Rice",
        "pest_name": "Yellow Stem Borer (Scirpophaga incertulas)",
        "symptoms": "Dead heart during vegetative phase (central shoot dies and pulls out easily); white earheads (empty panicles) during reproductive stage.",
        "preventive_controls": [
            "Clip seedling leaf tips before transplanting to eliminate egg masses.",
            "Maintain wide 25x25 cm spacing as in SRI method.",
            "Erect 5-8 pheromone traps per acre for continuous monitoring."
        ],
        "biological_controls": [
            "Release Trichogramma japonicum egg parasitoid @ 40,000 eggs/acre starting 30 DAT.",
            "Conserve native spiders (Lycosa pseudoannulata) and dragonflies by avoiding broad-spectrum synthetic poisons."
        ],
        "botanical_sprays": [
            "Spray Neem oil 3000 ppm @ 3 ml/L or NSKE 5% at peak moth flight.",
            "Apply Neem Cake @ 150 kg/acre basal."
        ],
        "expert_advisory": "Monitor economic threshold level (ETL): 1 egg mass per sq. meter or 5% dead hearts. Contact local agricultural officer if white ears exceed 2%."
    },
    {
        "id": "tomato_whitefly_tolcv",
        "crop": "Tomato",
        "pest_name": "Whitefly & Tomato Leaf Curl Virus (ToLCV)",
        "symptoms": "Tiny white winged insects fluttering under leaves; leaves become mottled, curled upwards, cupped, thick, brittle, and stunted.",
        "preventive_controls": [
            "Install 15-20 bright yellow sticky sheets per acre at canopy height.",
            "Grow 2 border rows of dense maize or bajra to prevent whitefly flight drift.",
            "Use reflective silver mulch film to repel incoming whiteflies."
        ],
        "biological_controls": [
            "Spray Verticillium lecanii entomopathogenic fungus @ 5 g/L under humid conditions.",
            "Release predatory mirid bugs (Nesidiocoris tenuis)."
        ],
        "botanical_sprays": [
            "Spray cold-pressed Neem Oil 1500 ppm @ 5 ml/L + soapnut extract.",
            "Spray Dashaparni Ark @ 25 ml/L water every 10 days."
        ],
        "expert_advisory": "Tomato Leaf Curl is a viral disease; rogue out and burn infected plants immediately to prevent spread."
    }
]

class DiagnoseRequest(BaseModel):
    crop: Optional[str] = "General"
    symptoms: str
    image_base64: Optional[str] = None

@router.get("")
def list_pests(crop: Optional[str] = None):
    """List known pests and organic treatments filtered by crop."""
    if crop and crop.lower() != "all":
        filtered = [p for p in PEST_DATABASE if crop.lower() in p["crop"].lower()]
        return {"pests": filtered}
    return {"pests": PEST_DATABASE}

@router.post("/diagnose")
def diagnose_crop_issue(payload: DiagnoseRequest):
    """
    Diagnose crop pest or disease using RAG retrieval over symptom descriptions and image indicators.
    Communicates confidence and safety guidelines clearly.
    """
    symptoms = payload.symptoms.strip()
    if not symptoms:
        raise HTTPException(status_code=400, detail="Please describe the crop symptoms observed.")

    # Query RAG engine for grounded diagnosis
    query = f"Pest and disease diagnosis for {payload.crop}: {symptoms}"
    rag_result = rag_engine.generate_answer(
        query=query,
        crop_filter=payload.crop if payload.crop != "General" else None,
        topic_filter="Pest"
    )

    # Find matching curated pest if any
    matched_pest = None
    for item in PEST_DATABASE:
        if (payload.crop.lower() in item["crop"].lower() or item["crop"].lower() in payload.crop.lower()):
            matched_pest = item
            break

    # Calculate confidence based on retrieval scores
    confidence_level = "High (Verified Match)" if rag_result["sources"] else "Moderate (Symptom Guidance)"

    return {
        "crop": payload.crop,
        "observed_symptoms": symptoms,
        "has_image": bool(payload.image_base64),
        "diagnosis_guidance": rag_result["answer"],
        "confidence_level": confidence_level,
        "curated_reference": matched_pest,
        "sources": rag_result["sources"],
        "expert_disclaimer": "Organic management relies on preventive and biological barriers. If symptoms indicate severe bacterial wilt or viral outbreak exceeding 15% field damage, please bring a leaf sample to your local Krishi Vigyan Kendra (KVK) for laboratory pathology confirmation."
    }
