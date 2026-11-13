import { ReportAnalysis, AnalyzeReportResponse } from '../types/report';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

export async function uploadAndAnalyzeFile(file: File): Promise<AnalyzeReportResponse> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${API_BASE_URL}/api/reports/analyze`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || `Upload failed with status ${response.status}`);
  }

  return response.json();
}

export async function checkBackendHealth(): Promise<any> {
  const response = await fetch(`${API_BASE_URL}/api/health`);
  if (!response.ok) {
    throw new Error('Backend health check failed');
  }
  return response.json();
}

export async function analyzeText(text: string, userId?: string): Promise<ReportAnalysis> {
  const response = await fetch(`${API_BASE_URL}/api/analyze/text`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ text, user_id: userId }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || `Text analysis failed with status ${response.status}`);
  }

  return response.json();
}

export async function fetchSampleReport(): Promise<ReportAnalysis> {
  const response = await fetch(`${API_BASE_URL}/api/analyze/sample`);
  if (!response.ok) {
    throw new Error('Failed to load sample report');
  }
  return response.json();
}

export async function fetchReportHistory(userId?: string): Promise<ReportAnalysis[]> {
  const url = userId 
    ? `${API_BASE_URL}/api/reports?user_id=${encodeURIComponent(userId)}`
    : `${API_BASE_URL}/api/reports`;
    
  const response = await fetch(url);
  if (!response.ok) {
    return [];
  }
  return response.json();
}
