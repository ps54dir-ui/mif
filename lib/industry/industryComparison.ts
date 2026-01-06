/**
 * 업종 간 비교 분석 시스템
 * 다른 업종과의 성과 비교 및 확장 가능성 분석
 */

import { IndustryType } from '@/data/industries/industryConfig'
import { calculateIndustryScore, IndustryScoreResult } from './industryScoreCalculator'

export interface IndustryComparison {
  currentIndustry: IndustryType
  comparedIndustry: IndustryType
  metricComparison: Array<{
    metric: string
    currentValue: number
    comparedValue: number
    difference: number
    differencePercent: number
    insight: string
  }>
  overallInsight: string
  expansionPotential?: {
    targetIndustry: IndustryType
    requiredChanges: string[]
    expectedImpact: string
    difficulty: 'easy' | 'medium' | 'hard'
  }
}

/**
 * 업종 간 비교 분석
 */
export function compareIndustries(
  currentIndustry: IndustryType,
  currentMetrics: IndustryScoreResult,
  comparedIndustry: IndustryType,
  comparedMetrics: IndustryScoreResult
): IndustryComparison {
  const metricComparison: IndustryComparison['metricComparison'] = []

  // 현재 업종의 메트릭과 비교 업종의 메트릭 비교
  currentMetrics.breakdown.forEach(currentMetric => {
    const comparedMetric = comparedMetrics.breakdown.find(
      m => m.metric === currentMetric.metric
    )

    if (comparedMetric) {
      const difference = comparedMetric.score - currentMetric.score
      const differencePercent = currentMetric.score > 0
        ? (difference / currentMetric.score) * 100
        : 0

      let insight = ''
      if (differencePercent > 20) {
        insight = `${comparedIndustry} 업종이 이 지표에서 ${Math.abs(differencePercent).toFixed(0)}% 더 우수합니다.`
      } else if (differencePercent < -20) {
        insight = `현재 업종이 이 지표에서 ${Math.abs(differencePercent).toFixed(0)}% 더 우수합니다.`
      } else {
        insight = '두 업종 간 차이가 크지 않습니다.'
      }

      metricComparison.push({
        metric: currentMetric.metric,
        currentValue: currentMetric.score,
        comparedValue: comparedMetric.score,
        difference,
        differencePercent,
        insight
      })
    }
  })

  // 종합 인사이트
  const avgDifference = metricComparison.length > 0
    ? metricComparison.reduce((sum, m) => sum + m.differencePercent, 0) / metricComparison.length
    : 0

  let overallInsight = ''
  if (avgDifference > 15) {
    overallInsight = `${comparedIndustry} 업종이 평균적으로 ${avgDifference.toFixed(0)}% 더 우수한 성과를 보입니다. 이는 비즈니스 모델의 차이 때문일 수 있습니다.`
  } else if (avgDifference < -15) {
    overallInsight = `현재 업종이 평균적으로 ${Math.abs(avgDifference).toFixed(0)}% 더 우수한 성과를 보입니다.`
  } else {
    overallInsight = '두 업종 간 성과 차이가 크지 않습니다.'
  }

  return {
    currentIndustry,
    comparedIndustry,
    metricComparison,
    overallInsight
  }
}

/**
 * 업종 확장 가능성 분석
 */
export function analyzeExpansionPotential(
  currentIndustry: IndustryType,
  targetIndustry: IndustryType,
  currentMetrics: IndustryScoreResult
): IndustryComparison['expansionPotential'] {
  const expansionMap: Record<string, {
    requiredChanges: string[]
    expectedImpact: string
    difficulty: 'easy' | 'medium' | 'hard'
  }> = {
    'ecommerce->saas': {
      requiredChanges: [
        '콘텐츠 마케팅 강화 (현재 30% → 필요 60%)',
        '리드 생성 시스템 구축',
        '구독 모델 전환',
        'B2B 타겟팅 전략 수립'
      ],
      expectedImpact: '리드 생성률 +100%, LTV +50%',
      difficulty: 'hard'
    },
    'saas->ecommerce': {
      requiredChanges: [
        '상품 페이지 최적화',
        '전환 퍼널 구축',
        '장바구니 시스템 구축',
        '결제 프로세스 구현'
      ],
      expectedImpact: 'CVR +200%, AOV +30%',
      difficulty: 'hard'
    },
    'local_business->ecommerce': {
      requiredChanges: [
        '온라인 쇼핑몰 구축',
        '배송 시스템 구축',
        '상품 관리 시스템 구축'
      ],
      expectedImpact: '매출 +150%, 고객 범위 확대',
      difficulty: 'medium'
    },
    'ecommerce->local_business': {
      requiredChanges: [
        '오프라인 매장 구축',
        '지역 SEO 최적화',
        'Naver Place 등록',
        '예약 시스템 구축'
      ],
      expectedImpact: '지역 고객 +200%, 재방문율 +50%',
      difficulty: 'medium'
    },
    'creator_economy->saas': {
      requiredChanges: [
        '구독 서비스 구축',
        '콘텐츠 라이브러리 구축',
        '멤버십 프로그램 고도화'
      ],
      expectedImpact: '안정적 수익 +300%, LTV +200%',
      difficulty: 'medium'
    }
  }

  const key = `${currentIndustry}->${targetIndustry}`
  const expansion = expansionMap[key]

  if (!expansion) {
    return {
      targetIndustry,
      requiredChanges: ['이 업종 간 확장은 아직 분석되지 않았습니다.'],
      expectedImpact: '분석 필요',
      difficulty: 'hard'
    }
  }

  return {
    targetIndustry,
    ...expansion
  }
}

/**
 * 업종별 성공 사례 데이터베이스
 */
export interface SuccessCase {
  industry: IndustryType
  company: string
  metric: string
  achievement: string
  methods: string[]
  benchmark: {
    before: number
    after: number
    improvement: number
  }
}

export const SUCCESS_CASES: SuccessCase[] = [
  {
    industry: 'ecommerce',
    company: '전자상거래 A사',
    metric: 'CVR',
    achievement: 'CVR 8% 달성 (업계 평균 2.5%)',
    methods: [
      '상품 이미지 AI 최적화 (10장 이상, 다각도)',
      '고객 리뷰 자동 분류 및 표시',
      '개인화된 상품 추천 (AI 기반)',
      '장바구니 이탈 방지 팝업 (할인 쿠폰)',
      '결제 프로세스 1단계로 단순화'
    ],
    benchmark: {
      before: 2.0,
      after: 8.0,
      improvement: 300
    }
  },
  {
    industry: 'saas',
    company: 'SaaS B사',
    metric: 'Monthly Leads',
    achievement: '월간 리드 500개 달성 (업계 평균 100개)',
    methods: [
      '문제 해결형 블로그 콘텐츠 100개 이상 작성',
      'Case Study 20개 작성 및 배포',
      '웨비나 시리즈 (월 4회)',
      '이메일 시퀀스 자동화 (리드 네어팅)',
      '무료 체험 프로세스 단순화 (1클릭)'
    ],
    benchmark: {
      before: 100,
      after: 500,
      improvement: 400
    }
  },
  {
    industry: 'local_business',
    company: '로컬 비즈니스 C사',
    metric: 'Monthly Reservations',
    achievement: '월간 예약 500개 달성 (업계 평균 100개)',
    methods: [
      'Naver Place 순위 1위 달성 (지역 키워드 최적화)',
      '고품질 사진 20장 이상 업로드',
      '리뷰 응답 자동화 (24시간 이내)',
      '예약 시스템 개선 (1클릭 예약)',
      '카카오톡 채널 운영 (예약 알림)'
    ],
    benchmark: {
      before: 100,
      after: 500,
      improvement: 400
    }
  },
  {
    industry: 'creator_economy',
    company: '크리에이터 D',
    metric: 'Monthly Views',
    achievement: '월간 조회수 300만 달성 (업계 평균 10만)',
    methods: [
      '썸네일 최적화 (A/B 테스트)',
      '영상 길이 최적화 (시청 지속 시간 분석)',
      '커뮤니티 탭 활용 (팬 상호작용)',
      '멤버십 프로그램 론칭',
      '콜라보 시리즈 (다른 크리에이터와)'
    ],
    benchmark: {
      before: 100000,
      after: 3000000,
      improvement: 2900
    }
  }
]

/**
 * 업종별 성공 사례 가져오기
 */
export function getSuccessCases(industry: IndustryType): SuccessCase[] {
  return SUCCESS_CASES.filter(case_ => case_.industry === industry)
}

/**
 * 유사 성과 달성 방법 추천
 */
export function recommendSimilarMethods(
  industry: IndustryType,
  targetMetric: string,
  currentValue: number,
  targetValue: number
): {
  successCase: SuccessCase | null
  applicableMethods: string[]
  expectedImprovement: number
} {
  const cases = getSuccessCases(industry)
  const relevantCase = cases.find(
    c => c.metric.toLowerCase().includes(targetMetric.toLowerCase())
  )

  if (!relevantCase) {
    return {
      successCase: null,
      applicableMethods: [],
      expectedImprovement: 0
    }
  }

  // 성공 사례의 방법 중 적용 가능한 것 필터링
  const applicableMethods = relevantCase.methods.filter(method => {
    // 현재 상황에 맞는 방법인지 판단 (간단한 키워드 매칭)
    return true // 실제로는 더 정교한 필터링 필요
  })

  // 예상 개선율 계산
  const improvementRatio = relevantCase.benchmark.improvement / 100
  const expectedImprovement = currentValue * improvementRatio

  return {
    successCase: relevantCase,
    applicableMethods,
    expectedImprovement
  }
}
