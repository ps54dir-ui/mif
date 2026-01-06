/**
 * Mock 데이터 - 백엔드 없이 프론트엔드에서 작동
 */

export interface MockBrandData {
  brandName: string
  overallScore: number
  fourAxes: {
    inflow: number
    persuasion: number
    trust: number
    circulation: number
  }
  seoGeoAeoReports: Array<{
    type: 'SEO' | 'GEO' | 'AEO'
    score: number
    issues: string[]
  }>
  icePriorities: Array<{
    id: string
    strategyName: string
    impact: number
    confidence: number
    ease: number
    finalScore: number
    description?: string
  }>
  diagnosisHistory: Array<{
    date: string
    overallScore: number
    version: number
  }>
  executiveSummary: string
  channelConnections: Array<{
    id: string
    channel_type: string
    channel_url: string | null
    connection_status: string
    auto_discovered: boolean
  }>
  weeklyChecklist: {
    week_start: string
    week_end: string
    total_tasks: number
    tasks: Array<{
      task: string
      description: string
      category: string
      priority: string
      estimated_time: string
      owner: string
    }>
  }
  onlineChannelDiagnostics?: any
  channelDiagnostics?: any
  snsDiagnostics?: any
  channelAsymmetry?: any
  digitalShare?: any
}

/**
 * 나이키 Mock 데이터
 */
export const nikeMockData: MockBrandData = {
  brandName: '나이키',
  overallScore: 88,
  fourAxes: {
    inflow: 95,      // SEO 점수
    persuasion: 89,  // SNS 점수
    trust: 85,      // 신뢰도
    circulation: 82  // 순환
  },
  seoGeoAeoReports: [
    {
      type: 'SEO',
      score: 95,
      issues: []
    },
    {
      type: 'GEO',
      score: 72,
      issues: [
        '생성형 AI 응답에서 경쟁 브랜드 대비 구체적 통계 인용 수치가 부족함',
        'JSON-LD 스키마 추가 필요',
        '통계 및 인용구 보강 필요'
      ]
    },
    {
      type: 'AEO',
      score: 68,
      issues: [
        'FAQ/Q&A 포맷 부족',
        '서술형 콘텐츠 → 표/불렛포인트 전환 필요'
      ]
    }
  ],
  icePriorities: [
    {
      id: '1',
      strategyName: '틱톡 설득 지수 개선 - 콘텐츠 전략 재구성',
      impact: 9,
      confidence: 8,
      ease: 7,
      finalScore: 8.0,
      description: '유튜브 유입은 강하지만, 틱톡의 설득 지수가 낮습니다(62.1점). 틱톡 특성에 맞는 짧고 임팩트 있는 콘텐츠로 전환하여 설득력을 높여야 합니다.'
    },
    {
      id: '2',
      strategyName: 'AEO 최적화 - 사용자 질문형 콘텐츠 보강',
      impact: 9,
      confidence: 8,
      ease: 7,
      finalScore: 8.0,
      description: '나이키는 검색 지배력은 강력하나, AI 답변 엔진(AEO) 최적화를 위해 사용자 질문형 콘텐츠 보강이 필요함'
    },
    {
      id: '3',
      strategyName: '콘텐츠 구조화 - 서술형을 표/불렛포인트로 전환',
      impact: 7,
      confidence: 9,
      ease: 8,
      finalScore: 8.0,
      description: 'AI가 요약하기 쉬운 구조화된 형식으로 콘텐츠를 전환합니다.'
    }
  ],
  diagnosisHistory: [
    {
      date: new Date().toISOString(),
      overallScore: 88,
      version: 3
    },
    {
      date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      overallScore: 85,
      version: 2
    },
    {
      date: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
      overallScore: 82,
      version: 1
    }
  ],
  onlineChannelDiagnostics: {
    youtube: {
      video_mentions_growth: 200,  // 200% 상승
      viral_index: 92  // 92점
    },
    tiktok: {
      video_mentions_growth: 180,
      viral_index: 88
    },
    instagram: {
      engagement_index: 85,  // 85점
      hashtag_spread_rank: '상위 1%'  // 상위 1%
    },
    threads: {
      engagement_index: 79,
      hashtag_spread_rank: '상위 5%'
    },
    naver_cafe: {
      positive_review_ratio: 78,  // 78%
      response_speed: '매우 빠름'  // '매우 빠름'
    },
    daum_cafe: {
      positive_review_ratio: 72,
      response_speed: '빠름'
    },
    own_mall: {
      conversion_rate: 3.2,
      repeat_visit_rate: 45
    },
    x_twitter: {
      mentions_growth: 150,
      engagement_rate: 6.8
    },
    smartstore: {
      conversion_rate: 2.8,
      review_score: 4.5
    },
    coupang: {
      sales_performance: 85,
      review_score: 4.6
    }
  },
  channelDiagnostics: {
    youtube: {
      score: 92,
      insight: '신제품 리뷰 영상 트렌딩 점유율 최상위'
    },
    instagram: {
      score: 88,
      insight: '릴스 챌린지 참여율 기반 설득 지수 최우선 순위'
    },
    community: {
      score: 75,
      insight: '특정 커뮤니티 내 브랜드 위조품 이슈로 인한 신뢰 지수 모니터링 필요'
    },
    tiktok: {
      score: 82,
      insight: '숏폼 기반 발견성 지표 우수'
    }
  },
  executiveSummary: '현재 가장 시급한 문제는 틱톡의 설득 지수입니다. (삼성생명은 유튜브 유입은 강하지만, 틱톡의 설득 지수가 낮습니다) 이를 해결하면 매출이 12.5% 상승할 것으로 예측됩니다.',
  channelAsymmetry: {
    insights: [
      {
        type: 'ASYMmetry',
        channel1: '유튜브',
        channel2: '틱톡',
        metric: '설득 지수',
        message: '유튜브 유입은 강하지만, 틱톡의 설득 지수가 낮습니다(틱톡: 62.1점, 유튜브: 88.5점)'
      }
    ],
    summary: '삼성생명은 유튜브 유입은 강하지만, 틱톡의 설득 지수가 낮습니다'
  },
  digitalShare: {
    overall_digital_share: 87.5,
    seo_contribution: 38.0,
    sns_contribution: 49.5,
    channel_contributions: {
      'SEO': 38.0,
      'YOUTUBE': 12.8,
      'TIKTOK': 9.3,
      'TWITTER': 12.8,
      'THREADS': 9.3
    },
    breakdown: {
      seo_score: 95,
      average_sns_score: 82.5,
      sns_channels: {
        'YOUTUBE': 85.2,
        'TIKTOK': 62.1,
        'TWITTER': 85.5,
        'THREADS': 62.3
      }
    }
  },
  channelConnections: [
    {
      id: '1',
      channel_type: 'YOUTUBE',
      channel_url: 'https://www.youtube.com/@nike',
      connection_status: 'CONNECTED',
      auto_discovered: true
    },
    {
      id: '2',
      channel_type: 'INSTAGRAM',
      channel_url: 'https://www.instagram.com/nike/',
      connection_status: 'CONNECTED',
      auto_discovered: true
    },
    {
      id: '3',
      channel_type: 'TWITTER',
      channel_url: 'https://twitter.com/nike',
      connection_status: 'CONNECTED',
      auto_discovered: true
    },
    {
      id: '4',
      channel_type: 'NAVER',
      channel_url: 'https://search.naver.com/search.naver?query=나이키',
      connection_status: 'CONNECTED',
      auto_discovered: true
    }
  ],
  weeklyChecklist: {
    week_start: new Date().toISOString().split('T')[0],
    week_end: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    total_tasks: 5,
    tasks: [
      {
        task: 'GEO 최적화 - 통계 및 인용구 추가',
        description: '신뢰할 수 있는 통계와 출처를 콘텐츠에 추가하여 생성형 AI 응답 노출 가능성 향상',
        category: 'GEO/AEO',
        priority: 'HIGH',
        estimated_time: '4-6시간',
        owner: '콘텐츠 팀'
      },
      {
        task: 'FAQ/Q&A 섹션 추가',
        description: '고객이 자주 묻는 질문을 Q&A 형식으로 정리',
        category: 'GEO/AEO',
        priority: 'HIGH',
        estimated_time: '2-3시간',
        owner: '콘텐츠 팀'
      },
      {
        task: '서술형 콘텐츠를 표/불렛포인트로 전환',
        description: 'AI가 요약하기 쉬운 구조화된 형식으로 변경',
        category: 'GEO/AEO',
        priority: 'MEDIUM',
        estimated_time: '3-4시간',
        owner: '콘텐츠 팀'
      },
      {
        task: 'JSON-LD 스키마 추가',
        description: 'FAQPage, Article 등 구조화된 데이터 추가',
        category: 'GEO/AEO',
        priority: 'MEDIUM',
        estimated_time: '2시간',
        owner: '개발 팀'
      },
      {
        task: 'SNS 채널 모니터링 강화',
        description: '유튜브, 인스타그램, X(트위터) 채널 성과 모니터링',
        category: 'SNS',
        priority: 'MEDIUM',
        estimated_time: '지속적',
        owner: 'SNS 팀'
      }
    ]
  }
}

/**
 * 브랜드명으로 Mock 데이터 가져오기
 */
export function getMockBrandData(brandName: string): MockBrandData | null {
  const normalizedName = brandName.toLowerCase().trim()
  
  // 나이키 또는 nike로 검색하면 나이키 데이터 반환
  if (normalizedName === '나이키' || normalizedName === 'nike') {
    return nikeMockData
  }
  
  // 다른 브랜드는 null 반환 (나중에 확장 가능)
  return null
}

/**
 * Mock 브랜드 ID 생성
 */
export function generateMockBrandId(brandName: string): string {
  return `mock-brand-${brandName.toLowerCase().replace(/\s+/g, '-')}`
}
