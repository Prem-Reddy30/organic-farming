import {
  ChatMessage,
  CropInfo,
  CropGuideResponse,
  FertilizerItem,
  PestRecord,
  IngestedDocument,
  EvaluationBenchmarkSummary,
  Language
} from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

export async function sendMessageToRAG(
  query: string,
  sessionId?: string,
  cropFilter?: string,
  topicFilter?: string,
  regionFilter?: string,
  languageOverride?: Language
): Promise<any> {
  const resp = await fetch(`${API_BASE_URL}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query,
      session_id: sessionId,
      crop_filter: cropFilter,
      topic_filter: topicFilter,
      region_filter: regionFilter,
      language_override: languageOverride
    })
  });
  if (!resp.ok) {
    const err = await resp.json().catch(() => ({ detail: 'Failed to communicate with RAG engine' }));
    throw new Error(err.detail || 'RAG response error');
  }
  return resp.json();
}

export async function fetchChatHistory(sessionId?: string): Promise<any> {
  const url = sessionId
    ? `${API_BASE_URL}/api/chat/history?session_id=${sessionId}`
    : `${API_BASE_URL}/api/chat/history`;
  const resp = await fetch(url);
  if (!resp.ok) return { sessions: [] };
  return resp.json();
}

export async function fetchCrops(): Promise<CropInfo[]> {
  const resp = await fetch(`${API_BASE_URL}/api/crops`);
  if (!resp.ok) throw new Error('Failed to load crops catalog');
  const data = await resp.json();
  return data.crops || [];
}

export async function fetchCropGuide(
  crop: string,
  state: string = 'Telangana',
  district?: string,
  soilType?: string,
  season: string = 'Kharif',
  stage?: string
): Promise<CropGuideResponse> {
  const params = new URLSearchParams({ state, season });
  if (district) params.append('district', district);
  if (soilType) params.append('soil_type', soilType);
  if (stage) params.append('stage', stage);

  const resp = await fetch(`${API_BASE_URL}/api/crop-guide/${encodeURIComponent(crop)}?${params.toString()}`);
  if (!resp.ok) throw new Error('Failed to fetch crop guide');
  return resp.json();
}

export async function fetchFertilizers(): Promise<FertilizerItem[]> {
  const resp = await fetch(`${API_BASE_URL}/api/fertilizers`);
  if (!resp.ok) throw new Error('Failed to fetch fertilizers');
  const data = await resp.json();
  return data.fertilizers || [];
}

export async function fetchPests(crop?: string): Promise<PestRecord[]> {
  const url = crop && crop !== 'All'
    ? `${API_BASE_URL}/api/pests?crop=${encodeURIComponent(crop)}`
    : `${API_BASE_URL}/api/pests`;
  const resp = await fetch(url);
  if (!resp.ok) throw new Error('Failed to fetch pests');
  const data = await resp.json();
  return data.pests || [];
}

export async function diagnoseCropIssue(crop: string, symptoms: string, imageBase64?: string): Promise<any> {
  const resp = await fetch(`${API_BASE_URL}/api/pests/diagnose`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      crop,
      symptoms,
      image_base64: imageBase64
    })
  });
  if (!resp.ok) {
    const err = await resp.json().catch(() => ({ detail: 'Failed to diagnose' }));
    throw new Error(err.detail || 'Diagnostic error');
  }
  return resp.json();
}

export async function fetchSources(crop?: string, topic?: string): Promise<{ total: number; sources: IngestedDocument[] }> {
  const params = new URLSearchParams();
  if (crop && crop !== 'All') params.append('crop', crop);
  if (topic && topic !== 'All') params.append('topic', topic);

  const resp = await fetch(`${API_BASE_URL}/api/sources?${params.toString()}`);
  if (!resp.ok) throw new Error('Failed to load knowledge sources');
  return resp.json();
}

export async function uploadAgriculturalDocument(formData: FormData, adminKey: string): Promise<any> {
  const resp = await fetch(`${API_BASE_URL}/api/ingest/upload`, {
    method: 'POST',
    headers: {
      'X-Admin-Key': adminKey
    },
    body: formData
  });
  if (!resp.ok) {
    const err = await resp.json().catch(() => ({ detail: 'Upload failed' }));
    throw new Error(err.detail || 'Failed to ingest document');
  }
  return resp.json();
}

export async function ingestWebUrl(payload: any, adminKey: string): Promise<any> {
  const resp = await fetch(`${API_BASE_URL}/api/ingest/url`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Admin-Key': adminKey
    },
    body: JSON.stringify(payload)
  });
  if (!resp.ok) {
    const err = await resp.json().catch(() => ({ detail: 'URL ingestion failed' }));
    throw new Error(err.detail || 'Failed to ingest URL');
  }
  return resp.json();
}

export async function deleteDocument(docId: string, adminKey: string): Promise<any> {
  const resp = await fetch(`${API_BASE_URL}/api/documents/${encodeURIComponent(docId)}`, {
    method: 'DELETE',
    headers: { 'X-Admin-Key': adminKey }
  });
  if (!resp.ok) {
    const err = await resp.json().catch(() => ({ detail: 'Failed to delete' }));
    throw new Error(err.detail || 'Deletion error');
  }
  return resp.json();
}

export async function fetchAdminStatus(adminKey: string): Promise<any> {
  const resp = await fetch(`${API_BASE_URL}/api/admin/ingestion-status`, {
    headers: { 'X-Admin-Key': adminKey }
  });
  if (!resp.ok) throw new Error('Unauthorized or failed to fetch admin status');
  return resp.json();
}

export async function runRAGEvaluation(limit: number = 30): Promise<EvaluationBenchmarkSummary> {
  const resp = await fetch(`${API_BASE_URL}/api/evaluation/run?limit=${limit}`);
  if (!resp.ok) throw new Error('Evaluation run failed');
  return resp.json();
}
