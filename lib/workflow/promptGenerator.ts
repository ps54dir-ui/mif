/**
 * 데이터 기반 프롬프트 생성
 * 진단 결과를 콘텐츠 생성 프롬프트로 변환
 */

export interface DiagnosticData {
  pagePersuasionScore: number
  snsPsychologyScore: number
  returnRate: number
  conversionRate: number
  bounceRate: number
  brainScienceScore: number
  socialAssetValue: number
  emotionalTemperature: number
  weaknesses: string[]
  topChannels: string[]
}

export interface ContentPrompt {
  prompt: string
  context: string
  targetChannel: string
  contentType: 'reels' | 'post' | 'video' | 'blog' | 'email'
  tone: string
  keyPoints: string[]
}

/**
 * 진단 데이터를 콘텐츠 생성 프롬프트로 변환
 */
export function generateContentPrompt(
  diagnosticData: DiagnosticData,
  contentType: 'reels' | 'post' | 'video' | 'blog' | 'email' = 'reels',
  targetChannel: string = 'instagram'
): ContentPrompt {
  const contextParts: string[] = []
  const keyPoints: string[] = []
  let prompt = ''
  let tone = '친근하고 전문적인'
  
  // 재방문율이 낮은 경우
  if (diagnosticData.returnRate < 25) {
    contextParts.push(`현재 재방문율이 ${diagnosticData.returnRate.toFixed(1)}%로 낮습니다`)
    keyPoints.push('팬덤 자극', '재구매 유도', '브랜드 충성도 강화')
    
    if (contentType === 'reels' && targetChannel === 'instagram') {
      prompt = `현재 나이키의 재방문율이 ${diagnosticData.returnRate.toFixed(1)}%로 낮으니, 팬덤을 자극하는 인스타그램 릴스 대본을 작성해줘. 
      
요구사항:
- 팬덤의 감정적 연결을 강화하는 메시지
- 재구매를 유도하는 혜택 강조
- 브랜드 충성도를 높이는 스토리텔링
- 15-30초 분량의 강렬한 후킹
- 해시태그 포함`
      tone = '열정적이고 감성적인'
    }
  }
  
  // 상세페이지 점수가 낮은 경우
  if (diagnosticData.pagePersuasionScore < 70) {
    contextParts.push(`상세페이지 설득력 점수가 ${diagnosticData.pagePersuasionScore}점으로 낮습니다`)
    keyPoints.push('신뢰 신호 강화', '사회적 증거', '명확한 가치 제안')
    
    if (contentType === 'blog') {
      prompt = `상세페이지 설득력이 부족하니, 제품의 가치를 명확히 전달하는 블로그 콘텐츠를 작성해줘.
      
요구사항:
- 제품의 핵심 가치와 차별점 강조
- 실제 사용자 후기와 인증 배지 강조
- 명확한 CTA와 구매 혜택
- SEO 최적화된 키워드 포함`
      tone = '신뢰감 있고 전문적인'
    }
  }
  
  // SNS 심리 지수가 낮은 경우
  if (diagnosticData.snsPsychologyScore < 70) {
    contextParts.push(`SNS 심리 지수가 ${diagnosticData.snsPsychologyScore}점으로 낮습니다`)
    keyPoints.push('감정적 공감', '바이럴 요소', '참여 유도')
    
    if (contentType === 'post') {
      prompt = `SNS 심리 지수가 낮으니, 사용자의 감정을 자극하고 공유를 유도하는 소셜 미디어 포스트를 작성해줘.
      
요구사항:
- 강렬한 감정적 메시지
- 공유를 유도하는 요소 포함
- 인터랙티브 요소 (질문, 투표 등)
- 트렌디한 해시태그`
      tone = '감성적이고 트렌디한'
    }
  }
  
  // 이탈률이 높은 경우
  if (diagnosticData.bounceRate > 60) {
    contextParts.push(`이탈률이 ${diagnosticData.bounceRate.toFixed(1)}%로 높습니다`)
    keyPoints.push('초반 후킹', '명확한 가치 제안', '긴급성')
    
    if (contentType === 'email') {
      prompt = `이탈률이 높으니, 초반에 강력한 후킹과 명확한 가치 제안이 포함된 이메일 마케팅 콘텐츠를 작성해줘.
      
요구사항:
- 제목에 긴급성과 가치 제안 포함
- 첫 문단에 핵심 메시지 전달
- 명확한 CTA 버튼
- 모바일 최적화된 레이아웃`
      tone = '긴급하고 설득력 있는'
    }
  }
  
  // 뇌 과학 지수가 낮은 경우
  if (diagnosticData.brainScienceScore < 70) {
    contextParts.push(`뇌 과학 지수가 ${diagnosticData.brainScienceScore}점으로 낮습니다`)
    keyPoints.push('도파민 자극', '보상 요소', '성취감 제공')
    
    if (contentType === 'video') {
      prompt = `뇌 과학 지수가 낮으니, 도파민을 자극하는 보상과 성취감을 주는 영상 콘텐츠 대본을 작성해줘.
      
요구사항:
- 초반 3초 내 강력한 후킹
- 중간에 보상 요소 (할인, 이벤트) 포함
- 성취감을 주는 메시지
- 시각적 임팩트 강조`
      tone = '에너지 넘치고 동기부여하는'
    }
  }
  
  // 기본 프롬프트 (조건에 맞지 않는 경우)
  if (!prompt) {
    prompt = `${targetChannel}용 ${contentType} 콘텐츠를 작성해줘. 
    
현재 상태:
- 재방문율: ${diagnosticData.returnRate.toFixed(1)}%
- 전환율: ${diagnosticData.conversionRate.toFixed(2)}%
- 상세페이지 점수: ${diagnosticData.pagePersuasionScore}점
- SNS 심리 지수: ${diagnosticData.snsPsychologyScore}점

이 데이터를 바탕으로 효과적인 마케팅 콘텐츠를 생성해줘.`
  }
  
  const context = contextParts.join(', ') || '일반적인 마케팅 콘텐츠 생성'
  
  return {
    prompt,
    context,
    targetChannel,
    contentType,
    tone,
    keyPoints: keyPoints.length > 0 ? keyPoints : ['브랜드 강화', '전환율 개선', '참여도 증가']
  }
}
