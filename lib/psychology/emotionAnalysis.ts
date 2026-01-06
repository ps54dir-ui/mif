/**
 * 감정 및 심리 분석 모듈
 * 브랜드 감정 온도계, 심리적 저항 지수, 심리 상태 분류
 */

export interface EmotionalState {
  trust: number // 신뢰 (0-100)
  anxiety: number // 불안 (0-100)
  enthusiasm: number // 열광 (0-100)
  skepticism: number // 회의 (0-100)
  loyalty: number // 충성 (0-100)
}

export interface BrandEmotionalTemperature {
  overall: number // 전체 감정 온도 (-50 to 50, 0이 중립)
  trend: 'RISING' | 'STABLE' | 'FALLING'
  sentiment: 'POSITIVE' | 'NEUTRAL' | 'NEGATIVE'
  emotionalStates: EmotionalState
}

export interface PsychologicalResistance {
  channel: string
  resistanceScore: number // 저항 지수 (0-100, 높을수록 저항이 큼)
  factors: Array<{
    factor: string
    impact: number
    description: string
  }>
}

/**
 * 리뷰 텍스트에서 심리 상태 추출
 */
export function analyzeReviewPsychology(reviewText: string, rating: number): {
  primaryEmotion: 'trust' | 'anxiety' | 'enthusiasm' | 'skepticism' | 'loyalty'
  confidence: number
  emotionalScore: number
} {
  const text = reviewText.toLowerCase()
  
  // 신뢰 키워드
  const trustKeywords = ['신뢰', '믿음', '확신', '검증', '인증', '정품', '신뢰할', '믿을만']
  // 불안 키워드
  const anxietyKeywords = ['걱정', '불안', '우려', '염려', '두려움', '불안정', '불확실']
  // 열광 키워드
  const enthusiasmKeywords = ['최고', '대박', '완벽', '열광', '사랑', '최애', '필수', '강력추천']
  // 회의 키워드
  const skepticismKeywords = ['의심', '회의', '불신', '의문', '의아', '수상', '의심스러']
  // 충성 키워드
  const loyaltyKeywords = ['재구매', '계속', '항상', '오래', '충성', '애정', '선호', '고정']
  
  let trustScore = 0
  let anxietyScore = 0
  let enthusiasmScore = 0
  let skepticismScore = 0
  let loyaltyScore = 0
  
  trustKeywords.forEach(kw => { if (text.includes(kw)) trustScore += 2 })
  anxietyKeywords.forEach(kw => { if (text.includes(kw)) anxietyScore += 2 })
  enthusiasmKeywords.forEach(kw => { if (text.includes(kw)) enthusiasmScore += 3 })
  skepticismKeywords.forEach(kw => { if (text.includes(kw)) skepticismScore += 2 })
  loyaltyKeywords.forEach(kw => { if (text.includes(kw)) loyaltyScore += 2 })
  
  // 평점 기반 가중치
  const ratingWeight = rating >= 4 ? 1.5 : rating <= 2 ? 0.5 : 1.0
  trustScore *= ratingWeight
  enthusiasmScore *= ratingWeight
  loyaltyScore *= ratingWeight
  
  if (rating <= 2) {
    anxietyScore *= 1.5
    skepticismScore *= 1.5
  }
  
  const scores = {
    trust: Math.min(100, trustScore * 10),
    anxiety: Math.min(100, anxietyScore * 10),
    enthusiasm: Math.min(100, enthusiasmScore * 10),
    skepticism: Math.min(100, skepticismScore * 10),
    loyalty: Math.min(100, loyaltyScore * 10)
  }
  
  // 주요 감정 결정
  const maxScore = Math.max(...Object.values(scores))
  const primaryEmotion = Object.entries(scores).find(([_, score]) => score === maxScore)?.[0] as any || 'trust'
  
  // 감정 점수 계산 (신뢰 + 열광 + 충성 - 불안 - 회의)
  const emotionalScore = scores.trust + scores.enthusiasm + scores.loyalty - scores.anxiety - scores.skepticism
  
  return {
    primaryEmotion,
    confidence: maxScore,
    emotionalScore: Math.max(0, Math.min(100, emotionalScore + 50)) // -50~50을 0~100으로 변환
  }
}

/**
 * 브랜드 감정 온도계 계산
 */
export function calculateBrandEmotionalTemperature(
  reviews: Array<{ text: string; rating: number }>
): BrandEmotionalTemperature {
  const emotionalStates: EmotionalState = {
    trust: 0,
    anxiety: 0,
    enthusiasm: 0,
    skepticism: 0,
    loyalty: 0
  }
  
  let totalEmotionalScore = 0
  
  reviews.forEach(review => {
    const analysis = analyzeReviewPsychology(review.text, review.rating)
    totalEmotionalScore += analysis.emotionalScore
    
    // 각 감정 상태 집계
    const analysis2 = analyzeReviewPsychology(review.text, review.rating)
    // 간단한 집계 (실제로는 더 정교한 분석 필요)
    if (analysis2.primaryEmotion === 'trust') emotionalStates.trust += analysis2.confidence
    if (analysis2.primaryEmotion === 'anxiety') emotionalStates.anxiety += analysis2.confidence
    if (analysis2.primaryEmotion === 'enthusiasm') emotionalStates.enthusiasm += analysis2.confidence
    if (analysis2.primaryEmotion === 'skepticism') emotionalStates.skepticism += analysis2.confidence
    if (analysis2.primaryEmotion === 'loyalty') emotionalStates.loyalty += analysis2.confidence
  })
  
  const count = reviews.length
  const avgEmotionalScore = totalEmotionalScore / count
  
  // 감정 온도 (-50 to 50, 0이 중립)
  const overall = Math.round((avgEmotionalScore - 50) * 2)
  
  // 평균화
  emotionalStates.trust = Math.round(emotionalStates.trust / count)
  emotionalStates.anxiety = Math.round(emotionalStates.anxiety / count)
  emotionalStates.enthusiasm = Math.round(emotionalStates.enthusiasm / count)
  emotionalStates.skepticism = Math.round(emotionalStates.skepticism / count)
  emotionalStates.loyalty = Math.round(emotionalStates.loyalty / count)
  
  return {
    overall,
    trend: overall > 10 ? 'RISING' : overall < -10 ? 'FALLING' : 'STABLE',
    sentiment: overall > 0 ? 'POSITIVE' : overall < 0 ? 'NEGATIVE' : 'NEUTRAL',
    emotionalStates
  }
}

/**
 * 심리적 저항 지수 계산
 */
export function calculatePsychologicalResistance(
  channel: string,
  conversionRate: number,
  bounceRate: number,
  avgTimeOnPage: number,
  reviewSentiment: number
): PsychologicalResistance {
  const factors: Array<{ factor: string; impact: number; description: string }> = []
  
  // 전환율이 낮으면 저항이 높음
  if (conversionRate < 2.5) {
    factors.push({
      factor: '낮은 전환율',
      impact: (2.5 - conversionRate) * 10,
      description: '구매 결정에 대한 심리적 저항이 높습니다'
    })
  }
  
  // 이탈률이 높으면 저항이 높음
  if (bounceRate > 60) {
    factors.push({
      factor: '높은 이탈률',
      impact: (bounceRate - 60) * 0.5,
      description: '초기 관심을 유지하지 못하는 심리적 장벽이 있습니다'
    })
  }
  
  // 체류 시간이 짧으면 저항이 높음
  if (avgTimeOnPage < 30) {
    factors.push({
      factor: '짧은 체류 시간',
      impact: (30 - avgTimeOnPage) * 1,
      description: '콘텐츠에 대한 몰입도가 낮아 심리적 저항이 발생합니다'
    })
  }
  
  // 리뷰 감정이 부정적이면 저항이 높음
  if (reviewSentiment < 50) {
    factors.push({
      factor: '부정적 리뷰 감정',
      impact: (50 - reviewSentiment) * 0.8,
      description: '고객의 신뢰도가 낮아 구매 저항이 높습니다'
    })
  }
  
  const totalImpact = factors.reduce((sum, f) => sum + f.impact, 0)
  const resistanceScore = Math.min(100, Math.max(0, totalImpact))
  
  return {
    channel,
    resistanceScore: Math.round(resistanceScore),
    factors
  }
}
