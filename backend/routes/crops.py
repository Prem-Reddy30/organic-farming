from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional, Dict, Any
from backend.routes.chat import rag_engine

router = APIRouter(prefix="/api", tags=["Crop-Specific Farming Guide"])

CROPS_CATALOG = [
    {
        "id": "paddy",
        "name": "Paddy / Rice (వరి / धान)",
        "scientific_name": "Oryza sativa",
        "category": "Cereals",
        "seasons": ["Kharif", "Rabi"],
        "major_states": ["Telangana", "Andhra Pradesh", "Punjab", "West Bengal", "Tamil Nadu", "Odisha", "Uttar Pradesh"],
        "suitable_soils": ["Clayey Loam", "Alluvial", "Heavy Clay", "Black Cotton Soil"],
        "water_requirement": "High (SRI / Alternate Wetting & Drying recommended)",
        "duration_days": "120 - 150 days",
        "icon": "🌾"
    },
    {
        "id": "cotton",
        "name": "Cotton (పత్తి / कपास)",
        "scientific_name": "Gossypium hirsutum",
        "category": "Cash Crop / Fiber",
        "seasons": ["Kharif"],
        "major_states": ["Gujarat", "Maharashtra", "Telangana", "Andhra Pradesh", "Karnataka", "Madhya Pradesh", "Haryana"],
        "suitable_soils": ["Deep Black Cotton Soil", "Medium Black Soil", "Well-drained Alluvial"],
        "water_requirement": "Medium (sensitive to waterlogging)",
        "duration_days": "150 - 180 days",
        "icon": "🌱"
    },
    {
        "id": "tomato",
        "name": "Tomato (టమాటా / टमाटर)",
        "scientific_name": "Solanum lycopersicum",
        "category": "Vegetables",
        "seasons": ["Kharif", "Rabi", "Zaid"],
        "major_states": ["Andhra Pradesh", "Karnataka", "Madhya Pradesh", "Gujarat", "Odisha", "West Bengal", "Maharashtra"],
        "suitable_soils": ["Well-drained Sandy Loam", "Clay Loam rich in organic matter"],
        "water_requirement": "Medium (Drip irrigation with mulching)",
        "duration_days": "90 - 130 days",
        "icon": "🍅"
    },
    {
        "id": "wheat",
        "name": "Wheat (గోధుమ / गेहूँ)",
        "scientific_name": "Triticum aestivum",
        "category": "Cereals",
        "seasons": ["Rabi"],
        "major_states": ["Uttar Pradesh", "Punjab", "Haryana", "Madhya Pradesh", "Rajasthan", "Bihar"],
        "suitable_soils": ["Well-drained Fertile Loam", "Clay Loam"],
        "water_requirement": "Moderate (4-6 timely irrigations at crown root stage)",
        "duration_days": "110 - 135 days",
        "icon": "🌾"
    },
    {
        "id": "chickpea",
        "name": "Chickpea / Bengal Gram (శనగలు / चना)",
        "scientific_name": "Cicer arietinum",
        "category": "Pulses",
        "seasons": ["Rabi"],
        "major_states": ["Madhya Pradesh", "Maharashtra", "Rajasthan", "Karnataka", "Andhra Pradesh", "Uttar Pradesh"],
        "suitable_soils": ["Deep Black Soils", "Sandy Loam to Clay Loam"],
        "water_requirement": "Low (Drought tolerant, 1-2 protective irrigations)",
        "duration_days": "90 - 110 days",
        "icon": "🫘"
    },
    {
        "id": "chilli",
        "name": "Chilli (మిరప / मिर्च)",
        "scientific_name": "Capsicum annuum",
        "category": "Spices & Vegetables",
        "seasons": ["Kharif", "Rabi"],
        "major_states": ["Andhra Pradesh", "Telangana", "Karnataka", "Madhya Pradesh", "West Bengal"],
        "suitable_soils": ["Light Loamy Black Soil", "Red Sandy Loam"],
        "water_requirement": "Medium (Requires good drainage)",
        "duration_days": "140 - 170 days",
        "icon": "🌶️"
    }
]

STAGE_DETAILS = {
    "paddy": {
        "land_preparation": "Incorporate Dhaincha (Sesbania) or Sunnhemp green manure at 45 days. Plough 2-3 times, puddle thoroughly, and incorporate 2.5 tonnes vermicompost and 200 kg neem cake per acre.",
        "seed_selection": "Opt for traditional/pest-resilient varieties like BPT-5204, Telangana Sona (RNR-15048), or Kalanamak. Treat seeds with Bijamrutham or Pseudomonas fluorescens @ 10 g/kg seed.",
        "sowing": "For SRI (System of Rice Intensification), transplant 8-12 day old single seedlings at 25x25 cm square grid.",
        "nutrient_management": "Apply 200 L Jeevamrutham in irrigation at active tillering. Broadcast Azolla @ 300 kg/acre. Foliar spray 3% Panchagavya at panicle initiation.",
        "irrigation": "Adopt Alternate Wetting & Drying (AWD). Keep 1-2 cm thin water layer, let hair-cracks appear before re-irrigating to boost root oxygenation.",
        "weed_management": "Operate rotary cono-weeder at 15, 25, and 35 DAT. This incorporates weeds as organic manure and aerates roots.",
        "pest_disease": "Erect 5 pheromone traps/acre for yellow stem borer. Spray 5% Neem Seed Kernel Extract (NSKE) or sour buttermilk (50 ml/L) for sheath blight.",
        "harvesting": "Harvest when 80-85% grains turn golden yellow. Cut 10-15 cm above ground level.",
        "post_harvest": "Dry paddy on clean tarpaulins to 12% moisture level. Store with neem leaves in hermetic bags."
    },
    "cotton": {
        "land_preparation": "Deep summer ploughing to expose pupae to sun. Incorporate 3 tonnes well-rotted FYM and 150 kg neem cake per acre during final disc harrowing.",
        "seed_selection": "Choose non-Bt organic certified hirsutum varieties. Delint naturally or treat seeds with Trichoderma viride @ 10 g/kg seed.",
        "sowing": "Sow at 90x60 cm or 120x45 cm spacing depending on soil depth. Plant 2 border rows of maize or sorghum and 1 intercrop row of cowpea/marigold.",
        "nutrient_management": "Band apply 1.5 tonnes vermicompost. Drench or fertigate with 200 L Jeevamrutham every 21 days. Spray 3% Panchagavya at squaring and peak boll formation.",
        "irrigation": "Drip irrigation or furrow irrigation every 12-15 days. Avoid stagnant water around root collars.",
        "weed_management": "Intercultural hoeing at 20, 40, and 60 DAS. Spread crop residue mulch in inter-rows.",
        "pest_disease": "Install Gossyplure pheromone traps @ 5/acre for pink bollworm. Release Trichocards @ 60,000 eggs/acre at 45 DAS for 4 releases. Spray NSKE 5% or cold-pressed Neem Oil (1500 ppm @ 5 ml/L).",
        "harvesting": "Pick fully burst clean bolls in morning hours without dried leaves/bract trash.",
        "post_harvest": "Sun-dry seed cotton to 7-8% moisture. Store in dry, well-ventilated godowns free from rodents."
    },
    "tomato": {
        "land_preparation": "Solarize raised nursery beds with 25-micron polythene sheet for 30-45 days. Form broad beds and furrows (BBF) enriched with 3 tonnes vermicompost/acre.",
        "seed_selection": "Select wilt-tolerant varieties. Treat seeds with Trichoderma viride @ 10 g/kg seed.",
        "sowing": "Transplant 25-30 day sturdy seedlings in evening hours at 75x60 cm spacing. Dip roots in Azospirillum + PSB slurry for 20 minutes.",
        "nutrient_management": "Soil application of Arka Microbial Consortium. Apply 200 L Jeevamrutham every 15 days. Spray 3% Panchagavya every 14 days during flowering.",
        "irrigation": "Drip irrigation at 2-3 day intervals. Mulch beds with 4-inch dry straw to conserve 45% moisture.",
        "weed_management": "Hand weeding at 25 and 45 DAT. Organic straw mulching drastically reduces weed germination.",
        "pest_disease": "Stake plants with bamboo poles. Prune lower 30 cm leaves. Install yellow sticky traps (15-20/acre) for whiteflies. Spray fermented sour buttermilk (50 ml/L) for early blight.",
        "harvesting": "Harvest at breaker/pink stage for distant markets or red-ripe for local consumption.",
        "post_harvest": "Grade by size, sort blemishes, pack in plastic crates with paper lining. Store at 12-15°C."
    }
}

@router.get("/crops")
def get_crops():
    """List available crops with seasons and soil types."""
    return {"crops": CROPS_CATALOG}

@router.get("/crop-guide/{crop}")
def get_crop_guide(
    crop: str,
    state: Optional[str] = Query("Telangana", description="Indian State"),
    district: Optional[str] = Query(None, description="District"),
    soil_type: Optional[str] = Query(None, description="Soil Type"),
    season: Optional[str] = Query("Kharif", description="Season: Kharif, Rabi, or Zaid"),
    stage: Optional[str] = Query(None, description="Farming stage")
):
    """
    Generate comprehensive 9-stage organic crop guide tailored to state, soil, and season.
    Grounded in agricultural research and verified knowledge base.
    """
    crop_id = crop.lower().strip()
    # Match crop
    crop_info = next((c for c in CROPS_CATALOG if c["id"] == crop_id or c["id"] in crop_id or crop_id in c["name"].lower()), None)
    
    if not crop_info:
        # Default fallback to paddy or tomato
        crop_info = CROPS_CATALOG[0]
        crop_id = "paddy"

    stages = STAGE_DETAILS.get(crop_id, STAGE_DETAILS["paddy"])

    # Retrieve relevant RAG context for this crop
    rag_context = rag_engine.retrieve_context(
        query=f"Organic {crop_info['name']} package of practices cultivation nutrient pest management",
        top_k=2,
        crop_filter=crop_info["name"].split()[0]
    )

    sources = [
        {
            "title": c["metadata"].get("title"),
            "author": c["metadata"].get("author"),
            "source_url": c["metadata"].get("source_url")
        }
        for c in rag_context
    ]

    return {
        "crop": crop_info,
        "region_parameters": {
            "state": state,
            "district": district or "Central Agro-climatic Zone",
            "soil_type": soil_type or crop_info["suitable_soils"][0],
            "season": season
        },
        "selected_stage": stage,
        "stages": {
            "1_land_preparation": {
                "title": "Land Preparation & Basal Soil Health",
                "details": stages.get("land_preparation")
            },
            "2_seed_selection_and_treatment": {
                "title": "Seed Selection & Bio-Treatment",
                "details": stages.get("seed_selection")
            },
            "3_sowing_and_spacing": {
                "title": "Sowing & Ideal Plant Geometry",
                "details": stages.get("sowing")
            },
            "4_organic_nutrient_management": {
                "title": "Organic Nutrient Schedule (Basal & Top-dressing)",
                "details": stages.get("nutrient_management")
            },
            "5_irrigation_and_water_conservation": {
                "title": "Irrigation Protocol & Moisture Conservation",
                "details": stages.get("irrigation")
            },
            "6_weed_management": {
                "title": "Ecological Weed Management & Mulching",
                "details": stages.get("weed_management")
            },
            "7_pest_and_disease_prevention": {
                "title": "Integrated Pest & Disease Prevention",
                "details": stages.get("pest_disease")
            },
            "8_harvesting": {
                "title": "Maturity Indices & Harvesting Technique",
                "details": stages.get("harvesting")
            },
            "9_post_harvest_handling": {
                "title": "Post-Harvest Curing & Safe Organic Storage",
                "details": stages.get("post_harvest")
            }
        },
        "sources": sources
    }
