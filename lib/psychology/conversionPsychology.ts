/**
 * 전환 심리 인과관계 추적
 * 영상 유입자가 상세페이지의 어떤 심리적 문구에 반응하여 전환되었는지 분석
 */

export interface VideoToPageFlow {
  videoId: string
  videoTitle: string
  videoPlatform: 'youtube' | 'tiktok'
  landingPageUrl: string
  visitors: number
  conversions: number
  conversionRate: number
}

export interface PsychologicalPhrase {
  phrase: string
  type: 'scarcity' | 'social_proof' | 'trust' | 'authority' | 'urgency' | 'value'
  impact: number // 전환에 미치는 영향 (0-100)
  conversionCount: number // 이 문구로 전환된 수
}

export interface ConversionPsychologyAnalysis {
  videoId: string
  landingPageUrl: string
  overallConversionRate: number
  psychologicalPhrases: PsychologicalPhrase[]
  topConvertingPhrase: PsychologicalPhrase | null
  psychologyInsight: string
  recommendation: string
}

/**
 * 상세페이지에서 심리적 문구 추출 및 전환 영향 분석
 */
export function analyzeConversionPsychology(
  flow: VideoToPageFlow,
  pagePhrases: Array<{ phrase: string; type: string; position: string }>
): ConversionPsychologyAnalysis {
  const psychologicalPhrases: PsychologicalPhrase[] = []
  
  // 각 문구의 전환 영향 계산
  pagePhrases.forEach(({ phrase, type, position }) => {
    // 위치에 따른 가중치
    const positionWeight = position === 'above_fold' ? 1.5 : 
                          position === 'middle' ? 1.0 : 0.7
    
    // 문구 타입에 따른 기본 영향력
    let baseImpact = 0
    switch (type) {
      case 'scarcity':
        baseImpact = 25
        break
      case 'social_proof':
        baseImpact = 30
        break
      case 'trust':
        baseImpact = 35
        break
      case 'authority':
        baseImpact = 20
        break
      case 'urgency':
        baseImpact = 28
        break
      case 'value':
        baseImpact = 22
        break
      default:
        baseImpact = 15
    }
    
    // 전환율 기반 영향 조정
    const impact = Math.min(100, baseImpact * positionWeight * (flow.conversionRate / 2.5))
    
    // 이 문구로 전환된 수 추정 (전환율 기반)
    const conversionCount = Math.round((flow.visitors * (impact / 100)) * (flow.conversionRate / 100))
    
    psychologicalPhrases.push({
      phrase,
      type: type as any,
      impact: Math.round(impact),
      conversionCount
    })
  })
  
  // 영향력순 정렬
  psychologicalPhrases.sort((a, b) => b.impact - a.impact)
  
  const topConvertingPhrase = psychologicalPhrases.length > 0 ? psychologicalPhrases[0] : null
  
  // 인사이트 생성
  let psychologyInsight = ''
  let recommendation = ''
  
  if (topConvertingPhrase) {
    switch (topConvertingPhrase.type) {
      case 'trust':
        psychologyInsight = `"${topConvertingPhrase.phrase}"와 같은 신뢰 신호가 전환에 가장 큰 영향을 미쳤습니다.`
        recommendation = '신뢰 신호를 더 강화하고 상단에 배치하세요.'
        break
      case 'social_proof':
        psychologyInsight = `"${topConvertingPhrase.phrase}"와 같은 사회적 증거가 전환을 유도했습니다.`
        recommendation = '실제 구매자 리뷰와 인증 배지를 더 많이 표시하세요.'
        break
      case 'scarcity':
        psychologyInsight = `"${topConvertingPhrase.phrase}"와 같은 희소성 메시지가 구매 결정을 촉진했습니다.`
        recommendation = '재고 부족, 한정판 등의 희소성 메시지를 강화하세요.'
        break
      case 'urgency':
        psychologyInsight = `"${topConvertingPhrase.phrase}"와 같은 긴급성 메시지가 즉시 구매를 유도했습니다.`
        recommendation = '타임리밋 할인, 마감 임박 등의 긴급성 요소를 추가하세요.'
        break
      case 'value':
        psychologyInsight = `"${topConvertingPhrase.phrase}"와 같은 가치 제안이 전환에 효과적이었습니다.`
        recommendation = '가성비, 혜택, 특가 등의 가치 메시지를 더 강조하세요.'
        break
      default:
        psychologyInsight = `"${topConvertingPhrase.phrase}"가 전환에 영향을 미쳤습니다.`
        recommendation = '이 문구를 더 눈에 띄는 위치에 배치하세요.'
    }
  } else {
    psychologyInsight = '심리적 문구가 부족하여 전환율이 낮습니다.'
    recommendation = '신뢰, 사회적 증거, 희소성 등의 심리적 문구를 추가하세요.'
  }
  
  return {
    videoId: flow.videoId,
    landingPageUrl: flow.landingPageUrl,
    overallConversionRate: flow.conversionRate,
    psychologicalPhrases,
    topConvertingPhrase,
    psychologyInsight,
    recommendation
  }
}
