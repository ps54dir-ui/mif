/**
 * 전환 최적화 모듈
 * GA4 전환율, 재방문율, 상세페이지 점수 분석
 */

export interface GA4Metrics {
  visitors: number
  conversions: number
  conversionRate: number // CVR (%)
  bounceRate: number // 이탈률 (%)
  avgSessionDuration: number // 평균 세션 시간 (초)
  pagesPerSession: number
}

export interface ReturnVisitorMetrics {
  newVisitors: number
  returnVisitors: number
  returnRate: number // 재방문율 (%)
  avgDaysBetweenVisits: number
  loyaltyScore: number // 0-100
}

export interface ProductPageMetrics {
  pageUrl: string
  views: number
  timeOnPage: number // 평균 체류 시간 (초)
  bounceRate: number
  conversionRate: number
  persuasionScore: number // 설득력 점수 0-100
  issues: string[]
}

/**
 * 인과관계 분석
 */
export interface CausalityAnalysis {
  insight: string
  cause: string
  effect: string
  recommendation: string
  priority: 'HIGH' | 'MEDIUM' | 'LOW'
}

/**
 * 통합 진단 보고서 생성
 */
export function generateDiagnosticReport(
  ga4Metrics: GA4Metrics,
  returnMetrics: ReturnVisitorMetrics,
  pageMetrics: ProductPageMetrics[],
  channelScores: Record<string, number>
): CausalityAnalysis[] {
  const analyses: CausalityAnalysis[] = []
  
  // 유튜브 유입은 좋으나 전환율이 낮은 경우
  if (channelScores.youtube >= 90 && ga4Metrics.conversionRate < 2.5) {
    const avgPersuasionScore = pageMetrics.reduce((sum, p) => sum + p.persuasionScore, 0) / pageMetrics.length
    
    if (avgPersuasionScore < 70) {
      analyses.push({
        insight: '유튜브 유입(노출)은 좋으나, 상세페이지의 설득력이 부족해 전환율이 낮고 재방문율이 떨어집니다.',
        cause: '상세페이지 설득력 부족 (평균 설득력 점수: ' + Math.round(avgPersuasionScore) + '점)',
        effect: '전환율 ' + ga4Metrics.conversionRate + '% (목표 대비 낮음), 재방문율 ' + returnMetrics.returnRate + '%',
        recommendation: '상세페이지 콘텐츠 개선, 제품 사진/영상 강화, 리뷰 섹션 확대, CTA 버튼 최적화',
        priority: 'HIGH'
      })
    }
  }
  
  // 이탈률이 높은 경우
  if (ga4Metrics.bounceRate > 60) {
    analyses.push({
      insight: '이탈률이 높아 초기 관심 전환이 어렵습니다.',
      cause: '랜딩 페이지 메시지와 검색 의도 불일치, 페이지 로딩 속도 저하',
      effect: '이탈률 ' + ga4Metrics.bounceRate + '%, 평균 세션 시간 ' + Math.round(ga4Metrics.avgSessionDuration / 60) + '분',
      recommendation: '랜딩 페이지 메시지 최적화, 로딩 속도 개선, 모바일 최적화 강화',
      priority: 'HIGH'
    })
  }
  
  // 재방문율이 낮은 경우
  if (returnMetrics.returnRate < 20) {
    analyses.push({
      insight: '재방문율이 낮아 고객 유지가 어렵습니다.',
      cause: '첫 구매 후 재구매 유도 부족, 브랜드 충성도 프로그램 미흡',
      effect: '재방문율 ' + returnMetrics.returnRate + '%, 충성도 점수 ' + returnMetrics.loyaltyScore + '점',
      recommendation: '리타겟팅 광고 강화, 재구매 혜택 프로그램 도입, 이메일 마케팅 활성화',
      priority: 'MEDIUM'
    })
  }
  
  // 상세페이지 체류 시간이 짧은 경우
  const avgTimeOnPage = pageMetrics.reduce((sum, p) => sum + p.timeOnPage, 0) / pageMetrics.length
  if (avgTimeOnPage < 30) {
    analyses.push({
      insight: '상세페이지 체류 시간이 짧아 제품 정보 전달이 부족합니다.',
      cause: '콘텐츠 부족, 시각적 매력도 저하, 정보 구조화 미흡',
      effect: '평균 체류 시간 ' + Math.round(avgTimeOnPage) + '초, 전환율 저하',
      recommendation: '제품 상세 정보 확대, 고품질 이미지/영상 추가, 비교표 및 FAQ 섹션 추가',
      priority: 'MEDIUM'
    })
  }
  
  return analyses
}
