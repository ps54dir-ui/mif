/**
 * 대시보드 API 호출 함수
 * 실제 API 연동 시 이 파일의 함수들을 구현하면 됩니다.
 */

import { getMockBrandData, type MockBrandData } from './mockData'

/**
 * DashboardData 타입 (페이지에서 사용하는 타입과 동일)
 */
export interface DashboardData {
  overallScore: number
  fourAxes: {
    inflow: number      // 유입
    persuasion: number  // 설득
    trust: number       // 신뢰
    circulation: number // 순환
  }
  seoGeoAeoReports: Array<{
    type: 'SEO' | 'GEO' | 'AEO'
    score: number
    issues: string[]
  }>
  icePriorities: Array<{
    id: string
    strategyName: string
    impact: number
    confidence: number
    ease: number
    finalScore: number
    description?: string
  }>
  diagnosisHistory: Array<{
    date: string
    overallScore: number
    version: number
  }>
  snsDiagnostics?: {
    youtube?: any
    tiktok?: any
    twitter?: any
    threads?: any
  }
  channelAsymmetry?: {
    insights: Array<{
      type: string
      channel1: string
      channel2: string
      metric: string
      message: string
    }>
    summary: string
  }
  digitalShare?: {
    overall_digital_share: number
    seo_contribution: number
    sns_contribution: number
    channel_contributions: Record<string, number>
    breakdown: {
      seo_score: number
      average_sns_score: number
      sns_channels: Record<string, number>
    }
  }
  onlineChannelDiagnostics?: {
    youtube: {
      video_mentions_growth: number
      viral_index: number
    }
    tiktok?: {
      video_mentions_growth: number
      viral_index: number
    }
    instagram: {
      engagement_index: number
      hashtag_spread_rank: string
    }
    threads?: {
      engagement_index: number
      hashtag_spread_rank: string
    }
    naver_cafe?: {
      positive_review_ratio: number
      response_speed: string
    }
    daum_cafe?: {
      positive_review_ratio: number
      response_speed: string
    }
    own_mall?: {
      conversion_rate: number
      repeat_visit_rate: number
    }
    x_twitter?: {
      mentions_growth: number
      engagement_rate: number
    }
    smartstore?: {
      conversion_rate: number
      review_score: number
    }
    coupang?: {
      sales_performance: number
      review_score: number
    }
    facebook?: {
      engagement_index: number
      reach_growth: number
    }
    youtube_shorts?: {
      views_growth: number
      engagement_rate: number
    }
  }
  channelDiagnostics?: {
    youtube?: {
      score: number
      insight: string
    }
    instagram?: {
      score: number
      insight: string
    }
    community?: {
      score: number
      insight: string
    }
    tiktok?: {
      score: number
      insight: string
    }
    threads?: {
      score: number
      insight: string
    }
    facebook?: {
      score: number
      insight: string
    }
    youtube_shorts?: {
      score: number
      insight: string
    }
  }
}

/**
 * Mock 데이터를 DashboardData 형식으로 변환
 */
function convertMockDataToDashboardData(mockData: MockBrandData): DashboardData {
  return {
    overallScore: mockData.overallScore,
    fourAxes: mockData.fourAxes,
    seoGeoAeoReports: mockData.seoGeoAeoReports,
    icePriorities: mockData.icePriorities,
    diagnosisHistory: mockData.diagnosisHistory,
    snsDiagnostics: mockData.snsDiagnostics,
    channelAsymmetry: mockData.channelAsymmetry,
    digitalShare: mockData.digitalShare,
    onlineChannelDiagnostics: mockData.onlineChannelDiagnostics,
    channelDiagnostics: mockData.channelDiagnostics
  }
}

/**
 * 브랜드 이름으로 대시보드 데이터 조회
 * 
 * @param brandName 브랜드 이름 (예: '나이키')
 * @returns DashboardData
 * 
 * TODO: 실제 API 연동 시 아래 주석을 해제하고 구현
 * 
 * ```typescript
 * export async function fetchDashboardDataByBrandName(brandName: string): Promise<DashboardData> {
 *   const response = await fetch(`/api/dashboard/brand/${encodeURIComponent(brandName)}`)
 *   if (!response.ok) {
 *     throw new Error(`대시보드 데이터 조회 실패: ${response.statusText}`)
 *   }
 *   return await response.json()
 * }
 * ```
 */
export async function fetchDashboardDataByBrandName(brandName: string): Promise<DashboardData> {
  // TODO: 실제 API 호출로 교체
  // const response = await fetch(`/api/dashboard/brand/${encodeURIComponent(brandName)}`)
  // if (!response.ok) {
  //   throw new Error(`대시보드 데이터 조회 실패: ${response.statusText}`)
  // }
  // return await response.json()
  
  // 현재는 무조건 나이키 Mock 데이터 사용 (백엔드 미연결 상태)
  // 네트워크 지연 시뮬레이션 (1초)
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  const mockData = getMockBrandData(brandName) || getMockBrandData('삼성생명')
  if (!mockData) {
    // 최후의 수단: 기본 나이키 데이터 직접 반환
    const { nikeMockData } = await import('./mockData')
    return convertMockDataToDashboardData(nikeMockData)
  }
  
  return convertMockDataToDashboardData(mockData)
}

/**
 * 브랜드 ID로 대시보드 데이터 조회
 * 
 * @param brandId 브랜드 ID
 * @returns DashboardData
 * 
 * TODO: 실제 API 연동 시 아래 주석을 해제하고 구현
 * 
 * ```typescript
 * export async function fetchDashboardDataByBrandId(brandId: string): Promise<DashboardData> {
 *   const response = await fetch(`/api/dashboard/brand/${brandId}`)
 *   if (!response.ok) {
 *     throw new Error(`대시보드 데이터 조회 실패: ${response.statusText}`)
 *   }
 *   return await response.json()
 * }
 * ```
 */
export async function fetchDashboardDataByBrandId(brandId: string): Promise<DashboardData> {
  // TODO: 실제 API 호출로 교체
  // const response = await fetch(`/api/dashboard/brand/${brandId}`)
  // if (!response.ok) {
  //   throw new Error(`대시보드 데이터 조회 실패: ${response.statusText}`)
  // }
  // return await response.json()
  
  // 현재는 무조건 나이키 Mock 데이터 사용 (백엔드 미연결 상태)
  // 네트워크 지연 시뮬레이션 (1초)
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  const mockData = getMockBrandData('삼성생명')
  if (!mockData) {
    // 최후의 수단: 기본 나이키 데이터 직접 반환
    const { nikeMockData } = await import('./mockData')
    return convertMockDataToDashboardData(nikeMockData)
  }
  
  return convertMockDataToDashboardData(mockData)
}

/**
 * 리포트 ID로 대시보드 데이터 조회
 * 
 * @param reportId 리포트 ID
 * @returns DashboardData
 * 
 * TODO: 실제 API 연동 시 아래 주석을 해제하고 구현
 * 
 * ```typescript
 * export async function fetchDashboardDataByReportId(reportId: string): Promise<DashboardData> {
 *   const response = await fetch(`/api/dashboard/report/${reportId}`)
 *   if (!response.ok) {
 *     throw new Error(`대시보드 데이터 조회 실패: ${response.statusText}`)
 *   }
 *   return await response.json()
 * }
 * ```
 */
export async function fetchDashboardDataByReportId(reportId: string): Promise<DashboardData> {
  // TODO: 실제 API 호출로 교체
  // const response = await fetch(`/api/dashboard/report/${reportId}`)
  // if (!response.ok) {
  //   throw new Error(`대시보드 데이터 조회 실패: ${response.statusText}`)
  // }
  // return await response.json()
  
  // 현재는 무조건 나이키 Mock 데이터 사용 (백엔드 미연결 상태)
  // 네트워크 지연 시뮬레이션 (1초)
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  const mockData = getMockBrandData('삼성생명')
  if (!mockData) {
    // 최후의 수단: 기본 나이키 데이터 직접 반환
    const { nikeMockData } = await import('./mockData')
    return convertMockDataToDashboardData(nikeMockData)
  }
  
  return convertMockDataToDashboardData(mockData)
}
