/**
 * 데이터 기반 시나리오 분석
 * GA4 이탈률과 상세페이지 점수 기반 구체적 가이드라인
 */

export interface DataScenario {
  id: string
  scenario: string
  currentState: {
    metric: string
    value: number
    unit: string
  }
  action: string
  expectedOutcome: {
    metric: string
    improvement: number
    unit: string
    description: string
  }
  confidence: number // 신뢰도 0-100
  dataBasis: string
}

export interface ScenarioAnalysis {
  scenarios: DataScenario[]
  overallRecommendation: string
}

/**
 * 데이터 기반 시나리오 생성
 */
export function generateDataScenarios(
  bounceRate: number,
  conversionRate: number,
  pagePersuasionScore: number,
  avgTimeOnPage: number,
  pagesPerSession: number
): ScenarioAnalysis {
  const scenarios: DataScenario[] = []
  
  // 시나리오 1: 상세페이지 상단 심리적 안심 장치
  if (bounceRate > 60 && pagePersuasionScore < 70) {
    const improvement = (bounceRate - 60) * 0.02 // 이탈률 감소에 따른 전환율 개선
    scenarios.push({
      id: 'top-fold-safety',
      scenario: '상세페이지 상단 3초 내 심리적 안심 장치 배치',
      currentState: {
        metric: '이탈률',
        value: bounceRate,
        unit: '%'
      },
      action: '상단 폴드에 리뷰/인증 배지, 평점, 긍정 리뷰 미리보기 배치',
      expectedOutcome: {
        metric: '전환율',
        improvement: improvement,
        unit: '%',
        description: `전환율이 ${conversionRate.toFixed(2)}%에서 ${(conversionRate + improvement).toFixed(2)}%로 ${improvement.toFixed(2)}%p 상승 예상`
      },
      confidence: 85,
      dataBasis: `현재 이탈률 ${bounceRate.toFixed(1)}%, 상세페이지 설득력 점수 ${pagePersuasionScore}점. 상단 3초 내 신뢰 신호가 이탈률을 ${(bounceRate * 0.15).toFixed(1)}%p 감소시킬 것으로 예측`
    })
  }
  
  // 시나리오 2: 평균 체류 시간 개선
  if (avgTimeOnPage < 30 && pagePersuasionScore < 70) {
    const timeImprovement = (30 - avgTimeOnPage) * 1.5
    scenarios.push({
      id: 'time-on-page',
      scenario: '콘텐츠 구조 개선으로 체류 시간 증가',
      currentState: {
        metric: '평균 체류 시간',
        value: avgTimeOnPage,
        unit: '초'
      },
      action: '제품 사진 확대, 비교표 추가, FAQ 섹션 강화',
      expectedOutcome: {
        metric: '평균 체류 시간',
        improvement: timeImprovement,
        unit: '초',
        description: `체류 시간이 ${avgTimeOnPage}초에서 ${(avgTimeOnPage + timeImprovement).toFixed(1)}초로 ${timeImprovement.toFixed(1)}초 증가 예상`
      },
      confidence: 75,
      dataBasis: `현재 체류 시간 ${avgTimeOnPage}초, 설득력 점수 ${pagePersuasionScore}점. 콘텐츠 개선으로 체류 시간 증가 및 전환율 개선 예상`
    })
  }
  
  // 시나리오 3: 페이지 탐색 증가
  if (pagesPerSession < 2.5 && bounceRate > 50) {
    scenarios.push({
      id: 'page-exploration',
      scenario: '관련 제품 추천으로 페이지 탐색 증가',
      currentState: {
        metric: '페이지당 세션',
        value: pagesPerSession,
        unit: '페이지'
      },
      action: '상세페이지 하단에 관련 제품 추천, 비교 제품 섹션 추가',
      expectedOutcome: {
        metric: '페이지당 세션',
        improvement: 0.8,
        unit: '페이지',
        description: `페이지 탐색이 ${pagesPerSession.toFixed(1)}페이지에서 ${(pagesPerSession + 0.8).toFixed(1)}페이지로 증가 예상`
      },
      confidence: 70,
      dataBasis: `현재 페이지 탐색 ${pagesPerSession.toFixed(1)}페이지, 이탈률 ${bounceRate.toFixed(1)}%. 관련 제품 추천으로 탐색 증가 및 전환 기회 확대`
    })
  }
  
  // 시나리오 4: 전환율 개선
  if (conversionRate < 3.0 && pagePersuasionScore < 75) {
    const cvrImprovement = (3.0 - conversionRate) * 0.4
    scenarios.push({
      id: 'conversion-optimization',
      scenario: 'CTA 버튼 최적화 및 긴급성 메시지 추가',
      currentState: {
        metric: '전환율',
        value: conversionRate,
        unit: '%'
      },
      action: 'CTA 버튼 색상/위치 최적화, "오늘만 특가" 긴급성 메시지, 무료배송 강조',
      expectedOutcome: {
        metric: '전환율',
        improvement: cvrImprovement,
        unit: '%',
        description: `전환율이 ${conversionRate.toFixed(2)}%에서 ${(conversionRate + cvrImprovement).toFixed(2)}%로 ${cvrImprovement.toFixed(2)}%p 상승 예상`
      },
      confidence: 80,
      dataBasis: `현재 전환율 ${conversionRate.toFixed(2)}%, 설득력 점수 ${pagePersuasionScore}점. CTA 최적화와 긴급성 메시지로 즉시 구매 유도`
    })
  }
  
  const overallRecommendation = scenarios.length > 0
    ? `${scenarios.length}개의 데이터 기반 시나리오가 도출되었습니다. 우선순위별로 실행하면 전환율과 수익률이 크게 개선될 것으로 예상됩니다.`
    : '현재 상태가 양호하여 추가 시나리오가 필요하지 않습니다.'
  
  return {
    scenarios,
    overallRecommendation
  }
}
