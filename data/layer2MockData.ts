/**
 * Layer 2 (컴플라이언스) 모의 데이터
 * 규정 준수, 위험 자가진단, 스코어카드, 개선 계획 데이터
 */

// 규정 준수 세부 검증 데이터
export const nikeComplianceValidation = {
  koreanLawValidation: {
    ecommerceLaw: {
      name: '전자상거래 소비자 보호법',
      checks: [
        { item: '필수 표시 사항', passed: true, severity: 'critical' as const },
        { item: '상품 정보 표시', passed: true, severity: 'critical' as const },
        { item: '과장된 표현 금지', passed: true, severity: 'high' as const },
        { item: '냉각기간 제공', passed: true, severity: 'high' as const }
      ],
      violationCount: 0,
      maxFine: '3000만원',
      status: 'compliant' as const
    },
    unfairCompetitionLaw: {
      name: '부정경쟁방지 및 영업비밀 보호법',
      checks: [
        { item: '가격 공정성', passed: true, severity: 'critical' as const },
        { item: '광고 정직성', passed: true, severity: 'critical' as const },
        { item: '영업 방해 금지', passed: true, severity: 'high' as const }
      ],
      violationCount: 0,
      maxFine: '5000만원',
      status: 'compliant' as const
    },
    advertisingLaw: {
      name: '광고법 (상표법 포함)',
      checks: [
        { item: '광고 표시 명확성', passed: true, severity: 'high' as const },
        { item: '비교 광고 공정성', passed: true, severity: 'high' as const },
        { item: '특별 청약 정직성', passed: true, severity: 'medium' as const }
      ],
      violationCount: 0,
      status: 'compliant' as const
    },
    personalInfoLaw: {
      name: '개인정보보호법',
      checks: [
        { item: '명시적 동의', passed: true, severity: 'critical' as const },
        { item: '보안 조치', passed: true, severity: 'critical' as const },
        { item: '제3자 공유 동의', passed: true, severity: 'high' as const },
        { item: '데이터 접근권 제공', passed: true, severity: 'high' as const }
      ],
      violationCount: 0,
      maxFine: '50억원',
      status: 'compliant' as const
    },
    priceDisplayLaw: {
      name: '가격 표시법',
      checks: [
        { item: '최종 가격 명확 표시', passed: true, severity: 'critical' as const },
        { item: '숨겨진 비용 금지', passed: true, severity: 'critical' as const },
        { item: '원가 표시 정확성', passed: true, severity: 'high' as const },
        { item: '할인 근거 명확성', passed: true, severity: 'high' as const }
      ],
      violationCount: 0,
      status: 'compliant' as const
    }
  },
  internationalLawValidation: {
    gdpr: {
      name: 'GDPR (EU)',
      applicable: true,
      checks: [
        { item: 'DPO 필수 여부', required: false, passed: true },
        { item: '데이터 처리 계약', passed: true },
        { item: '72시간 신고', passed: true }
      ],
      maxFine: '€20M or 4% revenue'
    },
    ccpa: {
      name: 'CCPA (California)',
      applicable: true,
      checks: [
        { item: 'Opt-in 메커니즘', passed: true },
        { item: 'Opt-out 메커니즘', passed: true },
        { item: '데이터 접근권', passed: true }
      ],
      maxFine: '$7,500 per violation'
    },
    fta: {
      name: 'FTA 규정',
      checks: [
        { item: '원산지 표시', passed: true },
        { item: '국가 차별 금지', passed: true }
      ]
    }
  },
  platformPolicyValidation: {
    naver: {
      platform: '네이버 스마트스토어',
      checks: [
        { item: '금지 상품 판매 안 함', passed: true, severity: 'critical' as const },
        { item: '정확한 카테고리', passed: true, severity: 'high' as const },
        { item: '고품질 이미지', passed: true, severity: 'medium' as const },
        { item: '리뷰 조작 금지', passed: true, severity: 'critical' as const }
      ],
      violations: [],
      suspensionRisk: 'none' as const
    },
    coupang: {
      platform: '쿠팡',
      checks: [
        { item: '배송 시간 준수', passed: true, severity: 'critical' as const },
        { item: '반품/환불 정책', passed: true, severity: 'high' as const },
        { item: '가격 정책 준수', passed: true, severity: 'high' as const }
      ],
      violations: [],
      suspensionRisk: 'none' as const
    },
    google: {
      platform: '구글 쇼핑',
      checks: [
        { item: '신원 확인', passed: true, severity: 'critical' as const },
        { item: '정책 준수', passed: true, severity: 'high' as const }
      ],
      violations: []
    }
  },
  overallComplianceScore: 92,
  complianceRating: 'AA' as const,
  riskLevel: 'low' as const,
  immediateActions: []
}

// 위험 자가진단 데이터 타입
type RiskLevel = 'safe' | 'warning' | 'critical'

interface RiskCategory {
  name: string
  questions: Array<{
    id: string
    question: string
    riskIfYes: 'critical' | 'high' | 'medium'
    fineAmount?: string
    example?: string
    consequence?: string
    detection?: string
    violation?: string
    breachRisk?: boolean
    legalRequired?: string
    legalAction?: string
    platformAction?: string
    yourAnswer: boolean
  }>
  riskScore: number
  status: RiskLevel
}

// 위험 자가진단 데이터
export const nikeRiskDiagnosis: {
  categories: {
    pricing: RiskCategory
    advertising: RiskCategory
    traffic: RiskCategory
    reviews: RiskCategory
    dataPrivacy: RiskCategory
    copyrightIP: RiskCategory
    spam: RiskCategory
  }
  overallRiskScore: number
  riskLevel: RiskLevel
  criticalIssues: string[]
  immediateActions: Array<{ action: string; timeline: string; consequence: string }>
} = {
  categories: {
    pricing: {
      name: '가격 관련',
      questions: [
        {
          id: 'price_1',
          question: '원가보다 훨씬 높은 가격으로 올렸다가 할인하나요?',
          riskIfYes: 'critical' as const,
          fineAmount: '500만원~3000만원',
          yourAnswer: false
        },
        {
          id: 'price_2',
          question: '같은 상품을 경쟁사보다 훨씬 비싸게 파나요?',
          riskIfYes: 'medium' as const,
          yourAnswer: false
        },
        {
          id: 'price_3',
          question: '가격을 숨겨두고 나중에 추가 비용을 청구하나요?',
          riskIfYes: 'high' as const,
          yourAnswer: false
        }
      ],
      riskScore: 0,
      status: 'safe' as RiskLevel
    },
    advertising: {
      name: '광고 관련',
      questions: [
        {
          id: 'ad_1',
          question: '과학적 증거 없이 상품 효능을 주장하나요?',
          riskIfYes: 'critical' as const,
          example: '"3개월에 10kg 감량 보장"',
          yourAnswer: false
        },
        {
          id: 'ad_2',
          question: '가짜 고객 후기나 추천을 사용하나요?',
          riskIfYes: 'critical' as const,
          fineAmount: '허위광고 금지법: 최대 벌금',
          yourAnswer: false
        },
        {
          id: 'ad_3',
          question: '합성/편집된 비포-애프터 이미지를 쓰나요?',
          riskIfYes: 'high' as const,
          yourAnswer: false
        }
      ],
      riskScore: 0,
      status: 'safe' as RiskLevel
    },
    traffic: {
      name: '트래픽 관련',
      questions: [
        {
          id: 'traffic_1',
          question: '가짜 트래픽을 구매했거나 봇을 사용했나요?',
          riskIfYes: 'critical' as const,
          consequence: '계정 정지, 벌금, 평판 손상',
          yourAnswer: false
        },
        {
          id: 'traffic_2',
          question: '프록시나 VPN을 사용해서 트래픽을 부풀렸나요?',
          riskIfYes: 'critical' as const,
          detection: '플랫폼이 자동 감지',
          yourAnswer: false
        },
        {
          id: 'traffic_3',
          question: 'SEO 조작(블랙햇 기법)을 사용했나요?',
          riskIfYes: 'high' as const,
          consequence: '구글 검색 제외',
          yourAnswer: false
        }
      ],
      riskScore: 0,
      status: 'safe' as RiskLevel
    },
    reviews: {
      name: '리뷰 관련',
      questions: [
        {
          id: 'review_1',
          question: '가짜 리뷰를 구매했거나 의뢰했나요?',
          riskIfYes: 'critical' as const,
          fineAmount: '부정경쟁방지법: 최대 3억원',
          yourAnswer: false
        },
        {
          id: 'review_2',
          question: '리뷰 작성을 조건으로 상품 할인을 했나요?',
          riskIfYes: 'high' as const,
          violation: '플랫폼 정책 위반',
          yourAnswer: false
        },
        {
          id: 'review_3',
          question: '직원이나 지인이 작성한 리뷰를 올렸나요?',
          riskIfYes: 'medium' as const,
          consequence: '리뷰 삭제, 계정 경고',
          yourAnswer: false
        }
      ],
      riskScore: 0,
      status: 'safe' as RiskLevel
    },
    dataPrivacy: {
      name: '개인정보 보호',
      questions: [
        {
          id: 'privacy_1',
          question: '고객 동의 없이 개인정보를 수집하나요?',
          riskIfYes: 'critical' as const,
          fineAmount: '개인정보보호법: 최대 50억원',
          yourAnswer: false
        },
        {
          id: 'privacy_2',
          question: '고객 데이터를 암호화하지 않나요?',
          riskIfYes: 'high' as const,
          breachRisk: true,
          yourAnswer: false
        },
        {
          id: 'privacy_3',
          question: '개인정보를 제3자에게 공유하나요?',
          riskIfYes: 'high' as const,
          legalRequired: '고객 동의 필수',
          yourAnswer: false
        }
      ],
      riskScore: 0,
      status: 'safe' as RiskLevel
    },
    copyrightIP: {
      name: '지적재산권',
      questions: [
        {
          id: 'ip_1',
          question: '다른 회사의 이미지나 콘텐츠를 무단으로 사용하나요?',
          riskIfYes: 'high' as const,
          fineAmount: '저작권법: 최대 5000만원',
          yourAnswer: false
        },
        {
          id: 'ip_2',
          question: '경쟁사 제품 설명을 복사해서 쓰나요?',
          riskIfYes: 'medium' as const,
          legalAction: '저작권 침해 고소 가능',
          yourAnswer: false
        }
      ],
      riskScore: 0,
      status: 'safe' as RiskLevel
    },
    spam: {
      name: '스팸/악용',
      questions: [
        {
          id: 'spam_1',
          question: '고객 동의 없이 스팸 메일/SMS를 보내나요?',
          riskIfYes: 'high' as const,
          violation: '정보통신망법',
          yourAnswer: false
        },
        {
          id: 'spam_2',
          question: '자동화 봇으로 대량 문의를 보내나요?',
          riskIfYes: 'medium' as const,
          platformAction: '계정 정지',
          yourAnswer: false
        }
      ],
      riskScore: 0,
      status: 'safe' as RiskLevel
    }
  },
  overallRiskScore: 0,
  riskLevel: 'safe' as RiskLevel,
  criticalIssues: [],
  immediateActions: [] as Array<{ action: string; timeline: string; consequence: string }>
}

// 컴플라이언스 스코어카드 데이터
export const nikeComplianceScorecard = {
  companyName: '나이키',
  issuedDate: new Date(),
  validUntil: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90일 후
  categoryScores: {
    pricingEthics: {
      weight: 15,
      score: 95,
      details: ['가격 공정성 우수', '할인 정책 투명']
    },
    advertisingHonesty: {
      weight: 20,
      score: 92,
      details: ['광고 내용 정직', '과장 표현 없음']
    },
    trafficLegitimacy: {
      weight: 15,
      score: 98,
      details: ['정당한 트래픽', '봇 사용 없음']
    },
    reviewAuthenticity: {
      weight: 15,
      score: 90,
      details: ['리뷰 정당성 확인', '조작 없음']
    },
    dataPrivacy: {
      weight: 20,
      score: 95,
      details: ['개인정보 보호 우수', '암호화 적용']
    },
    intellectualProperty: {
      weight: 10,
      score: 100,
      details: ['지적재산권 준수', '무단 사용 없음']
    },
    consumerProtection: {
      weight: 5,
      score: 88,
      details: ['소비자 보호 정책 명확']
    }
  },
  overallScore: 93,
  rating: 'AA' as const,
  certificate: {
    uniqueId: 'COMP-2024-NIKE-001',
    verificationUrl: 'https://verify.example.com/COMP-2024-NIKE-001',
    canDisplayBadge: true
  },
  improvementsNeeded: [],
  legalStatus: {
    violationsFound: false,
    criticalIssues: [],
    recommendation: '현재 모든 법규를 준수하고 있습니다.'
  }
}

// 자동 개선 계획 데이터 타입
export interface Violation {
  violation: string
  applicableLaw: string
  fineRisk: string
  severity: 'critical' | 'high' | 'medium' | 'low'
  requiredActions: Array<{
    action: string
    deadline: string
    responsible: string
    status: 'pending' | 'in_progress' | 'completed'
  }>
  remediationSteps: string[]
  verification: {
    method: string
    expectedResult: string
    howToVerify: string
  }
  prevention: {
    policyChange: string
    staffTraining: string
    monitoring: string
  }
  status: 'pending' | 'in_progress' | 'completed'
}

export interface RemediationPlan {
  violations: Violation[]
  totalFineRisk: number
  estimatedResolutionTime: string
  priorityOrder: string[]
  checklist: Array<{
    item: string
    completed: boolean
    deadline: string
  }>
}

// 자동 개선 계획 데이터
export const nikeRemediationPlan: RemediationPlan = {
  violations: [],
  totalFineRisk: 0,
  estimatedResolutionTime: 'N/A',
  priorityOrder: [],
  checklist: []
}
