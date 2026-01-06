/**
 * 업종별 심리 분석 트리거 측정 시스템
 * 각 업종의 특화된 심리 요소를 구체적으로 측정
 */

import { IndustryType } from '@/data/industries/industryConfig'

export interface PsychologyTriggerMeasurement {
  trigger: string
  score: number // 0-10
  measurement: string // 측정 방법
  currentValue?: number | string
  benchmark?: {
    top1: number
    median: number
    bottom25: number
  }
  recommendation?: string
}

export interface IndustryPsychologyTriggers {
  industry: IndustryType
  measurements: PsychologyTriggerMeasurement[]
  overallScore: number // 0-100
  insights: string[]
  priorityActions: Array<{
    action: string
    trigger: string
    expectedImpact: string
    priority: 'high' | 'medium' | 'low'
  }>
}

/**
 * 전자상거래 심리 트리거 측정
 */
export function measureEcommercePsychology(data: {
  scarcity_indicators?: number // 재고 부족 알림 수
  review_count?: number
  review_rating?: number
  discount_display?: boolean
  urgency_messages?: number // "마지막 상품", "할인 마감" 등
  product_images?: number
  image_quality?: number // 0-10
  return_policy?: boolean
  cart_abandonment_popup?: boolean
  shipping_time?: number // 시간
  option_count?: number // 상품 옵션 수
  information_density?: number // 정보량 (0-10)
}): IndustryPsychologyTriggers {
  const measurements: PsychologyTriggerMeasurement[] = []

  // 희소성 (Scarcity)
  const scarcityScore = data.scarcity_indicators 
    ? Math.min(10, data.scarcity_indicators * 2) 
    : 0
  measurements.push({
    trigger: '희소성 (Scarcity)',
    score: scarcityScore,
    measurement: `재고 부족 알림: ${data.scarcity_indicators || 0}개`,
    benchmark: { top1: 8, median: 5, bottom25: 2 },
    recommendation: scarcityScore < 6 
      ? '재고 부족 알림, "마지막 상품" 메시지 추가' 
      : undefined
  })

  // 사회적 증거 (Social Proof)
  const socialProofScore = data.review_count && data.review_rating
    ? Math.min(10, (data.review_count / 100) * 2 + (data.review_rating - 3) * 2)
    : 0
  measurements.push({
    trigger: '사회적 증거 (Social Proof)',
    score: socialProofScore,
    measurement: `리뷰: ${data.review_count || 0}개, 평점: ${data.review_rating || 0}점`,
    benchmark: { top1: 9, median: 7, bottom25: 4 },
    recommendation: socialProofScore < 7
      ? '리뷰 수집 전략, 평점 4.5점 이상 목표'
      : undefined
  })

  // 가격 프레이밍
  const priceFramingScore = data.discount_display ? 8 : 3
  measurements.push({
    trigger: '가격 프레이밍 (Price Framing)',
    score: priceFramingScore,
    measurement: `할인 표시: ${data.discount_display ? '있음' : '없음'}`,
    benchmark: { top1: 9, median: 7, bottom25: 4 },
    recommendation: priceFramingScore < 7
      ? '정가/할인가 명확히 표시, 할인율 퍼센트 표시'
      : undefined
  })

  // 즉시성 (Urgency)
  const urgencyScore = data.urgency_messages
    ? Math.min(10, data.urgency_messages * 2 + (data.shipping_time ? (24 - data.shipping_time) / 2 : 0))
    : 0
  measurements.push({
    trigger: '즉시성 (Urgency)',
    score: urgencyScore,
    measurement: `긴급 메시지: ${data.urgency_messages || 0}개, 배송 시간: ${data.shipping_time || 0}시간`,
    benchmark: { top1: 8, median: 6, bottom25: 3 },
    recommendation: urgencyScore < 6
      ? '"오늘 구매하면 무료배송", "할인 마감" 메시지 추가'
      : undefined
  })

  // 도파민 (시각적 매력)
  const dopamineScore = data.product_images && data.image_quality
    ? Math.min(10, (data.product_images / 10) * 3 + data.image_quality * 0.7)
    : 0
  measurements.push({
    trigger: '도파민 (시각적 매력)',
    score: dopamineScore,
    measurement: `상품 이미지: ${data.product_images || 0}장, 품질: ${data.image_quality || 0}/10`,
    benchmark: { top1: 9, median: 7, bottom25: 4 },
    recommendation: dopamineScore < 7
      ? '고품질 이미지 10장 이상, 다각도 촬영, 비디오 추가'
      : undefined
  })

  // 신뢰
  const trustScore = (data.return_policy ? 3 : 0) + 
                     (data.review_rating ? Math.min(4, (data.review_rating - 3) * 2) : 0) +
                     (data.review_count ? Math.min(3, data.review_count / 50) : 0)
  measurements.push({
    trigger: '신뢰 (Trust)',
    score: Math.min(10, trustScore),
    measurement: `반품 정책: ${data.return_policy ? '있음' : '없음'}, 리뷰: ${data.review_count || 0}개`,
    benchmark: { top1: 9, median: 7, bottom25: 4 },
    recommendation: trustScore < 7
      ? '반품 정책 명확히 표시, 리뷰 수집, 신뢰 배지 추가'
      : undefined
  })

  // 인지 부하
  const cognitiveLoadScore = 10 - Math.min(10, 
    (data.option_count ? data.option_count / 2 : 0) + 
    (data.information_density ? data.information_density : 0)
  )
  measurements.push({
    trigger: '인지 부하 (Cognitive Load)',
    score: cognitiveLoadScore,
    measurement: `옵션 수: ${data.option_count || 0}개, 정보 밀도: ${data.information_density || 0}/10`,
    benchmark: { top1: 8, median: 6, bottom25: 3 },
    recommendation: cognitiveLoadScore < 6
      ? '옵션 수 최소화, 정보 구조화, 단계별 안내'
      : undefined
  })

  // 종합 점수
  const overallScore = Math.round(
    measurements.reduce((sum, m) => sum + m.score, 0) / measurements.length * 10
  )

  // 우선순위 액션
  const priorityActions = [
    {
      action: '장바구니 이탈 개선',
      trigger: '인지 부하',
      expectedImpact: 'CVR +12%',
      priority: 'high' as const
    },
    {
      action: '결제 프로세스 단순화',
      trigger: '인지 부하',
      expectedImpact: 'CVR +12%',
      priority: 'high' as const
    },
    {
      action: '리뷰 별점 마크업',
      trigger: '사회적 증거',
      expectedImpact: 'CVR +8%',
      priority: 'high' as const
    },
    {
      action: '상품 이미지 고도화',
      trigger: '도파민',
      expectedImpact: 'CVR +5%',
      priority: 'high' as const
    },
    {
      action: '페이지 로딩 속도 개선',
      trigger: '인지 부하',
      expectedImpact: 'CVR +7%',
      priority: 'high' as const
    }
  ]

  // 인사이트
  const insights: string[] = []
  if (overallScore < 70) {
    insights.push('전자상거래 심리 트리거가 평균 이하입니다. 희소성, 사회적 증거, 긴급성을 강화하세요.')
  }
  if (scarcityScore < 5) {
    insights.push('희소성 요소가 부족합니다. 재고 부족 알림, "마지막 상품" 메시지를 추가하세요.')
  }
  if (socialProofScore < 7) {
    insights.push('사회적 증거를 강화하세요. 리뷰 수집 전략, 평점 4.5점 이상 목표를 설정하세요.')
  }

  return {
    industry: 'ecommerce',
    measurements,
    overallScore,
    insights,
    priorityActions
  }
}

/**
 * SaaS 심리 트리거 측정
 */
export function measureSaasPsychology(data: {
  customer_logos?: number
  review_count?: number
  user_count?: number
  security_badges?: boolean
  research_content?: number // 리서치 기반 콘텐츠 수
  case_studies?: number
  pricing_options?: number
  feature_complexity?: number // 0-10
  demo_video?: boolean
  free_trial?: boolean
  discount_urgency?: boolean
}): IndustryPsychologyTriggers {
  const measurements: PsychologyTriggerMeasurement[] = []

  // 신뢰
  const trustScore = (data.customer_logos ? Math.min(4, data.customer_logos / 5) : 0) +
                     (data.review_count ? Math.min(3, data.review_count / 20) : 0) +
                     (data.user_count ? Math.min(2, Math.log10(data.user_count) / 2) : 0) +
                     (data.security_badges ? 1 : 0)
  measurements.push({
    trigger: '신뢰 (Trust)',
    score: Math.min(10, trustScore),
    measurement: `고객 로고: ${data.customer_logos || 0}개, 리뷰: ${data.review_count || 0}개, 사용자: ${data.user_count || 0}명`,
    benchmark: { top1: 9, median: 7, bottom25: 4 },
    recommendation: trustScore < 7
      ? '고객 로고, 리뷰, 사용자 수 표시, 보안 배지 추가'
      : undefined
  })

  // 전문성
  const authorityScore = (data.research_content ? Math.min(5, data.research_content / 2) : 0) +
                         (data.case_studies ? Math.min(5, data.case_studies * 2) : 0)
  measurements.push({
    trigger: '전문성 (Authority)',
    score: Math.min(10, authorityScore),
    measurement: `리서치 콘텐츠: ${data.research_content || 0}개, 케이스 스터디: ${data.case_studies || 0}개`,
    benchmark: { top1: 9, median: 7, bottom25: 4 },
    recommendation: authorityScore < 7
      ? '리서치 기반 백서, 케이스 스터디 작성'
      : undefined
  })

  // 복잡도 제거
  const simplicityScore = 10 - Math.min(10,
    (data.pricing_options ? data.pricing_options / 2 : 0) +
    (data.feature_complexity ? data.feature_complexity : 0)
  )
  measurements.push({
    trigger: '복잡도 제거 (Simplicity)',
    score: Math.max(0, simplicityScore),
    measurement: `가격 옵션: ${data.pricing_options || 0}개, 기능 복잡도: ${data.feature_complexity || 0}/10`,
    benchmark: { top1: 8, median: 6, bottom25: 3 },
    recommendation: simplicityScore < 6
      ? '가격 옵션 최소화, 기능 설명 단순화, 비교표 제공'
      : undefined
  })

  // 긴급성 (FOMO)
  const urgencyScore = (data.free_trial ? 4 : 0) +
                       (data.discount_urgency ? 4 : 0) +
                       (data.demo_video ? 2 : 0)
  measurements.push({
    trigger: '긴급성 (FOMO)',
    score: Math.min(10, urgencyScore),
    measurement: `무료 체험: ${data.free_trial ? '있음' : '없음'}, 할인: ${data.discount_urgency ? '있음' : '없음'}`,
    benchmark: { top1: 8, median: 6, bottom25: 3 },
    recommendation: urgencyScore < 6
      ? '무료 체험 제공, 한정 기간 할인 강조'
      : undefined
  })

  // 도파민 (동기 유발)
  const dopamineScore = (data.demo_video ? 5 : 0) +
                        (data.case_studies ? Math.min(5, data.case_studies * 2) : 0)
  measurements.push({
    trigger: '도파민 (동기 유발)',
    score: Math.min(10, dopamineScore),
    measurement: `데모 영상: ${data.demo_video ? '있음' : '없음'}, 성공 사례: ${data.case_studies || 0}개`,
    benchmark: { top1: 8, median: 6, bottom25: 3 },
    recommendation: dopamineScore < 6
      ? '데모 영상 제작, 성공 사례 강조'
      : undefined
  })

  const overallScore = Math.round(
    measurements.reduce((sum, m) => sum + m.score, 0) / measurements.length * 10
  )

  const priorityActions = [
    {
      action: '문제 해결형 블로그 콘텐츠',
      trigger: '전문성',
      expectedImpact: 'Leads +30%',
      priority: 'high' as const
    },
    {
      action: 'Case Study/Whitepaper 작성',
      trigger: '전문성',
      expectedImpact: 'Leads +25%',
      priority: 'high' as const
    },
    {
      action: '웨비나 시리즈',
      trigger: '신뢰',
      expectedImpact: 'Leads +20%',
      priority: 'high' as const
    },
    {
      action: '이메일 시퀀스 개선',
      trigger: '복잡도 제거',
      expectedImpact: 'Conversion +15%',
      priority: 'medium' as const
    },
    {
      action: '무료 체험 프로세스 단순화',
      trigger: '복잡도 제거',
      expectedImpact: 'Leads +10%',
      priority: 'medium' as const
    }
  ]

  const insights: string[] = []
  if (overallScore < 70) {
    insights.push('SaaS 심리 트리거가 평균 이하입니다. 신뢰와 전문성을 강화하고 복잡도를 제거하세요.')
  }
  if (trustScore < 7) {
    insights.push('신뢰 요소가 부족합니다. 고객 로고, 리뷰, 사용자 수를 강조하세요.')
  }
  if (simplicityScore < 6) {
    insights.push('복잡도가 높습니다. 가격 옵션을 최소화하고 기능 설명을 단순화하세요.')
  }

  return {
    industry: 'saas',
    measurements,
    overallScore,
    insights,
    priorityActions
  }
}

/**
 * 로컬 비즈니스 심리 트리거 측정
 */
export function measureLocalBusinessPsychology(data: {
  location_proximity?: number // 거리 (m)
  review_rating?: number
  review_count?: number
  booking_urgency?: boolean
  social_proof_count?: number // "지금 30명이 보고 있습니다"
  business_hours?: boolean
  photos_count?: number
  video_tour?: boolean
}): IndustryPsychologyTriggers {
  const measurements: PsychologyTriggerMeasurement[] = []

  // 위치 근접성
  const proximityScore = data.location_proximity
    ? Math.min(10, 10 - (data.location_proximity / 1000))
    : 5
  measurements.push({
    trigger: '위치 근접성 (Location Proximity)',
    score: proximityScore,
    measurement: `거리: ${data.location_proximity || 0}m`,
    benchmark: { top1: 9, median: 7, bottom25: 4 },
    recommendation: proximityScore < 7
      ? 'GPS 기반 거리 표시, 지도 최적화'
      : undefined
  })

  // 신뢰 (리뷰)
  const trustScore = (data.review_rating ? Math.min(5, (data.review_rating - 3) * 2.5) : 0) +
                     (data.review_count ? Math.min(5, data.review_count / 20) : 0)
  measurements.push({
    trigger: '신뢰 (Trust)',
    score: Math.min(10, trustScore),
    measurement: `평점: ${data.review_rating || 0}점, 리뷰: ${data.review_count || 0}개`,
    benchmark: { top1: 9, median: 7, bottom25: 4 },
    recommendation: trustScore < 7
      ? '리뷰 수집 전략, 평점 4.5점 이상 목표'
      : undefined
  })

  // 긴급성
  const urgencyScore = (data.booking_urgency ? 5 : 0) +
                       (data.business_hours ? 3 : 0) +
                       (data.social_proof_count ? Math.min(2, data.social_proof_count / 15) : 0)
  measurements.push({
    trigger: '긴급성 (Urgency)',
    score: Math.min(10, urgencyScore),
    measurement: `예약 긴급성: ${data.booking_urgency ? '있음' : '없음'}, 영업시간: ${data.business_hours ? '표시' : '없음'}`,
    benchmark: { top1: 8, median: 6, bottom25: 3 },
    recommendation: urgencyScore < 6
      ? '예약 마감 알림, 영업시간 종료 임박 표시'
      : undefined
  })

  // 사회적 증거
  const socialProofScore = data.social_proof_count
    ? Math.min(10, data.social_proof_count / 3)
    : 0
  measurements.push({
    trigger: '사회적 증거 (Social Proof)',
    score: socialProofScore,
    measurement: `"지금 보고 있는 사람": ${data.social_proof_count || 0}명`,
    benchmark: { top1: 8, median: 6, bottom25: 3 },
    recommendation: socialProofScore < 6
      ? '"지금 30명이 보고 있습니다" 메시지 추가'
      : undefined
  })

  // 시각적 매력
  const visualScore = (data.photos_count ? Math.min(5, data.photos_count / 2) : 0) +
                      (data.video_tour ? 5 : 0)
  measurements.push({
    trigger: '시각적 매력 (Visual Appeal)',
    score: Math.min(10, visualScore),
    measurement: `사진: ${data.photos_count || 0}장, 비디오 투어: ${data.video_tour ? '있음' : '없음'}`,
    benchmark: { top1: 9, median: 7, bottom25: 4 },
    recommendation: visualScore < 7
      ? '고품질 사진 10장 이상, 비디오 투어 추가'
      : undefined
  })

  const overallScore = Math.round(
    measurements.reduce((sum, m) => sum + m.score, 0) / measurements.length * 10
  )

  const priorityActions = [
    {
      action: 'Naver Place 순위 개선',
      trigger: '위치 근접성',
      expectedImpact: 'Visits +50%',
      priority: 'high' as const
    },
    {
      action: '사진/영상 고도화',
      trigger: '시각적 매력',
      expectedImpact: 'Click-Through +30%',
      priority: 'high' as const
    },
    {
      action: '리뷰 응답 자동화',
      trigger: '신뢰',
      expectedImpact: 'Rating +0.2점',
      priority: 'high' as const
    },
    {
      action: '예약 시스템 개선',
      trigger: '긴급성',
      expectedImpact: 'Conversion +25%',
      priority: 'high' as const
    },
    {
      action: '카카오톡 채널 운영',
      trigger: '사회적 증거',
      expectedImpact: 'Repeat +15%',
      priority: 'medium' as const
    }
  ]

  const insights: string[] = []
  if (overallScore < 70) {
    insights.push('로컬 비즈니스 심리 트리거가 평균 이하입니다. 위치 근접성, 리뷰, 긴급성을 강화하세요.')
  }
  if (proximityScore < 7) {
    insights.push('위치 정보를 강화하세요. GPS 기반 거리 표시, 지도를 최적화하세요.')
  }
  if (trustScore < 7) {
    insights.push('리뷰를 강화하세요. 리뷰 수집 전략, 평점 4.5점 이상 목표를 설정하세요.')
  }

  return {
    industry: 'local_business',
    measurements,
    overallScore,
    insights,
    priorityActions
  }
}

/**
 * 크리에이터 심리 트리거 측정
 */
export function measureCreatorPsychology(data: {
  thumbnail_quality?: number // 0-10
  title_curiosity?: number // 0-10
  story_empathy?: number // 0-10
  fan_mentions?: number // 팬 멘션 수
  fan_names?: boolean
  limited_content?: boolean
  live_feeling?: boolean
}): IndustryPsychologyTriggers {
  const measurements: PsychologyTriggerMeasurement[] = []

  // 호기심
  const curiosityScore = ((data.thumbnail_quality || 0) + (data.title_curiosity || 0)) / 2
  measurements.push({
    trigger: '호기심 (Curiosity)',
    score: curiosityScore,
    measurement: `썸네일 품질: ${data.thumbnail_quality || 0}/10, 제목 구체성: ${data.title_curiosity || 0}/10`,
    benchmark: { top1: 9, median: 7, bottom25: 4 },
    recommendation: curiosityScore < 7
      ? '썸네일 최적화, 호기심 자극하는 제목 작성'
      : undefined
  })

  // 공감
  const empathyScore = data.story_empathy || 0
  measurements.push({
    trigger: '공감 (Empathy)',
    score: empathyScore,
    measurement: `감정적 스토리: ${empathyScore}/10`,
    benchmark: { top1: 9, median: 7, bottom25: 4 },
    recommendation: empathyScore < 7
      ? '공감 요소 강화, 감정적 스토리텔링'
      : undefined
  })

  // 팬덤 형성
  const fanScore = (data.fan_mentions ? Math.min(5, data.fan_mentions / 2) : 0) +
                   (data.fan_names ? 5 : 0)
  measurements.push({
    trigger: '팬덤 형성 (Parasocial Bond)',
    score: Math.min(10, fanScore),
    measurement: `팬 멘션: ${data.fan_mentions || 0}개, 팬 이름 사용: ${data.fan_names ? '있음' : '없음'}`,
    benchmark: { top1: 9, median: 7, bottom25: 4 },
    recommendation: fanScore < 7
      ? '팬 멘션, 팬 이름 사용, 상호작용 강화'
      : undefined
  })

  // 긴급성
  const urgencyScore = (data.limited_content ? 5 : 0) +
                       (data.live_feeling ? 5 : 0)
  measurements.push({
    trigger: '긴급성 (Urgency)',
    score: Math.min(10, urgencyScore),
    measurement: `한정 콘텐츠: ${data.limited_content ? '있음' : '없음'}, 생방송 느낌: ${data.live_feeling ? '있음' : '없음'}`,
    benchmark: { top1: 8, median: 6, bottom25: 3 },
    recommendation: urgencyScore < 6
      ? '한정 콘텐츠, 생방송 느낌 강조'
      : undefined
  })

  const overallScore = Math.round(
    measurements.reduce((sum, m) => sum + m.score, 0) / measurements.length * 10
  )

  const priorityActions = [
    {
      action: '썸네일 최적화',
      trigger: '호기심',
      expectedImpact: 'CTR +20%',
      priority: 'high' as const
    },
    {
      action: '영상 길이 최적화',
      trigger: '공감',
      expectedImpact: 'Watch Time +15%',
      priority: 'high' as const
    },
    {
      action: '커뮤니티 탭 활용',
      trigger: '팬덤 형성',
      expectedImpact: 'Engagement +30%',
      priority: 'high' as const
    },
    {
      action: '멤버십 프로그램 론칭',
      trigger: '팬덤 형성',
      expectedImpact: 'Revenue +40%',
      priority: 'medium' as const
    },
    {
      action: '콜라보 시리즈',
      trigger: '호기심',
      expectedImpact: 'Subscriber Growth +25%',
      priority: 'medium' as const
    }
  ]

  const insights: string[] = []
  if (overallScore < 70) {
    insights.push('크리에이터 심리 트리거가 평균 이하입니다. 호기심, 공감, 팬덤 형성을 강화하세요.')
  }
  if (curiosityScore < 7) {
    insights.push('호기심 요소가 부족합니다. 썸네일과 제목을 최적화하세요.')
  }
  if (fanScore < 7) {
    insights.push('팬덤 형성이 부족합니다. 팬 멘션, 상호작용을 강화하세요.')
  }

  return {
    industry: 'creator_economy',
    measurements,
    overallScore,
    insights,
    priorityActions
  }
}

/**
 * 업종별 심리 트리거 측정 (통합 함수)
 */
export function measureIndustryPsychology(
  industry: IndustryType,
  data: any
): IndustryPsychologyTriggers {
  switch (industry) {
    case 'ecommerce':
      return measureEcommercePsychology(data)
    case 'saas':
      return measureSaasPsychology(data)
    case 'local_business':
      return measureLocalBusinessPsychology(data)
    case 'creator_economy':
      return measureCreatorPsychology(data)
    default:
      // 기본 측정 (다른 업종은 추후 확장)
      return {
        industry,
        measurements: [],
        overallScore: 0,
        insights: ['이 업종의 심리 트리거 측정은 아직 구현되지 않았습니다.'],
        priorityActions: []
      }
  }
}
