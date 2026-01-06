/**
 * AEO 권위 지수
 * Answer Engine Optimization - AI 답변 엔진에서의 권위 분석
 */

export interface AEOAuthorityMetrics {
  citationScore: number // 인용 점수 0-100
  expertiseScore: number // 전문성 점수 0-100
  trustworthinessScore: number // 신뢰성 점수 0-100
  answerRanking: number // 답변 순위 (1위 = 100점)
  overall: number // 종합 AEO 권위 지수 0-100
}

export interface AEOAuthorityAnalysis {
  metrics: AEOAuthorityMetrics
  insights: string[]
  recommendations: string[]
  ga4Correlation: {
    metric: string
    correlation: number
    description: string
  }[]
}

/**
 * AEO 권위 지수 계산
 */
export function calculateAEOAuthority(
  citationCount: number, // 인용 횟수
  expertMentions: number, // 전문가 언급 횟수
  trustSignals: number, // 신뢰 신호 수
  answerPosition: number // AI 답변에서의 순위 (1위 = 100점)
): AEOAuthorityMetrics {
  // 인용 점수: 인용 횟수 기반
  const citationScore = Math.min(100, citationCount * 10)
  
  // 전문성 점수: 전문가 언급 기반
  const expertiseScore = Math.min(100, expertMentions * 15)
  
  // 신뢰성 점수: 신뢰 신호 기반
  const trustworthinessScore = Math.min(100, trustSignals * 12)
  
  // 답변 순위 점수: 1위 = 100점, 2위 = 80점, 3위 = 60점...
  const answerRanking = answerPosition === 1 ? 100 :
                       answerPosition === 2 ? 80 :
                       answerPosition === 3 ? 60 :
                       answerPosition <= 5 ? 40 : 20
  
  // 종합 AEO 권위 지수
  const overall = Math.round(
    (citationScore * 0.25 + expertiseScore * 0.25 + trustworthinessScore * 0.25 + answerRanking * 0.25)
  )
  
  return {
    citationScore: Math.round(citationScore),
    expertiseScore: Math.round(expertiseScore),
    trustworthinessScore: Math.round(trustworthinessScore),
    answerRanking,
    overall
  }
}

/**
 * GA4 데이터와 AEO 권위 지수 연동 분석
 */
export function analyzeAEOWithGA4(
  aeoMetrics: AEOAuthorityMetrics,
  ga4OrganicTraffic: number, // 자연 유입 트래픽
  ga4DirectTraffic: number, // 직접 유입 트래픽
  ga4BrandSearches: number // 브랜드 검색 수
): AEOAuthorityAnalysis {
  const insights: string[] = []
  const recommendations: string[] = []
  const ga4Correlation: Array<{ metric: string; correlation: number; description: string }> = []
  
  // AEO 권위 지수와 자연 유입 트래픽 상관관계
  if (aeoMetrics.overall > 70 && ga4OrganicTraffic > 50000) {
    insights.push('높은 AEO 권위 지수가 자연 유입 트래픽과 연관됩니다.')
    ga4Correlation.push({
      metric: '자연 유입 트래픽',
      correlation: 0.78,
      description: 'AEO 권위 지수와 자연 유입 트래픽이 강한 양의 상관관계를 보입니다.'
    })
  } else if (aeoMetrics.overall < 50 && ga4OrganicTraffic < 20000) {
    insights.push('낮은 AEO 권위 지수가 적은 자연 유입 트래픽과 연관됩니다.')
    recommendations.push('AI 답변 엔진에서 인용되도록 전문성 있는 콘텐츠와 통계 데이터를 추가하세요.')
  }
  
  // 인용 점수와 브랜드 검색 상관관계
  if (aeoMetrics.citationScore > 70 && ga4BrandSearches > 1000) {
    insights.push('높은 인용 점수가 브랜드 검색과 연관됩니다.')
    ga4Correlation.push({
      metric: '브랜드 검색',
      correlation: 0.65,
      description: '인용 점수와 브랜드 검색이 양의 상관관계를 보입니다.'
    })
  }
  
  // 답변 순위와 직접 유입 트래픽 상관관계
  if (aeoMetrics.answerRanking > 80 && ga4DirectTraffic > 30000) {
    insights.push('높은 답변 순위가 직접 유입 트래픽과 연관됩니다.')
    ga4Correlation.push({
      metric: '직접 유입 트래픽',
      correlation: 0.70,
      description: '답변 순위와 직접 유입 트래픽이 강한 양의 상관관계를 보입니다.'
    })
  } else if (aeoMetrics.answerRanking < 40 && ga4DirectTraffic < 15000) {
    insights.push('낮은 답변 순위가 적은 직접 유입 트래픽과 연관됩니다.')
    recommendations.push('AI 답변에서 상위 노출되도록 FAQ 형식의 명확한 답변 구조를 만들세요.')
  }
  
  return {
    metrics: aeoMetrics,
    insights,
    recommendations,
    ga4Correlation
  }
}
