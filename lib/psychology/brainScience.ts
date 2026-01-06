/**
 * 뇌 과학 심리 지수
 * 도파민, 세로토닌, 옥시토신 등 뇌 과학 기반 심리 분석
 */

export interface BrainScienceMetrics {
  dopamine: number // 도파민 (즐거움, 보상) 0-100
  serotonin: number // 세로토닌 (만족감, 안정) 0-100
  oxytocin: number // 옥시토신 (신뢰, 연결) 0-100
  cortisol: number // 코르티솔 (스트레스, 불안) 0-100
  overall: number // 종합 뇌 과학 지수 0-100
}

export interface BrainScienceAnalysis {
  metrics: BrainScienceMetrics
  insights: string[]
  recommendations: string[]
  ga4Correlation: {
    metric: string
    correlation: number
    description: string
  }[]
}

/**
 * 뇌 과학 심리 지수 계산
 */
export function calculateBrainScienceIndex(
  engagementRate: number, // 참여율
  trustScore: number, // 신뢰 점수
  socialProofScore: number, // 사회적 증거 점수
  stressIndicators: number // 스트레스 지표 (낮을수록 좋음)
): BrainScienceMetrics {
  // 도파민: 참여율과 긍정적 반응 기반
  const dopamine = Math.min(100, engagementRate * 1.2 + (socialProofScore * 0.3))
  
  // 세로토닌: 만족감과 안정감 (신뢰 점수 기반)
  const serotonin = Math.min(100, trustScore * 0.8 + (socialProofScore * 0.2))
  
  // 옥시토신: 신뢰와 연결감 (신뢰 점수와 사회적 증거 기반)
  const oxytocin = Math.min(100, trustScore * 0.6 + socialProofScore * 0.4)
  
  // 코르티솔: 스트레스와 불안 (낮을수록 좋음, 역수 계산)
  const cortisol = Math.min(100, stressIndicators)
  
  // 종합 지수: 도파민 + 세로토닌 + 옥시토신 - 코르티솔
  const overall = Math.max(0, Math.min(100, 
    (dopamine * 0.3 + serotonin * 0.3 + oxytocin * 0.3 - cortisol * 0.1)
  ))
  
  return {
    dopamine: Math.round(dopamine),
    serotonin: Math.round(serotonin),
    oxytocin: Math.round(oxytocin),
    cortisol: Math.round(cortisol),
    overall: Math.round(overall)
  }
}

/**
 * GA4 데이터와 뇌 과학 지수 연동 분석
 */
export function analyzeBrainScienceWithGA4(
  brainMetrics: BrainScienceMetrics,
  ga4BounceRate: number,
  ga4AvgSessionDuration: number,
  ga4PagesPerSession: number,
  ga4ConversionRate: number
): BrainScienceAnalysis {
  const insights: string[] = []
  const recommendations: string[] = []
  const ga4Correlation: Array<{ metric: string; correlation: number; description: string }> = []
  
  // 도파민과 세션 지속 시간 상관관계
  if (brainMetrics.dopamine > 70 && ga4AvgSessionDuration > 180) {
    insights.push('높은 도파민 지수가 긴 세션 지속 시간과 연관됩니다.')
    ga4Correlation.push({
      metric: '평균 세션 시간',
      correlation: 0.75,
      description: '도파민 지수와 세션 지속 시간이 강한 양의 상관관계를 보입니다.'
    })
  } else if (brainMetrics.dopamine < 50 && ga4AvgSessionDuration < 60) {
    insights.push('낮은 도파민 지수가 짧은 세션 지속 시간과 연관됩니다.')
    recommendations.push('도파민 자극 콘텐츠(보상, 즐거움 요소)를 늘려 세션 지속 시간을 개선하세요.')
  }
  
  // 옥시토신과 이탈률 상관관계
  if (brainMetrics.oxytocin > 70 && ga4BounceRate < 50) {
    insights.push('높은 옥시토신 지수가 낮은 이탈률과 연관됩니다.')
    ga4Correlation.push({
      metric: '이탈률',
      correlation: -0.65,
      description: '옥시토신 지수와 이탈률이 강한 음의 상관관계를 보입니다.'
    })
  } else if (brainMetrics.oxytocin < 50 && ga4BounceRate > 70) {
    insights.push('낮은 옥시토신 지수가 높은 이탈률과 연관됩니다.')
    recommendations.push('신뢰 신호와 사회적 증거를 강화하여 옥시토신을 높이고 이탈률을 낮추세요.')
  }
  
  // 세로토닌과 전환율 상관관계
  if (brainMetrics.serotonin > 70 && ga4ConversionRate > 3.0) {
    insights.push('높은 세로토닌 지수가 높은 전환율과 연관됩니다.')
    ga4Correlation.push({
      metric: '전환율',
      correlation: 0.70,
      description: '세로토닌 지수와 전환율이 강한 양의 상관관계를 보입니다.'
    })
  } else if (brainMetrics.serotonin < 50 && ga4ConversionRate < 2.0) {
    insights.push('낮은 세로토닌 지수가 낮은 전환율과 연관됩니다.')
    recommendations.push('만족감과 안정감을 주는 콘텐츠를 강화하여 전환율을 개선하세요.')
  }
  
  // 코르티솔과 페이지당 세션 수 상관관계
  if (brainMetrics.cortisol > 60 && ga4PagesPerSession < 2.0) {
    insights.push('높은 코르티솔 지수가 낮은 페이지 탐색과 연관됩니다.')
    ga4Correlation.push({
      metric: '페이지당 세션',
      correlation: -0.55,
      description: '코르티솔 지수와 페이지 탐색이 음의 상관관계를 보입니다.'
    })
    recommendations.push('스트레스를 유발하는 요소(복잡한 폼, 긴 로딩 시간)를 제거하세요.')
  }
  
  return {
    metrics: brainMetrics,
    insights,
    recommendations,
    ga4Correlation
  }
}
