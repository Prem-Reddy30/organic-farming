from fastapi import APIRouter, HTTPException
from typing import List, Optional, Dict, Any

router = APIRouter(prefix="/api/fertilizers", tags=["Organic Fertilizer & Inputs Guide"])

FERTILIZERS_DATA = [
    {
        "id": "jeevamrutham",
        "name": "Jeevamrutham (జీవామృతం / जीवामृत)",
        "type": "Liquid Bio-enhancer / Microbial Consortium",
        "category": "Microbial Inoculant",
        "ideal_for": "All crops (Paddy, Cotton, Vegetables, Pulses, Millets)",
        "prep_time": "48 - 72 hours",
        "active_shelf_life": "7 - 8 days",
        "cost_per_acre": "₹50 - ₹100",
        "npk_and_bio": "Teeming with >10⁹ CFU/ml beneficial aerobic rhizobacteria, fungi, and actinomycetes",
        "ingredients": [
            "10 kg Fresh Desi Cow Dung (native cow)",
            "5 - 10 liters Fresh Desi Cow Urine (Gomutra)",
            "2 kg Organic Jaggery (Gur) or 4 L fresh sugarcane juice",
            "2 kg Pulse / Gram Flour (Besan, cowpea, or blackgram)",
            "1 fistful (100-200g) virgin living soil from tree shade / forest",
            "200 liters clean non-chlorinated water"
        ],
        "preparation_steps": [
            "Step 1: Thoroughly mix 10 kg cow dung and 10 L cow urine in a bucket to form a lump-free slurry.",
            "Step 2: Dissolve 2 kg jaggery and 2 kg pulse flour in warm water without forming lumps.",
            "Step 3: Pour all ingredients into a 200-liter plastic drum placed under complete tree shade.",
            "Step 4: Add the fistful of living soil and fill up to 200 liters with clean water.",
            "Step 5: Stir clockwise with a clean wooden pole for 5 minutes twice daily (morning & evening).",
            "Step 6: Cover drum with a breathable jute gunny bag. Ready to use on day 3."
        ],
        "application_method": "Apply 200 liters per acre through main irrigation water channel or double-filtered through muslin cloth for 10% foliar spray every 15-20 days.",
        "precautions": [
            "Never expose to direct sunlight during preparation or storage.",
            "Do not store beyond 10 days as efficacy drops rapidly.",
            "Ensure complete filtration before running through micro-drip fertigation."
        ],
        "source": "National Centre for Organic and Natural Farming (NCOF), Ghaziabad"
    },
    {
        "id": "panchagavya",
        "name": "Panchagavya (పంచగవ్య / पंचगव्य)",
        "type": "Bio-stimulant & Growth Promoter",
        "category": "Foliar Nutrition & Systemic Resistance",
        "ideal_for": "Commercial Vegetables, Fruits, Flowers, Cotton, Turmeric",
        "prep_time": "18 - 21 days",
        "active_shelf_life": "6 months",
        "cost_per_acre": "₹300 - ₹450",
        "npk_and_bio": "Rich in auxins, gibberellins, cytokinins, lactic acid bacteria, and micronutrients",
        "ingredients": [
            "5 kg Fresh Cow Dung",
            "1 kg Desi Cow Ghee",
            "3 liters Fresh Cow Urine",
            "2 liters Fresh Cow Milk",
            "2 liters Fresh Cow Curd",
            "3 liters Tender Coconut Water",
            "1 kg Jaggery dissolved in 3 L water",
            "12 ripe bananas (mashed)"
        ],
        "preparation_steps": [
            "Step 1: Blend 5 kg cow dung and 1 kg ghee thoroughly in a plastic/clay tub. Let stand for 3 days, stirring once daily.",
            "Step 2: On day 4, mix 3 L cow urine and 10 L water. Let stand for 24 hours.",
            "Step 3: On day 5, add cow milk, curd, tender coconut water, jaggery syrup, and 12 mashed bananas.",
            "Step 4: Stir the mixture clockwise for 10 minutes in the morning and evening daily for 15-18 days.",
            "Step 5: On the 18th day, a pleasant fruity alcoholic fragrance develops. Strain through nylon mesh."
        ],
        "application_method": "Foliar spray @ 3% concentration (300 ml in 10 liters clean water; 6 liters per 200 liters water per acre) at vegetative, flowering, and fruit-fill stages.",
        "precautions": [
            "Do not mix with synthetic chemical fertilizers or pesticides.",
            "Spray in early morning (7-9 AM) or late afternoon (4-6 PM) to prevent leaf scorching.",
            "Do not exceed 3% concentration to prevent leaf tip burn."
        ],
        "source": "Tamil Nadu Agricultural University (TNAU), Department of Sustainable Organic Agriculture"
    },
    {
        "id": "vermicompost",
        "name": "Vermicompost (వానపాముల ఎరువు / केंचुआ खाद)",
        "type": "Granular Organic Manure",
        "category": "Soil Conditioner & Primary Nutrient Source",
        "ideal_for": "All field crops, orchards, vegetables, and nursery seedlings",
        "prep_time": "45 - 60 days",
        "active_shelf_life": "12 months under shade",
        "cost_per_acre": "₹2,500 - ₹4,000 (or near-zero if farm-produced)",
        "npk_and_bio": "Organic Carbon: 16%, N: 1.8-2.2%, P₂O₅: 1.4-1.8%, K₂O: 1.6-2.4%, humic acid and enzymes",
        "ingredients": [
            "Pre-decomposed cow dung (15-20 days old): 60%",
            "Chopped dry crop residues (straw, stover, dry leaves): 40%",
            "Earthworm inoculum: Eisenia fetida @ 1.5 - 2 kg per sq. meter",
            "Clean water for regular moisture sprinkling"
        ],
        "preparation_steps": [
            "Step 1: Construct a bed of 10-20 ft length, 3-4 ft width, and 2-2.5 ft depth under a 75% shade net.",
            "Step 2: Place a bottom 3-inch layer of coconut coir or dry twigs for drainage.",
            "Step 3: Fill with pre-decomposed dung and chopped biomass layers up to 2 feet height.",
            "Step 4: Release earthworms over the top surface; they burrow down naturally.",
            "Step 5: Sprinkle water every 2-3 days to maintain 60-70% moisture.",
            "Step 6: At 45-60 days, scrape granular black tea-leaf castings from the top layer and sieve through a 3 mm screen."
        ],
        "application_method": "Incorporate 2.0 - 2.5 tonnes per acre during final ploughing for field crops; 3.0 tonnes/acre for vegetables; 5-10 kg per fruit tree twice a year.",
        "precautions": [
            "Never feed fresh, hot steaming dung to earthworms.",
            "Protect beds against red ants, rodents, and poultry using water moats.",
            "Avoid drying harvested vermicompost in open sun (kills microbes and volatilizes nitrogen)."
        ],
        "source": "ICAR-Central Research Institute for Dryland Agriculture (CRIDA), Hyderabad"
    },
    {
        "id": "green_manure",
        "name": "Green Manure: Dhaincha & Sunnhemp (జనుము / పచ్చిరొట్ట / हरी खाद)",
        "type": "In-situ Nitrogen-Fixing Biomass",
        "category": "Soil Restorer & Organic Matter Booster",
        "ideal_for": "Paddy fields, cotton fallows, sugarcane rotations, degraded soils",
        "prep_time": "45 - 50 days to flowering",
        "active_shelf_life": "Decomposes in soil within 10-14 days",
        "cost_per_acre": "₹600 - ₹900 (seeds)",
        "npk_and_bio": "Fixes 60 - 100 kg atmospheric Nitrogen/acre; adds 8 - 12 tonnes green organic biomass",
        "ingredients": [
            "Dhaincha (Sesbania aculeata) seed: 15 - 20 kg/acre (ideal for wet/saline soils)",
            "OR Sunnhemp (Crotalaria juncea) seed: 15 - 20 kg/acre (ideal for loamy/dryland soils)",
            "Rhizobium biofertilizer culture for seed inoculation: 250 g/acre"
        ],
        "preparation_steps": [
            "Step 1: Broadcast seeds with pre-monsoon showers or first summer irrigation.",
            "Step 2: Allow fast vegetative growth for 45 to 50 days up to 50% flowering stage.",
            "Step 3: At flowering, stem and leaf tissues are tender, succulent, and highest in nitrogen content.",
            "Step 4: Incorporate using disc plough or rotavator into moist or puddled soil.",
            "Step 5: Allow 10 to 14 days for soil microbial decomposition before sowing/transplanting main crop."
        ],
        "application_method": "Grown and incorporated in-situ across the entire acreage once every year before main Kharif crop.",
        "precautions": [
            "Do not allow plants to set mature woody seed pods, or woody lignin retards decomposition.",
            "Ensure adequate soil moisture during incorporation for rapid humification."
        ],
        "source": "ICAR-Indian Institute of Rice Research (IIRR) & NCOF"
    },
    {
        "id": "biofertilizers",
        "name": "Biofertilizers (Rhizobium, Azospirillum, PSB, KMB)",
        "type": "Living Microbial Inoculants",
        "category": "Biological Nutrient Solubilizers & Mobilizers",
        "ideal_for": "Seed treatment and soil enrichment across all crops",
        "prep_time": "Ready to use carrier formulations or liquid cultures",
        "active_shelf_life": "6 - 12 months",
        "cost_per_acre": "₹150 - ₹250",
        "npk_and_bio": "Supplies 25-30% of crop nitrogen needs and mobilizes 30-50 kg bound phosphorus/acre",
        "ingredients": [
            "Rhizobium: 250 g per 10 kg legume seeds (chickpea, pigeon pea, soybean)",
            "Azospirillum / Azotobacter: 2 kg/acre for cereals and vegetables",
            "Phosphorus Solubilizing Bacteria (PSB): 2 kg/acre",
            "Potassium Mobilizing Bacteria (KMB - Frateuria aurantia): 2 kg/acre",
            "Jaggery water (10% solution) as sticky sticker"
        ],
        "preparation_steps": [
            "Seed Slurry: Mix 250 g biofertilizer in 200 ml cooled jaggery syrup.",
            "Coat seeds gently without bruising seed coat.",
            "Shade-dry for 30 minutes and sow immediately within 4 hours.",
            "Soil Application: Blend 2 kg biofertilizer into 200 kg moist vermicompost, incubate under shade for 5 days, and broadcast."
        ],
        "application_method": "Seed treatment prior to sowing; seedling root dip for 30 minutes; basal soil broadcasting.",
        "precautions": [
            "Store in a cool dry place away from heat and direct sunlight.",
            "Never mix with synthetic fungicides or chemical fertilizers.",
            "Check manufacturing and expiry dates on package."
        ],
        "source": "Ministry of Agriculture & Farmers Welfare, National Centre for Organic Farming"
    },
    {
        "id": "neem_inputs",
        "name": "Neem-Based Inputs (Neem Astra, NSKE 5%, Neem Oil)",
        "type": "Botanical Pest Repellent & Nitrification Inhibitor",
        "category": "Organic Crop Protection & Nitrogen Extender",
        "ideal_for": "Cotton, Paddy, Vegetables, Chilli, Pulses",
        "prep_time": "24 hours for NSKE; 48 hours for Neem Astra",
        "active_shelf_life": "Freshly prepared (1-2 weeks)",
        "cost_per_acre": "₹100 - ₹200",
        "npk_and_bio": "Azadirachtin, salannin, nimbin; acts as antifeedant, oviposition deterrent, and growth disruptor",
        "ingredients": [
            "Neem Astra: 5 kg crushed neem leaves, 5 L cow urine, 2 kg cow dung in 100 L water",
            "NSKE 5%: 5 kg shade-dried neem seed kernels, 100 g soap powder in 100 L water",
            "Cold-pressed Neem Oil: 1500 ppm or 3000 ppm formulation"
        ],
        "preparation_steps": [
            "NSKE 5%: Pound 5 kg neem kernels into fine powder.",
            "Tie in a cloth bag, soak in 10 L water overnight.",
            "Squeeze bag repeatedly to extract milky azadirachtin suspension.",
            "Dissolve 100 g soap powder in 1 L water as emulsifier.",
            "Mix extract and soap solution, make up to 100 L with water and spray immediately."
        ],
        "application_method": "Foliar spray @ 5% NSKE or 5 ml cold-pressed Neem Oil per liter of water with soap emulsifier at first sign of sucking pests or bollworm eggs.",
        "precautions": [
            "Spray in evening hours (UV degrades azadirachtin rapidly).",
            "Always emulsify pure neem oil with soap solution, or oil separates on surface.",
            "Filter thoroughly to avoid knapsack nozzle choking."
        ],
        "source": "ICAR-Central Institute for Cotton Research (CICR) & KVK Guidelines"
    }
]

@router.get("")
def list_fertilizers():
    """List all organic fertilizers and bio-inputs."""
    return {"fertilizers": FERTILIZERS_DATA}

@router.get("/{slug}")
def get_fertilizer_details(slug: str):
    """Retrieve detailed recipe and application guidelines for an organic input."""
    item = next((f for f in FERTILIZERS_DATA if f["id"] == slug.lower() or slug.lower() in f["id"]), None)
    if not item:
        raise HTTPException(status_code=404, detail="Fertilizer/bio-input not found.")
    return {"fertilizer": item}
