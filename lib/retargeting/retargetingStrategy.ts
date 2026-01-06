/**
 * 리타겟팅 자동 설계
 * 이탈 고객과 구매 고객 분류 및 심리 상태 기반 전략
 */

export type CustomerSegment = 'purchased' | 'abandoned_cart' | 'bounced' | 'engaged_no_purchase'

export interface CustomerSegmentData {
  segment: CustomerSegment
  count: number
  percentage: number
  psychologyState: {
    emotion: 'positive' | 'neutral' | 'negative' | 'curious'
    engagement: number // 0-100
    purchaseIntent: number // 0-100
  }
  characteristics: string[]
}

export interface RetargetingStrategy {
  segment: CustomerSegment
  strategyName: string
  psychologyApproach: 'dopamine' | 'cortisol' | 'empathy' | 'social_proof'
  message: string
  creativeGuidelines: string[]
  expectedConversionRate: number
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW'
}

/**
 * 고객 세그먼트 분류
 */
export function classifyCustomerSegments(
  totalSessions: number,
  purchases: number,
  abandonedCarts: number,
  bounces: number
): CustomerSegmentData[] {
  const engagedNoPurchase = totalSessions - purchases - abandonedCarts - bounces
  
  return [
    {
      segment: 'purchased',
      count: purchases,
      percentage: (purchases / totalSessions) * 100,
      psychologyState: {
        emotion: 'positive',
        engagement: 90,
        purchaseIntent: 100
      },
      characteristics: [
        '구매 완료 고객',
        '높은 만족도',
        '재구매 가능성 높음',
        '리뷰 작성 의향 있음'
      ]
    },
    {
      segment: 'abandoned_cart',
      count: abandonedCarts,
      percentage: (abandonedCarts / totalSessions) * 100,
      psychologyState: {
        emotion: 'curious',
        engagement: 70,
        purchaseIntent: 60
      },
      characteristics: [
        '장바구니에 담았으나 구매하지 않음',
        '가격 비교 중일 가능성',
        '추가 정보 필요',
        '할인 혜택에 반응 가능'
      ]
    },
    {
      segment: 'bounced',
      count: bounces,
      percentage: (bounces / totalSessions) * 100,
      psychologyState: {
        emotion: 'neutral',
        engagement: 20,
        purchaseIntent: 10
      },
      characteristics: [
        '페이지 즉시 이탈',
        '관심도 낮음',
        '잘못된 유입일 가능성',
        '재방문 가능성 낮음'
      ]
    },
    {
      segment: 'engaged_no_purchase',
      count: engagedNoPurchase,
      percentage: (engagedNoPurchase / totalSessions) * 100,
      psychologyState: {
        emotion: 'curious',
        engagement: 50,
        purchaseIntent: 30
      },
      characteristics: [
        '페이지 탐색은 했으나 구매하지 않음',
        '정보 수집 단계',
        '추가 설득 필요',
        '콘텐츠 마케팅에 반응 가능'
      ]
    }
  ]
}

/**
 * 리타겟팅 전략 생성
 */
export function generateRetargetingStrategies(
  segments: CustomerSegmentData[]
): RetargetingStrategy[] {
  const strategies: RetargetingStrategy[] = []
  
  segments.forEach(segment => {
    if (segment.segment === 'purchased') {
      // 구매 고객 - 팬덤 형성용
      strategies.push({
        segment: 'purchased',
        strategyName: '팬덤 형성 및 재구매 유도',
        psychologyApproach: 'dopamine',
        message: '나이키 커뮤니티의 일원이 되세요! 특별 회원 혜택과 신제품 우선 알림을 받아보세요.',
        creativeGuidelines: [
          '성공 스토리와 커뮤니티 참여 사례 강조',
          '회원 전용 혜택과 VIP 프로그램 소개',
          '신제품 런칭 알림 및 사전 예약 혜택',
          '리뷰 작성 유도 및 리워드 제공'
        ],
        expectedConversionRate: 15.0, // 재구매율
        priority: 'HIGH'
      })
    } else if (segment.segment === 'abandoned_cart') {
      // 장바구니 이탈 고객
      strategies.push({
        segment: 'abandoned_cart',
        strategyName: '장바구니 복귀 유도',
        psychologyApproach: 'cortisol',
        message: '장바구니에 담은 상품이 곧 품절될 수 있습니다. 지금 구매하고 특별 할인을 받으세요!',
        creativeGuidelines: [
          '장바구니에 담은 제품 이미지 재노출',
          '한정 수량/마감 임박 메시지',
          '추가 할인 혜택 제공 (10-15%)',
          '무료 배송 및 반품 보장 강조'
        ],
        expectedConversionRate: 25.0,
        priority: 'CRITICAL'
      })
    } else if (segment.segment === 'bounced') {
      // 이탈 고객
      strategies.push({
        segment: 'bounced',
        strategyName: '재관심 유도',
        psychologyApproach: 'empathy',
        message: '나이키와 함께 새로운 도전을 시작하세요. 당신의 목표를 달성하는 데 도움이 되는 제품을 만나보세요.',
        creativeGuidelines: [
          '사용자의 고민과 니즈를 공감하는 메시지',
          '성공 사례와 스토리텔링',
          '교육 콘텐츠 및 가이드 제공',
          '낮은 진입 장벽 (무료 체험, 샘플 등)'
        ],
        expectedConversionRate: 3.0,
        priority: 'LOW'
      })
    } else if (segment.segment === 'engaged_no_purchase') {
      // 참여했으나 구매하지 않은 고객
      strategies.push({
        segment: 'engaged_no_purchase',
        strategyName: '정보 제공 및 설득 강화',
        psychologyApproach: 'social_proof',
        message: '나이키를 선택한 수많은 고객들의 후기를 확인해보세요. 당신도 그들의 성공 스토리에 동참할 수 있습니다.',
        creativeGuidelines: [
          '리뷰 및 사용자 후기 강조',
          '제품 비교 및 장점 명확히 제시',
          'FAQ 및 고객 문의 답변 제공',
          '비교 구매 가이드 및 추천 제품 제시'
        ],
        expectedConversionRate: 8.0,
        priority: 'MEDIUM'
      })
    }
  })
  
  return strategies
}
