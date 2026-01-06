/**
 * 회원사 관리 API 클라이언트
 */

import { fetchWithAuth } from '@/lib/auth/auth'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

/**
 * 인증 헤더 가져오기
 */
function getAuthHeaders(): HeadersInit {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  }
  
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('access_token')
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }
  }
  
  return headers
}

export interface ClientMaster {
  id: string
  sales_rep_id: string
  company_name: string
  manager_name?: string
  contact?: string
  company_url?: string
  email?: string
  additional_emails?: string[]
  phone?: string
  additional_phones?: Array<{ type: string; number: string }>
  fax?: string
  additional_managers?: Array<{ name: string; role: string; contact: string }>
  contract_details?: Record<string, any>
  contract_history?: Array<{ start_date: string; end_date: string; type: string; details?: Record<string, any> }>
  ga4_status: 'None' | 'Pending' | 'Completed'
  sns_status: 'None' | 'Pending' | 'Completed'
  api_status: 'None' | 'Pending' | 'Completed'
  data_grade?: 'A' | 'B' | 'C'
  data_grade_note?: string
  client_status: 'Active' | 'Inactive' | 'OnHold' | 'Lost'
  contract_start_date?: string
  contract_end_date?: string
  contract_type?: string
  notes?: string
  tags?: string[]
  brand_id?: string
  created_at: string
  updated_at: string
  created_by?: string
  updated_by?: string
}

export interface CreateClientRequest {
  company_name: string
  manager_name?: string
  contact?: string
  company_url?: string
  notes?: string
  tags?: string[]
  brand_id?: string
}

export interface UpdateClientRequest {
  company_name?: string
  manager_name?: string
  contact?: string
  company_url?: string
  email?: string
  additional_emails?: string[]
  phone?: string
  additional_phones?: Array<{ type: string; number: string }>
  fax?: string
  additional_managers?: Array<{ name: string; role: string; contact: string }>
  contract_details?: Record<string, any>
  contract_history?: Array<{ start_date: string; end_date: string; type: string; details?: Record<string, any> }>
  ga4_status?: 'None' | 'Pending' | 'Completed'
  sns_status?: 'None' | 'Pending' | 'Completed'
  api_status?: 'None' | 'Pending' | 'Completed'
  data_grade?: 'A' | 'B' | 'C'
  client_status?: 'Active' | 'Inactive' | 'OnHold' | 'Lost'
  contract_start_date?: string
  contract_end_date?: string
  contract_type?: string
  notes?: string
  tags?: string[]
  brand_id?: string
}

export interface ClientStats {
  total_clients: number
  active_clients: number
  completed_ga4: number
  completed_sns: number
  completed_api: number
  grade_a: number
  grade_b: number
  grade_c: number
}

/**
 * 내가 담당한 회원사 목록 조회
 */
export async function getMyClients(): Promise<ClientMaster[]> {
  // 클라이언트 사이드에서만 실행
  if (typeof window === 'undefined') {
    return []
  }
  
  try {
    const response = await fetchWithAuth(`${API_BASE_URL}/api/client-master/`, {
      method: 'GET',
    })

    if (!response.ok) {
      throw new Error(`회원사 목록 조회 실패: ${response.statusText}`)
    }

    const result = await response.json()
    return result.data || []
  } catch (error) {
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('서버에 연결할 수 없습니다. 백엔드 서버가 실행 중인지 확인해주세요.')
    }
    throw error
  }
}

/**
 * 회원사 상세 정보 조회
 */
export async function getClientDetail(clientId: string): Promise<ClientMaster> {
  // 클라이언트 사이드에서만 실행
  if (typeof window === 'undefined') {
    throw new Error('이 함수는 클라이언트 사이드에서만 실행할 수 있습니다.')
  }
  
  try {
    const response = await fetchWithAuth(`${API_BASE_URL}/api/client-master/${clientId}`, {
      method: 'GET',
    })

    if (!response.ok) {
      throw new Error(`회원사 상세 조회 실패: ${response.statusText}`)
    }

    const result = await response.json()
    return result.data
  } catch (error) {
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('서버에 연결할 수 없습니다. 백엔드 서버가 실행 중인지 확인해주세요.')
    }
    throw error
  }
}

/**
 * 신규 회원사 등록
 */
export async function createClient(request: CreateClientRequest): Promise<ClientMaster> {
  // 클라이언트 사이드에서만 실행
  if (typeof window === 'undefined') {
    throw new Error('이 함수는 클라이언트 사이드에서만 실행할 수 있습니다.')
  }
  
  try {
    const response = await fetchWithAuth(`${API_BASE_URL}/api/client-master/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    })

    if (!response.ok) {
      let errorMessage = `회원사 등록 실패: ${response.statusText}`
      try {
        const error = await response.json()
        errorMessage = error.detail || error.message || errorMessage
      } catch {
        // JSON 파싱 실패 시 기본 메시지 사용
      }
      throw new Error(errorMessage)
    }

    const result = await response.json()
    return result.data
  } catch (error) {
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('서버에 연결할 수 없습니다. 백엔드 서버가 실행 중인지 확인해주세요.')
    }
    throw error
  }
}

/**
 * 회원사 정보 업데이트
 */
export async function updateClient(
  clientId: string,
  request: UpdateClientRequest
): Promise<ClientMaster> {
  try {
    const response = await fetchWithAuth(`${API_BASE_URL}/api/client-master/${clientId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    })

    if (!response.ok) {
      let errorMessage = `회원사 업데이트 실패: ${response.statusText}`
      try {
        const error = await response.json()
        errorMessage = error.detail || error.message || errorMessage
      } catch {
        // JSON 파싱 실패 시 기본 메시지 사용
      }
      throw new Error(errorMessage)
    }

    const result = await response.json()
    return result.data
  } catch (error) {
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('서버에 연결할 수 없습니다. 백엔드 서버가 실행 중인지 확인해주세요.')
    }
    throw error
  }
}

/**
 * 회원사 삭제
 */
export async function deleteClient(clientId: string): Promise<void> {
  try {
    const response = await fetchWithAuth(`${API_BASE_URL}/api/client-master/${clientId}`, {
      method: 'DELETE',
    })

    if (!response.ok) {
      let errorMessage = `회원사 삭제 실패: ${response.statusText}`
      try {
        const error = await response.json()
        errorMessage = error.detail || error.message || errorMessage
      } catch {
        // JSON 파싱 실패 시 기본 메시지 사용
      }
      throw new Error(errorMessage)
    }
  } catch (error) {
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('서버에 연결할 수 없습니다. 백엔드 서버가 실행 중인지 확인해주세요.')
    }
    throw error
  }
}

/**
 * 회원사 통계 조회
 */
export async function getClientStats(): Promise<ClientStats> {
  // 클라이언트 사이드에서만 실행
  if (typeof window === 'undefined') {
    return {
      total_clients: 0,
      active_clients: 0,
      completed_ga4: 0,
      completed_sns: 0,
      completed_api: 0,
      grade_a: 0,
      grade_b: 0,
      grade_c: 0
    }
  }
  
  try {
    const response = await fetchWithAuth(`${API_BASE_URL}/api/client-master/stats/summary`, {
      method: 'GET',
    })

    if (!response.ok) {
      throw new Error(`통계 조회 실패: ${response.statusText}`)
    }

    const result = await response.json()
    return result.data
  } catch (error) {
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('서버에 연결할 수 없습니다. 백엔드 서버가 실행 중인지 확인해주세요.')
    }
    throw error
  }
}

/**
 * 데이터 요청 지침서 이메일 발송
 */
export async function sendDataRequestGuide(clientId: string): Promise<{
  success: boolean
  message: string
  sent_at?: string
  recipient?: string
}> {
  try {
    const response = await fetchWithAuth(`${API_BASE_URL}/api/client-master/${clientId}/send-guide`, {
      method: 'POST',
    })

    if (!response.ok) {
      let errorMessage = `지침서 발송 실패: ${response.statusText}`
      try {
        const error = await response.json()
        errorMessage = error.detail || error.message || errorMessage
      } catch {
        // JSON 파싱 실패 시 기본 메시지 사용
      }
      throw new Error(errorMessage)
    }

    const result = await response.json()
    return result
  } catch (error) {
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('서버에 연결할 수 없습니다. 백엔드 서버가 실행 중인지 확인해주세요.')
    }
    throw error
  }
}

/**
 * 데이터 등급 자동 계산 (정확성 기준)
 * 
 * 정확성 기준:
 * - A등급: API 연동으로 실시간 정확한 데이터 수집 (가장 신뢰도 높음)
 * - B등급: 확장 프로그램으로 보완된 데이터 수집 (중간 신뢰도)
 * - C등급: 수동 입력 또는 추론 데이터 (낮은 신뢰도)
 */
export function calculateDataGrade(
  ga4Status: 'None' | 'Pending' | 'Completed',
  snsStatus: 'None' | 'Pending' | 'Completed',
  apiStatus: 'None' | 'Pending' | 'Completed'
): 'A' | 'B' | 'C' {
  // 정확성 기준으로 등급 계산
  // API 연동(ga4Status)이 Completed면 A등급 (가장 정확한 데이터)
  if (ga4Status === 'Completed') {
    return 'A' // API 연동으로 실시간 정확한 데이터
  }
  
  // 확장 프로그램(apiStatus)이 Completed면 B등급 (보완된 데이터)
  if (apiStatus === 'Completed') {
    return 'B' // 확장 프로그램으로 보완된 데이터
  }
  
  // 수동 입력(snsStatus)만 Completed거나 모두 None이면 C등급
  return 'C' // 수동 입력 또는 추론 데이터
}
