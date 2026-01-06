/**
 * 성과 예측 시뮬레이터
 * 예산이나 전략 변수를 조정했을 때 예상 CVR 및 ROAS 변화 시뮬레이션
 */

export interface SimulationInput {
  budget: number // 예산 (원)
  channel: 'meta' | 'google' | 'youtube' | 'instagram' | 'blog'
  strategy: 'awareness' | 'consideration' | 'conversion' | 'retention'
  creativeQuality: number // 1-10
  targetingPrecision: number // 1-10
  psychologyMatch: number // 0-100, 광고와 상세페이지 심리 일치도
}

export interface SimulationResult {
  expectedImpressions: number
  expectedClicks: number
  expectedCTR: number
  expectedCVR: number
  expectedConversions: number
  expectedRevenue: number
  expectedROAS: number
  expectedCPA: number
  confidence: number // 0-100, 예측 신뢰도
  factors: {
    budgetImpact: number // 예산이 성과에 미치는 영향
    strategyImpact: number // 전략이 성과에 미치는 영향
    creativeImpact: number // 크리에이티브 품질이 성과에 미치는 영향
  }
}

/**
 * 성과 예측 시뮬레이션
 */
export function simulatePerformance(input: SimulationInput): SimulationResult {
  // 기본 지표 (채널별)
  const baseMetrics: Record<string, { ctr: number; cvr: number; cpc: number; avgOrderValue: number }> = {
    meta: { ctr: 5.0, cvr: 3.0, cpc: 40, avgOrderValue: 120000 },
    google: { ctr: 3.5, cvr: 4.0, cpc: 50, avgOrderValue: 150000 },
    youtube: { ctr: 4.5, cvr: 2.5, cpc: 45, avgOrderValue: 130000 },
    instagram: { ctr: 5.5, cvr: 2.8, cpc: 35, avgOrderValue: 110000 },
    blog: { ctr: 2.0, cvr: 1.5, cpc: 20, avgOrderValue: 100000 }
  }
  
  const base = baseMetrics[input.channel]
  
  // 전략별 가중치
  const strategyMultipliers: Record<string, { ctr: number; cvr: number }> = {
    awareness: { ctr: 1.2, cvr: 0.8 },
    consideration: { ctr: 1.0, cvr: 1.0 },
    conversion: { ctr: 0.9, cvr: 1.3 },
    retention: { ctr: 0.8, cvr: 1.5 }
  }
  
  const strategyMultiplier = strategyMultipliers[input.strategy]
  
  // 크리에이티브 품질 영향 (1-10 스케일)
  const creativeMultiplier = 0.7 + (input.creativeQuality / 10) * 0.6 // 0.7 ~ 1.3
  
  // 타겟팅 정밀도 영향
  const targetingMultiplier = 0.8 + (input.targetingPrecision / 10) * 0.4 // 0.8 ~ 1.2
  
  // 심리 일치도 영향
  const psychologyMultiplier = 0.6 + (input.psychologyMatch / 100) * 0.8 // 0.6 ~ 1.4
  
  // 예상 CTR 계산
  const expectedCTR = base.ctr * strategyMultiplier.ctr * creativeMultiplier * targetingMultiplier
  
  // 예상 CVR 계산
  const expectedCVR = base.cvr * strategyMultiplier.cvr * creativeMultiplier * psychologyMultiplier
  
  // 예산 기반 노출수 계산
  const expectedClicks = Math.round((input.budget / base.cpc) * (expectedCTR / 100))
  const expectedImpressions = Math.round(expectedClicks / (expectedCTR / 100))
  
  // 예상 전환수
  const expectedConversions = Math.round(expectedClicks * (expectedCVR / 100))
  
  // 예상 매출
  const expectedRevenue = expectedConversions * base.avgOrderValue
  
  // 예상 ROAS
  const expectedROAS = input.budget > 0 ? expectedRevenue / input.budget : 0
  
  // 예상 CPA
  const expectedCPA = expectedConversions > 0 ? input.budget / expectedConversions : base.cpc * 10
  
  // 신뢰도 계산
  const confidence = Math.round(
    (input.creativeQuality / 10) * 30 +
    (input.targetingPrecision / 10) * 30 +
    (input.psychologyMatch / 100) * 40
  )
  
  // 영향 요인 분석
  const budgetImpact = input.budget > 1000000 ? 1.2 : input.budget > 500000 ? 1.0 : 0.8
  const strategyImpact = strategyMultiplier.ctr * strategyMultiplier.cvr
  const creativeImpact = creativeMultiplier
  
  return {
    expectedImpressions,
    expectedClicks,
    expectedCTR: Math.round(expectedCTR * 100) / 100,
    expectedCVR: Math.round(expectedCVR * 100) / 100,
    expectedConversions,
    expectedRevenue,
    expectedROAS: Math.round(expectedROAS * 100) / 100,
    expectedCPA: Math.round(expectedCPA),
    confidence,
    factors: {
      budgetImpact,
      strategyImpact: Math.round(strategyImpact * 100) / 100,
      creativeImpact: Math.round(creativeImpact * 100) / 100
    }
  }
}

/**
 * 시나리오 비교 시뮬레이션
 */
export function compareScenarios(
  baseScenario: SimulationInput,
  alternativeScenarios: SimulationInput[]
): Array<{ scenario: string; result: SimulationResult; improvement: number }> {
  const baseResult = simulatePerformance(baseScenario)
  
  const comparisons = alternativeScenarios.map(scenario => {
    const result = simulatePerformance(scenario)
    const improvement = ((result.expectedROAS - baseResult.expectedROAS) / baseResult.expectedROAS) * 100
    
    return {
      scenario: `${scenario.channel} - ${scenario.strategy} (예산: ${(scenario.budget / 10000).toFixed(0)}만원)`,
      result,
      improvement: Math.round(improvement * 100) / 100
    }
  })
  
  return comparisons
}
