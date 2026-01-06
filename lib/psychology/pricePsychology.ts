/**
 * 가격 심리 분석
 * 리뷰와 GA4 데이터를 결합해 고객의 심리적 가격 저항선 분석
 */

export interface PriceResistancePoint {
  priceRange: string // 예: '10만원-15만원'
  resistanceLevel: number // 0-100, 높을수록 저항이 큼
  customerSegment: string
  reviewSentiment: 'positive' | 'neutral' | 'negative'
  purchaseRate: number
}

export interface PricePsychologyAnalysis {
  optimalPriceRange: string
  psychologicalPricePoint: number // 심리적 가격 포인트 (예: 99,000원)
  resistancePoints: PriceResistancePoint[]
  averageResistance: number
  insights: string[]
  copywritingStrategy: {
    approach: 'premium' | 'value' | 'scarcity' | 'social_proof'
    message: string
    keyPhrases: string[]
    tone: string
  }
}

/**
 * 가격 심리 분석 수행
 */
export function analyzePricePsychology(
  reviews: Array<{ price: number; sentiment: 'positive' | 'neutral' | 'negative'; text: string }>,
  ga4Data: { priceRange: string; conversionRate: number; bounceRate: number }[]
): PricePsychologyAnalysis {
  // 가격대별 저항선 계산
  const priceRanges = [
    { range: '5만원-10만원', min: 50000, max: 100000 },
    { range: '10만원-15만원', min: 100000, max: 150000 },
    { range: '15만원-20만원', min: 150000, max: 200000 },
    { range: '20만원-25만원', min: 200000, max: 250000 },
    { range: '25만원 이상', min: 250000, max: 1000000 }
  ]
  
  const resistancePoints: PriceResistancePoint[] = priceRanges.map(range => {
    const rangeReviews = reviews.filter(r => r.price >= range.min && r.price < range.max)
    const negativeReviews = rangeReviews.filter(r => r.sentiment === 'negative').length
    const resistanceLevel = rangeReviews.length > 0 
      ? (negativeReviews / rangeReviews.length) * 100 
      : 50
    
    const ga4DataForRange = ga4Data.find(d => d.priceRange === range.range)
    const purchaseRate = ga4DataForRange?.conversionRate || 0
    
    return {
      priceRange: range.range,
      resistanceLevel: Math.round(resistanceLevel),
      customerSegment: range.min < 150000 ? '가격 민감' : '프리미엄',
      reviewSentiment: resistanceLevel > 50 ? 'negative' : resistanceLevel > 30 ? 'neutral' : 'positive',
      purchaseRate
    }
  })
  
  // 최적 가격대 찾기 (저항이 낮고 구매율이 높은 구간)
  const optimalRange = resistancePoints.reduce((best, current) => {
    const currentScore = (100 - current.resistanceLevel) + current.purchaseRate
    const bestScore = (100 - best.resistanceLevel) + best.purchaseRate
    return currentScore > bestScore ? current : best
  })
  
  // 평균 저항도
  const averageResistance = resistancePoints.reduce((sum, p) => sum + p.resistanceLevel, 0) / resistancePoints.length
  
  // 심리적 가격 포인트 계산 (예: 99,000원처럼 9로 끝나는 가격)
  const psychologicalPricePoint = optimalRange.priceRange.includes('10만원-15만원') ? 99000 : 149000
  
  const insights: string[] = []
  if (averageResistance > 50) {
    insights.push('고객의 가격 저항이 높습니다. 가치 제안을 강화해야 합니다.')
  }
  if (optimalRange.resistanceLevel < 30) {
    insights.push(`${optimalRange.priceRange} 구간에서 가격 저항이 낮고 구매율이 높습니다.`)
  }
  insights.push(`심리적 가격 포인트(${psychologicalPricePoint.toLocaleString()}원)를 활용하면 전환율이 개선될 수 있습니다.`)
  
  // 카피라이팅 전략 결정
  let approach: 'premium' | 'value' | 'scarcity' | 'social_proof' = 'value'
  let message = ''
  let keyPhrases: string[] = []
  let tone = ''
  
  if (averageResistance > 60) {
    approach = 'value'
    message = '가격 대비 뛰어난 가치를 강조하세요. 장기적 관점에서의 투자 가치를 제시하세요.'
    keyPhrases = ['가격 대비 최고', '투자 가치', '오래 사용', '내구성', '성능 대비 가격']
    tone = '합리적이고 실용적인 톤'
  } else if (optimalRange.priceRange.includes('20만원')) {
    approach = 'premium'
    message = '프리미엄 포지셔닝을 강조하세요. 독점성과 고급스러움을 어필하세요.'
    keyPhrases = ['프리미엄', '독점', '한정', '고급', '프리미엄 경험']
    tone = '고급스럽고 독점적인 톤'
  } else if (optimalRange.resistanceLevel < 20) {
    approach = 'scarcity'
    message = '한정성과 긴급성을 강조하세요. 기회 비용을 제시하세요.'
    keyPhrases = ['한정 수량', '마감 임박', '놓치지 마세요', '지금만', '특가']
    tone = '긴급하고 희소성을 강조하는 톤'
  } else {
    approach = 'social_proof'
    message = '사회적 증거를 강조하세요. 리뷰와 사용자 후기를 활용하세요.'
    keyPhrases = ['수많은 고객이 선택', '베스트셀러', '만족도 높음', '재구매율', '추천']
    tone = '신뢰감 있고 사회적으로 검증된 톤'
  }
  
  return {
    optimalPriceRange: optimalRange.priceRange,
    psychologicalPricePoint,
    resistancePoints,
    averageResistance: Math.round(averageResistance),
    insights,
    copywritingStrategy: {
      approach,
      message,
      keyPhrases,
      tone
    }
  }
}
