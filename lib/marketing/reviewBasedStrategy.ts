/**
 * 리뷰 기반 전략 생성
 * 긍정 리뷰는 광고 콘텐츠로, 부정 리뷰는 개선 데이터로 활용
 */

export interface ReviewInsight {
  id: string
  reviewId: string
  sentiment: 'positive' | 'negative' | 'neutral'
  category: 'product' | 'service' | 'delivery' | 'customer_support' | 'price' | 'quality'
  keywords: string[]
  actionable: boolean
  priority: 'HIGH' | 'MEDIUM' | 'LOW'
}

export interface PositiveReviewForMarketing {
  reviewId: string
  quote: string
  author: string
  rating: number
  platform: string
  keywords: string[]
  useCase: 'testimonial' | 'social_proof' | 'feature_highlight' | 'cta'
  suggestedCopy: string[]
  placement: string[]
}

export interface NegativeReviewForImprovement {
  reviewId: string
  issue: string
  category: string
  keywords: string[]
  frequency: number
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW'
  suggestedActions: {
    action: string
    priority: 'IMMEDIATE' | 'SHORT_TERM' | 'LONG_TERM'
    expectedImpact: string
    owner: string
  }[]
  relatedPositiveReviews?: string[] // 동일 카테고리에서 긍정적인 리뷰
}

export interface ReviewBasedStrategyReport {
  positiveReviewsForMarketing: PositiveReviewForMarketing[]
  negativeReviewsForImprovement: NegativeReviewForImprovement[]
  marketingCopySuggestions: {
    headline: string
    description: string
    useCase: string
    sourceReviewIds: string[]
  }[]
  improvementActions: {
    category: string
    actions: {
      action: string
      priority: string
      expectedImpact: string
    }[]
  }[]
  keyInsights: {
    topStrengths: string[]
    topWeaknesses: string[]
    opportunities: string[]
  }
}

export interface Review {
  id: string
  text: string
  rating: number
  author: string
  platform: string
  date: string
  sentiment: 'positive' | 'negative' | 'neutral'
  keywords?: string[]
}

/**
 * 리뷰 분석을 통한 마케팅 및 개선 전략 생성
 */
export function generateReviewBasedStrategy(reviews: Review[]): ReviewBasedStrategyReport {
  const positiveReviews = reviews.filter(r => r.sentiment === 'positive' || r.rating >= 4)
  const negativeReviews = reviews.filter(r => r.sentiment === 'negative' || r.rating <= 2)

  // 1. 긍정 리뷰를 마케팅 콘텐츠로 활용
  const positiveReviewsForMarketing: PositiveReviewForMarketing[] = positiveReviews
    .filter(r => r.text.length > 20) // 충분한 내용이 있는 리뷰만
    .map(review => {
      // 키워드 추출 (간단한 버전)
      const keywords = extractKeywords(review.text)
      
      // 사용 사례 결정
      const useCase = determineUseCase(review, keywords)
      
      // 카피 제안
      const suggestedCopy = generateMarketingCopy(review, useCase)
      
      // 배치 위치 제안
      const placement = suggestPlacement(useCase)

      return {
        reviewId: review.id,
        quote: extractBestQuote(review.text),
        author: review.author,
        rating: review.rating,
        platform: review.platform,
        keywords,
        useCase,
        suggestedCopy,
        placement
      }
    })
    .sort((a, b) => {
      // 평점이 높고, 키워드가 많은 순서로 정렬
      if (b.rating !== a.rating) return b.rating - a.rating
      return b.keywords.length - a.keywords.length
    })
    .slice(0, 20) // 상위 20개

  // 2. 부정 리뷰를 개선 데이터로 활용
  const negativeReviewsForImprovement: NegativeReviewForImprovement[] = analyzeNegativeReviews(negativeReviews)

  // 3. 마케팅 카피 제안
  const marketingCopySuggestions = generateMarketingCopySuggestions(positiveReviewsForMarketing)

  // 4. 개선 액션 아이템
  const improvementActions = generateImprovementActions(negativeReviewsForImprovement)

  // 5. 주요 인사이트
  const keyInsights = extractKeyInsights(positiveReviews, negativeReviews)

  return {
    positiveReviewsForMarketing,
    negativeReviewsForImprovement,
    marketingCopySuggestions,
    improvementActions,
    keyInsights
  }
}

/**
 * 키워드 추출 (간단한 버전)
 */
function extractKeywords(text: string): string[] {
  const commonWords = ['좋아', '최고', '대박', '추천', '만족', '완벽', '사랑', '훌륭', '좋다', '최고다']
  const keywords: string[] = []
  
  commonWords.forEach(word => {
    if (text.includes(word)) {
      keywords.push(word)
    }
  })
  
  // 실제로는 더 정교한 NLP 처리 필요
  return keywords
}

/**
 * 사용 사례 결정
 */
function determineUseCase(review: Review, keywords: string[]): PositiveReviewForMarketing['useCase'] {
  if (review.rating === 5 && review.text.includes('추천')) {
    return 'testimonial'
  }
  if (keywords.some(kw => ['만족', '좋아', '최고'].includes(kw))) {
    return 'social_proof'
  }
  if (review.text.length > 100) {
    return 'feature_highlight'
  }
  return 'cta'
}

/**
 * 마케팅 카피 생성
 */
function generateMarketingCopy(
  review: Review,
  useCase: PositiveReviewForMarketing['useCase']
): string[] {
  const suggestions: string[] = []
  
  switch (useCase) {
    case 'testimonial':
      suggestions.push(`"${extractBestQuote(review.text)}" - ${review.author} 고객님`)
      suggestions.push(`${review.rating}점 만점의 만족도! "${extractBestQuote(review.text)}"`)
      break
    case 'social_proof':
      suggestions.push(`${review.rating}점 만점으로 평가받은 이유`)
      suggestions.push(`고객들이 선택하는 이유: "${extractBestQuote(review.text)}"`)
      break
    case 'feature_highlight':
      suggestions.push(`고객이 말하는 우리의 장점: "${extractBestQuote(review.text, 50)}"`)
      break
    case 'cta':
      suggestions.push(`${review.rating}점 만점의 경험을 직접 확인해보세요`)
      break
  }
  
  return suggestions
}

/**
 * 배치 위치 제안
 */
function suggestPlacement(useCase: PositiveReviewForMarketing['useCase']): string[] {
  switch (useCase) {
    case 'testimonial':
      return ['랜딩 페이지', '제품 페이지', 'About 페이지', '홈페이지 히어로 섹션']
    case 'social_proof':
      return ['제품 페이지', '가격 페이지', '체크아웃 페이지', '이메일 마케팅']
    case 'feature_highlight':
      return ['기능 소개 페이지', '비교 페이지', 'FAQ 섹션']
    case 'cta':
      return ['CTA 버튼 근처', '사이드바', '팝업', '이메일 시그니처']
    default:
      return ['홈페이지']
  }
}

/**
 * 최적의 인용구 추출
 */
function extractBestQuote(text: string, maxLength: number = 100): string {
  if (text.length <= maxLength) return text
  
  // 문장 단위로 나누고 가장 의미 있는 부분 추출
  const sentences = text.split(/[.!?。！？]/).filter(s => s.trim().length > 0)
  
  // 가장 긴 문장 또는 핵심 키워드가 있는 문장 선택
  const bestSentence = sentences
    .sort((a, b) => {
      const aScore = scoreSentence(a)
      const bScore = scoreSentence(b)
      return bScore - aScore
    })[0]
  
  if (bestSentence.length <= maxLength) return bestSentence.trim()
  return bestSentence.substring(0, maxLength - 3) + '...'
}

/**
 * 문장 점수 계산 (긍정 키워드 포함 여부)
 */
function scoreSentence(sentence: string): number {
  const positiveWords = ['좋아', '최고', '대박', '추천', '만족', '완벽', '사랑', '훌륭']
  let score = sentence.length // 길이도 점수에 반영
  
  positiveWords.forEach(word => {
    if (sentence.includes(word)) score += 10
  })
  
  return score
}

/**
 * 부정 리뷰 분석
 */
function analyzeNegativeReviews(negativeReviews: Review[]): NegativeReviewForImprovement[] {
  // 카테고리별로 그룹화
  const categoryMap = new Map<string, Review[]>()
  
  negativeReviews.forEach(review => {
    const category = categorizeReview(review.text)
    if (!categoryMap.has(category)) {
      categoryMap.set(category, [])
    }
    categoryMap.get(category)!.push(review)
  })
  
  const improvements: NegativeReviewForImprovement[] = []
  
  categoryMap.forEach((reviews, category) => {
    // 가장 빈번한 이슈 찾기
    const commonIssues = findCommonIssues(reviews)
    
    commonIssues.forEach(issue => {
      const severity = determineSeverity(issue.frequency, reviews.length)
      
      improvements.push({
        reviewId: issue.reviewIds[0], // 대표 리뷰 ID
        issue: issue.text,
        category,
        keywords: extractKeywords(issue.text),
        frequency: issue.frequency,
        severity,
        suggestedActions: generateImprovementActionsForIssue(issue, category, severity)
      })
    })
  })
  
  return improvements.sort((a, b) => {
    const severityOrder = { CRITICAL: 4, HIGH: 3, MEDIUM: 2, LOW: 1 }
    return severityOrder[b.severity] - severityOrder[a.severity]
  })
}

/**
 * 리뷰 카테고리 분류
 */
function categorizeReview(text: string): string {
  const lowerText = text.toLowerCase()
  
  if (lowerText.includes('배송') || lowerText.includes('배달') || lowerText.includes('택배')) {
    return 'delivery'
  }
  if (lowerText.includes('고객') || lowerText.includes('서비스') || lowerText.includes('응대')) {
    return 'customer_support'
  }
  if (lowerText.includes('가격') || lowerText.includes('비싸') || lowerText.includes('할인')) {
    return 'price'
  }
  if (lowerText.includes('품질') || lowerText.includes('성능') || lowerText.includes('기능')) {
    return 'quality'
  }
  if (lowerText.includes('제품') || lowerText.includes('상품')) {
    return 'product'
  }
  
  return 'service'
}

/**
 * 공통 이슈 찾기
 */
function findCommonIssues(reviews: Review[]): Array<{ text: string; frequency: number; reviewIds: string[] }> {
  // 실제로는 더 정교한 텍스트 유사도 분석 필요
  // 여기서는 간단히 키워드 기반으로 그룹화
  
  const issueGroups: Array<{ text: string; frequency: number; reviewIds: string[] }> = []
  
  reviews.forEach(review => {
    // 비슷한 이슈가 있는지 확인
    const similarIssue = issueGroups.find(issue => 
      calculateSimilarity(issue.text, review.text) > 0.6
    )
    
    if (similarIssue) {
      similarIssue.frequency++
      similarIssue.reviewIds.push(review.id)
    } else {
      issueGroups.push({
        text: extractBestQuote(review.text, 100),
        frequency: 1,
        reviewIds: [review.id]
      })
    }
  })
  
  return issueGroups.sort((a, b) => b.frequency - a.frequency)
}

/**
 * 텍스트 유사도 계산 (간단한 버전)
 */
function calculateSimilarity(text1: string, text2: string): number {
  const words1 = new Set(text1.toLowerCase().split(/\s+/))
  const words2 = new Set(text2.toLowerCase().split(/\s+/))
  
  const intersection = new Set([...words1].filter(w => words2.has(w)))
  const union = new Set([...words1, ...words2])
  
  return intersection.size / union.size
}

/**
 * 심각도 결정
 */
function determineSeverity(frequency: number, totalReviews: number): 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' {
  const percentage = (frequency / totalReviews) * 100
  
  if (percentage >= 30) return 'CRITICAL'
  if (percentage >= 15) return 'HIGH'
  if (percentage >= 5) return 'MEDIUM'
  return 'LOW'
}

/**
 * 개선 액션 생성
 */
function generateImprovementActionsForIssue(
  issue: { text: string; frequency: number },
  category: string,
  severity: string
): Array<{ action: string; priority: 'IMMEDIATE' | 'SHORT_TERM' | 'LONG_TERM'; expectedImpact: string; owner: string }> {
  const actions: Array<{ action: string; priority: 'IMMEDIATE' | 'SHORT_TERM' | 'LONG_TERM'; expectedImpact: string; owner: string }> = []
  
  switch (category) {
    case 'delivery':
      actions.push({
        action: '배송 프로세스 개선 및 추적 시스템 강화',
        priority: (severity === 'CRITICAL' ? 'IMMEDIATE' : 'SHORT_TERM') as 'IMMEDIATE' | 'SHORT_TERM' | 'LONG_TERM',
        expectedImpact: '배송 관련 부정 리뷰 50% 감소',
        owner: '물류팀'
      })
      break
    case 'customer_support':
      actions.push({
        action: '고객 지원 응답 시간 단축 및 교육 강화',
        priority: (severity === 'CRITICAL' ? 'IMMEDIATE' : 'SHORT_TERM') as 'IMMEDIATE' | 'SHORT_TERM' | 'LONG_TERM',
        expectedImpact: '고객 만족도 30% 증가',
        owner: '고객지원팀'
      })
      break
    case 'price':
      actions.push({
        action: '가격 정책 재검토 및 가치 명확화',
        priority: 'SHORT_TERM' as 'IMMEDIATE' | 'SHORT_TERM' | 'LONG_TERM',
        expectedImpact: '가격 인식 개선, 전환율 15% 증가',
        owner: '마케팅팀'
      })
      break
    case 'quality':
      actions.push({
        action: '품질 관리 프로세스 강화',
        priority: (severity === 'CRITICAL' ? 'IMMEDIATE' : 'SHORT_TERM') as 'IMMEDIATE' | 'SHORT_TERM' | 'LONG_TERM',
        expectedImpact: '품질 관련 리뷰 개선, 브랜드 신뢰도 25% 향상',
        owner: '품질관리팀'
      })
      break
    default:
      actions.push({
        action: '해당 카테고리별 개선 계획 수립',
        priority: 'SHORT_TERM' as 'IMMEDIATE' | 'SHORT_TERM' | 'LONG_TERM',
        expectedImpact: '전반적인 고객 만족도 향상',
        owner: '관련 부서'
      })
  }
  
  return actions
}

/**
 * 마케팅 카피 제안 생성
 */
function generateMarketingCopySuggestions(
  positiveReviews: PositiveReviewForMarketing[]
): Array<{ headline: string; description: string; useCase: string; sourceReviewIds: string[] }> {
  const suggestions: Array<{ headline: string; description: string; useCase: string; sourceReviewIds: string[] }> = []
  
  // 평점이 높은 리뷰들로 헤드라인 생성
  const topReviews = positiveReviews
    .filter(r => r.rating === 5)
    .slice(0, 5)
  
  if (topReviews.length > 0) {
    suggestions.push({
      headline: `${topReviews.length}명이 5점 만점으로 평가했습니다`,
      description: topReviews[0].quote,
      useCase: '랜딩 페이지 히어로 섹션',
      sourceReviewIds: topReviews.map(r => r.reviewId)
    })
  }
  
  // 공통 키워드 기반 카피
  const commonKeywords = findCommonKeywords(positiveReviews)
  if (commonKeywords.length > 0) {
    suggestions.push({
      headline: `고객들이 가장 많이 언급하는 "${commonKeywords[0]}"`,
      description: `실제 고객 리뷰에서 확인할 수 있는 우리의 강점`,
      useCase: '소셜 프루프 섹션',
      sourceReviewIds: positiveReviews
        .filter(r => r.keywords.includes(commonKeywords[0]))
        .map(r => r.reviewId)
        .slice(0, 10)
    })
  }
  
  return suggestions
}

/**
 * 공통 키워드 찾기
 */
function findCommonKeywords(reviews: PositiveReviewForMarketing[]): string[] {
  const keywordCount = new Map<string, number>()
  
  reviews.forEach(review => {
    review.keywords.forEach(keyword => {
      keywordCount.set(keyword, (keywordCount.get(keyword) || 0) + 1)
    })
  })
  
  return Array.from(keywordCount.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([keyword]) => keyword)
}

/**
 * 개선 액션 아이템 생성
 */
function generateImprovementActions(
  negativeReviews: NegativeReviewForImprovement[]
): Array<{ category: string; actions: Array<{ action: string; priority: string; expectedImpact: string }> }> {
  const categoryMap = new Map<string, NegativeReviewForImprovement[]>()
  
  negativeReviews.forEach(review => {
    if (!categoryMap.has(review.category)) {
      categoryMap.set(review.category, [])
    }
    categoryMap.get(review.category)!.push(review)
  })
  
  const actions: Array<{ category: string; actions: Array<{ action: string; priority: string; expectedImpact: string }> }> = []
  
  categoryMap.forEach((reviews, category) => {
    const categoryActions = reviews
      .flatMap(r => r.suggestedActions)
      .map(a => ({
        action: a.action,
        priority: a.priority,
        expectedImpact: a.expectedImpact
      }))
    
    actions.push({
      category: getCategoryLabel(category),
      actions: categoryActions
    })
  })
  
  return actions
}

/**
 * 카테고리 라벨 변환
 */
function getCategoryLabel(category: string): string {
  const labels: Record<string, string> = {
    delivery: '배송',
    customer_support: '고객 지원',
    price: '가격',
    quality: '품질',
    product: '제품',
    service: '서비스'
  }
  return labels[category] || category
}

/**
 * 주요 인사이트 추출
 */
function extractKeyInsights(
  positiveReviews: Review[],
  negativeReviews: Review[]
): { topStrengths: string[]; topWeaknesses: string[]; opportunities: string[] } {
  // 강점: 긍정 리뷰에서 자주 언급되는 키워드
  const positiveKeywords = new Map<string, number>()
  positiveReviews.forEach(review => {
    const keywords = extractKeywords(review.text)
    keywords.forEach(kw => {
      positiveKeywords.set(kw, (positiveKeywords.get(kw) || 0) + 1)
    })
  })
  
  const topStrengths = Array.from(positiveKeywords.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([keyword]) => keyword)
  
  // 약점: 부정 리뷰 카테고리별 분포
  const categoryCount = new Map<string, number>()
  negativeReviews.forEach(review => {
    const category = categorizeReview(review.text)
    categoryCount.set(category, (categoryCount.get(category) || 0) + 1)
  })
  
  const topWeaknesses = Array.from(categoryCount.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([category]) => getCategoryLabel(category))
  
  // 기회: 긍정 리뷰는 많은데 마케팅에 활용되지 않은 부분
  const opportunities = [
    '긍정 리뷰를 홈페이지와 마케팅 자료에 적극 활용',
    '부정 리뷰에서 발견된 이슈를 빠르게 개선하여 경쟁 우위 확보',
    '리뷰 데이터를 기반으로 한 제품/서비스 개선 로드맵 수립'
  ]
  
  return {
    topStrengths,
    topWeaknesses,
    opportunities
  }
}
