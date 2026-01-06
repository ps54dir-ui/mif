/**
 * 데이터 기반 전략 수립 리포트
 * GA4 데이터와 심리 분석을 통합한 전략 리포트
 */

export interface DataDrivenStrategy {
  id: string
  title: string
  dataBasis: {
    ga4Metric: string
    ga4Value: number
    psychologyMetric: string
    psychologyValue: number
    correlation: number
  }
  insight: string
  action: string
  expectedImpact: string
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW'
}

export interface DataDrivenReport {
  strategies: DataDrivenStrategy[]
  overallInsight: string
  keyMetrics: {
    acquisition: number
    engagement: number
    conversion: number
    psychologyScore: number
  }
}

/**
 * 데이터 기반 전략 리포트 생성
 */
export function generateDataDrivenReport(
  ga4Acquisition: number,
  ga4Engagement: number,
  ga4Conversion: number,
  psychologyScore: number,
  correlation: number
): DataDrivenReport {
  const strategies: DataDrivenStrategy[] = []
  
  // 전략 1: 심리적 자극과 유입률 상관관계 기반
  if (correlation > 0.7 && ga4Engagement < 40) {
    strategies.push({
      id: 'psychology-engagement',
      title: '심리적 자극 콘텐츠로 참여도 개선',
      dataBasis: {
        ga4Metric: '참여율',
        ga4Value: ga4Engagement,
        psychologyMetric: '심리적 자극',
        psychologyValue: psychologyScore,
        correlation
      },
      insight: `심리적 자극(${psychologyScore}점)과 참여율(${ga4Engagement.toFixed(1)}%)의 상관관계가 ${(correlation * 100).toFixed(0)}%로 높습니다.`,
      action: '도파민 자극 요소(보상, 성취감)를 강화한 콘텐츠를 발행하세요.',
      expectedImpact: '참여율 15% 증가 예상',
      priority: 'HIGH'
    })
  }
  
  // 전략 2: 획득과 전환 불일치 분석
  if (ga4Acquisition > 50000 && ga4Conversion < 3.0) {
    strategies.push({
      id: 'acquisition-conversion',
      title: '유입은 많으나 전환율이 낮음 - 상세페이지 개선 필요',
      dataBasis: {
        ga4Metric: '사용자 획득',
        ga4Value: ga4Acquisition,
        psychologyMetric: '전환율',
        psychologyValue: ga4Conversion,
        correlation: 0.3
      },
      insight: `사용자 획득(${ga4Acquisition.toLocaleString()}명)은 높으나 전환율(${ga4Conversion.toFixed(2)}%)이 낮습니다.`,
      action: '상세페이지 상단에 신뢰 신호(리뷰, 인증)를 배치하여 이탈률을 낮추세요.',
      expectedImpact: '전환율 1.2%p 상승 예상',
      priority: 'CRITICAL'
    })
  }
  
  // 전략 3: 참여도와 전환율 연계
  if (ga4Engagement > 45 && ga4Conversion < 2.5) {
    strategies.push({
      id: 'engagement-conversion',
      title: '참여도는 높으나 전환율이 낮음 - CTA 최적화 필요',
      dataBasis: {
        ga4Metric: '참여율',
        ga4Value: ga4Engagement,
        psychologyMetric: '전환율',
        psychologyValue: ga4Conversion,
        correlation: 0.5
      },
      insight: `참여율(${ga4Engagement.toFixed(1)}%)은 높으나 전환율(${ga4Conversion.toFixed(2)}%)이 낮습니다.`,
      action: 'CTA 버튼 위치와 메시지를 최적화하여 전환을 유도하세요.',
      expectedImpact: '전환율 0.8%p 상승 예상',
      priority: 'HIGH'
    })
  }
  
  // 전략 4: 심리 점수와 획득 연계
  if (psychologyScore < 60 && ga4Acquisition < 30000) {
    strategies.push({
      id: 'psychology-acquisition',
      title: '심리 점수가 낮아 유입이 부족 - 바이럴 콘텐츠 강화',
      dataBasis: {
        ga4Metric: '사용자 획득',
        ga4Value: ga4Acquisition,
        psychologyMetric: '심리 점수',
        psychologyValue: psychologyScore,
        correlation: 0.65
      },
      insight: `심리 점수(${psychologyScore}점)가 낮아 사용자 획득(${ga4Acquisition.toLocaleString()}명)이 부족합니다.`,
      action: '바이럴 요소(호기심, 감정, 트렌드)를 강화한 콘텐츠를 발행하세요.',
      expectedImpact: '사용자 획득 30% 증가 예상',
      priority: 'MEDIUM'
    })
  }
  
  const overallInsight = strategies.length > 0
    ? `${strategies.length}개의 데이터 기반 전략이 도출되었습니다. GA4 데이터와 심리 분석을 결합하여 최적의 마케팅 전략을 수립할 수 있습니다.`
    : '현재 데이터 상태가 양호하여 추가 전략이 필요하지 않습니다.'
  
  return {
    strategies: strategies.sort((a, b) => {
      const priorityOrder = { CRITICAL: 4, HIGH: 3, MEDIUM: 2, LOW: 1 }
      return priorityOrder[b.priority] - priorityOrder[a.priority]
    }),
    overallInsight,
    keyMetrics: {
      acquisition: ga4Acquisition,
      engagement: ga4Engagement,
      conversion: ga4Conversion,
      psychologyScore
    }
  }
}
