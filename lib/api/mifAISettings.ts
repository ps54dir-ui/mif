/**
 * MIF AI Settings API Client
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export interface APIKeyStatus {
  has_key: boolean;
  key_preview?: string | null;
}

export interface SaveAPIKeyRequest {
  api_key: string;
}

export interface SaveAPIKeyResponse {
  success: boolean;
  message: string;
}

/**
 * API Key 상태 조회
 */
export async function getAPIKeyStatus(): Promise<APIKeyStatus> {
  const token = localStorage.getItem('access_token');
  
  const response = await fetch(`${API_URL}/api/mif-ai-settings/api-key`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    }
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'API Key 조회 실패' }));
    throw new Error(error.detail || 'API Key 조회 실패');
  }
  
  return response.json();
}

/**
 * API Key 저장
 */
export async function saveAPIKey(apiKey: string): Promise<SaveAPIKeyResponse> {
  const token = localStorage.getItem('access_token');
  
  const response = await fetch(`${API_URL}/api/mif-ai-settings/api-key`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    },
    body: JSON.stringify({ api_key: apiKey })
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'API Key 저장 실패' }));
    throw new Error(error.detail || 'API Key 저장 실패');
  }
  
  return response.json();
}

/**
 * API Key 삭제
 */
export async function deleteAPIKey(): Promise<SaveAPIKeyResponse> {
  const token = localStorage.getItem('access_token');
  
  const response = await fetch(`${API_URL}/api/mif-ai-settings/api-key`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    }
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'API Key 삭제 실패' }));
    throw new Error(error.detail || 'API Key 삭제 실패');
  }
  
  return response.json();
}
