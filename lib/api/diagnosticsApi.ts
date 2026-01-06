/**
 * 진단 시작 API
 * 영업 데이터를 Supabase의 diagnostics_history 테이블에 즉시 기록
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export interface StartDiagnosisRequest {
  company_name: string
  brand_name?: string
  channel_info?: {
    channels?: string[]
    urls?: string[]
    excel_data?: any
  }
}

export interface StartDiagnosisResponse {
  diagnosis_id: string
  report_id: string
  company_name: string
  created_at: string
  message: string
}

export async function startDiagnosis(
  request: StartDiagnosisRequest
): Promise<StartDiagnosisResponse> {
  try {
    const token = typeof window !== 'undefined' 
      ? localStorage.getItem('access_token') 
      : null

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    }

    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }

    const response = await fetch(`${API_BASE_URL}/api/diagnostics/start`, {
      method: 'POST',
      headers,
      body: JSON.stringify(request),
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: '서버 오류가 발생했습니다.' }))
      throw new Error(error.detail || '진단 시작에 실패했습니다.')
    }

    return await response.json()
  } catch (error) {
    console.error('진단 시작 오류:', error)
    throw error
  }
}

export async function getDiagnosisHistory(reportId: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/diagnostics/history/${reportId}`)
    
    if (!response.ok) {
      throw new Error('진단 이력 조회에 실패했습니다.')
    }

    return await response.json()
  } catch (error) {
    console.error('진단 이력 조회 오류:', error)
    throw error
  }
}
