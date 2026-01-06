/**
 * 심리 분석 실행성 강화 모듈
 * 도파민/코르티솔 점수를 CVR과 연결하고 구체적 액션 아이템 생성
 */

export interface PsychologyScore {
  dopamine: number // 0-100 또는 1-10 스케일
  cortisol: number // 0-100 또는 1-10 스케일 (낮을수록 좋음)
  serotonin?: number // 0-100 또는 1-10 스케일
  oxytocin?: number // 0-100 또는 1-10 스케일
  trust?: number // 1-10 스케일
  urgency?: number // 1-10 스케일
  cognitiveLoad?: number // 1-10 스케일 (낮을수록 좋음)
}

export interface PsychologyScore1To10 {
  dopamine_score: number // 1-10
  cortisol_score: number // 1-10 (낮을수록 좋음)
  trust_score: number // 1-10
  urgency_score: number // 1-10
  cognitive_load: number // 1-10 (낮을수록 좋음)
}

export interface CVRMetrics {
  conversionRate: number // 전환율 (%)
  bounceRate: number // 이탈률 (%)
  avgTimeOnPage: number // 평균 페이지 체류 시간 (초)
  pagesPerSession: number // 세션당 페이지 수
  revenue: number // 매출
}

export interface PsychologyCVRConnection {
  psychologyScore: PsychologyScore
  cvrMetrics: CVRMetrics
  correlation: {
    dopamineToCVR: number // 도파민과 CVR의 상관계수
    cortisolToBounce: number // 코르티솔과 이탈률의 상관계수
    overallImpact: number // 전체 영향도 (0-100)
  }
  insights: string[]
  actionItems: ActionItem[]
  predictedCVRImprovement: number // 예상 CVR 개선율 (%)
  predictedCVR: number // 예측 CVR (%)
  baselineCVR: number // 기준선 CVR (%)
  cvrChange: number // CVR 변화율 (%)
  psychologicalBottleneck: string // 심리적 병목 지점
  specificActions: SpecificAction[] // 구체적 액션
}

export interface SpecificAction {
  id: string
  action: string // 구체적 액션 (예: "상세페이지에서 2개 섹션 제거")
  expectedEffect: string // 기대 효과 (예: "CVR +3% → 2.3%")
  priority: 'high' | 'medium' | 'low'
  difficulty: 'easy' | 'medium' | 'hard'
  timeToImplement: string // 예상 소요 시간
}

export interface ActionItem {
  id: string
  title: string
  description: string
  psychologyFactor: 'dopamine' | 'cortisol' | 'serotonin' | 'oxytocin'
  expectedImpact: {
    cvrImprovement: number // 예상 CVR 개선율 (%)
    bounceReduction: number // 예상 이탈률 감소 (%)
    timeOnPageIncrease: number // 예상 체류 시간 증가 (초)
  }
  priority: 'high' | 'medium' | 'low'
  difficulty: 'easy' | 'medium' | 'hard'
  implementationSteps: string[]
  examples: string[]
}

/**
 * 1-10 스케일 심리 점수를 CVR로 변환
 */
export function convertPsychologyToCVR(
  psychologyScore: PsychologyScore1To10,
  baselineCVR: number = 2.0
): {
  predictedCVR: number
  cvrChange: number
  cvrChangePercent: number
  psychologicalBottleneck: string
  specificActions: SpecificAction[]
} {
  // 각 심리 요소의 CVR 영향 계수 (실제 데이터 기반으로 조정 필요)
  const dopamineCoefficient = 0.15 // 도파민 1점 증가 시 CVR +0.15%p
  const cortisolCoefficient = -0.20 // 코르티솔 1점 증가 시 CVR -0.20%p
  const trustCoefficient = 0.12 // 신뢰 1점 증가 시 CVR +0.12%p
  const urgencyCoefficient = 0.10 // 긴급성 1점 증가 시 CVR +0.10%p
  const cognitiveLoadCoefficient = -0.18 // 인지 부하 1점 증가 시 CVR -0.18%p
  
  // 이상적인 점수 (10점 만점 기준)
  const idealDopamine = 8.0
  const idealCortisol = 2.0 // 낮을수록 좋음
  const idealTrust = 8.5
  const idealUrgency = 7.0
  const idealCognitiveLoad = 3.0 // 낮을수록 좋음
  
  // 각 요소의 차이 계산
  const dopamineDiff = psychologyScore.dopamine_score - idealDopamine
  const cortisolDiff = psychologyScore.cortisol_score - idealCortisol // 높을수록 나쁨
  const trustDiff = psychologyScore.trust_score - idealTrust
  const urgencyDiff = psychologyScore.urgency_score - idealUrgency
  const cognitiveLoadDiff = psychologyScore.cognitive_load - idealCognitiveLoad // 높을수록 나쁨
  
  // CVR 변화 계산
  const cvrChange = 
    dopamineDiff * dopamineCoefficient +
    cortisolDiff * cortisolCoefficient +
    trustDiff * trustCoefficient +
    urgencyDiff * urgencyCoefficient +
    cognitiveLoadDiff * cognitiveLoadCoefficient
  
  const predictedCVR = baselineCVR + cvrChange
  const cvrChangePercent = (cvrChange / baselineCVR) * 100
  
  // 심리적 병목 지점 찾기
  const bottlenecks: Array<{ factor: string; impact: number; message: string }> = []
  
  if (psychologyScore.cognitive_load > 6.0) {
    bottlenecks.push({
      factor: 'cognitive_load',
      impact: Math.abs(cognitiveLoadDiff * cognitiveLoadCoefficient),
      message: '인지 부하 과다 - UI 단순화 필요'
    })
  }
  
  if (psychologyScore.cortisol_score > 5.0) {
    bottlenecks.push({
      factor: 'cortisol',
      impact: Math.abs(cortisolDiff * cortisolCoefficient),
      message: '스트레스 요소 과다 - 긴급성 메시지 완화 필요'
    })
  }
  
  if (psychologyScore.dopamine_score < 6.0) {
    bottlenecks.push({
      factor: 'dopamine',
      impact: Math.abs(dopamineDiff * dopamineCoefficient),
      message: '도파민 자극 부족 - 보상 요소 추가 필요'
    })
  }
  
  if (psychologyScore.trust_score < 6.0) {
    bottlenecks.push({
      factor: 'trust',
      impact: Math.abs(trustDiff * trustCoefficient),
      message: '신뢰도 부족 - 사회적 증거 강화 필요'
    })
  }
  
  // 가장 큰 병목 지점
  const mainBottleneck = bottlenecks.length > 0
    ? bottlenecks.reduce((max, b) => b.impact > max.impact ? b : max)
    : { message: '심리적 병목 없음', factor: 'none', impact: 0 }
  
  // 구체적 액션 생성
  const specificActions: SpecificAction[] = []
  
  if (psychologyScore.cognitive_load > 6.0) {
    const sectionsToRemove = Math.ceil((psychologyScore.cognitive_load - 6.0) / 2)
    specificActions.push({
      id: 'action-cognitive-001',
      action: `상세페이지에서 ${sectionsToRemove}개 섹션 제거`,
      expectedEffect: `CVR +${(sectionsToRemove * 0.5).toFixed(1)}% → ${(baselineCVR + sectionsToRemove * 0.5).toFixed(2)}%`,
      priority: 'high',
      difficulty: 'medium',
      timeToImplement: '2-3일'
    })
    
    specificActions.push({
      id: 'action-cognitive-002',
      action: 'CTA 버튼 크기 30% 확대',
      expectedEffect: `CVR +${(0.3).toFixed(1)}% → ${(baselineCVR + 0.3).toFixed(2)}%`,
      priority: 'high',
      difficulty: 'easy',
      timeToImplement: '1일'
    })
    
    specificActions.push({
      id: 'action-cognitive-003',
      action: '로딩 시간 1초 단축',
      expectedEffect: `CVR +${(0.2).toFixed(1)}% → ${(baselineCVR + 0.2).toFixed(2)}%`,
      priority: 'medium',
      difficulty: 'medium',
      timeToImplement: '3-5일'
    })
  }
  
  if (psychologyScore.dopamine_score < 6.0) {
    specificActions.push({
      id: 'action-dopamine-001',
      action: '보상 요소 추가 (할인, 혜택 배지)',
      expectedEffect: `CVR +${(Math.abs(dopamineDiff) * dopamineCoefficient).toFixed(1)}% → ${(baselineCVR + Math.abs(dopamineDiff) * dopamineCoefficient).toFixed(2)}%`,
      priority: 'high',
      difficulty: 'easy',
      timeToImplement: '1일'
    })
  }
  
  if (psychologyScore.trust_score < 6.0) {
    specificActions.push({
      id: 'action-trust-001',
      action: '리뷰 섹션 상단 배치 및 평점 강조',
      expectedEffect: `CVR +${(Math.abs(trustDiff) * trustCoefficient).toFixed(1)}% → ${(baselineCVR + Math.abs(trustDiff) * trustCoefficient).toFixed(2)}%`,
      priority: 'high',
      difficulty: 'easy',
      timeToImplement: '1일'
    })
  }
  
  return {
    predictedCVR: Math.max(0, Math.round(predictedCVR * 100) / 100),
    cvrChange: Math.round(cvrChange * 100) / 100,
    cvrChangePercent: Math.round(cvrChangePercent * 10) / 10,
    psychologicalBottleneck: mainBottleneck.message,
    specificActions
  }
}

/**
 * 심리 점수와 CVR 메트릭 연결 분석
 */
export function analyzePsychologyCVRConnection(
  psychologyScore: PsychologyScore,
  cvrMetrics: CVRMetrics
): PsychologyCVRConnection {
  // 도파민과 CVR의 상관관계 계산
  // 도파민이 높을수록 전환율이 높아지는 경향 (상관계수 0.6-0.8 가정)
  const dopamineToCVR = calculateCorrelation(
    psychologyScore.dopamine,
    cvrMetrics.conversionRate,
    0.7 // 실제 데이터 기반으로 조정 필요
  )
  
  // 코르티솔과 이탈률의 상관관계 계산
  // 코르티솔이 높을수록 이탈률이 높아지는 경향 (상관계수 0.5-0.7 가정)
  const cortisolToBounce = calculateCorrelation(
    psychologyScore.cortisol,
    cvrMetrics.bounceRate,
    0.6 // 실제 데이터 기반으로 조정 필요
  )
  
  // 전체 영향도 계산
  const overallImpact = calculateOverallImpact(
    psychologyScore,
    cvrMetrics,
    dopamineToCVR,
    cortisolToBounce
  )
  
  // 인사이트 생성
  const insights = generateInsights(
    psychologyScore,
    cvrMetrics,
    dopamineToCVR,
    cortisolToBounce
  )
  
  // 액션 아이템 생성
  const actionItems = generateActionItems(
    psychologyScore,
    cvrMetrics,
    dopamineToCVR,
    cortisolToBounce
  )
  
  // 예상 CVR 개선율 계산
  const predictedCVRImprovement = calculatePredictedCVRImprovement(
    psychologyScore,
    actionItems
  )
  
  // 1-10 스케일로 변환하여 CVR 예측 (있는 경우)
  let predictedCVR = cvrMetrics.conversionRate
  let baselineCVR = cvrMetrics.conversionRate
  let cvrChange = 0
  let psychologicalBottleneck = '심리적 병목 없음'
  let specificActions: SpecificAction[] = []
  
  // 1-10 스케일 심리 점수가 있는 경우
  if (psychologyScore.dopamine && psychologyScore.dopamine <= 10 && 
      psychologyScore.cortisol && psychologyScore.cortisol <= 10) {
    const psychologyScore1To10: PsychologyScore1To10 = {
      dopamine_score: psychologyScore.dopamine,
      cortisol_score: psychologyScore.cortisol,
      trust_score: psychologyScore.trust || 7.0,
      urgency_score: psychologyScore.urgency || 6.5,
      cognitive_load: psychologyScore.cognitiveLoad || 4.2
    }
    
    const cvrPrediction = convertPsychologyToCVR(psychologyScore1To10, baselineCVR)
    predictedCVR = cvrPrediction.predictedCVR
    cvrChange = cvrPrediction.cvrChange
    psychologicalBottleneck = cvrPrediction.psychologicalBottleneck
    specificActions = cvrPrediction.specificActions
  }
  
  return {
    psychologyScore,
    cvrMetrics,
    correlation: {
      dopamineToCVR,
      cortisolToBounce,
      overallImpact
    },
    insights,
    actionItems,
    predictedCVRImprovement,
    predictedCVR,
    baselineCVR,
    cvrChange,
    psychologicalBottleneck,
    specificActions
  }
}

/**
 * 상관계수 계산 (간단한 선형 근사)
 */
function calculateCorrelation(
  psychologyValue: number,
  metricValue: number,
  baseCorrelation: number
): number {
  // 실제로는 통계적 상관분석 필요
  // 여기서는 심리 점수와 메트릭 값의 정규화된 차이를 기반으로 계산
  const normalizedPsych = psychologyValue / 100
  const normalizedMetric = metricValue / 100 // 메트릭도 0-100으로 정규화 가정
  
  // 상관계수는 -1 ~ 1 사이
  return Math.max(-1, Math.min(1, baseCorrelation * (normalizedPsych + normalizedMetric) / 2))
}

/**
 * 전체 영향도 계산
 */
function calculateOverallImpact(
  psychologyScore: PsychologyScore,
  cvrMetrics: CVRMetrics,
  dopamineToCVR: number,
  cortisolToBounce: number
): number {
  // 도파민의 긍정적 영향 (높을수록 좋음)
  const dopamineImpact = (psychologyScore.dopamine / 100) * 40 * Math.abs(dopamineToCVR)
  
  // 코르티솔의 부정적 영향 (낮을수록 좋음)
  const cortisolImpact = ((100 - psychologyScore.cortisol) / 100) * 30 * Math.abs(cortisolToBounce)
  
  // 세로토닌/옥시토신의 영향 (있는 경우)
  let additionalImpact = 0
  if (psychologyScore.serotonin) {
    additionalImpact += (psychologyScore.serotonin / 100) * 15
  }
  if (psychologyScore.oxytocin) {
    additionalImpact += (psychologyScore.oxytocin / 100) * 15
  }
  
  return Math.min(100, Math.round(dopamineImpact + cortisolImpact + additionalImpact))
}

/**
 * 인사이트 생성
 */
function generateInsights(
  psychologyScore: PsychologyScore,
  cvrMetrics: CVRMetrics,
  dopamineToCVR: number,
  cortisolToBounce: number
): string[] {
  const insights: string[] = []
  
  // 도파민 관련 인사이트
  if (psychologyScore.dopamine < 50 && cvrMetrics.conversionRate < 2.0) {
    insights.push(
      `도파민 점수가 낮습니다(${psychologyScore.dopamine}점). 기대감과 보상 요소를 강화하면 전환율이 ${(2.0 - cvrMetrics.conversionRate).toFixed(1)}%p 개선될 수 있습니다.`
    )
  } else if (psychologyScore.dopamine > 70 && cvrMetrics.conversionRate > 3.0) {
    insights.push(
      `도파민 점수가 높습니다(${psychologyScore.dopamine}점). 현재 전환율(${cvrMetrics.conversionRate.toFixed(1)}%)과 강한 양의 상관관계를 보입니다.`
    )
  }
  
  // 코르티솔 관련 인사이트
  if (psychologyScore.cortisol > 60 && cvrMetrics.bounceRate > 70) {
    insights.push(
      `코르티솔 점수가 높습니다(${psychologyScore.cortisol}점). 스트레스 요소를 제거하면 이탈률을 ${(cvrMetrics.bounceRate - 50).toFixed(1)}%p 감소시킬 수 있습니다.`
    )
  }
  
  // 종합 인사이트
  if (psychologyScore.dopamine < psychologyScore.cortisol) {
    insights.push(
      `도파민(${psychologyScore.dopamine}점)이 코르티솔(${psychologyScore.cortisol}점)보다 낮습니다. 긍정적 자극을 늘리고 부정적 요소를 줄여야 합니다.`
    )
  }
  
  return insights
}

/**
 * 액션 아이템 생성
 */
function generateActionItems(
  psychologyScore: PsychologyScore,
  cvrMetrics: CVRMetrics,
  dopamineToCVR: number,
  cortisolToBounce: number
): ActionItem[] {
  const actionItems: ActionItem[] = []
  
  // 도파민 개선 액션 아이템
  if (psychologyScore.dopamine < 60) {
    actionItems.push({
      id: 'action-dopamine-001',
      title: '도파민 자극 요소 강화',
      description: '기대감과 보상을 주는 콘텐츠를 추가하여 도파민 점수를 높입니다.',
      psychologyFactor: 'dopamine',
      expectedImpact: {
        cvrImprovement: Math.max(0.5, (60 - psychologyScore.dopamine) * 0.1),
        bounceReduction: Math.max(2, (60 - psychologyScore.dopamine) * 0.2),
        timeOnPageIncrease: Math.max(5, (60 - psychologyScore.dopamine) * 0.5)
      },
      priority: psychologyScore.dopamine < 40 ? 'high' : 'medium',
      difficulty: 'medium',
      implementationSteps: [
        '제품/서비스의 혜택과 가치를 명확히 강조',
        '한정 혜택, 할인, 보너스 등 보상 요소 추가',
        '성취감을 주는 메시지 작성 (예: "지금 구매하면 30% 할인")',
        '시각적 자극 강화 (밝은 색상, 애니메이션)'
      ],
      examples: [
        '상단 배너: "신규 가입 시 10,000원 적립금 지급"',
        '제품 카드: "한정 수량, 지금 구매하세요"',
        'CTA 버튼: "지금 바로 구매하고 특별 혜택 받기"'
      ]
    })
  }
  
  // 코르티솔 감소 액션 아이템
  if (psychologyScore.cortisol > 50) {
    actionItems.push({
      id: 'action-cortisol-001',
      title: '스트레스 요소 제거',
      description: '긴급성과 결핍감을 유발하는 요소를 줄여 코르티솔 점수를 낮춥니다.',
      psychologyFactor: 'cortisol',
      expectedImpact: {
        cvrImprovement: Math.max(0.3, (psychologyScore.cortisol - 50) * 0.05),
        bounceReduction: Math.max(5, (psychologyScore.cortisol - 50) * 0.3),
        timeOnPageIncrease: Math.max(3, (psychologyScore.cortisol - 50) * 0.3)
      },
      priority: psychologyScore.cortisol > 70 ? 'high' : 'medium',
      difficulty: 'easy',
      implementationSteps: [
        '과도한 "마감임박", "품절" 메시지 제거',
        '복잡한 폼과 긴 입력 과정 단순화',
        '로딩 시간 최적화',
        '명확한 가격 정보와 배송 정보 제공'
      ],
      examples: [
        '제거: "지금 안 사면 후회합니다" → 변경: "지금 구매하시면 특별 혜택을 드립니다"',
        '폼 단순화: 10개 필드 → 3개 필드',
        '배송 정보 명확화: "1-2일 배송" → "내일 도착 가능"'
      ]
    })
  }
  
  // 세로토닌 개선 액션 아이템
  if (psychologyScore.serotonin && psychologyScore.serotonin < 60) {
    actionItems.push({
      id: 'action-serotonin-001',
      title: '만족감과 안정감 강화',
      description: '신뢰 신호와 사회적 증거를 추가하여 세로토닌 점수를 높입니다.',
      psychologyFactor: 'serotonin',
      expectedImpact: {
        cvrImprovement: Math.max(0.4, (60 - psychologyScore.serotonin) * 0.08),
        bounceReduction: Math.max(3, (60 - psychologyScore.serotonin) * 0.25),
        timeOnPageIncrease: Math.max(4, (60 - psychologyScore.serotonin) * 0.4)
      },
      priority: 'medium',
      difficulty: 'easy',
      implementationSteps: [
        '고객 리뷰와 평점 표시',
        '인증 배지 추가 (예: "신뢰할 수 있는 쇼핑몰")',
        '환불/교환 정책 명확히 표시',
        '고객 서비스 연락처 명시'
      ],
      examples: [
        '상단: "4.8/5.0 평점, 10,000+ 리뷰"',
        '배지: "구매자 보호 프로그램 가입"',
        '하단: "무료 반품, 30일 환불 보장"'
      ]
    })
  }
  
  // 옥시토신 개선 액션 아이템
  if (psychologyScore.oxytocin && psychologyScore.oxytocin < 60) {
    actionItems.push({
      id: 'action-oxytocin-001',
      title: '연결감과 신뢰 강화',
      description: '커뮤니티와 스토리를 추가하여 옥시토신 점수를 높입니다.',
      psychologyFactor: 'oxytocin',
      expectedImpact: {
        cvrImprovement: Math.max(0.3, (60 - psychologyScore.oxytocin) * 0.06),
        bounceReduction: Math.max(2, (60 - psychologyScore.oxytocin) * 0.2),
        timeOnPageIncrease: Math.max(3, (60 - psychologyScore.oxytocin) * 0.3)
      },
      priority: 'medium',
      difficulty: 'medium',
      implementationSteps: [
        '브랜드 스토리 섹션 추가',
        '고객 성공 사례 공유',
        '커뮤니티 링크 추가',
        '개인화된 메시지 제공'
      ],
      examples: [
        '브랜드 스토리: "우리의 여정" 섹션',
        '고객 사례: "이렇게 사용하고 있어요"',
        '커뮤니티: "10만 회원과 함께하는 커뮤니티"'
      ]
    })
  }
  
  // 우선순위 정렬
  return actionItems.sort((a, b) => {
    const priorityOrder = { high: 3, medium: 2, low: 1 }
    if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
      return priorityOrder[b.priority] - priorityOrder[a.priority]
    }
    return b.expectedImpact.cvrImprovement - a.expectedImpact.cvrImprovement
  })
}

/**
 * 예상 CVR 개선율 계산
 */
function calculatePredictedCVRImprovement(
  psychologyScore: PsychologyScore,
  actionItems: ActionItem[]
): number {
  // 모든 액션 아이템의 예상 CVR 개선율 합산
  const totalImprovement = actionItems.reduce(
    (sum, item) => sum + item.expectedImpact.cvrImprovement,
    0
  )
  
  // 최대 개선율 제한 (현실적으로 50% 이하)
  return Math.min(50, Math.round(totalImprovement * 10) / 10)
}

/**
 * 심리 점수 기반 CVR 예측
 */
export function predictCVRFromPsychology(
  psychologyScore: PsychologyScore,
  baseCVR: number
): number {
  // 도파민의 긍정적 영향
  const dopamineBoost = (psychologyScore.dopamine / 100) * 0.5
  
  // 코르티솔의 부정적 영향
  const cortisolPenalty = (psychologyScore.cortisol / 100) * 0.3
  
  // 세로토닌/옥시토신의 긍정적 영향
  const additionalBoost = 
    (psychologyScore.serotonin ? psychologyScore.serotonin / 100 * 0.1 : 0) +
    (psychologyScore.oxytocin ? psychologyScore.oxytocin / 100 * 0.1 : 0)
  
  // 예상 CVR 계산
  const predictedCVR = baseCVR * (1 + dopamineBoost - cortisolPenalty + additionalBoost)
  
  return Math.max(0, Math.round(predictedCVR * 10) / 10)
}
