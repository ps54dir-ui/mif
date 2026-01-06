/**
 * Layer 3 (시장 보호) 모의 데이터
 * 경쟁사 감시, 악플 감시, 신고 도구 데이터
 */

// 경쟁사 부정행위 감지 데이터
export const nikeCompetitorAnalysis = {
  monitoredCompetitors: [
    {
      companyName: '경쟁사 A',
      category: '스포츠웨어',
      marketShare: 15.2,
      fraudDetection: {
        fakeTrafficDetected: true,
        fakeReviewsDetected: true,
        priceManipulation: false,
        falseAdvertising: false
      },
      details: {
        fakeTraffic: {
          trafficPatternAnomalies: ['비정상적인 트래픽 급증 패턴', '봇 활동 의심'],
          botActivity: 23,
          proxyUsage: 15,
          suspiciousSources: ['프록시 네트워크', 'VPN 서비스']
        },
        fakeReviews: {
          plagiarizedReviews: 12,
          coordinatedReviews: 8,
          ratingAnomalies: ['동시 다발적 5점 리뷰', '유사 문구 반복'],
          suspiciousReviewers: 20
        },
        pricing: {
          artificialDiscounts: [],
          priceDumping: false,
          originalPriceInflation: 0,
          flashSaleAbuse: false
        },
        advertising: {
          unverifiableClaims: [],
          fakeTestimonials: 0,
          manipulatedImages: 0,
          misleadingStatements: []
        }
      },
      riskLevel: 'high' as const,
      threatScore: 72,
      impactOnYou: {
        unfairAdvantage: '가짜 리뷰와 트래픽으로 검색 순위 상승',
        lostRevenue: 5000000,
        reputationDamage: '시장 혼란 유발'
      }
    },
    {
      companyName: '경쟁사 B',
      category: '운동화',
      marketShare: 8.5,
      fraudDetection: {
        fakeTrafficDetected: false,
        fakeReviewsDetected: false,
        priceManipulation: true,
        falseAdvertising: false
      },
      details: {
        fakeTraffic: {
          trafficPatternAnomalies: [],
          botActivity: 0,
          proxyUsage: 0,
          suspiciousSources: []
        },
        fakeReviews: {
          plagiarizedReviews: 0,
          coordinatedReviews: 0,
          ratingAnomalies: [],
          suspiciousReviewers: 0
        },
        pricing: {
          artificialDiscounts: ['할인가 조작 의심'],
          priceDumping: true,
          originalPriceInflation: 45,
          flashSaleAbuse: true
        },
        advertising: {
          unverifiableClaims: [],
          fakeTestimonials: 0,
          manipulatedImages: 0,
          misleadingStatements: []
        }
      },
      riskLevel: 'medium' as const,
      threatScore: 55,
      impactOnYou: {
        unfairAdvantage: '불공정 가격 경쟁',
        lostRevenue: 2000000,
        reputationDamage: '시장 왜곡'
      }
    }
  ],
  ethicalCompetitors: [
    {
      name: '경쟁사 C',
      complianceScore: 88,
      ethicalPractices: ['정당한 마케팅', '투명한 가격 정책', '실제 고객 리뷰'],
      benchmarkingValue: 85
    }
  ]
}

// 악플/공격 감시 데이터
export const nikeMaliciousReviews = {
  maliciousReviews: [
    {
      reviewId: 'rev_001',
      reviewerName: 'user_xxx',
      content: '이 회사 제품이 너무 나쁩니다. 구매하지 마세요.',
      rating: 1,
      maliceIndicators: {
        fakeAccount: true,
        coordinatedAttack: true,
        competitorInitiated: true,
        botGenerated: false
      },
      authenticityScore: 15,
      isRealCustomer: false,
      recommendedAction: 'flag' as const,
      legalEvidenceValue: 'high' as const,
      canSue: true
    },
    {
      reviewId: 'rev_002',
      reviewerName: 'reviewer_abc',
      content: '가짜 제품 같아요. 절대 사지 마세요.',
      rating: 1,
      maliceIndicators: {
        fakeAccount: true,
        coordinatedAttack: true,
        competitorInitiated: false,
        botGenerated: true
      },
      authenticityScore: 20,
      isRealCustomer: false,
      recommendedAction: 'report' as const,
      legalEvidenceValue: 'medium' as const,
      canSue: false
    }
  ],
  coordinatedAttacks: [
    {
      attackId: 'attack_001',
      attackDate: new Date('2024-01-15'),
      attackerProfile: {
        type: 'competitor' as const,
        identifiedCompetitor: '경쟁사 A',
        motivation: '경쟁사가 조직적으로 부정 리뷰 공격 수행'
      },
      attackScale: {
        reviewCount: 15,
        period: '2024-01-15 ~ 2024-01-17',
        frequency: 5,
        impactOnRating: -0.3
      },
      evidence: {
        identicalContentAnalysis: true,
        timingPatternAnalysis: true,
        reviewerNetworkAnalysis: true,
        ipAddressClustering: true,
        writingStyleAnalysis: true
      },
      reportOptions: {
        reportToPlatform: {
          available: true,
          successRate: 85,
          timeline: '7-14일'
        },
        reportToPolice: {
          available: true,
          requiresEvidence: true,
          charge: '명예훼손, 허위사실 유포'
        },
        legalAction: {
          available: true,
          damagesClaim: 5000000,
          proofNeeded: 'IP 주소, 리뷰 패턴 분석 결과'
        }
      }
    }
  ],
  competitorInvolvement: {
    involvedCompetitors: ['경쟁사 A'],
    evidenceOfInvolvement: ['동일 IP 주소', '유사 리뷰 패턴', '타이밍 분석'],
    legalActionAvailable: true,
    canSeekDamages: true
  }
}

// 신고 도구 데이터
export const nikeReportingTools = {
  evidenceCollection: {
    screenshots: ['screenshot_001.png', 'screenshot_002.png'],
    dataAnalysis: {
      statisticalEvidence: '15건의 리뷰가 동일 패턴으로 작성됨',
      patternAnalysis: '모든 리뷰가 2일 내에 집중 작성됨',
      timeline: '2024-01-15 10:00 ~ 2024-01-17 18:00'
    },
    expertOpinion: '전문가 분석 결과, 조직적인 부정 행위로 판단됨',
    legalStrength: 'strong' as const
  },
  platformReport: {
    reportId: 'PLATFORM-REPORT-001',
    platform: 'naver_smart_store' as const,
    submittedDate: new Date('2024-01-18'),
    violationType: '부정 리뷰 및 허위 정보 유포',
    evidenceSummary: '15건의 가짜 리뷰 및 조직적 공격 감지',
    expectedOutcome: {
      removalLikelihood: 85,
      timeline: '7-14일',
      appealAvailable: true
    },
    trackingUrl: 'https://platform.naver.com/report/PLATFORM-REPORT-001'
  },
  policeReport: {
    offenseType: 'defamation' as 'fraud' | 'defamation' | 'intellectual_property_theft',
    suspectInfo: '경쟁사 A (추정)',
    evidenceSummary: '조직적 명예훼손 및 허위사실 유포',
    applicableLaws: ['명예훼손죄', '정보통신망법', '부정경쟁방지법'],
    requiredDocuments: ['증거 자료', '피해 증명', '신원 확인서'],
    nextSteps: ['관할 경찰서 방문', '고소장 제출', '수사 진행 대기'],
    estimatedTimeline: '2-3개월'
  },
  lawsuitPreparation: {
    caseType: 'civil_lawsuit' as const,
    legalGrounds: ['명예훼손', '영업방해', '부정경쟁'],
    damagesClaim: {
      actualDamages: 5000000,
      lostProfit: 10000000,
      exemplaryDamages: 5000000,
      totalClaim: 20000000
    },
    evidenceStrength: 'strong' as const,
    winProbability: 75,
    estimatedCost: {
      attorneyFees: 5000000,
      courtFees: 500000,
      expertWitness: 2000000
    },
    estimatedDuration: '6-12개월'
  }
}
