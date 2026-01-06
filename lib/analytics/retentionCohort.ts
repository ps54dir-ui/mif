/**
 * 재방문 코호트 및 LTV 분석
 */

export interface RetentionCohort {
  cohort: string // 예: '2024-01', '2024-02'
  totalUsers: number
  week1: number // 1주차 재방문율
  week2: number
  week3: number
  week4: number
  month2: number // 2개월차 재방문율
  month3: number
  ltv: number // Lifetime Value
  avgOrderValue: number
  purchaseFrequency: number
}

export interface LTVAnalysis {
  averageLTV: number
  highValueSegment: {
    percentage: number
    avgLTV: number
    characteristics: string[]
  }
  lowValueSegment: {
    percentage: number
    avgLTV: number
    characteristics: string[]
  }
  recommendations: string[]
}

/**
 * 재방문 코호트 데이터 생성
 */
export function generateRetentionCohortData(): RetentionCohort[] {
  const cohorts: RetentionCohort[] = []
  const months = ['2024-01', '2024-02', '2024-03', '2024-04']
  
  months.forEach((month, idx) => {
    const baseRetention = 25 - (idx * 2) // 점진적 감소 시뮬레이션
    cohorts.push({
      cohort: month,
      totalUsers: 10000 + (idx * 2000),
      week1: baseRetention + Math.random() * 5,
      week2: baseRetention * 0.7 + Math.random() * 3,
      week3: baseRetention * 0.5 + Math.random() * 2,
      week4: baseRetention * 0.4 + Math.random() * 2,
      month2: baseRetention * 0.3 + Math.random() * 2,
      month3: baseRetention * 0.2 + Math.random() * 1,
      ltv: 150000 + (idx * 10000),
      avgOrderValue: 120000 + (idx * 5000),
      purchaseFrequency: 1.2 + (idx * 0.1)
    })
  })
  
  return cohorts
}

/**
 * LTV 분석
 */
export function analyzeLTV(cohorts: RetentionCohort[]): LTVAnalysis {
  const avgLTV = cohorts.reduce((sum, c) => sum + c.ltv, 0) / cohorts.length
  const sortedByLTV = [...cohorts].sort((a, b) => b.ltv - a.ltv)
  const highValueCount = Math.ceil(cohorts.length * 0.2) // 상위 20%
  const lowValueCount = Math.ceil(cohorts.length * 0.3) // 하위 30%
  
  const highValueSegment = {
    percentage: 20,
    avgLTV: sortedByLTV.slice(0, highValueCount).reduce((sum, c) => sum + c.ltv, 0) / highValueCount,
    characteristics: [
      '재방문율이 높음 (월 30% 이상)',
      '평균 주문 금액이 높음 (15만원 이상)',
      '구매 빈도가 높음 (월 1.5회 이상)',
      '유튜브/블로그 유입 비중이 높음'
    ]
  }
  
  const lowValueSegment = {
    percentage: 30,
    avgLTV: sortedByLTV.slice(-lowValueCount).reduce((sum, c) => sum + c.ltv, 0) / lowValueCount,
    characteristics: [
      '재방문율이 낮음 (월 15% 미만)',
      '평균 주문 금액이 낮음 (10만원 미만)',
      '구매 빈도가 낮음 (월 1회 미만)',
      '메타 광고/인스타그램 유입 비중이 높음'
    ]
  }
  
  const recommendations: string[] = []
  
  if (avgLTV < 150000) {
    recommendations.push('LTV가 낮습니다. 재방문율을 높이기 위한 팬덤 형성 전략이 필요합니다.')
  }
  
  if (lowValueSegment.avgLTV < 100000) {
    recommendations.push('하위 30% 세그먼트의 LTV가 매우 낮습니다. 이탈 고객을 위한 리타겟팅 전략을 수립하세요.')
  }
  
  if (highValueSegment.avgLTV > 200000) {
    recommendations.push('상위 20% 세그먼트의 LTV가 우수합니다. 이 고객층을 확대하는 전략을 수립하세요.')
  }
  
  return {
    averageLTV: Math.round(avgLTV),
    highValueSegment,
    lowValueSegment,
    recommendations
  }
}
