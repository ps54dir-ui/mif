/**
 * 회원사별 채널 운영 및 데이터 제공 현황 관리 API 클라이언트
 */

import { fetchWithAuth } from '@/lib/auth/auth'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export interface ClientChannelData {
  id?: string
  client_id: string
  channel_type: string
  provided_type: 'API_KEY' | 'CHANNEL_NAME' | 'CHANNEL_URL' | 'MANUAL' | 'NONE'
  provided_data?: Record<string, any>
  is_active: boolean
  collection_status: 'None' | 'Pending' | 'Completed' | 'Failed'
  notes?: string
  last_collected_at?: string
  next_collection_at?: string
  created_at?: string
  updated_at?: string
}

export interface UpdateChannelDataRequest {
  provided_type?: 'API_KEY' | 'CHANNEL_NAME' | 'CHANNEL_URL' | 'MANUAL' | 'NONE'
  provided_data?: Record<string, any>
  is_active?: boolean
  collection_status?: 'None' | 'Pending' | 'Completed' | 'Failed'
  notes?: string
}

/**
 * 회원사별 운영 채널 및 제공 항목 조회
 */
export async function getClientChannels(
  clientId: string
): Promise<ClientChannelData[]> {
  if (typeof window === 'undefined') {
    return []
  }
  
  try {
    const response = await fetchWithAuth(
      `${API_BASE_URL}/api/client-channel-data/client/${clientId}`,
      {
        method: 'GET',
      }
    )

    if (!response.ok) {
      if (response.status === 404) {
        return []
      }
      console.warn(`채널 데이터 조회 실패 (${response.status}): ${response.statusText}`)
      return []
    }

    const result = await response.json()
    return result.data || []
  } catch (error) {
    console.error('채널 데이터 조회 실패:', error)
    return []
  }
}

/**
 * 회원사 채널 추가 또는 업데이트
 */
export async function addOrUpdateChannel(
  clientId: string,
  channelData: Omit<ClientChannelData, 'id' | 'created_at' | 'updated_at'>
): Promise<ClientChannelData> {
  if (typeof window === 'undefined') {
    throw new Error('이 함수는 클라이언트 사이드에서만 실행할 수 있습니다.')
  }
  
  try {
    const response = await fetchWithAuth(
      `${API_BASE_URL}/api/client-channel-data/client/${clientId}/channel`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(channelData),
      }
    )

    if (!response.ok) {
      let errorMessage = `채널 데이터 저장 실패: ${response.statusText}`
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
    console.error('채널 데이터 저장 실패:', error)
    throw error
  }
}

/**
 * 회원사 채널 데이터 업데이트
 */
export async function updateChannelData(
  clientId: string,
  channelType: string,
  updateData: UpdateChannelDataRequest
): Promise<ClientChannelData> {
  if (typeof window === 'undefined') {
    throw new Error('이 함수는 클라이언트 사이드에서만 실행할 수 있습니다.')
  }
  
  try {
    const response = await fetchWithAuth(
      `${API_BASE_URL}/api/client-channel-data/client/${clientId}/channel/${channelType}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      }
    )

    if (!response.ok) {
      let errorMessage = `채널 데이터 업데이트 실패: ${response.statusText}`
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
    console.error('채널 데이터 업데이트 실패:', error)
    throw error
  }
}

/**
 * 회원사 채널 삭제
 */
export async function deleteChannel(
  clientId: string,
  channelType: string
): Promise<void> {
  if (typeof window === 'undefined') {
    throw new Error('이 함수는 클라이언트 사이드에서만 실행할 수 있습니다.')
  }
  
  try {
    const response = await fetchWithAuth(
      `${API_BASE_URL}/api/client-channel-data/client/${clientId}/channel/${channelType}`,
      {
        method: 'DELETE',
      }
    )

    if (!response.ok) {
      let errorMessage = `채널 데이터 삭제 실패: ${response.statusText}`
      try {
        const error = await response.json()
        errorMessage = error.detail || error.message || errorMessage
      } catch {
        // JSON 파싱 실패 시 기본 메시지 사용
      }
      throw new Error(errorMessage)
    }
  } catch (error) {
    console.error('채널 데이터 삭제 실패:', error)
    throw error
  }
}

/**
 * 제공 타입 한글명 변환
 */
export function getProvidedTypeLabel(providedType: string): string {
  const labels: Record<string, string> = {
    'API_KEY': 'API 키 제공',
    'CHANNEL_NAME': '채널명 제공',
    'CHANNEL_URL': 'URL 제공',
    'MANUAL': '수동 입력',
    'NONE': '미제공'
  }
  return labels[providedType] || providedType
}
