/**
 * AI 권위 진단 (AEO - Answer Engine Optimization)
 * AI 검색 엔진들이 브랜드를 어떻게 평가하고 추천하는지 분석
 */

export interface AIEngineEvaluation {
  engine: 'chatgpt' | 'claude' | 'gemini' | 'perplexity' | 'copilot'
  brandMention: number // 브랜드 언급 횟수
  recommendationScore: number // 0-100
  sentiment: 'positive' | 'neutral' | 'negative'
  keyPhrases: string[]
  context: string // AI가 브랜드를 언급한 맥락
}

export interface AIAuthorityIndex {
  overallScore: number // 0-100
  averageRecommendationScore: number
  totalMentions: number
  positiveSentimentRatio: number
  trustFactors: {
    expertise: number // 전문성
    authority: number // 권위
    trustworthiness: number // 신뢰도
    popularity: number // 인지도
  }
  evaluations: AIEngineEvaluation[]
  insights: string[]
  recommendations: string[]
}

/**
 * AI 검색 엔진별 브랜드 평가 분석
 */
export function analyzeAIAuthority(brandName: string): AIAuthorityIndex {
  // 모의 데이터: 실제로는 AI 검색 엔진 API를 호출하여 분석
  const evaluations: AIEngineEvaluation[] = [
    {
      engine: 'chatgpt',
      brandMention: 1250,
      recommendationScore: 85,
      sentiment: 'positive',
      keyPhrases: [
        '프리미엄 스포츠 브랜드',
        '혁신적인 기술',
        '글로벌 리더',
        '지속가능성 노력'
      ],
      context: 'ChatGPT는 나이키를 "혁신적인 스포츠웨어와 지속가능성 노력으로 유명한 글로벌 리더"로 평가합니다.'
    },
    {
      engine: 'claude',
      brandMention: 980,
      recommendationScore: 82,
      sentiment: 'positive',
      keyPhrases: [
        '기술적 우수성',
        '디자인 혁신',
        '사회적 책임',
        '고객 만족도'
      ],
      context: 'Claude는 나이키의 기술적 우수성과 디자인 혁신을 강조하며 긍정적으로 평가합니다.'
    },
    {
      engine: 'gemini',
      brandMention: 1100,
      recommendationScore: 88,
      sentiment: 'positive',
      keyPhrases: [
        '혁신 리더',
        '스포츠 문화 선도',
        '디지털 전환',
        '고성능 제품'
      ],
      context: 'Gemini는 나이키를 스포츠 문화를 선도하는 혁신 리더로 평가합니다.'
    },
    {
      engine: 'perplexity',
      brandMention: 750,
      recommendationScore: 80,
      sentiment: 'positive',
      keyPhrases: [
        '시장 점유율',
        '브랜드 가치',
        '디지털 혁신',
        '글로벌 확장'
      ],
      context: 'Perplexity는 나이키의 높은 시장 점유율과 브랜드 가치를 언급합니다.'
    },
    {
      engine: 'copilot',
      brandMention: 650,
      recommendationScore: 78,
      sentiment: 'positive',
      keyPhrases: [
        '프리미엄 브랜드',
        '혁신 기술',
        '고객 경험',
        '디지털 플랫폼'
      ],
      context: 'Copilot은 나이키의 프리미엄 브랜드 포지셔닝과 디지털 플랫폼 혁신을 강조합니다.'
    }
  ]
  
  const averageRecommendationScore = evaluations.reduce((sum, e) => sum + e.recommendationScore, 0) / evaluations.length
  const totalMentions = evaluations.reduce((sum, e) => sum + e.brandMention, 0)
  const positiveCount = evaluations.filter(e => e.sentiment === 'positive').length
  const positiveSentimentRatio = (positiveCount / evaluations.length) * 100
  
  // 신뢰 요소 계산
  const trustFactors = {
    expertise: Math.round(averageRecommendationScore * 0.9), // 전문성
    authority: Math.round(averageRecommendationScore * 0.85), // 권위
    trustworthiness: Math.round(averageRecommendationScore * 0.88), // 신뢰도
    popularity: Math.min(100, Math.round((totalMentions / 5000) * 100)) // 인지도
  }
  
  const overallScore = Math.round(
    (averageRecommendationScore * 0.4) +
    (positiveSentimentRatio * 0.3) +
    (trustFactors.expertise * 0.15) +
    (trustFactors.authority * 0.15)
  )
  
  const insights: string[] = []
  if (averageRecommendationScore > 80) {
    insights.push('AI 검색 엔진들이 나이키를 매우 긍정적으로 평가하고 있습니다.')
  }
  if (positiveSentimentRatio > 90) {
    insights.push('대부분의 AI 엔진에서 긍정적 감정으로 언급되고 있습니다.')
  }
  if (trustFactors.expertise > 80) {
    insights.push('전문성과 권위가 높게 평가되고 있습니다.')
  }
  
  const recommendations: string[] = []
  if (averageRecommendationScore < 85) {
    recommendations.push('AI 엔진에서 더 자주 언급되도록 구조화된 데이터(JSON-LD)를 강화하세요.')
  }
  if (trustFactors.popularity < 80) {
    recommendations.push('AI가 인용하기 좋은 통계 자료와 전문가 인용을 콘텐츠에 추가하세요.')
  }
  recommendations.push('FAQ 섹션을 강화하여 AI가 직접 답변할 수 있는 구조로 개선하세요.')
  recommendations.push('브랜드의 전문성과 혁신성을 강조하는 콘텐츠를 지속적으로 발행하세요.')
  
  return {
    overallScore,
    averageRecommendationScore: Math.round(averageRecommendationScore),
    totalMentions,
    positiveSentimentRatio: Math.round(positiveSentimentRatio),
    trustFactors,
    evaluations,
    insights,
    recommendations
  }
}
