/**
 * 마스터급 전략 자동 생성
 * 뇌 과학, SNS 자산, AEO 권위 등을 종합한 고차원 전략
 */

export interface MasterStrategy {
  id: string
  title: string
  description: string
  targetMetric: string
  expectedImpact: string
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW'
  actionItems: string[]
  psychologyBasis: string
  channels: string[]
}

export interface MasterStrategyReport {
  strategies: MasterStrategy[]
  overallGoal: string
  timeline: string
  expectedRevenueIncrease: string
}

/**
 * 마스터급 전략 생성
 */
export function generateMasterStrategies(
  brainScienceOverall: number,
  socialAssetOverall: number,
  aeoAuthorityOverall: number,
  currentRevenue: number,
  targetRevenueMultiplier: number = 2
): MasterStrategyReport {
  const strategies: MasterStrategy[] = []
  
  // 도파민 자극 전략
  if (brainScienceOverall < 70) {
    strategies.push({
      id: 'dopamine-boost',
      title: '도파민 자극 콘텐츠 강화',
      description: '인스타그램과 틱톡에서 보상, 즐거움, 성취감을 주는 콘텐츠를 늘려 도파민을 자극합니다.',
      targetMetric: '도파민 지수',
      expectedImpact: '도파민 지수 30% 증가, 세션 지속 시간 25% 증가',
      priority: 'CRITICAL',
      actionItems: [
        '인스타그램 릴스에 보상 요소(할인 쿠폰, 이벤트) 추가',
        '틱톡 챌린지로 성취감 제공',
        '진행형 콘텐츠(시리즈)로 지속적 관심 유도',
        '인터랙티브 요소(투표, 퀴즈) 추가'
      ],
      psychologyBasis: '뇌 과학 연구에 따르면 도파민은 보상과 즐거움을 느낄 때 분비되어 행동을 강화합니다.',
      channels: ['instagram', 'tiktok']
    })
  }
  
  // 사회적 증거 강화 전략
  if (socialAssetOverall < 70) {
    strategies.push({
      id: 'social-proof-enhancement',
      title: '플레이스 사회적 증거(리뷰) 보강',
      description: '네이버 플레이스의 리뷰 수와 평점을 높여 사회적 증거를 강화하고 옥시토신을 증가시킵니다.',
      targetMetric: '사회적 자산 가치',
      expectedImpact: '리뷰 수 50% 증가, 리뷰 평점 0.3점 상승, 전환율 15% 증가',
      priority: 'HIGH',
      actionItems: [
        '구매 후 리뷰 작성 이벤트 (추가 할인)',
        '사진 리뷰 작성 시 특별 혜택 제공',
        '리뷰 응답률 80% 이상 유지',
        '인플루언서 리뷰 콘텐츠 제작 및 홍보'
      ],
      psychologyBasis: '사회적 증거는 옥시토신 분비를 촉진하여 신뢰와 연결감을 높이고 구매 결정을 돕습니다.',
      channels: ['naver_place', 'instagram', 'community']
    })
  }
  
  // AEO 권위 강화 전략 (포괄적 확장)
  if (aeoAuthorityOverall < 70) {
    strategies.push({
      id: 'aeo-authority-boost',
      title: 'AEO 권위 지수 향상 - 포괄적 최적화 전략',
      description: 'AI 답변 엔진에서 인용되도록 다양한 콘텐츠 타입과 구조화된 데이터를 활용합니다. 블로그 외 FAQ, JSON-LD, 통계, 표, 비디오 등 모든 콘텐츠 타입을 최적화합니다.',
      targetMetric: 'AEO 권위 지수',
      expectedImpact: '자연 유입 트래픽 40% 증가, 브랜드 검색 30% 증가, AI 인용률 50% 증가',
      priority: 'MEDIUM',
      actionItems: [
        'FAQ/Q&A 섹션 대폭 확장 (제품별, 서비스별, 산업별 FAQ)',
        'JSON-LD 구조화 데이터 마크업 (FAQPage, Article, HowTo, Product, Service, BreadcrumbList)',
        '전문가 인용 및 통계 데이터 추가 (업계 통계, 케이스 스터디, 인포그래픽)',
        '서술형 콘텐츠를 표/불렛포인트로 구조화',
        '비디오 콘텐츠 제작 및 최적화 (YouTube, 비디오 FAQ)',
        '전문가 권위 콘텐츠 구축 (백서, 화이트페이퍼, 게스트 포스팅)',
        '메타데이터 및 기술적 최적화 (헤딩 구조, 이미지 alt, 내부 링크)'
      ],
      psychologyBasis: 'AI 답변 엔진은 권위 있는 출처, 구조화된 데이터, 명확한 답변을 선호합니다. 다양한 콘텐츠 타입을 최적화하면 인용 가능성이 크게 높아집니다.',
      channels: ['blog', 'website', 'youtube', 'faq', 'structured_data']
    })
  }
  
  // 종합 전략: 매출 2배 증가
  const overallGoal = `이번 달 매출을 ${targetRevenueMultiplier}배 올리기`
  const expectedRevenueIncrease = `${((targetRevenueMultiplier - 1) * 100).toFixed(0)}% 증가 (${(currentRevenue * targetRevenueMultiplier).toLocaleString()}원)`
  
  // 우선순위별 정렬
  strategies.sort((a, b) => {
    const priorityOrder = { CRITICAL: 4, HIGH: 3, MEDIUM: 2, LOW: 1 }
    return priorityOrder[b.priority] - priorityOrder[a.priority]
  })
  
  return {
    strategies,
    overallGoal,
    timeline: '1개월',
    expectedRevenueIncrease
  }
}
