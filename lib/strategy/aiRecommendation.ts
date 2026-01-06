/**
 * AI 추천 전략 모듈
 * 진단 결과 기반 전략 제언
 */

export interface AIRecommendedStrategy {
  id: string
  title: string
  description: string
  expectedRevenueIncrease: number // 기대 수익률 (%)
  executionDifficulty: 'EASY' | 'MEDIUM' | 'HARD' // 실행 난이도
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW'
  channels: string[]
  actionItems: string[]
  dataBasis: string // 데이터 기반 근거
  timeline: string // 예상 소요 시간
}

export interface StrategyRecommendationReport {
  strategies: AIRecommendedStrategy[]
  overallImpact: string
  totalExpectedRevenueIncrease: number
}

/**
 * AI 추천 전략 생성
 */
export function generateAIRecommendedStrategies(
  bounceRate: number,
  conversionRate: number,
  pagePersuasionScore: number,
  videoViralScore: number,
  placeReviewCount: number,
  socialAssetValue: number,
  brainScienceScore: number
): StrategyRecommendationReport {
  const strategies: AIRecommendedStrategy[] = []
  
  // 전략 1: 상세페이지 심리적 안심 장치 배치
  if (bounceRate > 60 && pagePersuasionScore < 70) {
    const expectedImprovement = (bounceRate - 60) * 0.02 // 이탈률 감소에 따른 전환율 개선
    strategies.push({
      id: 'psychological-safety',
      title: '상세페이지 상단 심리적 안심 장치 배치',
      description: '상세페이지 상단 3초 내에 리뷰/인증 배지를 배치하여 신뢰를 즉시 전달하고 이탈률을 낮춥니다.',
      expectedRevenueIncrease: expectedImprovement * 100, // 전환율 개선을 수익률로 변환
      executionDifficulty: 'EASY',
      priority: 'CRITICAL',
      channels: ['website', 'ecommerce'],
      actionItems: [
        '상단 폴드에 "10,000명 구매" 배지 추가',
        '정품 인증 마크 상단 배치',
        '평점 4.5점 이상 시 별점 표시',
        '최근 긍정 리뷰 3개 미리보기'
      ],
      dataBasis: `현재 이탈률 ${bounceRate.toFixed(1)}%, 상세페이지 설득력 점수 ${pagePersuasionScore}점으로 전환율 저하 원인`,
      timeline: '1주일'
    })
  }
  
  // 전략 2: 유튜브 바이럴 → 플레이스 예약 연결
  if (videoViralScore > 70 && placeReviewCount < 500) {
    strategies.push({
      id: 'cross-channel-workflow',
      title: '유튜브 바이럴 → 네이버 플레이스 예약 연결',
      description: '유튜브 영상의 바이럴 파워를 네이버 플레이스 예약으로 직접 연결하는 워크플로우 구축.',
      expectedRevenueIncrease: 25, // 예약 증가로 인한 수익률 증가
      executionDifficulty: 'MEDIUM',
      priority: 'HIGH',
      channels: ['youtube', 'naver_place'],
      actionItems: [
        '유튜브 영상 설명란에 플레이스 링크 추가',
        '영상 내 QR 코드로 플레이스 예약 페이지 연결',
        '바이럴 영상 댓글에 예약 혜택 안내',
        '플레이스 예약 시 유튜브 시청자 특별 할인 제공'
      ],
      dataBasis: `유튜브 바이럴 점수 ${videoViralScore}점, 플레이스 리뷰 ${placeReviewCount}개로 연결 기회 존재`,
      timeline: '2주일'
    })
  }
  
  // 전략 3: SNS 사회적 자산 → 전환율 향상
  if (socialAssetValue > 65 && conversionRate < 3.0) {
    strategies.push({
      id: 'social-asset-conversion',
      title: 'SNS 사회적 자산을 전환율로 연결',
      description: '인플루언서 추천과 커뮤니티 리뷰를 상세페이지에 실시간 반영하여 사회적 증거를 강화합니다.',
      expectedRevenueIncrease: 18,
      executionDifficulty: 'MEDIUM',
      priority: 'HIGH',
      channels: ['instagram', 'community', 'website'],
      actionItems: [
        '인스타그램 인플루언서 리뷰를 상세페이지에 임베드',
        '커뮤니티 긍정 리뷰를 실시간으로 상세페이지에 표시',
        'SNS 공유 시 추가 할인 혜택 제공',
        '바이럴 콘텐츠를 상세페이지 히어로 섹션에 배치'
      ],
      dataBasis: `사회적 자산 가치 ${socialAssetValue}점, 현재 전환율 ${conversionRate.toFixed(1)}%로 개선 여지 존재`,
      timeline: '2주일'
    })
  }
  
  // 전략 4: 뇌 과학 기반 도파민 자극
  if (brainScienceScore < 70) {
    strategies.push({
      id: 'dopamine-stimulation',
      title: '뇌 과학 기반 도파민 자극 콘텐츠',
      description: '보상, 즐거움, 성취감을 주는 콘텐츠로 도파민을 자극하여 세션 지속 시간과 전환율을 높입니다.',
      expectedRevenueIncrease: 30,
      executionDifficulty: 'HARD',
      priority: 'CRITICAL',
      channels: ['instagram', 'tiktok', 'youtube'],
      actionItems: [
        '인스타그램 릴스에 진행형 챌린지 기획',
        '틱톡 챌린지로 성취감 제공 (배지, 랭킹)',
        '유튜브 시리즈 콘텐츠로 지속적 관심 유도',
        '인터랙티브 요소(투표, 퀴즈) 추가'
      ],
      dataBasis: `뇌 과학 지수 ${brainScienceScore}점으로 도파민 자극 필요`,
      timeline: '3주일'
    })
  }
  
  // 우선순위별 정렬 및 TOP 3 선정
  const priorityOrder = { CRITICAL: 4, HIGH: 3, MEDIUM: 2, LOW: 1 }
  strategies.sort((a, b) => {
    const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority]
    if (priorityDiff !== 0) return priorityDiff
    return b.expectedRevenueIncrease - a.expectedRevenueIncrease
  })
  
  const top3Strategies = strategies.slice(0, 3)
  const totalExpectedRevenueIncrease = top3Strategies.reduce((sum, s) => sum + s.expectedRevenueIncrease, 0)
  
  return {
    strategies: top3Strategies,
    overallImpact: `TOP 3 전략 실행 시 총 ${totalExpectedRevenueIncrease.toFixed(1)}% 수익률 증가 예상`,
    totalExpectedRevenueIncrease
  }
}
