/**
 * 컨설팅 모의 데이터
 * Nike 예시를 기반으로 한 실제적인 데이터
 */

import type {
  MarketAnalysis,
  CustomerAnalysis,
  ChannelStrategy,
  DetailedExecutionPlan,
  KPIFramework,
  RiskManagement,
  StrategicRoadmap,
  InvestmentAnalysis
} from '@/lib/types/consulting'

export const nikeMarketAnalysis: MarketAnalysis = {
  marketSize: {
    categoryName: '스포츠용품 온라인 시장',
    currentSize: {
      value: 5.2,
      currency: '조원',
      period: '2024년'
    },
    growth: {
      yearOverYear: 12.5,
      projection: {
        oneYear: 5.8,
        threeYear: 7.2
      },
      cagr: 11.2
    },
    marketTrends: [
      { trend: '모바일 쇼핑 증가', impact: 'positive', growthRate: 18 },
      { trend: '라이브커머스 성장', impact: 'positive', growthRate: 24 },
      { trend: '개인맞춤화 수요', impact: 'positive', growthRate: 15 },
      { trend: '환경 친화적 제품 선호', impact: 'positive', growthRate: 20 }
    ]
  },
  competitorAnalysis: [
    {
      rank: 1,
      companyName: '아디다스',
      marketShare: 24.5,
      digitalStrengths: {
        brandRecognition: 92,
        websiteUX: 88,
        mobileApp: '매우 우수',
        socialMediaEngagement: 4.8,
        contentQuality: 90,
        customerServiceQuality: 85,
        conversionRate: 3.2
      },
      marketingStrategy: {
        channels: ['인스타그램', '유튜브', '블로그', '틱톡'],
        contentThemes: ['운동 동기부여', '상품 리뷰', '스타일 가이드'],
        campaignFrequency: '주 3회',
        budgetEstimate: '월 500만원대 추정'
      },
      weaknesses: [
        {
          weakness: '한국 커뮤니티 약함',
          yourOpportunity: '로컬 커뮤니티 강화로 차별화',
          estimatedGain: 8
        },
        {
          weakness: '가격 경쟁력 부족',
          yourOpportunity: '가성비 강조 마케팅',
          estimatedGain: 12
        }
      ],
      threats: [
        {
          threat: '브랜드 인지도 압도',
          impact: 'high',
          yourCounterStrategy: '니치 마켓 집중 + 개인화 서비스'
        }
      ]
    },
    {
      rank: 2,
      companyName: '푸마',
      marketShare: 18.2,
      digitalStrengths: {
        brandRecognition: 78,
        websiteUX: 82,
        mobileApp: '우수',
        socialMediaEngagement: 3.5,
        contentQuality: 75,
        customerServiceQuality: 80,
        conversionRate: 2.8
      },
      marketingStrategy: {
        channels: ['인스타그램', '페이스북', '블로그'],
        contentThemes: ['스포츠 이벤트', '제품 소개'],
        campaignFrequency: '주 2회',
        budgetEstimate: '월 300만원대 추정'
      },
      weaknesses: [
        {
          weakness: '젊은 세대 타겟 약함',
          yourOpportunity: 'Z세대 중심 콘텐츠 전략',
          estimatedGain: 15
        }
      ],
      threats: [
        {
          threat: '가격 공격성',
          impact: 'medium',
          yourCounterStrategy: '프리미엄 포지셔닝 + 가치 강조'
        }
      ]
    },
    {
      rank: 3,
      companyName: '뉴발란스',
      marketShare: 15.8,
      digitalStrengths: {
        brandRecognition: 72,
        websiteUX: 85,
        mobileApp: '우수',
        socialMediaEngagement: 3.2,
        contentQuality: 80,
        customerServiceQuality: 88,
        conversionRate: 3.0
      },
      marketingStrategy: {
        channels: ['인스타그램', '유튜브', '커뮤니티'],
        contentThemes: ['일상 스타일', '제품 리뷰'],
        campaignFrequency: '주 2-3회',
        budgetEstimate: '월 400만원대 추정'
      },
      weaknesses: [
        {
          weakness: '디지털 마케팅 예산 제한',
          yourOpportunity: '효율적 디지털 마케팅으로 우위',
          estimatedGain: 10
        }
      ],
      threats: [
        {
          threat: '고객 서비스 우수',
          impact: 'medium',
          yourCounterStrategy: '자동화 + 개인화 서비스로 대응'
        }
      ]
    },
    {
      rank: 4,
      companyName: '컨버스',
      marketShare: 12.3,
      digitalStrengths: {
        brandRecognition: 68,
        websiteUX: 75,
        mobileApp: '보통',
        socialMediaEngagement: 2.8,
        contentQuality: 70,
        customerServiceQuality: 75,
        conversionRate: 2.5
      },
      marketingStrategy: {
        channels: ['인스타그램', '페이스북'],
        contentThemes: ['스타일', '트렌드'],
        campaignFrequency: '주 1-2회',
        budgetEstimate: '월 200만원대 추정'
      },
      weaknesses: [
        {
          weakness: '디지털 혁신 부족',
          yourOpportunity: '최신 디지털 기술 활용',
          estimatedGain: 18
        }
      ],
      threats: [
        {
          threat: '낮음',
          impact: 'low',
          yourCounterStrategy: '차별화 전략 불필요'
        }
      ]
    },
    {
      rank: 5,
      companyName: '반스',
      marketShare: 9.5,
      digitalStrengths: {
        brandRecognition: 65,
        websiteUX: 70,
        mobileApp: '보통',
        socialMediaEngagement: 2.5,
        contentQuality: 68,
        customerServiceQuality: 72,
        conversionRate: 2.2
      },
      marketingStrategy: {
        channels: ['인스타그램'],
        contentThemes: ['스타일'],
        campaignFrequency: '주 1회',
        budgetEstimate: '월 150만원대 추정'
      },
      weaknesses: [
        {
          weakness: '온라인 마케팅 약함',
          yourOpportunity: '디지털 마케팅 강화로 시장 점유',
          estimatedGain: 20
        }
      ],
      threats: [
        {
          threat: '낮음',
          impact: 'low',
          yourCounterStrategy: '차별화 전략 불필요'
        }
      ]
    }
  ],
  yourPositioning: {
    currentPosition: {
      marketShare: 3.2,
      ranking: 6,
      strengthAreas: ['제품 품질', '고객만족도', '빠른 응답'],
      weakAreas: ['브랜드 인지도', '채널 다양성', '마케팅 예산']
    },
    desiredPosition: {
      targetMarketShare: 6,
      targetRanking: 4,
      uniqueValueProposition: '성능+가성비+커뮤니티',
      differentiation: ['혁신적 마케팅', '고객 중심', '빠른 적응력']
    },
    competitiveAdvantage: [
      {
        advantage: '빠른 응답 속도',
        defensibility: 'medium',
        timeToImitate: '6개월'
      },
      {
        advantage: '데이터 기반 의사결정',
        defensibility: 'high',
        timeToImitate: '12개월'
      },
      {
        advantage: '커뮤니티 중심 운영',
        defensibility: 'high',
        timeToImitate: '18개월'
      }
    ]
  },
  opportunities: [
    {
      opportunity: '밀레니얼 세대 증가',
      timingWindow: '6-12개월',
      estimatedMarketSize: 2000,
      actionRequired: 'Z세대 타겟 콘텐츠 확대'
    },
    {
      opportunity: '건강 라이프스타일 트렌드',
      timingWindow: '지속적',
      estimatedMarketSize: 3500,
      actionRequired: '건강 관련 콘텐츠 강화'
    },
    {
      opportunity: '개인화 서비스 수요',
      timingWindow: '3-6개월',
      estimatedMarketSize: 1500,
      actionRequired: '맞춤형 추천 시스템 구축'
    }
  ],
  threats: [
    {
      threat: '중국산 저가 상품',
      likelihood: 'high',
      potentialImpact: -8,
      contingencyPlan: '품질 강조 + 브랜드 가치 마케팅'
    },
    {
      threat: '경쟁사 대규모 마케팅',
      likelihood: 'medium',
      potentialImpact: -5,
      contingencyPlan: '니치 마켓 집중 + 효율적 예산 배분'
    },
    {
      threat: '경제 침체',
      likelihood: 'medium',
      potentialImpact: -12,
      contingencyPlan: '가성비 강조 + 할인 전략'
    }
  ]
}

export const nikeCustomerAnalysis: CustomerAnalysis = {
  targetProfile: {
    demographics: {
      ageRange: '25-40세',
      gender: '남녀 모두',
      income: '중산층 이상',
      location: ['서울', '경기', '부산', '대구'],
      occupation: ['직장인', '자영업', '프리랜서']
    },
    psychographics: {
      lifestyleSegments: [
        {
          segment: '건강 관심 고객',
          size: 35,
          characteristics: ['운동 중심 생활', '건강식', '자기계발'],
          spendingPower: 'high',
          brandLoyalty: 75
        },
        {
          segment: '스타일 추구 고객',
          size: 30,
          characteristics: ['패션 관심', 'SNS 활동', '트렌드 민감'],
          spendingPower: 'medium',
          brandLoyalty: 60
        },
        {
          segment: '가성비 추구 고객',
          size: 25,
          characteristics: ['가격 민감', '비교 구매', '리뷰 중시'],
          spendingPower: 'medium',
          brandLoyalty: 50
        },
        {
          segment: '프리미엄 고객',
          size: 10,
          characteristics: ['고가 제품 선호', '브랜드 중시', '서비스 요구'],
          spendingPower: 'high',
          brandLoyalty: 85
        }
      ],
      values: ['성능', '가성비', '환경', '건강'],
      motivations: ['자기개발', '건강', '사회적 인정', '스타일'],
      fears: ['낭비', '품질 문제', '배송 지연', '환불 어려움'],
      aspirations: ['피트니스 전문가', '건강한 이미지', '스타일리시']
    },
    digitalBehavior: {
      devicePreference: '모바일 70%, PC 30%',
      channelPreferences: [
        {
          channel: '인스타그램',
          usage: 2.5,
          purpose: ['정보 탐색', '구매', '리뷰 확인'],
          trustLevel: 75
        },
        {
          channel: '유튜브',
          usage: 3.0,
          purpose: ['제품 리뷰', '사용법', '비교'],
          trustLevel: 85
        },
        {
          channel: '네이버 블로그',
          usage: 1.5,
          purpose: ['정보 검색', '리뷰'],
          trustLevel: 80
        },
        {
          channel: '커뮤니티',
          usage: 1.0,
          purpose: ['질문', '경험 공유'],
          trustLevel: 70
        }
      ],
      purchaseProcess: {
        awareness: 'SNS + 검색',
        consideration: '리뷰 + 비교',
        decision: '가격 + 배송',
        repurchaseRate: 45
      }
    }
  },
  customerJourney: {
    awareness: {
      triggerEvents: [
        {
          event: '운동 시작',
          channel: 'SNS 광고',
          conversionRate: 12
        },
        {
          event: '제품 필요',
          channel: '검색',
          conversionRate: 25
        },
        {
          event: '추천 받음',
          channel: '커뮤니티',
          conversionRate: 35
        }
      ],
      painPoints: [
        {
          point: '어떤 상품 선택할지 몰라',
          solution: '비교 가이드 제공'
        },
        {
          point: '브랜드 신뢰도 불확실',
          solution: '리뷰 + 인증 마크'
        }
      ],
      contentNeeds: ['제품 정보', '사용 팁', '비교 가이드']
    },
    consideration: {
      informationNeeds: [
        {
          need: '성능 비교',
          source: ['리뷰', '동영상'],
          trustImportance: 90
        },
        {
          need: '가격 비교',
          source: ['웹사이트', '앱'],
          trustImportance: 85
        },
        {
          need: '사용 후기',
          source: ['리뷰', '커뮤니티'],
          trustImportance: 95
        }
      ],
      mainConcerns: [
        {
          concern: '가격 부담',
          concern_rate: 45,
          resolution: '분할 결제 + 할인'
        },
        {
          concern: '품질 불확실',
          concern_rate: 60,
          resolution: '리뷰 + 보증'
        },
        {
          concern: '배송 지연',
          concern_rate: 35,
          resolution: '배송 보장 + 추적'
        }
      ],
      decisionCriteria: [
        {
          criteria: '가성비',
          weight: 40,
          competitorComparison: {}
        },
        {
          criteria: '리뷰 점수',
          weight: 30,
          competitorComparison: {}
        },
        {
          criteria: '배송 속도',
          weight: 20,
          competitorComparison: {}
        },
        {
          criteria: '브랜드',
          weight: 10,
          competitorComparison: {}
        }
      ]
    },
    decision: {
      obstacles: [
        {
          obstacle: '배송 기간 불안',
          overcomingStrategy: '배송 보장 + 실시간 추적'
        },
        {
          obstacle: '환불 정책 불명확',
          overcomingStrategy: '명확한 환불 정책 + 빠른 처리'
        }
      ],
      finalPushFactors: [
        {
          factor: '리뷰 수',
          impact: 25
        },
        {
          factor: '할인 쿠폰',
          impact: 30
        },
        {
          factor: '무료 배송',
          impact: 20
        }
      ],
      abandonmentReasons: [
        {
          reason: '배송료 추가',
          preventionStrategy: '무료 배송 조건 완화'
        },
        {
          reason: '결제 복잡',
          preventionStrategy: '원클릭 결제'
        }
      ]
    },
    retention: {
      expectations: ['빠른 배송', '좋은 품질', '친절한 서비스'],
      delightFactors: ['깜짝 선물', '맞춤 추천', '빠른 응답'],
      churnRisks: [
        {
          risk: '배송 지연',
          preventionAction: '배송 시스템 개선'
        },
        {
          risk: '품질 문제',
          preventionAction: '품질 관리 강화'
        }
      ],
      loyaltyTriggers: ['멤버십', '포인트', '특별 혜택']
    }
  },
  psychologicalFactors: {
    socialProof: {
      importance: 90,
      effectiveness: {
        reviewCount: 15,
        starRating: 8,
        userGeneratedContent: 22
      },
      tactics: ['리뷰 시스템', '인증마크', '소셜 증거']
    },
    scarcity: {
      perception: 70,
      triggers: ['한정 물량', '시간 제한', '재고 부족'],
      conversionLift: 30
    },
    authority: {
      credibilityFactors: [
        {
          factor: '전문가 추천',
          trustLift: 25
        },
        {
          factor: '인증 마크',
          trustLift: 20
        }
      ]
    },
    reciprocity: {
      giveStrategies: ['무료 샘플', '가이드', '할인 쿠폰'],
      expectedReturn: 35
    }
  }
}

// 나머지 모의 데이터 생성
export const nikeChannelStrategy: ChannelStrategy = {
  channels: [
    {
      channelName: '인스타그램',
      channelType: 'social',
      currentMetrics: {
        followers: 125000,
        engagement: {
          rate: 3.2,
          postingFrequency: 2,
          avgLikes: 4000,
          avgComments: 150,
          avgShares: 80
        },
        reach: {
          monthlyReach: 500000,
          reachTrend: 'up'
        },
        conversionMetrics: {
          clickThrough: 2.5,
          leadGeneration: 50,
          sales: 2500000
        }
      },
      benchmark: {
        yourEngagement: 3.2,
        topCompetitor: 4.8,
        industry: 3.5,
        gap: -1.6,
        opportunity: '1.6%p 개선 가능'
      },
      goals: {
        shortTerm: {
          timeline: '3개월',
          followers: 175000,
          engagement: 4.5,
          conversions: 75
        },
        mediumTerm: {
          timeline: '6개월',
          followers: 250000,
          engagement: 5.2,
          conversions: 100
        }
      },
      strategy: {
        contentStrategy: {
          pillars: [
            {
              pillar: '제품 리뷰',
              percentage: 30,
              formats: ['릴스', '포스트'],
              cadence: '주 1회'
            },
            {
              pillar: '사용자 이야기',
              percentage: 25,
              formats: ['스토리', '릴스'],
              cadence: '주 2회'
            },
            {
              pillar: '교육 콘텐츠',
              percentage: 25,
              formats: ['릴스', '카루셀'],
              cadence: '주 2회'
            },
            {
              pillar: '커뮤니티 참여',
              percentage: 20,
              formats: ['답글', '스토리'],
              cadence: '매일'
            }
          ],
          contentCalendar: [
            {
              week: 1,
              theme: '여름 시즌 준비',
              posts: 7,
              topics: ['여름 운동화', '시원한 옷차림', '운동 팁'],
              estimatedReach: 600000
            }
          ]
        },
        engagementStrategy: {
          tactics: [
            {
              tactic: '릴스 100K 챌린지',
              target: '신규 팔로워',
              expectedLift: 20,
              timeline: '4주'
            }
          ],
          communityManagement: {
            responseTime: '1시간 이내',
            answerRate: 95,
            conversionStrategy: 'DM으로 전환 유도'
          }
        },
        paidStrategy: {
          budget: {
            monthly: 5000000,
            allocation: {
              awareness: 30,
              consideration: 50,
              conversion: 20
            }
          },
          campaigns: [
            {
              campaignName: '신규 제품 론칭',
              objective: '판매',
              targetAudience: '25-40세 운동 관심층',
              budget: 3000000,
              duration: '4주',
              expectedROI: 250,
              creativeAssets: ['릴스', '스토리', '포스트']
            }
          ]
        }
      },
      weeklyActions: [
        {
          action: '릴스 3개 게시',
          owner: '콘텐츠 담당',
          deadline: '수요일',
          expectedImpact: '도달범위 +30%'
        }
      ],
      successMetrics: {
        primary: {
          metric: '팔로워 성장',
          target: 175000,
          measurement: '주간'
        },
        secondary: [
          {
            metric: '참여도',
            target: 4.5,
            measurement: '일일'
          }
        ]
      }
    }
  ]
}

export const nikeExecutionPlan: DetailedExecutionPlan = {
  planningPeriod: {
    startDate: new Date('2024-01-01'),
    endDate: new Date('2024-01-28'),
    duration: '4주'
  },
  weeklyPlans: [
    {
      week: 1,
      weekRange: '1월 1-7일',
      focus: {
        priority: '기초 설정',
        objective: '채널 최적화 완료',
        expectedOutcome: '모든 채널 프로필 최적화 완료'
      },
      channelActions: [
        {
          channel: '인스타그램',
          actions: [
            {
              actionNumber: 1,
              task: '프로필 최적화',
              description: '프로필 사진, 소개, 링크 최적화',
              owner: '마케팅 담당',
              deadline: '월요일',
              estimatedHours: 2,
              budget: 0,
              expectedImpact: '프로필 클릭률 +15%',
              checklist: ['사진 변경', '소개 수정', '링크 추가']
            }
          ]
        }
      ],
      dailyActivities: [
        {
          day: '월요일',
          activities: [
            { time: '09:00', task: '팀 미팅', duration: '30분' },
            { time: '10:00', task: '콘텐츠 리뷰', duration: '1시간' }
          ]
        }
      ],
      resources: {
        team: [
          { role: '마케터', hours: 20 },
          { role: '디자이너', hours: 15 }
        ],
        tools: ['Canva', 'Adobe'],
        budget: 2000000
      },
      weekReview: {
        metrics: [
          { metric: '도달범위', target: 100000, actual: null }
        ],
        successes: [],
        challenges: [],
        adjustments: []
      }
    }
  ],
  monthlyPlans: [
    {
      month: 1,
      monthName: '1월',
      focus: '브랜드 인식 구축',
      milestones: [
        {
          milestone: '팔로워 150K 달성',
          targetDate: new Date('2024-01-31'),
          metrics: { metric: 'followers', target: 150000 }
        }
      ]
    }
  ],
  resourceAllocation: {
    team: [
      {
        role: '마케팅 디렉터',
        hours: 40,
        salary: 5000000,
        responsibilities: ['전략 수립', '팀 관리']
      }
    ],
    budget: {
      totalBudget: 5000000,
      allocation: {
        content: 40,
        advertising: 35,
        tools: 15,
        testing: 10
      },
      breakdown: [
        {
          item: '콘텐츠 제작',
          cost: 2000000,
          frequency: '주간',
          expectedROI: 150
        }
      ]
    }
  }
}

export const nikeKPIs: KPIFramework = {
  strategicObjectives: [
    {
      objective: '시장 점유율 3→6%',
      timeframe: '6개월',
      kpis: [
        {
          kpiName: '월간 매출',
          baseline: 1000000,
          target: 3000000,
          unit: '원',
          measurement: {
            frequency: '일일',
            dataSource: 'GA4, Shopify',
            owner: 'CFO',
            method: '자동화 리포트'
          },
          successPath: {
            month1: 1500000,
            month2: 1700000,
            month3: 2000000,
            month6: 3000000
          },
          redFlag: {
            threshold: -20,
            action: '전략 재검토'
          }
        }
      ]
    }
  ],
  channelKPIs: [
    {
      channel: '인스타그램',
      primaryKPI: {
        metric: '월간 판매',
        baseline: 2500000,
        target: 5000000,
        weight: 40
      },
      supportingKPIs: [
        {
          metric: '참여율',
          baseline: 3.2,
          target: 4.5,
          weight: 20
        },
        {
          metric: '리드 생성',
          baseline: 50,
          target: 150,
          weight: 25
        }
      ]
    }
  ],
  successCriteria: {
    shortTerm: {
      timeline: '1개월',
      targets: [
        { criterion: '일일 도달범위 50K+', importance: 'critical' }
      ],
      bonus: '달성 시 다음 페이즈 진행'
    },
    mediumTerm: {
      timeline: '3개월',
      targets: [
        { criterion: '월간 매출 200만원+', importance: 'critical' }
      ]
    },
    longTerm: {
      timeline: '6개월',
      targets: [
        { criterion: '시장점유율 6%', importance: 'critical' }
      ]
    }
  },
  realtimeDashboard: {
    today: {
      sales: 50000,
      reach: 15000,
      engagement: 3.5,
      leads: 5
    },
    week: {
      salesTrend: 'up',
      reachTrend: '+15%',
      weeklyComparison: 15
    },
    month: {
      progress: 75,
      onTrack: true,
      nextWeekFocus: '콘텐츠 품질 향상'
    }
  },
  reviewProcess: {
    frequency: '주간',
    reviewMeeting: {
      day: '금요일',
      attendees: ['마케팅 팀', 'CFO'],
      duration: '1시간',
      agenda: ['KPI 리뷰', '전략 조정']
    },
    optimizationCycle: {
      test: 'A/B 테스트 실행',
      analyze: '데이터 분석',
      implement: '최적화 적용',
      frequency: '2주'
    }
  }
}

export const nikeRiskManagement: RiskManagement = {
  identifiedRisks: [
    {
      riskId: 1,
      riskName: '알고리즘 변화',
      riskCategory: 'operational',
      assessment: {
        likelihood: 'high',
        impact: 'critical',
        severity: 85,
        occurrenceProbability: 70
      },
      description: '인스타그램 알고리즘 변경으로 도달범위 급감',
      potentialImpact: {
        revenue: -20,
        timeline: '즉시',
        affectedChannels: ['인스타그램']
      },
      mitigationStrategies: [
        {
          strategy: '다채널 분산',
          actionItems: ['유튜브 강화', '틱톡 진출'],
          timeline: '2주 내',
          cost: 2000000,
          effectiveness: 80
        }
      ],
      contingencyPlan: {
        trigger: '알고리즘 80% 이상 변화',
        immediateActions: ['긴급 미팅', '예산 재배분'],
        timeline: '24시간',
        contactPerson: '마케팅 디렉터'
      },
      monitoring: {
        metric: '인스타 도달범위',
        alertThreshold: -30,
        checkFrequency: '매일',
        reportTo: '마케팅 팀'
      }
    }
  ],
  scenarioAnalysis: {
    worstCase: {
      scenario: '경쟁사 대규모 공격',
      probability: 15,
      impact: {
        sales: '-50%',
        timeline: '3개월',
        cumulativeLoss: 15000000
      },
      responseAction: '니치 마켓 집중',
      recoveryTime: '6개월'
    },
    bestCase: {
      scenario: '바이럴 콘텐츠 성공',
      probability: 20,
      impact: {
        sales: '+150%',
        timeline: '1개월'
      }
    },
    mostLikelyCase: {
      scenario: '계획대로 진행',
      probability: 65,
      impact: {
        sales: '+80%'
      }
    }
  },
  crisisManagement: {
    crisisTeam: {
      leader: '마케팅 디렉터',
      members: ['CFO', '콘텐츠 팀장'],
      communicationProtocol: '즉시 슬랙 알림'
    },
    communicationPlan: {
      internalCommunication: '주간 리포트',
      customerCommunication: '공지사항',
      mediaStatement: '준비됨'
    },
    recoveryPlan: {
      phases: [
        {
          phase: '즉시 대응',
          timeline: '24시간',
          actions: ['상황 파악', '팀 소집']
        }
      ]
    }
  }
}

export const nikeRoadmap: StrategicRoadmap = {
  phases: [
    {
      phaseNumber: 1,
      phaseName: '기초 구축',
      duration: '2개월',
      timeline: '1월-2월',
      objectives: [
        {
          objective: '채널 최적화',
          rationale: '기반 구축',
          expectedOutcome: '모든 채널 프로필 완성'
        }
      ],
      milestones: [
        {
          milestone: '프로필 완성',
          targetDate: new Date('2024-01-15'),
          metrics: { metric: 'completion', target: 100 },
          owner: '마케팅 팀',
          dependencies: []
        }
      ],
      phaseKPIs: [
        { metric: '팔로워', target: 150000, status: 'on-track' }
      ],
      goLiveChecklist: [
        { item: '프로필 완성', completed: false }
      ]
    },
    {
      phaseNumber: 2,
      phaseName: '성장 가속',
      duration: '2개월',
      timeline: '3월-4월',
      objectives: [
        {
          objective: '콘텐츠 확대',
          rationale: '성장 가속',
          expectedOutcome: '주간 게시물 2배 증가'
        }
      ],
      milestones: [
        {
          milestone: '팔로워 200K',
          targetDate: new Date('2024-04-30'),
          metrics: { metric: 'followers', target: 200000 },
          owner: '콘텐츠 팀',
          dependencies: ['Phase 1 완료']
        }
      ],
      phaseKPIs: [
        { metric: '참여율', target: 4.5, status: 'on-track' }
      ],
      goLiveChecklist: [
        { item: '콘텐츠 캘린더 완성', completed: false }
      ]
    },
    {
      phaseNumber: 3,
      phaseName: '최적화 & 확장',
      duration: '2개월',
      timeline: '5월-6월',
      objectives: [
        {
          objective: 'ROI 최적화',
          rationale: '효율성 향상',
          expectedOutcome: 'ROI 200% 달성'
        }
      ],
      milestones: [
        {
          milestone: '시장 점유율 6%',
          targetDate: new Date('2024-06-30'),
          metrics: { metric: 'marketShare', target: 6 },
          owner: '전체 팀',
          dependencies: ['Phase 2 완료']
        }
      ],
      phaseKPIs: [
        { metric: 'ROI', target: 200, status: 'on-track' }
      ],
      goLiveChecklist: [
        { item: '최적화 완료', completed: false }
      ]
    }
  ],
  growthScenarios: {
    conservative: {
      description: '최소 성장',
      assumptions: ['경쟁 심화', '예산 제한'],
      metrics: {
        revenue: 2000000,
        marketShare: 4.5
      },
      probability: 30
    },
    realistic: {
      description: '예상 성장',
      assumptions: ['계획대로 진행', '정상 예산'],
      metrics: {
        revenue: 3000000,
        marketShare: 6
      },
      probability: 60
    },
    aggressive: {
      description: '공격적 성장',
      assumptions: ['바이럴 성공', '예산 확대'],
      metrics: {
        revenue: 4500000,
        marketShare: 8
      },
      probability: 10
    }
  },
  roleBasedRoadmaps: {
    marketingTeam: {
      phase1: ['프로필 최적화', '콘텐츠 계획'],
      phase2: ['콘텐츠 제작', '캠페인 실행'],
      phase3: ['최적화', '확장']
    },
    contentTeam: {
      phase1: ['템플릿 제작', '가이드라인'],
      phase2: ['콘텐츠 확대', '품질 향상'],
      phase3: ['자동화', '최적화']
    }
  },
  dependencies: [
    {
      dependency: 'Phase 1 완료 필요',
      affectedPhase: 2,
      risk: '지연 시 Phase 2 미룸',
      mitigation: '우선순위 조정'
    }
  ]
}

export const nikeInvestmentROI: InvestmentAnalysis = {
  investmentPlan: {
    period: '6개월',
    costs: {
      teamCosts: {
        marketingDirector: {
          role: '마케팅 디렉터',
          months: 6,
          monthlyCost: 5000000,
          totalCost: 30000000
        },
        contentCreators: {
          count: 2,
          monthlyCost: 3000000,
          totalCost: 18000000
        },
        designers: {
          count: 1,
          monthlyCost: 2500000,
          totalCost: 15000000
        }
      },
      advertisingBudget: {
        instagram: 2000000,
        youtube: 1500000,
        search: 1000000,
        total6months: 27000000
      },
      tools: {
        analytics: 300000,
        automation: 200000,
        design: 100000,
        total6months: 3600000
      },
      contentProduction: {
        photography: 1000000,
        videography: 1500000,
        writing: 500000,
        total6months: 18000000
      },
      contingency: 7000000
    },
    totalInvestment: 70000000
  },
  expectedRevenue: {
    monthlyProjection: [
      {
        month: 1,
        baseline: 1000000,
        increment: 500000,
        projected: 1500000,
        confidence: 85
      },
      {
        month: 2,
        baseline: 1500000,
        increment: 800000,
        projected: 2300000,
        confidence: 80
      },
      {
        month: 3,
        baseline: 2300000,
        increment: 1200000,
        projected: 3500000,
        confidence: 75
      },
      {
        month: 4,
        baseline: 3500000,
        increment: 1500000,
        projected: 5000000,
        confidence: 70
      },
      {
        month: 5,
        baseline: 5000000,
        increment: 2000000,
        projected: 7000000,
        confidence: 65
      },
      {
        month: 6,
        baseline: 7000000,
        increment: 3000000,
        projected: 10000000,
        confidence: 60
      }
    ],
    cumulativeRevenue: {
      month1: 1500000,
      month3: 7300000,
      month6: 29300000
    }
  },
  roiAnalysis: {
    investmentPeriod: '6개월',
    basicROI: {
      investment: 70000000,
      revenue: 15000000,
      profit: -55000000,
      roiPercentage: -78.6,
      breakeven: '9개월 후'
    },
    scenarios: {
      conservative: {
        investment: 70000000,
        revenue6Month: 12000000,
        revenue12Month: 50000000,
        roi12Month: -28.6,
        breakeven: '13개월'
      },
      realistic: {
        investment: 70000000,
        revenue6Month: 15000000,
        revenue12Month: 80000000,
        roi12Month: 14.3,
        breakeven: '9개월'
      },
      aggressive: {
        investment: 70000000,
        revenue6Month: 20000000,
        revenue12Month: 120000000,
        roi12Month: 71.4,
        breakeven: '6개월'
      }
    },
    channelROI: [
      {
        channel: '인스타그램',
        investment: 15000000,
        revenue: 6000000,
        roi: -60,
        contribution: '40%'
      }
    ]
  },
  costOptimization: {
    areas: [
      {
        area: '콘텐츠 제작',
        currentCost: 9000000,
        optimizedCost: 6000000,
        savings: 3000000,
        method: '자동화 도구 + 템플릿',
        qualityImpact: '최소'
      }
    ],
    totalSavingsPotential: 8000000
  },
  financialPlan: {
    monthlyOutflow: [
      {
        month: 1,
        expense: 12000000,
        budget: 10000000,
        variance: -2000000,
        notes: '추가 콘텐츠 비용'
      }
    ],
    cashFlow: {
      month1: -12000000,
      month6: -55000000,
      month12: -5000000
    }
  },
  recommendation: {
    verdict: 'PROCEED-WITH-CAUTION',
    rationale: '초기 투자 대비 수익 회수에 시간이 걸리지만, 장기적으로 성장 가능성 높음',
    conditions: [
      '6개월 이상 지속 가능한 예산 확보',
      '단계별 목표 달성 모니터링',
      '월간 리뷰 및 조정'
    ],
    expectedReturn: 80000000,
    riskLevel: 'medium'
  }
}
