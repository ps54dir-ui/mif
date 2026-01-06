/**
 * 전략 수립 모듈
 * 진단 결과의 약점을 기반으로 전략을 자동 생성
 */

export interface Weakness {
  channel: string
  score: number
  issue: string
  priority: 'HIGH' | 'MEDIUM' | 'LOW'
}

export interface Strategy {
  id: string
  title: string
  description: string
  targetChannel: string
  actions: string[]
  expectedImpact: number
  priority: 'HIGH' | 'MEDIUM' | 'LOW'
}

/**
 * 진단 결과에서 약점 추출
 */
export function extractWeaknesses(channelScores: Record<string, number>, threshold: number = 75): Weakness[] {
  const weaknesses: Weakness[] = []
  
  const channelIssues: Record<string, string> = {
    community: '리셀 이슈로 인한 신뢰도 저하',
    tiktok: '숏폼 콘텐츠 발견성 부족',
    instagram: 'Z세대 참여율 감소',
    youtube: '리뷰 콘텐츠 다양성 부족'
  }
  
  Object.entries(channelScores).forEach(([channel, score]) => {
    if (score < threshold) {
      weaknesses.push({
        channel,
        score,
        issue: channelIssues[channel] || '성과 개선 필요',
        priority: score < 70 ? 'HIGH' : score < 80 ? 'MEDIUM' : 'LOW'
      })
    }
  })
  
  return weaknesses.sort((a, b) => {
    const priorityOrder = { HIGH: 3, MEDIUM: 2, LOW: 1 }
    return priorityOrder[b.priority] - priorityOrder[a.priority]
  })
}

/**
 * 약점을 기반으로 전략 자동 생성
 */
export function generateStrategies(weaknesses: Weakness[]): Strategy[] {
  const strategies: Strategy[] = []
  
  const strategyTemplates: Record<string, Omit<Strategy, 'id'>> = {
    community: {
      title: '커뮤니티 신뢰도 회복 전략',
      description: '리셀 이슈 해결을 통한 브랜드 신뢰도 향상',
      targetChannel: 'community',
      actions: [
        '공식 채널을 통한 정품 인증 시스템 강화',
        '고객 소통 채널 확대 및 실시간 모니터링',
        '리셀러와의 차별화된 혜택 제공',
        '커뮤니티 내 긍정적 스토리텔링 강화'
      ],
      expectedImpact: 15,
      priority: 'HIGH'
    },
    tiktok: {
      title: '틱톡 발견성 향상 전략',
      description: '숏폼 콘텐츠 최적화를 통한 발견성 지표 개선',
      targetChannel: 'tiktok',
      actions: [
        '트렌딩 해시태그 활용 가이드라인 수립',
        '바이럴 콘텐츠 제작 템플릿 개발',
        '인플루언서 협업 확대',
        '챌린지 캠페인 기획'
      ],
      expectedImpact: 12,
      priority: 'MEDIUM'
    },
    instagram: {
      title: '인스타그램 Z세대 참여율 증대 전략',
      description: '릴스 챌린지 및 UGC 캠페인을 통한 참여율 향상',
      targetChannel: 'instagram',
      actions: [
        '릴스 챌린지 참여율 기반 설득 지수 최우선 순위',
        '인플루언서 협업 확대',
        'UGC 캠페인 강화',
        'Z세대 트렌드 반영 콘텐츠 제작'
      ],
      expectedImpact: 10,
      priority: 'MEDIUM'
    },
    youtube: {
      title: '유튜브 리뷰 콘텐츠 다양성 확대 전략',
      description: '신제품 리뷰 영상 트렌딩 점유율 유지 및 확대',
      targetChannel: 'youtube',
      actions: [
        '리뷰어 협업 강화',
        '장기 콘텐츠 시리즈 기획',
        '다양한 카테고리 리뷰어 발굴',
        '콘텐츠 품질 가이드라인 제공'
      ],
      expectedImpact: 8,
      priority: 'LOW'
    }
  }
  
  weaknesses.forEach((weakness, index) => {
    const template = strategyTemplates[weakness.channel]
    if (template) {
      strategies.push({
        id: `strategy-${Date.now()}-${index}`,
        ...template,
        priority: weakness.priority
      })
    }
  })
  
  return strategies
}

/**
 * 전략을 AI 카피라이팅 엔진으로 전달하기 위한 데이터 포맷팅
 */
export function formatForCopywriting(strategy: Strategy, brandName: string) {
  return {
    brand: brandName,
    strategy: strategy.title,
    description: strategy.description,
    targetChannel: strategy.targetChannel,
    actions: strategy.actions,
    tone: 'professional',
    targetAudience: 'Z세대 및 밀레니얼',
    keyMessage: strategy.description
  }
}
