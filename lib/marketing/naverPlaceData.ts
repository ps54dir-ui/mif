/**
 * 네이버 플레이스 데이터 모듈
 */

export interface NaverPlaceMetrics {
  placeId: string
  placeName: string
  keywords: Array<{
    keyword: string
    currentRank: number
    bestRank: number
    impressions: number
    clicks: number
    ctr: number
  }>
  overallScore: number
  visibilityScore: number // 발견성 (30점)
  attractivenessScore: number // 매력도 (40점)
  conversionScore: number // 전환력 (30점)
  reservations: number
  phoneCalls: number
  directions: number
  reviews: {
    total: number
    average: number
    photoReviews: number
    responseRate: number
  }
}

/**
 * 나이키 네이버 플레이스 Mock 데이터
 */
export const nikeNaverPlaceData: NaverPlaceMetrics = {
  placeId: 'nike-place-001',
  placeName: '나이키 공식 스토어',
  keywords: [
    {
      keyword: '나이키',
      currentRank: 1,
      bestRank: 1,
      impressions: 125000,
      clicks: 8500,
      ctr: 6.8
    },
    {
      keyword: '나이키 운동화',
      currentRank: 3,
      bestRank: 1,
      impressions: 98000,
      clicks: 6200,
      ctr: 6.3
    },
    {
      keyword: '나이키 신발',
      currentRank: 5,
      bestRank: 2,
      impressions: 75000,
      clicks: 4200,
      ctr: 5.6
    }
  ],
  overallScore: 85,
  visibilityScore: 28, // 발견성 28/30
  attractivenessScore: 35, // 매력도 35/40
  conversionScore: 22, // 전환력 22/30
  reservations: 450,
  phoneCalls: 1200,
  directions: 3200,
  reviews: {
    total: 1250,
    average: 4.5,
    photoReviews: 850,
    responseRate: 78
  }
}
