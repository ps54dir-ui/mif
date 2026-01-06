/**
 * 메타 광고 최적화 전략 자동 제언
 */

export interface AdsOptimizationStrategy {
  id: string
  title: string
  problem: string
  insight: string
  action: string
  expectedImpact: string
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW'
  metrics: {
    currentCTR: number
    currentBounceRate: number
    targetCTR?: number
    targetBounceRate?: number
  }
}

export interface AdsOptimizationReport {
  strategies: AdsOptimizationStrategy[]
  overallInsight: string
  keyFindings: {
    highCTRLowConversion: boolean
    psychologyMismatch: boolean
    attributionGap: boolean
  }
}

/**
 * 메타 광고 최적화 전략 생성
 */
export function generateAdsOptimizationStrategies(
  ctr: number,
  bounceRate: number,
  conversionRate: number,
  psychologyMatchScore: number,
  attributionGap: number
): AdsOptimizationReport {
  const strategies: AdsOptimizationStrategy[] = []
  const keyFindings = {
    highCTRLowConversion: false,
    psychologyMismatch: false,
    attributionGap: false
  }
  
  // 전략 1: CTR은 높으나 전환율이 낮은 경우
  if (ctr > 4.0 && conversionRate < 2.5) {
    keyFindings.highCTRLowConversion = true
    strategies.push({
      id: 'ctr-conversion-gap',
      title: 'CTR은 높으나 전환율이 낮음 - 상세페이지 최적화 필요',
      problem: `메타 광고의 CTR(${ctr.toFixed(2)}%)은 우수하나 전환율(${conversionRate.toFixed(2)}%)이 낮습니다.`,
      insight: '광고 클릭 후 상세페이지에서 이탈하는 사용자가 많습니다. 광고와 상세페이지의 메시지 일관성이 부족할 가능성이 높습니다.',
      action: '상세페이지 상단에 광고와 동일한 모델의 이미지와 메시지를 배치하여 일관성을 확보하세요. 또한 광고에서 강조한 혜택을 상세페이지 초반에 명확히 표시하세요.',
      expectedImpact: '전환율 1.2%p 상승 예상',
      priority: 'CRITICAL',
      metrics: {
        currentCTR: ctr,
        currentBounceRate: bounceRate,
        targetBounceRate: bounceRate * 0.7
      }
    })
  }
  
  // 전략 2: 심리 톤 불일치
  if (psychologyMatchScore < 70) {
    keyFindings.psychologyMismatch = true
    strategies.push({
      id: 'psychology-mismatch',
      title: '광고와 상세페이지 심리 톤 불일치',
      problem: `광고 소재와 상세페이지의 심리 톤 일치도가 ${psychologyMatchScore}점으로 낮습니다.`,
      insight: '광고는 도파민(기대감) 위주이나 상세페이지는 코르티솔(긴급성) 위주이거나 그 반대일 수 있습니다. 이로 인해 사용자가 인지적 부조화를 경험하여 이탈할 수 있습니다.',
      action: '광고 소재의 심리 타입에 맞춰 상세페이지 메시지를 조정하세요. 광고가 도파민 위주라면 상세페이지도 긍정적이고 기대감을 주는 톤으로, 코르티솔 위주라면 긴급성과 결핍감을 강조하는 톤으로 통일하세요.',
      expectedImpact: '이탈률 15% 감소, 전환율 0.8%p 상승 예상',
      priority: 'HIGH',
      metrics: {
        currentCTR: ctr,
        currentBounceRate: bounceRate
      }
    })
  }
  
  // 전략 3: 어트리뷰션 갭
  if (Math.abs(attributionGap) > 500) {
    keyFindings.attributionGap = true
    strategies.push({
      id: 'attribution-gap',
      title: '메타 전환과 GA4 전환 간 어트리뷰션 갭 존재',
      problem: `메타 광고 관리자에서 보고된 전환과 GA4에서 추적된 전환 간 차이가 ${Math.abs(attributionGap).toLocaleString()}건입니다.`,
      insight: '어트리뷰션 모델의 차이로 인해 전환 데이터가 불일치할 수 있습니다. 또한 크로스 디바이스 전환이나 뷰스루 전환이 누락되었을 가능성이 있습니다.',
      action: 'GA4에서 메타 광고 캠페인을 UTM 파라미터로 정확히 추적하고, 어트리뷰션 모델을 조정하세요. 또한 크로스 디바이스 전환을 고려한 분석을 수행하세요.',
      expectedImpact: '전환 추적 정확도 20% 향상',
      priority: 'MEDIUM',
      metrics: {
        currentCTR: ctr,
        currentBounceRate: bounceRate
      }
    })
  }
  
  // 전략 4: 이탈률이 높은 경우
  if (bounceRate > 60) {
    strategies.push({
      id: 'high-bounce-rate',
      title: '상세페이지 이탈률이 높음 - 초반 경험 개선 필요',
      problem: `상세페이지 이탈률이 ${bounceRate.toFixed(1)}%로 높습니다.`,
      insight: '사용자가 광고를 클릭했으나 상세페이지에서 즉시 이탈하고 있습니다. 페이지 로딩 속도나 초반 메시지가 기대와 다를 수 있습니다.',
      action: '상세페이지 상단 3초 내에 광고에서 약속한 혜택을 명확히 표시하고, 로딩 속도를 최적화하세요. 또한 광고와 동일한 시각적 요소(색상, 모델, 제품)를 배치하여 일관성을 확보하세요.',
      expectedImpact: '이탈률 20% 감소 예상',
      priority: 'HIGH',
      metrics: {
        currentCTR: ctr,
        currentBounceRate: bounceRate,
        targetBounceRate: bounceRate * 0.8
      }
    })
  }
  
  const overallInsight = strategies.length > 0
    ? `${strategies.length}개의 최적화 전략이 도출되었습니다. 메타 광고 성과를 개선하기 위해 우선순위에 따라 실행하세요.`
    : '현재 메타 광고 성과가 양호하여 추가 최적화가 필요하지 않습니다.'
  
  return {
    strategies: strategies.sort((a, b) => {
      const priorityOrder = { CRITICAL: 4, HIGH: 3, MEDIUM: 2, LOW: 1 }
      return priorityOrder[b.priority] - priorityOrder[a.priority]
    }),
    overallInsight,
    keyFindings
  }
}
