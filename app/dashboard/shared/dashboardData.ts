import { type DashboardData } from '@/lib/api/dashboardApi'

// 나이키 종합 대시보드 데이터
export const NIKE_DATA: DashboardData = {
  overallScore: 88,
  fourAxes: {
    inflow: 95,
    persuasion: 89,
    trust: 85,
    circulation: 82
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
  seoReport: {
    score: 95,
    insights: []
  },
  geoReport: {
    score: 72,
    insights: [
      '생성형 AI 응답에서 경쟁 브랜드 대비 구체적 통계 인용 수치가 부족함',
      'JSON-LD 스키마 추가 필요',
      '통계 및 인용구 보강 필요'
    ]
  },
  aeoReport: {
    score: 68,
    insights: [
      'FAQ/Q&A 포맷 부족',
      '서술형 콘텐츠 → 표/불렛포인트 전환 필요'
    ]
  },
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
      video_mentions_growth: 200,
      viral_index: 92
    },
    tiktok: {
      video_mentions_growth: 180,
      viral_index: 88
    },
    instagram: {
      engagement_index: 85,
      hashtag_spread_rank: '상위 1%'
    },
    threads: {
      engagement_index: 79,
      hashtag_spread_rank: '상위 5%'
    },
    naver_cafe: {
      positive_review_ratio: 78,
      response_speed: '매우 빠름'
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
    },
    facebook: {
      engagement_index: 78,
      reach_growth: 45
    },
    youtube_shorts: {
      views_growth: 320,
      engagement_rate: 8.5
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
    },
    threads: {
      score: 79,
      insight: '텍스트 기반 소통 채널에서 브랜드 철학 전달 효과적'
    },
    facebook: {
      score: 76,
      insight: '중장년층 타겟 마케팅에서 브랜드 인지도 지속 상승'
    },
    youtube_shorts: {
      score: 85,
      insight: '숏폼 콘텐츠로 젊은 세대 유입률 급증, 전환율 개선 필요'
    }
  },
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
      'YOUTUBE_SHORTS': 8.5,
      'TIKTOK': 9.3,
      'TWITTER': 12.8,
      'THREADS': 9.3,
      'FACEBOOK': 7.8
    },
    breakdown: {
      seo_score: 95,
      average_sns_score: 82.5,
      sns_channels: {
        'YOUTUBE': 85.2,
        'YOUTUBE_SHORTS': 85.0,
        'TIKTOK': 62.1,
        'TWITTER': 85.5,
        'THREADS': 79.0,
        'FACEBOOK': 76.0
      }
    }
  }
}
