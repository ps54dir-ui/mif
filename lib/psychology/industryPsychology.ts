/**
 * 업종별 심리 분석 트리거
 * 각 업종의 특성에 맞는 심리 요소 가중치 및 분석 로직
 */

import { IndustryType } from '@/data/industries/industryConfig'
import { PsychologicalProfile, predictCVRFromPsychology, CVRPrediction } from './cvrPredictor'

export interface IndustryPsychologyWeights {
  dopamine: number // 0-1, 가중치
  cortisol: number
  trust: number
  urgency: number
  cognitive_load: number
}

export interface IndustryPsychologyAnalysis {
  industry: IndustryType
  adjustedProfile: PsychologicalProfile
  originalProfile: PsychologicalProfile
  prediction: CVRPrediction
  industrySpecificInsights: string[]
  recommendedActions: Array<{
    action: string
    psychologyFactor: string
    expectedImpact: string
    priority: 'high' | 'medium' | 'low'
  }>
}

/**
 * 업종별 심리 가중치
 */
const INDUSTRY_PSYCHOLOGY_WEIGHTS: Record<IndustryType, IndustryPsychologyWeights> = {
  // 전자상거래: 희소성, 사회적 증거, 가격 프레임
  ecommerce: {
    dopamine: 0.25, // 높음 (보상 시스템)
    cortisol: 0.20, // 중간 (희소성, 시간 제한)
    trust: 0.20, // 중간 (리뷰, 사회적 증거)
    urgency: 0.20, // 높음 (재고 부족, 할인 마감)
    cognitive_load: 0.15 // 낮음 (단순한 구매 프로세스)
  },

  // SaaS: 신뢰, 전문성, 복잡도 제거
  saas: {
    dopamine: 0.15, // 낮음
    cortisol: 0.10, // 낮음 (스트레스 최소화)
    trust: 0.30, // 매우 높음 (신뢰가 핵심)
    urgency: 0.15, // 낮음
    cognitive_load: 0.30 // 매우 높음 (복잡도 제거가 핵심)
  },

  // 전문서비스: 신뢰, 전문성, 경력
  services: {
    dopamine: 0.10, // 낮음
    cortisol: 0.10, // 낮음
    trust: 0.40, // 매우 높음 (신뢰가 모든 것)
    urgency: 0.15, // 낮음
    cognitive_load: 0.25 // 높음 (복잡한 서비스 설명 단순화)
  },

  // 의료: 신뢰, 안전성, 접근성
  healthcare: {
    dopamine: 0.10, // 낮음
    cortisol: 0.15, // 낮음 (불안 최소화)
    trust: 0.35, // 매우 높음 (의료진 신뢰)
    urgency: 0.20, // 중간 (예약 긴급성)
    cognitive_load: 0.20 // 중간 (의료 정보 단순화)
  },

  // 식음료: 시각적 매력, 리뷰, 위치 근접성
  food_beverage: {
    dopamine: 0.25, // 높음 (음식 사진, 맛)
    cortisol: 0.15, // 낮음
    trust: 0.25, // 높음 (리뷰 중요)
    urgency: 0.20, // 중간 (영업시간, 배달 시간)
    cognitive_load: 0.15 // 낮음 (간단한 주문)
  },

  // 로컬 비즈니스: 위치 근접성, 리뷰, 시간 긴급성
  local_business: {
    dopamine: 0.15, // 중간
    cortisol: 0.10, // 낮음
    trust: 0.25, // 높음 (리뷰)
    urgency: 0.25, // 높음 (영업시간, 예약)
    cognitive_load: 0.25 // 중간 (예약 프로세스)
  },

  // 크리에이터: 도파민, 공감, 팬덤 형성
  creator_economy: {
    dopamine: 0.35, // 매우 높음 (재미, 감동)
    cortisol: 0.10, // 낮음
    trust: 0.15, // 중간
    urgency: 0.15, // 중간 (라이브, 새 영상)
    cognitive_load: 0.25 // 중간 (콘텐츠 이해)
  },

  // 미디어: 호기심, 최신성, 신뢰
  media: {
    dopamine: 0.20, // 중간 (호기심)
    cortisol: 0.15, // 중간 (긴급성)
    trust: 0.25, // 높음 (신뢰할 수 있는 정보)
    urgency: 0.20, // 중간 (최신 뉴스)
    cognitive_load: 0.20 // 중간 (읽기 쉬운 기사)
  },

  // 비영리: 공감, 사회적 책임, 투명성
  non_profit: {
    dopamine: 0.15, // 중간 (기부의 기쁨)
    cortisol: 0.20, // 중간 (긴급한 필요)
    trust: 0.30, // 매우 높음 (투명성)
    urgency: 0.20, // 중간 (긴급 캠페인)
    cognitive_load: 0.15 // 낮음 (간단한 기부)
  }
}

/**
 * 업종별 심리 프로필 조정
 */
function adjustProfileForIndustry(
  profile: PsychologicalProfile,
  industry: IndustryType
): PsychologicalProfile {
  const weights = INDUSTRY_PSYCHOLOGY_WEIGHTS[industry]

  // 업종별 가중치를 반영하여 프로필 조정
  // 예: SaaS는 trust와 cognitive_load가 중요하므로 이 값들을 더 민감하게 반영
  return {
    dopamine_score: profile.dopamine_score * (1 + (weights.dopamine - 0.2) * 0.5),
    cortisol_score: profile.cortisol_score * (1 + (weights.cortisol - 0.15) * 0.5),
    trust_score: profile.trust_score * (1 + (weights.trust - 0.2) * 0.5),
    urgency_score: profile.urgency_score * (1 + (weights.urgency - 0.2) * 0.5),
    cognitive_load: profile.cognitive_load * (1 + (weights.cognitive_load - 0.2) * 0.5)
  }
}

/**
 * 업종별 심리 분석
 */
export function analyzeIndustryPsychology(
  industry: IndustryType,
  profile: PsychologicalProfile,
  baseline_cvr: number = 0.02
): IndustryPsychologyAnalysis {
  // 업종별 가중치 적용
  const adjustedProfile = adjustProfileForIndustry(profile, industry)
  
  // CVR 예측
  const prediction = predictCVRFromPsychology(adjustedProfile, baseline_cvr)

  // 업종별 특화 인사이트
  const insights = generateIndustryInsights(industry, profile, prediction)
  
  // 업종별 추천 액션
  const recommendedActions = generateIndustryActions(industry, profile, prediction)

  return {
    industry,
    adjustedProfile,
    originalProfile: profile,
    prediction,
    industrySpecificInsights: insights,
    recommendedActions
  }
}

/**
 * 업종별 인사이트 생성
 */
function generateIndustryInsights(
  industry: IndustryType,
  profile: PsychologicalProfile,
  prediction: CVRPrediction
): string[] {
  const insights: string[] = []
  const weights = INDUSTRY_PSYCHOLOGY_WEIGHTS[industry]

  switch (industry) {
    case 'ecommerce':
      if (profile.urgency_score < 6.0) {
        insights.push('전자상거래는 희소성과 긴급성이 중요합니다. 재고 부족 알림, 할인 마감 타이머를 추가하세요.')
      }
      if (profile.trust_score < 7.0) {
        insights.push('사회적 증거(리뷰, 판매량)를 강화하여 신뢰도를 높이세요.')
      }
      if (profile.dopamine_score < 7.0) {
        insights.push('보상 요소(할인, 혜택)를 추가하여 구매 동기를 자극하세요.')
      }
      break

    case 'saas':
      if (profile.trust_score < 8.0) {
        insights.push('SaaS는 신뢰가 핵심입니다. 고객 사례, 로고, 인증을 강조하세요.')
      }
      if (profile.cognitive_load > 5.0) {
        insights.push('복잡한 제품을 단순하게 설명하세요. 비교표, 비디오 데모를 활용하세요.')
      }
      if (profile.cortisol_score > 4.0) {
        insights.push('스트레스 요소를 제거하세요. 긴급성 메시지보다 신뢰와 전문성을 강조하세요.')
      }
      break

    case 'services':
      if (profile.trust_score < 8.5) {
        insights.push('전문서비스는 신뢰가 모든 것입니다. 경력, 인증, 케이스 스터디를 강조하세요.')
      }
      if (profile.cognitive_load > 5.0) {
        insights.push('서비스 설명을 단순화하세요. 프로세스 다이어그램, FAQ를 활용하세요.')
      }
      break

    case 'healthcare':
      if (profile.trust_score < 9.0) {
        insights.push('의료는 최고 수준의 신뢰가 필요합니다. 의료진 정보, 인증, 환자 리뷰를 강조하세요.')
      }
      if (profile.cortisol_score > 3.0) {
        insights.push('불안 요소를 최소화하세요. 안심 메시지, 명확한 정보를 제공하세요.')
      }
      break

    case 'food_beverage':
      if (profile.dopamine_score < 7.0) {
        insights.push('음식 사진의 시각적 매력을 강화하세요. 고품질 이미지, 비디오를 활용하세요.')
      }
      if (profile.trust_score < 7.0) {
        insights.push('리뷰를 강조하세요. 사진 리뷰, 평점을 상단에 배치하세요.')
      }
      if (profile.urgency_score < 6.0) {
        insights.push('영업시간, 배달 시간 정보를 명확히 표시하여 긴급성을 높이세요.')
      }
      break

    case 'local_business':
      if (profile.urgency_score < 7.0) {
        insights.push('예약 가능 시간, 영업시간을 명확히 표시하여 긴급성을 높이세요.')
      }
      if (profile.trust_score < 7.0) {
        insights.push('리뷰를 강조하세요. 지역 고객의 리뷰가 신뢰도를 높입니다.')
      }
      break

    case 'creator_economy':
      if (profile.dopamine_score < 8.0) {
        insights.push('크리에이터는 도파민 자극이 핵심입니다. 재미, 감동, 공감 콘텐츠를 강화하세요.')
      }
      if (profile.trust_score < 6.0) {
        insights.push('일관성 있는 콘텐츠로 팬덤을 형성하세요.')
      }
      break

    case 'media':
      if (profile.trust_score < 7.0) {
        insights.push('신뢰할 수 있는 정보 출처를 명확히 표시하세요.')
      }
      if (profile.urgency_score < 6.0) {
        insights.push('최신성, 독점성을 강조하여 호기심을 자극하세요.')
      }
      break

    case 'non_profit':
      if (profile.trust_score < 8.0) {
        insights.push('투명성을 강조하세요. 기부금 사용 내역, 연간 보고서를 명확히 표시하세요.')
      }
      if (profile.dopamine_score < 6.0) {
        insights.push('기부의 기쁨, 임팩트를 시각화하여 공감을 자극하세요.')
      }
      break
  }

  return insights
}

/**
 * 업종별 추천 액션 생성
 */
function generateIndustryActions(
  industry: IndustryType,
  profile: PsychologicalProfile,
  prediction: CVRPrediction
): Array<{
  action: string
  psychologyFactor: string
  expectedImpact: string
  priority: 'high' | 'medium' | 'low'
}> {
  const actions: Array<{
    action: string
    psychologyFactor: string
    expectedImpact: string
    priority: 'high' | 'medium' | 'low'
  }> = []

  const weights = INDUSTRY_PSYCHOLOGY_WEIGHTS[industry]

  // 업종별 가중치가 높은 요소에 대한 액션 우선 생성
  if (weights.trust > 0.25 && profile.trust_score < 7.0) {
    actions.push({
      action: '신뢰 요소 강화 (리뷰, 인증, 사회적 증거)',
      psychologyFactor: 'trust',
      expectedImpact: 'CVR +5-10%',
      priority: 'high'
    })
  }

  if (weights.cognitive_load > 0.25 && profile.cognitive_load > 5.0) {
    actions.push({
      action: 'UI/UX 단순화, 복잡도 제거',
      psychologyFactor: 'cognitive_load',
      expectedImpact: 'CVR +8-12%',
      priority: 'high'
    })
  }

  if (weights.dopamine > 0.25 && profile.dopamine_score < 7.0) {
    actions.push({
      action: '보상 요소 추가 (할인, 혜택, 시각적 매력)',
      psychologyFactor: 'dopamine',
      expectedImpact: 'CVR +4-8%',
      priority: 'high'
    })
  }

  if (weights.urgency > 0.25 && profile.urgency_score < 6.0) {
    actions.push({
      action: '긴급성 요소 추가 (재고 부족, 시간 제한)',
      psychologyFactor: 'urgency',
      expectedImpact: 'CVR +3-6%',
      priority: 'medium'
    })
  }

  if (weights.cortisol > 0.20 && profile.cortisol_score > 5.0) {
    actions.push({
      action: '스트레스 요소 제거 (긴급성 메시지 완화)',
      psychologyFactor: 'cortisol',
      expectedImpact: 'CVR +2-5%',
      priority: 'medium'
    })
  }

  return actions
}

/**
 * 업종별 심리 가중치 가져오기
 */
export function getIndustryPsychologyWeights(industry: IndustryType): IndustryPsychologyWeights {
  return INDUSTRY_PSYCHOLOGY_WEIGHTS[industry]
}
