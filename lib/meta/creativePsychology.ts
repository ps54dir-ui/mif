/**
 * 심리 기반 광고 소재 진단
 * 도파민(기대감) vs 코르티솔(공포/결핍) 분석
 */

export type PsychologyType = 'dopamine' | 'cortisol' | 'mixed'

export interface PsychologyAnalysis {
  type: PsychologyType
  dopamineScore: number // 0-100
  cortisolScore: number // 0-100
  overallScore: number // 0-100
  keywords: string[]
  tone: string
}

export interface CreativePsychologyDiagnosis {
  creativeId: string
  creativeName: string
  headline: string
  description: string
  psychology: PsychologyAnalysis
  pagePsychologyMatch: {
    matchScore: number // 0-100
    isAligned: boolean
    recommendation: string
  }
}

/**
 * 광고 소재의 심리 타입 분석
 */
export function analyzeCreativePsychology(
  headline: string,
  description: string,
  cta: string
): PsychologyAnalysis {
  const text = `${headline} ${description} ${cta}`.toLowerCase()
  
  // 도파민 키워드 (기대감, 보상, 성취)
  const dopamineKeywords = [
    '새로운', '특별', '할인', '프로모션', '이벤트', '선물', '보너스',
    '성공', '완벽', '최고', '프리미엄', '독점', '한정', '특가',
    '지금', '바로', '즉시', '당장', '지금 구매', '지금 주문'
  ]
  
  // 코르티솔 키워드 (공포, 결핍, 긴급성)
  const cortisolKeywords = [
    '마지막', '품절', '임박', '놓치지', '기회', '한정', '마감',
    '서두르', '급하다', '지금 안 하면', '늦으면', '아까워',
    '부족', '없다', '끝', '종료', '마감임박'
  ]
  
  const dopamineMatches = dopamineKeywords.filter(kw => text.includes(kw)).length
  const cortisolMatches = cortisolKeywords.filter(kw => text.includes(kw)).length
  
  const dopamineScore = Math.min(100, (dopamineMatches / dopamineKeywords.length) * 100 + 30)
  const cortisolScore = Math.min(100, (cortisolMatches / cortisolKeywords.length) * 100 + 20)
  
  let type: PsychologyType = 'mixed'
  if (dopamineScore > cortisolScore + 20) {
    type = 'dopamine'
  } else if (cortisolScore > dopamineScore + 20) {
    type = 'cortisol'
  }
  
  const overallScore = (dopamineScore + cortisolScore) / 2
  
  const keywords: string[] = []
  if (dopamineScore > 50) {
    keywords.push('기대감', '보상', '성취')
  }
  if (cortisolScore > 50) {
    keywords.push('긴급성', '결핍', '공포')
  }
  
  let tone = ''
  if (type === 'dopamine') {
    tone = '긍정적이고 기대감을 자극하는 톤'
  } else if (type === 'cortisol') {
    tone = '긴급성과 결핍감을 강조하는 톤'
  } else {
    tone = '기대감과 긴급성을 혼합한 톤'
  }
  
  return {
    type,
    dopamineScore: Math.round(dopamineScore),
    cortisolScore: Math.round(cortisolScore),
    overallScore: Math.round(overallScore),
    keywords,
    tone
  }
}

/**
 * 광고 소재와 상세페이지 심리 톤 일치도 진단
 * 
 * 이 함수는 광고 소재(메타 광고 등)의 심리 타입과 상세페이지의 심리 타입을 비교하여
 * 일치도를 계산합니다. 광고에서 기대감(도파민)을 자극했는데 상세페이지에서 긴급성(코르티솔)을
 * 강조하면 고객이 혼란스러워하여 전환율이 떨어질 수 있으므로, 이를 방지하기 위한 진단 함수입니다.
 * 
 * @param creativePsychology - 광고 소재의 심리 분석 결과
 * @param pagePsychologyScore - 상세페이지의 심리 점수 (0-100)
 * @param pagePsychologyType - 상세페이지의 심리 타입 (dopamine/cortisol/mixed)
 * @returns 매칭 점수, 정렬 여부, 권고사항
 */
export function diagnoseCreativePageAlignment(
  creativePsychology: PsychologyAnalysis,
  pagePsychologyScore: number, // 상세페이지 심리 점수
  pagePsychologyType: 'dopamine' | 'cortisol' | 'mixed'
): {
  matchScore: number
  isAligned: boolean
  recommendation: string
} {
  // 1단계: 심리 타입 일치도 계산 (0-100)
  // 광고와 상세페이지의 심리 타입이 동일한지 확인
  let typeMatch = 0
  if (creativePsychology.type === pagePsychologyType) {
    typeMatch = 100  // 완벽한 일치: 도파민-도파민, 코르티솔-코르티솔, 혼합-혼합
  } else if (
    (creativePsychology.type === 'dopamine' && pagePsychologyType === 'cortisol') ||
    (creativePsychology.type === 'cortisol' && pagePsychologyType === 'dopamine')
  ) {
    typeMatch = 20  // 완전 불일치: 도파민-코르티솔 또는 코르티솔-도파민 (매우 나쁨)
  } else {
    typeMatch = 60  // 부분 일치: 혼합 타입이 섞여 있는 경우 (보통)
  }
  
  // 2단계: 심리 점수 차이 계산
  // 광고의 전체 심리 점수와 상세페이지 심리 점수의 차이를 계산
  const scoreDiff = Math.abs(creativePsychology.overallScore - pagePsychologyScore)
  // 차이가 작을수록 매칭 점수가 높음 (최대 100점)
  const scoreMatch = Math.max(0, 100 - scoreDiff)
  
  // 3단계: 최종 매칭 점수 계산
  // 타입 일치도 60% + 점수 일치도 40% 가중 평균
  const matchScore = (typeMatch * 0.6 + scoreMatch * 0.4)
  // 70점 이상이면 정렬된 것으로 판단
  const isAligned = matchScore >= 70
  
  let recommendation = ''
  if (!isAligned) {
    if (creativePsychology.type === 'dopamine' && pagePsychologyType === 'cortisol') {
      recommendation = '광고는 기대감(도파민) 위주이나 상세페이지는 긴급성(코르티솔) 위주입니다. 상세페이지 초반에 광고와 동일한 모델의 이미지와 긍정적 메시지를 배치하여 일관성을 확보하세요.'
    } else if (creativePsychology.type === 'cortisol' && pagePsychologyType === 'dopamine') {
      recommendation = '광고는 긴급성(코르티솔) 위주이나 상세페이지는 기대감(도파민) 위주입니다. 상세페이지에 한정 수량이나 마감 임박 메시지를 추가하여 긴급성을 강조하세요.'
    } else {
      recommendation = '광고와 상세페이지의 심리 톤이 일치하지 않습니다. 광고 소재의 심리 타입에 맞춰 상세페이지 메시지를 조정하세요.'
    }
  } else {
    recommendation = '광고와 상세페이지의 심리 톤이 잘 일치합니다. 현재 전략을 유지하세요.'
  }
  
  return {
    matchScore: Math.round(matchScore),
    isAligned,
    recommendation
  }
}
