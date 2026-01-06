/**
 * 통합 API 클라이언트
 * Notion, Git, GitHub 등 외부 서비스 연동
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

async function authenticatedFetch(url: string, options: RequestInit = {}) {
  const token = localStorage.getItem('access_token')
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  }
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }
  
  const response = await fetch(`${API_URL}${url}`, {
    ...options,
    headers,
  })
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'Unknown error' }))
    throw new Error(error.detail || `HTTP error! status: ${response.status}`)
  }
  
  return response.json()
}

// Notion API
export interface NotionSyncRequest {
  database_id: string
  report_id?: string
  page_id?: string
}

export interface NotionSyncResponse {
  success: boolean
  page_id?: string
  page_url?: string
  message: string
}

export async function syncReportToNotion(request: NotionSyncRequest): Promise<NotionSyncResponse> {
  return authenticatedFetch('/api/integrations/notion/sync-report', {
    method: 'POST',
    body: JSON.stringify(request),
  })
}

export async function syncDashboardToNotion(
  database_id: string,
  company_name: string
): Promise<NotionSyncResponse> {
  return authenticatedFetch('/api/integrations/notion/sync-dashboard', {
    method: 'POST',
    body: JSON.stringify({ database_id, company_name }),
  })
}

export async function testNotionConnection(): Promise<{ success: boolean; message: string }> {
  return authenticatedFetch('/api/integrations/notion/test', {
    method: 'GET',
  })
}
