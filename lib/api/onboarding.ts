/**
 * 온보딩 API 클라이언트
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export interface OnboardingStatus {
  id: string
  brand_id: string
  company_name: string
  ga4_received: boolean
  naver_smartstore_received: boolean
  naver_datacenter_received: boolean
  naver_bizadvisor_received: boolean
  coupang_received: boolean
  sns_received: boolean
  email_received: boolean
  homepage_received: boolean
  onboarding_status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'ON_HOLD'
  onboarding_progress: number
  required_data_complete: boolean
  notes?: string
  assigned_to?: string
  last_updated_by?: string
  created_at: string
  updated_at: string
}

export interface ChannelDetails {
  received_date?: string
  updated_at?: string
  notes?: string
  [key: string]: any
}

export interface UpdateChannelRequest {
  brand_id: string
  channel: 'ga4' | 'naver_smartstore' | 'naver_datacenter' | 'naver_bizadvisor' | 'coupang' | 'sns' | 'email' | 'homepage'
  received: boolean
  details?: ChannelDetails
}

export interface RequiredDataCheck {
  is_complete: boolean
  missing_channels: string[]
  message: string
  onboarding_status?: OnboardingStatus
}

/**
 * 온보딩 상태 조회
 */
export async function getOnboardingStatus(brandId: string): Promise<OnboardingStatus | null> {
  const response = await fetch(`${API_BASE_URL}/api/onboarding/status/${brandId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error(`온보딩 상태 조회 실패: ${response.statusText}`)
  }

  const result = await response.json()
  return result.data
}

/**
 * 모든 고객사의 온보딩 상태 조회 (관리자용)
 */
export async function getAllOnboardingStatuses(): Promise<OnboardingStatus[]> {
  const response = await fetch(`${API_BASE_URL}/api/onboarding/status`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error(`온보딩 상태 목록 조회 실패: ${response.statusText}`)
  }

  const result = await response.json()
  return result.data || []
}

/**
 * 채널별 수령 여부 업데이트
 */
export async function updateChannelStatus(request: UpdateChannelRequest): Promise<OnboardingStatus> {
  const response = await fetch(`${API_BASE_URL}/api/onboarding/update-channel`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.detail || `채널 상태 업데이트 실패: ${response.statusText}`)
  }

  const result = await response.json()
  return result.data
}

/**
 * 필수 데이터 수령 여부 확인
 */
export async function checkRequiredData(brandId: string): Promise<RequiredDataCheck> {
  const response = await fetch(`${API_BASE_URL}/api/onboarding/check-required/${brandId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error(`필수 데이터 확인 실패: ${response.statusText}`)
  }

  const result = await response.json()
  return result.data
}

/**
 * 온보딩 요약 통계 조회
 */
export async function getOnboardingSummary(): Promise<{
  total_clients: number
  completed: number
  in_progress: number
  not_started: number
  required_data_complete: number
  required_data_incomplete: number
}> {
  const response = await fetch(`${API_BASE_URL}/api/onboarding/summary`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error(`온보딩 요약 조회 실패: ${response.statusText}`)
  }

  const result = await response.json()
  return result.data
}
