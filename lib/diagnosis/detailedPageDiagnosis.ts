/**
 * 상세페이지 진단 평가 시스템
 * 7가지 영역을 100점 만점으로 평가
 */

import { IndustryType } from '@/data/industries/industryConfig'

export interface DetailedPageScores {
  first_impression: number // 0-15
  trust_credibility: number // 0-20
  persuasion: number // 0-25
  structure_ux: number // 0-15
  conversion: number // 0-15
  technical: number // 0-5
  engagement: number // 0-5
}

export interface DetailedEvaluation {
  [area: string]: {
    [item: string]: {
      score: number
      max_score: number
      description: string
      current_status: '완벽' | '좋음' | '보통' | '미흡' | '나쁨'
      improvement_action: string
      expected_impact: string
    }
  }
}

export interface Recommendation {
  priority: 'critical' | 'high' | 'medium' | 'low'
  area: string
  action: string
  effort: 'low' | 'medium' | 'high'
  expected_cvr_impact: number
  implementation_time: string
  step_by_step: string[]
}

export interface ABTestSuggestion {
  test_name: string
  variant_a: string
  variant_b: string
  expected_winner: string
  expected_lift: number
  sample_size: number
  duration: string
}

export interface RevenueProjection {
  current_monthly_revenue: number
  projected_30days: number
  projected_90days: number
  projected_1year: number
  confidence: number // 0-100
}

export interface DetailedPageDiagnosis {
  // 기본 정보
  company_name: string
  product_name: string
  url: string
  industry_type: IndustryType
  screenshot_url?: string
  
  // 7가지 영역 점수
  scores: DetailedPageScores
  
  // 상세 평가
  detailed_evaluation: DetailedEvaluation
  
  // 종합 분석
  overall_score: number // 0-100
  percentile: number // 상위 몇 %
  estimated_cvr: number // 현재 예상 CVR
  potential_cvr: number // 개선 후 예상 CVR
  cvr_lift_potential: number // 증가율 (%)
  
  // 추천사항
  recommendations: Recommendation[]
  
  // A/B 테스트 제안
  ab_test_suggestions: ABTestSuggestion[]
  
  // 수익 예측
  revenue_projection: RevenueProjection
}

export interface PageData {
  html_content?: string
  hero_image?: string
  main_title?: string
  subtitle?: string
  background_color?: string
  product_specs?: string
  reviews?: {
    average_rating?: number
    total_count?: number
    photo_review_ratio?: number
    verified_purchase_ratio?: number
  }
  trust_signals?: {
    ssl_certificate?: boolean
    payment_security_badge?: boolean
    refund_policy_clear?: boolean
    warranty_policy?: boolean
  }
  text_content?: string
  has_celebrity_endorsement?: boolean
  has_media_mentions?: boolean
  has_expert_recommendation?: boolean
  review_rating?: number
  cta_buttons?: Array<{
    text: string
    color: string
    size: string
    position: string
  }>
  purchase_steps?: number
  payment_options?: number
  exit_popup?: boolean
  cart_recovery_email?: boolean
  live_chat?: boolean
  loading_speed?: number // LCP in ms
  pagespeed_score?: number
  mobile_optimized?: boolean
  touch_target_size?: number // px
  avg_session_duration?: number // seconds
  scroll_depth?: number // percentage
  current_cvr?: number
  monthly_revenue?: number
}

/**
 * 상세페이지 진단 메인 함수
 */
export async function diagnoseDetailedPage(
  url: string,
  companyName: string,
  productName: string,
  industryType: IndustryType,
  pageData: PageData
): Promise<DetailedPageDiagnosis> {
  // Step 1: 각 영역별 분석
  const firstImpression = analyzeFirstImpression(pageData)
  const trust = analyzeTrustAndCredibility(pageData)
  const persuasion = analyzePersuasionTriggers(pageData)
  const structure = analyzeStructureAndUX(pageData)
  const conversion = analyzeConversionElements(pageData)
  const technical = analyzeTechnicalPerformance(pageData)
  const engagement = analyzeEngagementMetrics(pageData)
  
  // Step 2: 총점 계산
  const overallScore = calculateTotalScore({
    first_impression: firstImpression.total,
    trust_credibility: trust.total,
    persuasion: persuasion.total,
    structure_ux: structure.total,
    conversion: conversion.total,
    technical: technical.total,
    engagement: engagement.total
  })
  
  // Step 3: 상세 평가 객체 생성
  const detailedEvaluation: DetailedEvaluation = {
    first_impression: firstImpression.details,
    trust_credibility: trust.details,
    persuasion: persuasion.details,
    structure_ux: structure.details,
    conversion: conversion.details,
    technical: technical.details,
    engagement: engagement.details
  }
  
  // Step 4: CVR 예측
  const cvrPrediction = predictCVR({
    overall_score: overallScore,
    persuasion_score: persuasion.total,
    trust_score: trust.total,
    industry_type: industryType,
    current_metrics: {
      cvr: pageData.current_cvr,
      monthly_revenue: pageData.monthly_revenue
    }
  })
  
  // Step 5: 개선 액션 생성
  const recommendations = generateRecommendations({
    scores: {
      first_impression: firstImpression.total,
      trust_credibility: trust.total,
      persuasion: persuasion.total,
      structure_ux: structure.total,
      conversion: conversion.total,
      technical: technical.total,
      engagement: engagement.total
    },
    industry_type: industryType,
    detailed_evaluation: detailedEvaluation
  })
  
  // Step 6: A/B 테스트 제안
  const abTests = suggestABTests({
    weak_areas: identifyWeakAreas({
      first_impression: firstImpression.total,
      trust_credibility: trust.total,
      persuasion: persuasion.total,
      structure_ux: structure.total,
      conversion: conversion.total,
      technical: technical.total,
      engagement: engagement.total
    }),
    industry_type: industryType
  })
  
  // Step 7: 수익 예측
  const revenueProjection = projectRevenue({
    current_monthly_revenue: pageData.monthly_revenue || 0,
    cvr_lift_potential: cvrPrediction.lift_percentage,
    confidence: calculateConfidenceScore({
      overall_score: overallScore,
      data_completeness: calculateDataCompleteness(pageData)
    })
  })
  
  // Step 8: 백분위 계산
  const percentile = calculatePercentile(overallScore)
  
  return {
    company_name: companyName,
    product_name: productName,
    url,
    industry_type: industryType,
    scores: {
      first_impression: firstImpression.total,
      trust_credibility: trust.total,
      persuasion: persuasion.total,
      structure_ux: structure.total,
      conversion: conversion.total,
      technical: technical.total,
      engagement: engagement.total
    },
    detailed_evaluation: detailedEvaluation,
    overall_score: overallScore,
    percentile,
    estimated_cvr: cvrPrediction.current_cvr,
    potential_cvr: cvrPrediction.predicted_cvr,
    cvr_lift_potential: cvrPrediction.lift_percentage,
    recommendations,
    ab_test_suggestions: abTests,
    revenue_projection: revenueProjection
  }
}

/**
 * 1. 첫인상 & 심리 분석 (15점)
 */
function analyzeFirstImpression(pageData: PageData): {
  total: number
  details: DetailedEvaluation['first_impression']
} {
  const details: DetailedEvaluation['first_impression'] = {}
  let total = 0
  
  // 헤더 이미지/영상 (5점)
  const imageQuality = analyzeImageQuality(pageData.hero_image, pageData.loading_speed)
  details['헤더 이미지/영상'] = {
    score: imageQuality.score,
    max_score: 5,
    description: imageQuality.description,
    current_status: getStatusFromScore(imageQuality.score, 5),
    improvement_action: imageQuality.improvement_action,
    expected_impact: imageQuality.expected_impact
  }
  total += imageQuality.score
  
  // 제목 & 서브타이틀 (5점)
  const titleQuality = analyzeTitleText(pageData.main_title, pageData.subtitle)
  details['제목 & 서브타이틀'] = {
    score: titleQuality.score,
    max_score: 5,
    description: titleQuality.description,
    current_status: getStatusFromScore(titleQuality.score, 5),
    improvement_action: titleQuality.improvement_action,
    expected_impact: titleQuality.expected_impact
  }
  total += titleQuality.score
  
  // 색상 & 배경 (5점)
  const colorAnalysis = analyzeColorPsychology(pageData.background_color)
  details['색상 & 배경'] = {
    score: colorAnalysis.score,
    max_score: 5,
    description: colorAnalysis.description,
    current_status: getStatusFromScore(colorAnalysis.score, 5),
    improvement_action: colorAnalysis.improvement_action,
    expected_impact: colorAnalysis.expected_impact
  }
  total += colorAnalysis.score
  
  return { total: Math.min(15, total), details }
}

function analyzeImageQuality(
  imageUrl?: string,
  loadTime?: number
): {
  score: number
  description: string
  improvement_action: string
  expected_impact: string
} {
  if (!imageUrl) {
    return {
      score: 0,
      description: '헤더 이미지 없음',
      improvement_action: '고품질 헤더 이미지 추가 (1920x1080 이상, WebP 포맷)',
      expected_impact: 'CVR +3%'
    }
  }
  
  let score = 0
  const issues: string[] = []
  const improvements: string[] = []
  
  // 해상도 (가정: 이미지가 있다면 기본 점수)
  score += 3
  improvements.push('이미지 해상도 확인 (1920x1080 이상 권장)')
  
  // 로딩 속도
  if (loadTime) {
    if (loadTime < 1000) {
      score += 2
    } else if (loadTime < 2000) {
      score += 1
      issues.push('로딩 속도 개선 필요')
      improvements.push('이미지 최적화 (WebP, 압축)')
    } else {
      issues.push('로딩 속도 느림')
      improvements.push('이미지 최적화 및 CDN 사용')
    }
  } else {
    score += 1
    improvements.push('이미지 로딩 속도 최적화')
  }
  
  return {
    score: Math.min(5, score),
    description: issues.length > 0 
      ? `이미지 있음, 하지만 ${issues.join(', ')}`
      : '고품질 헤더 이미지',
    improvement_action: improvements.join(', '),
    expected_impact: 'CVR +3-5%'
  }
}

function analyzeTitleText(
  title?: string,
  subtitle?: string
): {
  score: number
  description: string
  improvement_action: string
  expected_impact: string
} {
  if (!title) {
    return {
      score: 0,
      description: '제목 없음',
      improvement_action: '명확하고 감정적인 제목 추가 (8단어 이내)',
      expected_impact: 'CVR +5%'
    }
  }
  
  let score = 0
  const words = title.split(/\s+/).length
  
  // 길이 (5점 중 2점)
  if (words <= 8) {
    score += 2
  } else if (words <= 12) {
    score += 1
  }
  
  // 감정 단어 감지 (5점 중 2점)
  const emotionalWords = ['특별', '최고', '혁신', '완벽', '신뢰', '즉시', '무료', '할인']
  const hasEmotion = emotionalWords.some(word => title.includes(word))
  if (hasEmotion) {
    score += 2
  } else {
    score += 1
  }
  
  // 명확성 (5점 중 1점)
  const hasProduct = title.length > 0
  const hasBenefit = subtitle && subtitle.length > 0
  if (hasProduct && hasBenefit) {
    score += 1
  } else if (hasProduct) {
    score += 0.5
  }
  
  return {
    score: Math.min(5, Math.round(score)),
    description: `제목: ${title} (${words}단어)`,
    improvement_action: words > 8 
      ? '제목을 8단어 이내로 단축, 감정 단어 추가'
      : '감정 단어 추가, 서브타이틀으로 혜택 강조',
    expected_impact: 'CVR +3-5%'
  }
}

function analyzeColorPsychology(
  backgroundColor?: string
): {
  score: number
  description: string
  improvement_action: string
  expected_impact: string
} {
  // 기본 점수 (색상이 있다면)
  let score = backgroundColor ? 3 : 1
  
  // 명도 대비 (가정: 색상이 있다면 기본적으로 양호)
  score += 1
  
  // 브랜드 매치 (분석 불가 시 기본 점수)
  score += 1
  
  return {
    score: Math.min(5, score),
    description: backgroundColor ? '색상 설정됨' : '색상 최적화 필요',
    improvement_action: backgroundColor
      ? '색상 대비 확인 (WCAG 4.5 이상), 브랜드 색상과 일치 확인'
      : '브랜드 색상 적용, 명도 대비 최적화',
    expected_impact: 'CVR +2-3%'
  }
}

/**
 * 2. 신뢰도 & 신뢰성 분석 (20점)
 */
function analyzeTrustAndCredibility(pageData: PageData): {
  total: number
  details: DetailedEvaluation['trust_credibility']
} {
  const details: DetailedEvaluation['trust_credibility'] = {}
  let total = 0
  
  // 상품 정보 명확성 (5점)
  const productInfo = analyzeProductInfo(pageData.product_specs)
  details['상품 정보 명확성'] = {
    score: productInfo.score,
    max_score: 5,
    description: productInfo.description,
    current_status: getStatusFromScore(productInfo.score, 5),
    improvement_action: productInfo.improvement_action,
    expected_impact: productInfo.expected_impact
  }
  total += productInfo.score
  
  // 리뷰 & 평점 시스템 (8점)
  const reviewSystem = analyzeReviewSystem(pageData.reviews)
  details['리뷰 & 평점 시스템'] = {
    score: reviewSystem.score,
    max_score: 8,
    description: reviewSystem.description,
    current_status: getStatusFromScore(reviewSystem.score, 8),
    improvement_action: reviewSystem.improvement_action,
    expected_impact: reviewSystem.expected_impact
  }
  total += reviewSystem.score
  
  // 보안 & 보증 (7점)
  const security = analyzeSecurityBadges(pageData.trust_signals)
  details['보안 & 보증'] = {
    score: security.score,
    max_score: 7,
    description: security.description,
    current_status: getStatusFromScore(security.score, 7),
    improvement_action: security.improvement_action,
    expected_impact: security.expected_impact
  }
  total += security.score
  
  return { total: Math.min(20, total), details }
}

function analyzeProductInfo(productSpecs?: string): {
  score: number
  description: string
  improvement_action: string
  expected_impact: string
} {
  if (!productSpecs || productSpecs.length < 100) {
    return {
      score: 1,
      description: '상품 정보 부족',
      improvement_action: '상품 스펙, 사용법, 목표 고객 명확히 표시 (500자 이상)',
      expected_impact: 'CVR +4%'
    }
  }
  
  const hasSpecs = productSpecs.length >= 200
  const hasUsage = productSpecs.includes('사용법') || productSpecs.includes('방법')
  const hasTarget = productSpecs.includes('고객') || productSpecs.includes('대상')
  
  let score = 0
  if (hasSpecs) score += 2
  if (hasUsage) score += 1.5
  if (hasTarget) score += 1.5
  
  return {
    score: Math.min(5, Math.round(score)),
    description: `상품 정보: ${productSpecs.length}자`,
    improvement_action: !hasUsage 
      ? '사용법 섹션 추가'
      : !hasTarget 
      ? '목표 고객 명시'
      : '상품 정보 더 상세히 작성',
    expected_impact: 'CVR +3-4%'
  }
}

function analyzeReviewSystem(reviews?: PageData['reviews']): {
  score: number
  description: string
  improvement_action: string
  expected_impact: string
} {
  if (!reviews || !reviews.average_rating || !reviews.total_count) {
    return {
      score: 0,
      description: '리뷰 시스템 없음',
      improvement_action: '리뷰 시스템 구축, 리뷰 수집 전략 수립 (목표: 100개 이상, 4.5점 이상)',
      expected_impact: 'CVR +10%'
    }
  }
  
  let score = 0
  
  // 별점 (최대 3점)
  const rating = reviews.average_rating
  if (rating >= 4.5) {
    score += 3
  } else if (rating >= 4.0) {
    score += 2
  } else if (rating >= 3.5) {
    score += 1
  }
  
  // 리뷰 수 (최대 3점)
  const count = reviews.total_count
  if (count >= 100) {
    score += 3
  } else if (count >= 50) {
    score += 2
  } else if (count >= 10) {
    score += 1
  }
  
  // 다양성 (최대 2점)
  const photoRatio = reviews.photo_review_ratio || 0
  const verifiedRatio = reviews.verified_purchase_ratio || 0
  if (photoRatio > 0.3 && verifiedRatio > 0.5) {
    score += 2
  } else if (photoRatio > 0.2 || verifiedRatio > 0.3) {
    score += 1
  }
  
  const description = `평점: ${rating.toFixed(1)}점, 리뷰: ${count}개`
  const improvementAction = rating < 4.5 || count < 100
    ? `리뷰 수집 전략 강화 (목표: 100개 이상, 4.5점 이상), 사진 리뷰 유도`
    : '리뷰 다양성 향상 (사진 리뷰 비율 30% 이상)'
  
  return {
    score: Math.min(8, Math.round(score)),
    description,
    improvement_action: improvementAction,
    expected_impact: 'CVR +8-10%'
  }
}

function analyzeSecurityBadges(trustSignals?: PageData['trust_signals']): {
  score: number
  description: string
  improvement_action: string
  expected_impact: string
} {
  if (!trustSignals) {
    return {
      score: 0,
      description: '보안 배지 없음',
      improvement_action: 'SSL 인증서 배지, 결제 보안 배지, 환불 정책, 보증 정책 표시',
      expected_impact: 'CVR +5%'
    }
  }
  
  let score = 0
  const badges: string[] = []
  
  if (trustSignals.ssl_certificate) {
    score += 1
    badges.push('SSL')
  }
  if (trustSignals.payment_security_badge) {
    score += 2
    badges.push('결제 보안')
  }
  if (trustSignals.refund_policy_clear) {
    score += 2
    badges.push('환불 정책')
  }
  if (trustSignals.warranty_policy) {
    score += 2
    badges.push('보증 정책')
  }
  
  return {
    score: Math.min(7, score),
    description: badges.length > 0 ? badges.join(', ') : '보안 배지 없음',
    improvement_action: score < 7
      ? '누락된 보안 배지 추가 (SSL, 결제 보안, 환불/보증 정책)'
      : '보안 배지 위치 최적화 (상단 눈에 띄는 위치)',
    expected_impact: 'CVR +5%'
  }
}

/**
 * 3. 설득 & 심리 트리거 분석 (25점)
 */
function analyzePersuasionTriggers(pageData: PageData): {
  total: number
  details: DetailedEvaluation['persuasion']
} {
  const details: DetailedEvaluation['persuasion'] = {}
  let total = 0
  
  // 희소성 표시 (6점)
  const scarcity = analyzeScarcityElements(pageData.text_content || '')
  details['희소성 표시'] = {
    score: scarcity.score,
    max_score: 6,
    description: scarcity.description,
    current_status: getStatusFromScore(scarcity.score, 6),
    improvement_action: scarcity.improvement_action,
    expected_impact: scarcity.expected_impact
  }
  total += scarcity.score
  
  // 긴급성 유발 (6점)
  const urgency = analyzeUrgencyElements(pageData.text_content || '')
  details['긴급성 유발'] = {
    score: urgency.score,
    max_score: 6,
    description: urgency.description,
    current_status: getStatusFromScore(urgency.score, 6),
    improvement_action: urgency.improvement_action,
    expected_impact: urgency.expected_impact
  }
  total += urgency.score
  
  // 사회적 증거 (7점)
  const socialProof = analyzeSocialProof(pageData)
  details['사회적 증거'] = {
    score: socialProof.score,
    max_score: 7,
    description: socialProof.description,
    current_status: getStatusFromScore(socialProof.score, 7),
    improvement_action: socialProof.improvement_action,
    expected_impact: socialProof.expected_impact
  }
  total += socialProof.score
  
  // 가치 제안 (6점)
  const valueProp = analyzeValueProposition(pageData.text_content || '')
  details['가치 제안'] = {
    score: valueProp.score,
    max_score: 6,
    description: valueProp.description,
    current_status: getStatusFromScore(valueProp.score, 6),
    improvement_action: valueProp.improvement_action,
    expected_impact: valueProp.expected_impact
  }
  total += valueProp.score
  
  return { total: Math.min(25, total), details }
}

function analyzeScarcityElements(content: string): {
  score: number
  description: string
  improvement_action: string
  expected_impact: string
} {
  let score = 0
  const indicators: string[] = []
  
  // 재고 제한
  const stockLimit = /재고.*\d+개|only.*\d+|남음.*\d+개/i.test(content)
  if (stockLimit) {
    score += 2
    indicators.push('재고 제한')
  }
  
  // 한정판
  const limitedEdition = /한정판|limited edition|한정/i.test(content)
  if (limitedEdition) {
    score += 2
    indicators.push('한정판')
  }
  
  // 시간 제한
  const timeLimit = /오늘 만|today only|지금만/i.test(content)
  if (timeLimit) {
    score += 2
    indicators.push('시간 제한')
  }
  
  // 시각적 강조 (숫자 포함)
  const visualEmphasis = /\d+개\s*(남음|left|remaining)/gi.test(content)
  if (visualEmphasis) {
    score += 2
    indicators.push('시각적 강조')
  }
  
  return {
    score: Math.min(6, score),
    description: indicators.length > 0 ? indicators.join(', ') : '희소성 요소 없음',
    improvement_action: score < 6
      ? '실시간 재고 카운트 추가 ("재고 N개 남음"), 한정판 표시, 시간 제한 메시지 추가'
      : '희소성 메시지 시각적 강화 (빨간색 아이콘, 애니메이션)',
    expected_impact: 'CVR +5-7%'
  }
}

function analyzeUrgencyElements(content: string): {
  score: number
  description: string
  improvement_action: string
  expected_impact: string
} {
  let score = 0
  const indicators: string[] = []
  
  // 타이머
  const hasTimer = /(오늘|today).*\d+(시간|시|:)|자정|midnight|타이머/i.test(content)
  if (hasTimer) {
    score += 3
    indicators.push('타이머')
  }
  
  // 마감일
  const hasDeadline = /(마감|deadline|expires?).*\d+/i.test(content)
  if (hasDeadline) {
    score += 3
    indicators.push('마감일')
  }
  
  // FOMO 메시지
  const hasFomo = /마지막|마지막\s기회|limited time|hurry|지금만|서두르/i.test(content)
  if (hasFomo) {
    score += 2
    indicators.push('FOMO')
  }
  
  return {
    score: Math.min(6, score),
    description: indicators.length > 0 ? indicators.join(', ') : '긴급성 요소 없음',
    improvement_action: score < 6
      ? '타이머 추가 ("오늘 자정까지"), 마감일 표시, FOMO 메시지 추가 ("마지막 기회")'
      : '긴급성 메시지 위치 최적화 (상단 고정)',
    expected_impact: 'CVR +4-6%'
  }
}

function analyzeSocialProof(pageData: PageData): {
  score: number
  description: string
  improvement_action: string
  expected_impact: string
} {
  let score = 0
  const indicators: string[] = []
  
  // 유명인 추천
  if (pageData.has_celebrity_endorsement) {
    score += 2
    indicators.push('유명인')
  }
  
  // 판매량
  const content = pageData.text_content || ''
  const hasSalesNumber = /\d+명.*구매|\d+.*sold|\d+.*판매/i.test(content)
  if (hasSalesNumber) {
    score += 2
    indicators.push('판매량')
  }
  
  // 미디어 보도
  if (pageData.has_media_mentions) {
    score += 2
    indicators.push('미디어')
  }
  
  // 전문가 추천
  if (pageData.has_expert_recommendation) {
    score += 2
    indicators.push('전문가')
  }
  
  // 리뷰 평점 (추가 점수)
  if (pageData.review_rating && pageData.review_rating >= 4.5) {
    score += 1
    indicators.push('높은 평점')
  }
  
  return {
    score: Math.min(7, score),
    description: indicators.length > 0 ? indicators.join(', ') : '사회적 증거 부족',
    improvement_action: score < 7
      ? '유명인 추천, 판매량 표시 ("10,000명 구매"), 미디어 보도, 전문가 추천 추가'
      : '사회적 증거 위치 최적화 (상단 눈에 띄는 위치)',
    expected_impact: 'CVR +6-8%'
  }
}

function analyzeValueProposition(content: string): {
  score: number
  description: string
  improvement_action: string
  expected_impact: string
} {
  let score = 0
  const indicators: string[] = []
  
  // "왜 우리인가" 섹션
  if (content.includes('우리의') || content.includes('우리만의')) {
    score += 1
    indicators.push('차별화 메시지')
  }
  
  // 경쟁사 비교
  const hasComparison = /vs\.|경쟁사|기타 제품|비교/i.test(content)
  if (hasComparison) {
    score += 2
    indicators.push('경쟁사 비교')
  }
  
  // 구체적 효과
  const concreteBenefits = content.match(/\d+%|\d+시간|\d+일|\d+개월/g)
  if (concreteBenefits && concreteBenefits.length >= 2) {
    score += 2
    indicators.push('구체적 효과')
  } else if (concreteBenefits && concreteBenefits.length >= 1) {
    score += 1
    indicators.push('일부 효과')
  }
  
  // 차별화된 3가지
  const hasThreePoints = /(첫째|둘째|셋째|1\.|2\.|3\.)/.test(content)
  if (hasThreePoints) {
    score += 1
    indicators.push('3가지 차별점')
  }
  
  return {
    score: Math.min(6, score),
    description: indicators.length > 0 ? indicators.join(', ') : '가치 제안 불명확',
    improvement_action: score < 6
      ? '"왜 우리인가" 섹션 추가, 경쟁사 비교표, 구체적 효과 수치 표시 (예: "시간 50% 절약")'
      : '가치 제안 시각적 강화 (아이콘, 그래프)',
    expected_impact: 'CVR +4-6%'
  }
}

/**
 * 4. 구조 & UX 분석 (15점)
 */
function analyzeStructureAndUX(pageData: PageData): {
  total: number
  details: DetailedEvaluation['structure_ux']
} {
  const details: DetailedEvaluation['structure_ux'] = {}
  let total = 0
  
  // 정보 구조화 (5점)
  const structure = analyzeInformationStructure(pageData.text_content || '')
  details['정보 구조화'] = {
    score: structure.score,
    max_score: 5,
    description: structure.description,
    current_status: getStatusFromScore(structure.score, 5),
    improvement_action: structure.improvement_action,
    expected_impact: structure.expected_impact
  }
  total += structure.score
  
  // 스크롤 플로우 (5점)
  const scrollFlow = analyzeScrollFlow(pageData.avg_session_duration, pageData.scroll_depth)
  details['스크롤 플로우'] = {
    score: scrollFlow.score,
    max_score: 5,
    description: scrollFlow.description,
    current_status: getStatusFromScore(scrollFlow.score, 5),
    improvement_action: scrollFlow.improvement_action,
    expected_impact: scrollFlow.expected_impact
  }
  total += scrollFlow.score
  
  // CTA 배치 (5점)
  const ctaPlacement = analyzeCTAPlacement(pageData.cta_buttons)
  details['CTA 배치'] = {
    score: ctaPlacement.score,
    max_score: 5,
    description: ctaPlacement.description,
    current_status: getStatusFromScore(ctaPlacement.score, 5),
    improvement_action: ctaPlacement.improvement_action,
    expected_impact: ctaPlacement.expected_impact
  }
  total += ctaPlacement.score
  
  return { total: Math.min(15, total), details }
}

function analyzeInformationStructure(content: string): {
  score: number
  description: string
  improvement_action: string
  expected_impact: string
} {
  // 논리적 순서 확인 (간단한 키워드 기반)
  const hasIntro = content.includes('소개') || content.includes('안녕')
  const hasProblem = content.includes('문제') || content.includes('고민')
  const hasSolution = content.includes('해결') || content.includes('제품')
  const hasFeatures = content.includes('특징') || content.includes('기능')
  const hasReviews = content.includes('리뷰') || content.includes('평점')
  const hasPrice = content.includes('가격') || content.includes('원')
  const hasCTA = content.includes('구매') || content.includes('문의')
  
  let score = 0
  const sections: string[] = []
  
  if (hasIntro) { score += 0.5; sections.push('소개') }
  if (hasProblem) { score += 0.5; sections.push('문제') }
  if (hasSolution) { score += 1; sections.push('해결') }
  if (hasFeatures) { score += 1; sections.push('특징') }
  if (hasReviews) { score += 1; sections.push('리뷰') }
  if (hasPrice) { score += 0.5; sections.push('가격') }
  if (hasCTA) { score += 0.5; sections.push('CTA') }
  
  return {
    score: Math.min(5, Math.round(score)),
    description: sections.length > 0 ? `섹션: ${sections.join(' → ')}` : '정보 구조 불명확',
    improvement_action: score < 5
      ? '논리적 순서로 재구성: 소개 → 문제 → 해결 → 특징 → 리뷰 → 가격 → CTA'
      : '섹션 분리 명확화 (시각적 구분)',
    expected_impact: 'CVR +3-4%'
  }
}

function analyzeScrollFlow(
  avgDuration?: number,
  scrollDepth?: number
): {
  score: number
  description: string
  improvement_action: string
  expected_impact: string
} {
  let score = 0
  
  // 체류 시간
  if (avgDuration) {
    if (avgDuration > 180) {
      score += 2.5
    } else if (avgDuration > 120) {
      score += 2
    } else if (avgDuration > 60) {
      score += 1
    }
  } else {
    score += 1.5 // 데이터 없음 시 기본 점수
  }
  
  // 스크롤 깊이
  if (scrollDepth) {
    if (scrollDepth > 80) {
      score += 2.5
    } else if (scrollDepth > 60) {
      score += 2
    } else if (scrollDepth > 40) {
      score += 1
    }
  } else {
    score += 1.5 // 데이터 없음 시 기본 점수
  }
  
  return {
    score: Math.min(5, Math.round(score)),
    description: avgDuration && scrollDepth
      ? `체류: ${Math.round(avgDuration)}초, 스크롤: ${scrollDepth}%`
      : '체류 시간/스크롤 데이터 없음',
    improvement_action: score < 5
      ? '콘텐츠 길이 최적화 (2-3분 읽기), 스크롤 모멘텀 유지, 모바일 최적화'
      : '스크롤 인디케이터 추가, 섹션 전환 애니메이션',
    expected_impact: 'CVR +2-3%'
  }
}

function analyzeCTAPlacement(ctaButtons?: PageData['cta_buttons']): {
  score: number
  description: string
  improvement_action: string
  expected_impact: string
} {
  if (!ctaButtons || ctaButtons.length === 0) {
    return {
      score: 0,
      description: 'CTA 버튼 없음',
      improvement_action: 'CTA 버튼 5곳 이상 배치 (상단, 중간, 하단, 고정), 감정적 카피 사용',
      expected_impact: 'CVR +8%'
    }
  }
  
  let score = 0
  
  // CTA 개수
  if (ctaButtons.length >= 5) {
    score += 2
  } else if (ctaButtons.length >= 3) {
    score += 1.5
  } else if (ctaButtons.length >= 2) {
    score += 1
  } else {
    score += 0.5
  }
  
  // 고정 CTA 확인
  const hasFixed = ctaButtons.some(btn => btn.position === 'fixed' || btn.position === 'sticky')
  if (hasFixed) {
    score += 1.5
  }
  
  // 카피 품질 (감정 단어)
  const hasEmotionalCopy = ctaButtons.some(btn => {
    const emotional = ['지금', '무료', '특별', '즉시', '지금만']
    return emotional.some(word => btn.text.includes(word))
  })
  if (hasEmotionalCopy) {
    score += 1.5
  }
  
  return {
    score: Math.min(5, Math.round(score)),
    description: `CTA: ${ctaButtons.length}개`,
    improvement_action: score < 5
      ? `CTA 버튼 추가 (목표: 5개 이상), 고정 CTA 추가, 감정적 카피 사용 ("지금 반값에 구매하기")`
      : 'CTA 버튼 색상/크기 최적화',
    expected_impact: 'CVR +5-8%'
  }
}

/**
 * 5. 전환 & 행동 유도 분석 (15점)
 */
function analyzeConversionElements(pageData: PageData): {
  total: number
  details: DetailedEvaluation['conversion']
} {
  const details: DetailedEvaluation['conversion'] = {}
  let total = 0
  
  // CTA 버튼 최적화 (5점)
  const ctaOptimization = analyzeCTAButton(pageData.cta_buttons)
  details['CTA 버튼 최적화'] = {
    score: ctaOptimization.score,
    max_score: 5,
    description: ctaOptimization.description,
    current_status: getStatusFromScore(ctaOptimization.score, 5),
    improvement_action: ctaOptimization.improvement_action,
    expected_impact: ctaOptimization.expected_impact
  }
  total += ctaOptimization.score
  
  // 구매 과정 단순화 (5점)
  const purchaseProcess = analyzePurchaseProcess(pageData.purchase_steps, pageData.payment_options)
  details['구매 과정 단순화'] = {
    score: purchaseProcess.score,
    max_score: 5,
    description: purchaseProcess.description,
    current_status: getStatusFromScore(purchaseProcess.score, 5),
    improvement_action: purchaseProcess.improvement_action,
    expected_impact: purchaseProcess.expected_impact
  }
  total += purchaseProcess.score
  
  // 이탈 방지 (5점)
  const exitPrevention = analyzeExitPrevention(pageData)
  details['이탈 방지'] = {
    score: exitPrevention.score,
    max_score: 5,
    description: exitPrevention.description,
    current_status: getStatusFromScore(exitPrevention.score, 5),
    improvement_action: exitPrevention.improvement_action,
    expected_impact: exitPrevention.expected_impact
  }
  total += exitPrevention.score
  
  return { total: Math.min(15, total), details }
}

function analyzeCTAButton(ctaButtons?: PageData['cta_buttons']): {
  score: number
  description: string
  improvement_action: string
  expected_impact: string
} {
  if (!ctaButtons || ctaButtons.length === 0) {
    return {
      score: 0,
      description: 'CTA 버튼 없음',
      improvement_action: '감정적 카피 + 눈에 띄는 색상 + 적절한 크기 (44x44px 이상) + 애니메이션',
      expected_impact: 'CVR +8%'
    }
  }
  
  const firstCTA = ctaButtons[0]
  let score = 0
  
  // 감정적 카피
  const emotional = ['지금', '무료', '특별', '즉시', '반값']
  const hasEmotional = emotional.some(word => firstCTA.text.includes(word))
  if (hasEmotional) {
    score += 1.5
  } else {
    score += 0.5
  }
  
  // 색상 (눈에 띄는 색상)
  const eyeCatching = ['red', 'orange', 'blue', 'green']
  const hasEyeCatching = eyeCatching.some(color => 
    firstCTA.color.toLowerCase().includes(color)
  )
  if (hasEyeCatching) {
    score += 1.5
  } else {
    score += 1
  }
  
  // 크기 (가정: 버튼이 있다면 기본적으로 적절)
  score += 1
  
  // 애니메이션 (분석 불가 시 기본 점수)
  score += 1
  
  return {
    score: Math.min(5, Math.round(score)),
    description: `CTA: "${firstCTA.text}"`,
    improvement_action: !hasEmotional
      ? '감정적 카피 사용 ("지금 반값에 구매하고 무료배송 받기"), 눈에 띄는 색상, 호버 애니메이션'
      : 'CTA 버튼 크기 확인 (44x44px 이상), 애니메이션 추가',
    expected_impact: 'CVR +5-8%'
  }
}

function analyzePurchaseProcess(
  steps?: number,
  paymentOptions?: number
): {
  score: number
  description: string
  improvement_action: string
  expected_impact: string
} {
  let score = 0
  
  // 구매 단계
  if (steps) {
    if (steps <= 3) {
      score += 3
    } else if (steps <= 5) {
      score += 2
    } else {
      score += 1
    }
  } else {
    score += 2 // 데이터 없음 시 기본 점수
  }
  
  // 결제 옵션
  if (paymentOptions) {
    if (paymentOptions >= 4) {
      score += 2
    } else if (paymentOptions >= 2) {
      score += 1.5
    } else {
      score += 1
    }
  } else {
    score += 1.5 // 데이터 없음 시 기본 점수
  }
  
  return {
    score: Math.min(5, Math.round(score)),
    description: steps && paymentOptions
      ? `단계: ${steps}단계, 결제 옵션: ${paymentOptions}개`
      : '구매 과정 데이터 없음',
    improvement_action: steps && steps > 3
      ? `구매 단계 최소화 (목표: 3단계 이내), 다양한 결제 수단 추가 (목표: 4개 이상), 중간 저장 기능`
      : '결제 옵션 추가, 중간 저장 기능',
    expected_impact: 'CVR +12%'
  }
}

function analyzeExitPrevention(pageData: PageData): {
  score: number
  description: string
  improvement_action: string
  expected_impact: string
} {
  let score = 0
  const features: string[] = []
  
  if (pageData.exit_popup) {
    score += 2
    features.push('이탈 팝업')
  }
  if (pageData.cart_recovery_email) {
    score += 1.5
    features.push('장바구니 복구 이메일')
  }
  if (pageData.live_chat) {
    score += 1.5
    features.push('라이브 채팅')
  }
  
  return {
    score: Math.min(5, Math.round(score)),
    description: features.length > 0 ? features.join(', ') : '이탈 방지 기능 없음',
    improvement_action: score < 5
      ? '이탈 팝업 추가 (할인 쿠폰 제공), 장바구니 복구 이메일 자동화, 라이브 채팅 추가'
      : '이탈 팝업 최적화 (A/B 테스트)',
    expected_impact: 'CVR +7-10%'
  }
}

/**
 * 6. 기술 & 성능 분석 (5점)
 */
function analyzeTechnicalPerformance(pageData: PageData): {
  total: number
  details: DetailedEvaluation['technical']
} {
  const details: DetailedEvaluation['technical'] = {}
  let total = 0
  
  // 로딩 속도 (3점)
  const loadingSpeed = analyzeLoadingSpeed(pageData.loading_speed, pageData.pagespeed_score)
  details['로딩 속도'] = {
    score: loadingSpeed.score,
    max_score: 3,
    description: loadingSpeed.description,
    current_status: getStatusFromScore(loadingSpeed.score, 3),
    improvement_action: loadingSpeed.improvement_action,
    expected_impact: loadingSpeed.expected_impact
  }
  total += loadingSpeed.score
  
  // 모바일 최적화 (2점)
  const mobileOptimization = analyzeMobileOptimization(pageData.mobile_optimized, pageData.touch_target_size)
  details['모바일 최적화'] = {
    score: mobileOptimization.score,
    max_score: 2,
    description: mobileOptimization.description,
    current_status: getStatusFromScore(mobileOptimization.score, 2),
    improvement_action: mobileOptimization.improvement_action,
    expected_impact: mobileOptimization.expected_impact
  }
  total += mobileOptimization.score
  
  return { total: Math.min(5, total), details }
}

function analyzeLoadingSpeed(
  lcp?: number,
  pagespeedScore?: number
): {
  score: number
  description: string
  improvement_action: string
  expected_impact: string
} {
  let score = 0
  
  // LCP 기준
  if (lcp) {
    if (lcp < 2500) {
      score += 2
    } else if (lcp < 4000) {
      score += 1.5
    } else if (lcp < 6000) {
      score += 1
    }
  } else {
    score += 1 // 데이터 없음 시 기본 점수
  }
  
  // PageSpeed 점수
  if (pagespeedScore) {
    if (pagespeedScore >= 90) {
      score += 1
    } else if (pagespeedScore >= 70) {
      score += 0.5
    }
  } else {
    score += 0.5 // 데이터 없음 시 기본 점수
  }
  
  return {
    score: Math.min(3, Math.round(score)),
    description: lcp && pagespeedScore
      ? `LCP: ${lcp}ms, PageSpeed: ${pagespeedScore}점`
      : '성능 데이터 없음',
    improvement_action: score < 3
      ? '이미지 최적화 (WebP, 압축), CDN 사용, 코드 최적화 (목표: LCP < 2.5초, PageSpeed 90+)'
      : '성능 모니터링 지속',
    expected_impact: 'CVR +7%'
  }
}

function analyzeMobileOptimization(
  mobileOptimized?: boolean,
  touchTargetSize?: number
): {
  score: number
  description: string
  improvement_action: string
  expected_impact: string
} {
  let score = 0
  
  if (mobileOptimized) {
    score += 1
  }
  
  if (touchTargetSize && touchTargetSize >= 44) {
    score += 1
  } else if (touchTargetSize) {
    score += 0.5
  } else {
    score += 0.5 // 데이터 없음 시 기본 점수
  }
  
  return {
    score: Math.min(2, Math.round(score)),
    description: mobileOptimized 
      ? `모바일 최적화: ${touchTargetSize ? `${touchTargetSize}px` : '확인 필요'}`
      : '모바일 최적화 필요',
    improvement_action: score < 2
      ? '완벽한 반응형 디자인, 터치 타겟 크기 44x44px 이상, 모바일 테스트'
      : '모바일 사용성 지속 개선',
    expected_impact: 'CVR +9%'
  }
}

/**
 * 7. 체류시간 & 참여도 분석 (5점)
 */
function analyzeEngagementMetrics(pageData: PageData): {
  total: number
  details: DetailedEvaluation['engagement']
} {
  const details: DetailedEvaluation['engagement'] = {}
  
  const engagement = analyzeEngagement(pageData.avg_session_duration, pageData.scroll_depth)
  details['평균 체류시간 & 스크롤'] = {
    score: engagement.score,
    max_score: 5,
    description: engagement.description,
    current_status: getStatusFromScore(engagement.score, 5),
    improvement_action: engagement.improvement_action,
    expected_impact: engagement.expected_impact
  }
  
  return { total: engagement.score, details }
}

function analyzeEngagement(
  avgDuration?: number,
  scrollDepth?: number
): {
  score: number
  description: string
  improvement_action: string
  expected_impact: string
} {
  if (!avgDuration || !scrollDepth) {
    return {
      score: 2,
      description: '참여도 데이터 없음',
      improvement_action: 'GA4 연동하여 체류 시간 및 스크롤 깊이 측정',
      expected_impact: 'CVR +2-3%'
    }
  }
  
  let score = 0
  
  // 체류 시간
  if (avgDuration > 180) {
    score += 2.5
  } else if (avgDuration > 120) {
    score += 2
  } else if (avgDuration > 60) {
    score += 1.5
  } else if (avgDuration > 30) {
    score += 1
  }
  
  // 스크롤 깊이
  if (scrollDepth > 80) {
    score += 2.5
  } else if (scrollDepth > 60) {
    score += 2
  } else if (scrollDepth > 40) {
    score += 1.5
  } else if (scrollDepth > 20) {
    score += 1
  }
  
  return {
    score: Math.min(5, Math.round(score)),
    description: `체류: ${Math.round(avgDuration)}초, 스크롤: ${scrollDepth}%`,
    improvement_action: score < 5
      ? '콘텐츠 품질 향상 (체류 시간 3분 이상 목표), 스크롤 모멘텀 유지 (스크롤 깊이 80% 이상 목표)'
      : '참여도 유지 및 모니터링',
    expected_impact: 'CVR +3-4%'
  }
}

/**
 * 총점 계산
 */
function calculateTotalScore(scores: DetailedPageScores): number {
  return Math.round(
    scores.first_impression +
    scores.trust_credibility +
    scores.persuasion +
    scores.structure_ux +
    scores.conversion +
    scores.technical +
    scores.engagement
  )
}

/**
 * 상태 판정
 */
function getStatusFromScore(score: number, maxScore: number): '완벽' | '좋음' | '보통' | '미흡' | '나쁨' {
  const ratio = score / maxScore
  if (ratio >= 0.9) return '완벽'
  if (ratio >= 0.7) return '좋음'
  if (ratio >= 0.5) return '보통'
  if (ratio >= 0.3) return '미흡'
  return '나쁨'
}

/**
 * CVR 예측
 */
function predictCVR(params: {
  overall_score: number
  persuasion_score: number
  trust_score: number
  industry_type: IndustryType
  current_metrics: {
    cvr?: number
    monthly_revenue?: number
  }
}): {
  current_cvr: number
  predicted_cvr: number
  lift_percentage: number
} {
  // 업종별 기본 CVR
  const baselineCVR: Record<IndustryType, number> = {
    ecommerce: 0.025, // 2.5%
    saas: 0.05, // 5% (리드 기준)
    local_business: 0.08, // 8% (예약 기준)
    creator_economy: 0.03, // 3% (구독 기준)
    services: 0.04, // 4% (문의 기준)
    healthcare: 0.06, // 6% (예약 기준)
    food_beverage: 0.07, // 7% (예약/주문 기준)
    media: 0.02, // 2% (구독 기준)
    non_profit: 0.03 // 3% (기부 기준)
  }
  
  const baseline = params.current_metrics.cvr || baselineCVR[params.industry_type] || 0.025
  
  // 점수 기반 승수
  const overallMultiplier = 1.0 + (params.overall_score / 100) * 0.5
  // 50점 = 1.25배, 100점 = 1.5배
  
  // 설득력 보너스
  const persuasionBoost = (params.persuasion_score / 25) * 0.3
  // 25점 = +30% CVR 증가
  
  // 신뢰도 보너스
  const trustBoost = (params.trust_score / 20) * 0.2
  // 20점 = +20% CVR 증가
  
  // 최종 예측 CVR
  const predictedCVR = baseline * overallMultiplier * (1 + persuasionBoost + trustBoost)
  const liftPercentage = ((predictedCVR / baseline) - 1) * 100
  
  return {
    current_cvr: baseline,
    predicted_cvr: Math.max(0, Math.round(predictedCVR * 10000) / 10000),
    lift_percentage: Math.round(liftPercentage * 10) / 10
  }
}

/**
 * 약점 파악
 */
function identifyWeakAreas(scores: DetailedPageScores): Array<{
  area: string
  score: number
  maxScore: number
  ratio: number
  impact: number
  effort: number
}> {
  const areaWeights: Record<keyof DetailedPageScores, number> = {
    first_impression: 0.15,
    trust_credibility: 0.20,
    persuasion: 0.25,
    structure_ux: 0.15,
    conversion: 0.15,
    technical: 0.05,
    engagement: 0.05
  }
  
  const effortMap: Record<keyof DetailedPageScores, number> = {
    first_impression: 0.3, // 낮음
    trust_credibility: 0.5, // 중간
    persuasion: 0.2, // 낮음
    structure_ux: 0.4, // 중간
    conversion: 0.3, // 낮음
    technical: 0.6, // 높음
    engagement: 0.5 // 중간
  }
  
  return Object.entries(scores).map(([area, score]) => {
    const maxScore = {
      first_impression: 15,
      trust_credibility: 20,
      persuasion: 25,
      structure_ux: 15,
      conversion: 15,
      technical: 5,
      engagement: 5
    }[area as keyof DetailedPageScores]
    
    return {
      area,
      score,
      maxScore,
      ratio: score / maxScore,
      impact: areaWeights[area as keyof DetailedPageScores],
      effort: effortMap[area as keyof DetailedPageScores]
    }
  }).filter(w => w.ratio < 0.7) // 70% 미만인 영역만
}

/**
 * 개선 액션 생성
 */
function generateRecommendations(params: {
  scores: DetailedPageScores
  industry_type: IndustryType
  detailed_evaluation: DetailedEvaluation
}): Recommendation[] {
  const weaknesses = identifyWeakAreas(params.scores)
  
  const recommendations: Recommendation[] = []
  
  weaknesses.forEach(weakness => {
    const actions = getRecommendedActions(weakness.area as keyof DetailedPageScores, params.industry_type)
    
    actions.forEach(action => {
      const priorityScore = (1 - weakness.ratio) * weakness.impact / weakness.effort
      
      recommendations.push({
        priority: priorityScore > 0.7 ? 'critical' : priorityScore > 0.4 ? 'high' : 'medium',
        area: weakness.area,
        action: action.description,
        effort: action.effort,
        expected_cvr_impact: action.cvr_impact,
        implementation_time: action.implementation_time,
        step_by_step: action.steps
      })
    })
  })
  
  // 우선순위 정렬
  return recommendations
    .sort((a, b) => {
      const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 }
      if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
        return priorityOrder[b.priority] - priorityOrder[a.priority]
      }
      return b.expected_cvr_impact - a.expected_cvr_impact
    })
    .slice(0, 10) // Top 10
}

/**
 * 추천 액션 데이터베이스
 */
function getRecommendedActions(
  area: keyof DetailedPageScores,
  industryType: IndustryType
): Array<{
  description: string
  effort: 'low' | 'medium' | 'high'
  cvr_impact: number
  implementation_time: string
  steps: string[]
}> {
  const actions: Record<string, Partial<Record<IndustryType, Array<{
    description: string
    effort: 'low' | 'medium' | 'high'
    cvr_impact: number
    implementation_time: string
    steps: string[]
  }>>>> = {
    persuasion: {
      ecommerce: [
        {
          description: '실시간 재고 카운트 추가',
          effort: 'low',
          cvr_impact: 5,
          implementation_time: '2-3시간',
          steps: [
            '1. 실시간 재고 API 연결',
            '2. 상세페이지 상단에 "재고 N개 남음" 배너 추가',
            '3. 빨간색 아이콘으로 강조',
            '4. A/B 테스트: 있는 버전 vs 없는 버전'
          ]
        },
        {
          description: '타이머 추가 (한정 할인)',
          effort: 'low',
          cvr_impact: 4,
          implementation_time: '1-2시간',
          steps: [
            '1. JavaScript 타이머 컴포넌트 추가',
            '2. "오늘 자정까지" 메시지 표시',
            '3. 시각적 강조 (빨간색, 애니메이션)'
          ]
        }
      ],
      saas: [
        {
          description: '사용 사례(Case Study) 추가',
          effort: 'high',
          cvr_impact: 8,
          implementation_time: '1주일',
          steps: [
            '1. 고객 인터뷰 및 데이터 수집',
            '2. Case Study 페이지 작성',
            '3. 랜딩 페이지에 링크 추가'
          ]
        }
      ],
      local_business: [
        {
          description: '예약 마감 알림 추가',
          effort: 'low',
          cvr_impact: 6,
          implementation_time: '2-3시간',
          steps: [
            '1. 예약 가능 시간 확인',
            '2. "오늘 예약 마감 임박" 메시지 추가',
            '3. 시각적 강조'
          ]
        }
      ]
    },
    trust_credibility: {
      ecommerce: [
        {
          description: '리뷰 시스템 개선',
          effort: 'medium',
          cvr_impact: 10,
          implementation_time: '1주일',
          steps: [
            '1. 리뷰 수집 전략 수립',
            '2. 구매 후 이메일 자동 발송',
            '3. 리뷰 인센티브 제공',
            '4. 리뷰 평점 목표: 4.5점 이상'
          ]
        }
      ],
      saas: [
        {
          description: '고객 로고 섹션 추가',
          effort: 'medium',
          cvr_impact: 8,
          implementation_time: '3-5일',
          steps: [
            '1. 고객사 로고 수집',
            '2. "우리를 신뢰하는 기업" 섹션 추가',
            '3. 로고 캐러셀 구현'
          ]
        }
      ]
    },
    conversion: {
      ecommerce: [
        {
          description: '장바구니 이탈 개선',
          effort: 'low',
          cvr_impact: 12,
          implementation_time: '2-3시간',
          steps: [
            '1. 이탈 팝업 추가 (할인 쿠폰 제공)',
            '2. 장바구니 복구 이메일 자동화',
            '3. A/B 테스트: 팝업 vs 없음'
          ]
        },
        {
          description: '결제 프로세스 단순화',
          effort: 'medium',
          cvr_impact: 12,
          implementation_time: '1주일',
          steps: [
            '1. 구매 단계 최소화 (목표: 3단계 이내)',
            '2. 게스트 체크아웃 옵션 추가',
            '3. 결제 정보 자동 저장'
          ]
        }
      ]
    }
  }
  
  const areaActions = actions[area]?.[industryType] || []
  
  // 기본 액션 (업종별 특화 액션이 없을 경우)
  if (areaActions.length === 0) {
    return [{
      description: `${area} 영역 개선`,
      effort: 'medium' as const,
      cvr_impact: 3,
      implementation_time: '1주일',
      steps: ['1. 해당 영역 분석', '2. 개선 계획 수립', '3. 실행 및 테스트']
    }]
  }
  
  return areaActions
}

/**
 * A/B 테스트 제안
 */
function suggestABTests(params: {
  weak_areas: ReturnType<typeof identifyWeakAreas>
  industry_type: IndustryType
}): ABTestSuggestion[] {
  const suggestions: ABTestSuggestion[] = []
  
  // CTA 버튼 텍스트 테스트
  if (params.weak_areas.some(w => w.area === 'conversion')) {
    suggestions.push({
      test_name: 'CTA 버튼 텍스트',
      variant_a: '구매하기',
      variant_b: '지금 반값에 구매하고 무료배송 받기',
      expected_winner: 'variant_b',
      expected_lift: 12,
      sample_size: 500,
      duration: '2주'
    })
  }
  
  // 희소성 메시지 테스트
  if (params.weak_areas.some(w => w.area === 'persuasion')) {
    suggestions.push({
      test_name: '희소성 표시',
      variant_a: '희소성 메시지 없음',
      variant_b: '실시간 재고 카운트 ("재고 5개 남음")',
      expected_winner: 'variant_b',
      expected_lift: 7,
      sample_size: 300,
      duration: '2주'
    })
  }
  
  // 리뷰 표시 위치 테스트
  if (params.weak_areas.some(w => w.area === 'trust_credibility')) {
    suggestions.push({
      test_name: '리뷰 표시 위치',
      variant_a: '리뷰 하단 배치',
      variant_b: '리뷰 상단 배치 (제품 정보 바로 아래)',
      expected_winner: 'variant_b',
      expected_lift: 5,
      sample_size: 400,
      duration: '2주'
    })
  }
  
  return suggestions.slice(0, 5) // 최대 5개
}

/**
 * 수익 예측
 */
function projectRevenue(params: {
  current_monthly_revenue: number
  cvr_lift_potential: number
  confidence: number
}): RevenueProjection {
  const liftMultiplier = 1 + (params.cvr_lift_potential / 100)
  
  return {
    current_monthly_revenue: params.current_monthly_revenue,
    projected_30days: Math.round(params.current_monthly_revenue * liftMultiplier * 0.3),
    projected_90days: Math.round(params.current_monthly_revenue * liftMultiplier * 0.9),
    projected_1year: Math.round(params.current_monthly_revenue * liftMultiplier * 12),
    confidence: params.confidence
  }
}

/**
 * 신뢰도 계산
 */
function calculateConfidenceScore(params: {
  overall_score: number
  data_completeness: number
}): number {
  // 점수가 높을수록, 데이터가 완전할수록 신뢰도 높음
  const scoreConfidence = params.overall_score
  const dataConfidence = params.data_completeness
  
  return Math.round((scoreConfidence * 0.6 + dataConfidence * 0.4))
}

/**
 * 데이터 완전도 계산
 */
function calculateDataCompleteness(pageData: PageData): number {
  let completeness = 0
  let total = 0
  
  // 각 필드 확인
  if (pageData.hero_image) completeness += 1; total += 1
  if (pageData.main_title) completeness += 1; total += 1
  if (pageData.reviews) completeness += 1; total += 1
  if (pageData.trust_signals) completeness += 1; total += 1
  if (pageData.cta_buttons) completeness += 1; total += 1
  if (pageData.loading_speed !== undefined) completeness += 1; total += 1
  if (pageData.avg_session_duration !== undefined) completeness += 1; total += 1
  
  return total > 0 ? (completeness / total) * 100 : 50
}

/**
 * 백분위 계산
 */
function calculatePercentile(score: number): number {
  // 간단한 백분위 계산 (실제로는 업종별 벤치마크 필요)
  if (score >= 90) return 95
  if (score >= 80) return 75
  if (score >= 70) return 50
  if (score >= 60) return 25
  return 10
}
