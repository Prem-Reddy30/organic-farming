"""
Test dataset containing 30+ organic farming benchmark questions for Indian agriculture,
with expected key concepts, ground truth sources, and verification criteria.
"""

TEST_DATASET = [
    {
        "id": 1,
        "question": "How to prepare vermicompost?",
        "category": "Composting & Soil Fertility",
        "expected_source": "ICAR-CRIDA",
        "key_entities": ["Eisenia fetida", "cow dung", "moisture 60-70%", "45-60 days", "3 mm mesh"],
        "language": "en"
    },
    {
        "id": 2,
        "question": "Organic pest management for cotton?",
        "category": "Pest Management",
        "expected_source": "ICAR-CICR",
        "key_entities": ["Trichogramma", "pheromone trap", "neem oil", "NSKE 5%", "border crop maize"],
        "language": "en"
    },
    {
        "id": 3,
        "question": "How to manage fungal diseases in tomatoes?",
        "category": "Disease Management",
        "expected_source": "ICAR-IIHR",
        "key_entities": ["Trichoderma viride", "Pseudomonas fluorescens", "sour buttermilk", "staking", "mulching"],
        "language": "en"
    },
    {
        "id": 4,
        "question": "Organic nutrient management for paddy?",
        "category": "Cereal Agronomy",
        "expected_source": "ICAR-IIRR",
        "key_entities": ["Dhaincha", "green manure", "Azolla", "Jeevamrutham", "Panchagavya"],
        "language": "en"
    },
    {
        "id": 5,
        "question": "How to improve soil health naturally?",
        "category": "Soil Health",
        "expected_source": "NCOF",
        "key_entities": ["crop rotation", "green manuring", "organic matter", "vermicompost", "biofertilizers"],
        "language": "en"
    },
    {
        "id": 6,
        "question": "How to prepare Jeevamrutham step by step?",
        "category": "Bio-enhancers",
        "expected_source": "NCOF",
        "key_entities": ["cow dung 10 kg", "cow urine 10 liters", "jaggery 2 kg", "besan 2 kg", "48-72 hours"],
        "language": "en"
    },
    {
        "id": 7,
        "question": "జీవామృతం ఎలా తయారు చేయాలి?",
        "category": "Bio-enhancers (Telugu)",
        "expected_source": "NCOF",
        "key_entities": ["ఆవు పేడ", "గోమూత్రం", "బెల్లం", "శనగపిండి", "డ్రమ్ము"],
        "language": "te"
    },
    {
        "id": 8,
        "question": "केंचुआ खाद (वर्मीकम्पोस्ट) कैसे बनाएं?",
        "category": "Composting (Hindi)",
        "expected_source": "ICAR-CRIDA",
        "key_entities": ["गोबर", "केंचुआ", "नमी", "छाया"],
        "language": "hi"
    },
    {
        "id": 9,
        "question": "What is the formulation for Panchagavya?",
        "category": "Bio-stimulants",
        "expected_source": "TNAU",
        "key_entities": ["cow dung", "cow ghee", "cow urine", "milk", "curd", "coconut water", "banana"],
        "language": "en"
    },
    {
        "id": 10,
        "question": "What is the recommended foliar spray dosage of Panchagavya?",
        "category": "Bio-stimulants",
        "expected_source": "TNAU",
        "key_entities": ["3%", "300 ml", "10 liters"],
        "language": "en"
    },
    {
        "id": 11,
        "question": "How to control pink bollworm in cotton organically?",
        "category": "Pest Management",
        "expected_source": "ICAR-CICR",
        "key_entities": ["Gossyplure", "pheromone trap", "rosette flowers", "Trichocards"],
        "language": "en"
    },
    {
        "id": 12,
        "question": "What are the benefits of Dhaincha green manure?",
        "category": "Green Manure",
        "expected_source": "NCOF",
        "key_entities": ["Sesbania aculeata", "nitrogen fixation", "saline soil", "45-50 days"],
        "language": "en"
    },
    {
        "id": 13,
        "question": "How to use Azolla in wetland paddy?",
        "category": "Biofertilizers",
        "expected_source": "ICAR-IIRR",
        "key_entities": ["Azolla pinnata", "dual crop", "weed suppression", "atmospheric nitrogen"],
        "language": "en"
    },
    {
        "id": 14,
        "question": "How to treat seeds with Trichoderma viride?",
        "category": "Bio-seed treatment",
        "expected_source": "ICAR-IIHR",
        "key_entities": ["10 g per kg seed", "damping off", "root rot", "shade dry"],
        "language": "en"
    },
    {
        "id": 15,
        "question": "How to prepare 5% Neem Seed Kernel Extract (NSKE)?",
        "category": "Botanical Inputs",
        "expected_source": "ICAR-CICR",
        "key_entities": ["5 kg neem seed", "soap powder", "overnight", "100 liters"],
        "language": "en"
    },
    {
        "id": 16,
        "question": "What is the SRI method of rice cultivation?",
        "category": "Cereal Agronomy",
        "expected_source": "ICAR-IIRR",
        "key_entities": ["single seedling", "8-12 days old", "25x25 cm spacing", "cono-weeder"],
        "language": "en"
    },
    {
        "id": 17,
        "question": "How does Rhizobium biofertilizer work?",
        "category": "Biofertilizers",
        "expected_source": "NCOF",
        "key_entities": ["symbiotic", "legume root nodules", "nitrogen fixation", "pulses"],
        "language": "en"
    },
    {
        "id": 18,
        "question": "How to prevent damping-off in tomato nursery?",
        "category": "Disease Management",
        "expected_source": "ICAR-IIHR",
        "key_entities": ["soil solarization", "Trichoderma", "Pseudomonas", "raised beds"],
        "language": "en"
    },
    {
        "id": 19,
        "question": "What is the role of Phosphate Solubilizing Bacteria (PSB)?",
        "category": "Biofertilizers",
        "expected_source": "NCOF",
        "key_entities": ["organic acids", "insoluble phosphate", "calcium phosphate", "Bacillus megaterium"],
        "language": "en"
    },
    {
        "id": 20,
        "question": "వర్మీకంపోస్ట్ ఎలా తయారు చేస్తారు?",
        "category": "Composting (Telugu)",
        "expected_source": "ICAR-CRIDA",
        "key_entities": ["వానపాములు", "పేడ", "బెడ్", "తేమ"],
        "language": "te"
    },
    {
        "id": 21,
        "question": "How does fermented sour buttermilk protect crops?",
        "category": "Botanical Fungicide",
        "expected_source": "ICAR-IIHR",
        "key_entities": ["lactic acid", "copper wire", "50 ml/liter", "blight", "powdery mildew"],
        "language": "en"
    },
    {
        "id": 22,
        "question": "What are yellow sticky traps used for?",
        "category": "Pest Monitoring",
        "expected_source": "ICAR-IIHR",
        "key_entities": ["whitefly", "aphids", "thrips", "leaf curl virus", "15-20 traps"],
        "language": "en"
    },
    {
        "id": 23,
        "question": "Why should raw cow dung not be added directly to earthworms?",
        "category": "Vermiculture",
        "expected_source": "ICAR-CRIDA",
        "key_entities": ["heat release", "thermophilic decomposition", "pre-decomposition 15-20 days"],
        "language": "en"
    },
    {
        "id": 24,
        "question": "How to control sucking pests in cotton organically?",
        "category": "Pest Management",
        "expected_source": "ICAR-CICR",
        "key_entities": ["Chrysoperla", "neem oil", "border maize", "jassids", "whitefly"],
        "language": "en"
    },
    {
        "id": 25,
        "question": "What is Alternate Wetting and Drying (AWD) in rice?",
        "category": "Water Management",
        "expected_source": "ICAR-IIRR",
        "key_entities": ["hair cracking", "methane reduction", "root aeration", "water saving"],
        "language": "en"
    },
    {
        "id": 26,
        "question": "How to identify early blight in tomato leaves?",
        "category": "Disease Diagnostics",
        "expected_source": "ICAR-IIHR",
        "key_entities": ["concentric target-board rings", "Alternaria solani", "lower leaves"],
        "language": "en"
    },
    {
        "id": 27,
        "question": "How to apply neem cake to improve soil?",
        "category": "Organic Inputs",
        "expected_source": "ICAR-IIRR",
        "key_entities": ["nematode suppression", "nitrification inhibitor", "basal application"],
        "language": "en"
    },
    {
        "id": 28,
        "question": "Why is border cropping recommended in organic farming?",
        "category": "Agro-ecology",
        "expected_source": "ICAR-CICR",
        "key_entities": ["windbreak", "trap crop", "natural predators", "ladybird beetles", "maize"],
        "language": "en"
    },
    {
        "id": 29,
        "question": "What is the shelf life of freshly prepared Jeevamrutham?",
        "category": "Bio-enhancers",
        "expected_source": "NCOF",
        "key_entities": ["7 to 8 days", "microbial peak 48-72 hours", "do not store beyond 10 days"],
        "language": "en"
    },
    {
        "id": 30,
        "question": "Where should a farmer consult for acute crop failure or new disease outbreaks?",
        "category": "Farmer Advisory",
        "expected_source": "NCOF",
        "key_entities": ["Krishi Vigyan Kendra", "KVK", "Agricultural University"],
        "language": "en"
    }
]
