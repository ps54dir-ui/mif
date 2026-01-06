/**
 * 데이터 수집 방법 관리 API 클라이언트
 */

import { fetchWithAuth } from '@/lib/auth/auth'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export interface DataCollectionMethod {
  id: string
  channel_type: string
  method_name: string
  method_type: 'API' | 'EXTENSION' | 'MANUAL'
  priority: number
  description?: string
  required_fields?: Record<string, string>
  setup_guide_url?: string
  is_active: boolean
}

export interface ClientDataCollectionConfig {
  id?: string
  client_id: string
  channel_type: string
  method_id?: string
  method_type: 'API' | 'EXTENSION' | 'MANUAL'
  priority: number
  collection_status: 'None' | 'Pending' | 'Completed' | 'Failed'
  collection_config?: Record<string, any>
  notes?: string
  last_collected_at?: string
  next_collection_at?: string
}

export interface ChannelCollectionSummary {
  channel_type: string
  methods: DataCollectionMethod[]
  selected_methods: Array<{
    method: DataCollectionMethod
    config: ClientDataCollectionConfig
  }>
}

/**
 * 데이터 수집 방법 목록 조회
 */
export async function getCollectionMethods(
  channelType?: string
): Promise<DataCollectionMethod[]> {
  if (typeof window === 'undefined') {
    return []
  }
  
  try {
    const url = channelType
      ? `${API_BASE_URL}/api/data-collection/methods/${channelType}`
      : `${API_BASE_URL}/api/data-collection/methods`
    
    const response = await fetchWithAuth(url, {
      method: 'GET',
    })

    if (!response.ok) {
      throw new Error(`데이터 수집 방법 조회 실패: ${response.statusText}`)
    }

    const result = await response.json()
    return result.data || []
  } catch (error) {
    console.error('데이터 수집 방법 조회 실패:', error)
    throw error
  }
}

/**
 * 회원사별 데이터 수집 설정 조회
 */
export async function getClientCollectionConfig(
  clientId: string
): Promise<ClientDataCollectionConfig[]> {
  if (typeof window === 'undefined') {
    return []
  }
  
  try {
    const response = await fetchWithAuth(
      `${API_BASE_URL}/api/data-collection/client/${clientId}`,
      {
        method: 'GET',
      }
    )

    if (!response.ok) {
      throw new Error(`데이터 수집 설정 조회 실패: ${response.statusText}`)
    }

    const result = await response.json()
    return result.data || []
  } catch (error) {
    console.error('데이터 수집 설정 조회 실패:', error)
    throw error
  }
}

/**
 * 회원사별 데이터 수집 설정 저장/업데이트
 */
export async function setClientCollectionConfig(
  clientId: string,
  config: Omit<ClientDataCollectionConfig, 'id'>
): Promise<ClientDataCollectionConfig> {
  if (typeof window === 'undefined') {
    throw new Error('이 함수는 클라이언트 사이드에서만 실행할 수 있습니다.')
  }
  
  try {
    const response = await fetchWithAuth(
      `${API_BASE_URL}/api/data-collection/client/${clientId}/config`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(config),
      }
    )

    if (!response.ok) {
      let errorMessage = `데이터 수집 설정 저장 실패: ${response.statusText}`
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
    console.error('데이터 수집 설정 저장 실패:', error)
    throw error
  }
}

/**
 * 회원사별 데이터 수집 요약 정보 조회
 */
export async function getClientCollectionSummary(
  clientId: string
): Promise<ChannelCollectionSummary[]> {
  if (typeof window === 'undefined') {
    return []
  }
  
  try {
    const response = await fetchWithAuth(
      `${API_BASE_URL}/api/data-collection/client/${clientId}/summary`,
      {
        method: 'GET',
      }
    )

    if (!response.ok) {
      // 404나 다른 오류 시 빈 배열 반환
      if (response.status === 404) {
        return []
      }
      // 서버 오류 시에도 빈 배열 반환하여 페이지가 계속 작동하도록
      console.warn(`데이터 수집 요약 조회 실패 (${response.status}): ${response.statusText}`)
      return []
    }

    const result = await response.json()
    return result.data || []
  } catch (error) {
    console.error('데이터 수집 요약 조회 실패:', error)
    // 에러를 throw하지 않고 빈 배열 반환
    return []
  }
}

/**
 * 채널 타입 한글명 변환
 */
export function getChannelLabel(channelType: string): string {
  const labels: Record<string, string> = {
    'GA4': 'GA4',
    'INSTAGRAM': '인스타그램',
    'YOUTUBE': '유튜브',
    'FACEBOOK': '페이스북',
    'TWITTER': '트위터/X',
    'TIKTOK': '틱톡',
    'THREADS': '쓰레드',
    'NAVER_SMARTSTORE': '네이버 스마트스토어',
    'COUPANG': '쿠팡',
    'NAVER_DATACENTER': '네이버 데이터센터',
    'NAVER_BIZADVISOR': '네이버 비즈어드바이저',
    'NAVER_PLACE': '네이버 플레이스',
    'NAVER_CAFE': '네이버 카페',
    'OWN_STORE': '자사몰',
    'HOMEPAGE': '홈페이지'
  }
  return labels[channelType] || channelType
}

/**
 * 수집 방법 타입 한글명 변환
 */
export function getMethodTypeLabel(methodType: string): string {
  const labels: Record<string, string> = {
    'API': 'API 연동',
    'EXTENSION': '확장 프로그램',
    'MANUAL': '수동 입력'
  }
  return labels[methodType] || methodType
}
