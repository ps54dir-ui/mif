/**
 * 데이터 통합 API 클라이언트
 * GA4, 네이버, 쿠팡 등 여러 데이터 소스 통합
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export interface SyncDataRequest {
  start_date: string
  end_date: string
  keywords?: string[]
}

export interface DashboardRequest {
  start_date: string
  end_date: string
  page_url?: string
}

export interface IntegratedData {
  ga4?: any
  naver_smartstore?: any
  naver_datacenter?: any
  naver_bizadvisor?: any
  coupang?: any
  timestamp: string
  dateRange: {
    startDate: string
    endDate: string
  }
}

export interface DashboardData {
  summary: {
    total_sessions: number
    total_revenue: number
    overall_cvr: number
    avg_satisfaction: number
    return_rate: number
  }
  channelComparison: Record<string, {
    traffic: number
    cvr: number
    aov: number
    revenue: number
  }>
  detailedPageScore: {
    overall_score: number
    first_impression: number
    trust_credibility: number
    persuasion: number
    structure_ux: number
    conversion: number
    technical: number
    engagement: number
  }
  cvrPrediction: {
    current_cvr: number
    projected_cvr: number
    confidence: number
  }
  customerJourney: {
    discovery: {
      channel: string
      timestamp: string
      source: string
    }
    consideration: {
      searches: number
      pageviews: number
      time_spent: number
    }
    purchase: {
      channel: string
      amount: number
      timestamp: string
    }
    post_purchase: {
      return_rate: number
      satisfaction: number
      repeat_purchase: boolean
    }
  }
  customerSegments: Record<string, {
    segment: string
    count: number
    characteristics: any
  }>
  timestamp: string
}

/**
 * 모든 데이터 소스에서 데이터 동기화
 */
export async function syncAllData(request: SyncDataRequest): Promise<IntegratedData> {
  const response = await fetch(`${API_BASE_URL}/api/integrations/data/sync`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  })

  if (!response.ok) {
    throw new Error(`데이터 동기화 실패: ${response.statusText}`)
  }

  const result = await response.json()
  return result.data
}

/**
 * 통합 대시보드 데이터 조회
 */
export async function getIntegratedDashboardData(
  request: DashboardRequest
): Promise<DashboardData> {
  const response = await fetch(`${API_BASE_URL}/api/integrations/data/dashboard`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  })

  if (!response.ok) {
    throw new Error(`대시보드 데이터 조회 실패: ${response.statusText}`)
  }

  const result = await response.json()
  return result.data
}

/**
 * 채널별 성과 비교
 */
export async function compareChannels(
  startDate: string,
  endDate: string
): Promise<Record<string, any>> {
  const response = await fetch(
    `${API_BASE_URL}/api/integrations/data/channels/compare?start_date=${startDate}&end_date=${endDate}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }
  )

  if (!response.ok) {
    throw new Error(`채널 비교 실패: ${response.statusText}`)
  }

  const result = await response.json()
  return result.data
}

/**
 * 고객 여정 추적
 */
export async function getCustomerJourney(
  startDate: string,
  endDate: string
): Promise<any> {
  const response = await fetch(
    `${API_BASE_URL}/api/integrations/data/customer-journey?start_date=${startDate}&end_date=${endDate}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }
  )

  if (!response.ok) {
    throw new Error(`고객 여정 조회 실패: ${response.statusText}`)
  }

  const result = await response.json()
  return result.data
}

/**
 * 고객 세분화
 */
export async function getCustomerSegments(
  startDate: string,
  endDate: string
): Promise<Record<string, any>> {
  const response = await fetch(
    `${API_BASE_URL}/api/integrations/data/customer-segments?start_date=${startDate}&end_date=${endDate}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }
  )

  if (!response.ok) {
    throw new Error(`고객 세분화 조회 실패: ${response.statusText}`)
  }

  const result = await response.json()
  return result.data
}
