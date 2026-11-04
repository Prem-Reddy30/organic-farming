export type Language = 'en' | 'te' | 'hi';

export interface SourceCitation {
  id?: string;
  title: string;
  author?: string;
  source_url?: string;
  page_number?: number;
  crop_category?: string;
  farming_topic?: string;
  relevance_score?: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  sources?: SourceCitation[];
  language?: Language;
  used_llm?: string;
  suggested_questions?: string[];
  timestamp: string;
  isStreaming?: boolean;
}

export interface CropInfo {
  id: string;
  name: string;
  scientific_name: string;
  category: string;
  seasons: string[];
  major_states: string[];
  suitable_soils: string[];
  water_requirement: string;
  duration_days: string;
  icon: string;
}

export interface CropGuideStage {
  title: string;
  details: string;
}

export interface CropGuideResponse {
  crop: CropInfo;
  region_parameters: {
    state: string;
    district: string;
    soil_type: string;
    season: string;
  };
  selected_stage?: string;
  stages: Record<string, CropGuideStage>;
  sources: SourceCitation[];
}

export interface FertilizerItem {
  id: string;
  name: string;
  type: string;
  category: string;
  ideal_for: string;
  prep_time: string;
  active_shelf_life: string;
  cost_per_acre: string;
  npk_and_bio: string;
  ingredients: string[];
  preparation_steps: string[];
  application_method: string;
  precautions: string[];
  source: string;
}

export interface PestRecord {
  id: string;
  crop: string;
  pest_name: string;
  symptoms: string;
  preventive_controls: string[];
  biological_controls: string[];
  botanical_sprays: string[];
  expert_advisory: string;
}

export interface IngestedDocument {
  id: string;
  title: string;
  source_url: string;
  author: string;
  publication_date: string;
  crop_category: string;
  farming_topic: string;
  language: string;
  chunk_count: number;
  status: string;
}

export interface EvaluationBenchmarkSummary {
  total_benchmark_questions: number;
  retrieval_precision_rate: number;
  average_context_concept_coverage: number;
  answer_faithfulness_rate: number;
  citation_correctness_rate: number;
  average_response_relevance: number;
  unsupported_answer_detection_active: boolean;
  average_latency_seconds: number;
  overall_rag_grade: string;
  detailed_results: Array<{
    id: number;
    question: string;
    category: string;
    expected_source: string;
    retrieval_hit: boolean;
    entity_coverage_pct: number;
    faithfulness_score: number;
    citation_correct: boolean;
    latency_sec: number;
    retrieved_sources_count: number;
  }>;
}

export interface UserProfile {
  name: string;
  role: 'farmer' | 'student' | 'expert' | 'admin';
  preferredLanguage: Language;
  state: string;
  primaryCrop: string;
  farmSizeAcres?: number;
}
