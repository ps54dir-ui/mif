/**
 * 리뷰 분석 엔진
 * 긍정/부정 키워드 추출 및 시각화
 */

export interface Review {
  id: string
  text: string
  rating: number
  date: string
  channel: string
}

export interface KeywordFrequency {
  keyword: string
  frequency: number
  sentiment: 'positive' | 'negative' | 'neutral'
  score: number // -100 to 100
}

/**
 * 리뷰에서 키워드 추출 및 감성 분석
 */
export function analyzeReviews(reviews: Review[]): KeywordFrequency[] {
  const keywordMap = new Map<string, { count: number, sentiment: number }>()
  
  // 긍정 키워드
  const positiveKeywords = [
    '좋아', '최고', '대박', '멋져', '훌륭', '완벽', '사랑', '추천', '만족', '좋다',
    'good', 'great', 'awesome', 'amazing', 'love', 'best', 'perfect', 'excellent'
  ]
  
  // 부정 키워드
  const negativeKeywords = [
    '별로', '최악', '싫어', '불만', '문제', '실망', '나쁘', '불량', '불편', '아쉽',
    'bad', 'worst', 'hate', 'disappointed', 'terrible', 'awful', 'poor', 'wrong'
  ]
  
  reviews.forEach(review => {
    const text = review.text.toLowerCase()
    const words = text.split(/\s+/)
    
    words.forEach(word => {
      // 특수문자 제거
      const cleanWord = word.replace(/[^\w가-힣]/g, '')
      if (cleanWord.length < 2) return
      
      let sentiment = 0
      if (positiveKeywords.some(kw => cleanWord.includes(kw))) {
        sentiment = 1
      } else if (negativeKeywords.some(kw => cleanWord.includes(kw))) {
        sentiment = -1
      }
      
      if (sentiment !== 0 || cleanWord.length > 3) {
        const existing = keywordMap.get(cleanWord) || { count: 0, sentiment: 0 }
        keywordMap.set(cleanWord, {
          count: existing.count + 1,
          sentiment: existing.sentiment + sentiment
        })
      }
    })
  })
  
  // 키워드 빈도 및 감성 점수 계산
  const keywords: KeywordFrequency[] = []
  keywordMap.forEach((data, keyword) => {
    const avgSentiment = data.sentiment / data.count
    const sentiment: 'positive' | 'negative' | 'neutral' = 
      avgSentiment > 0.3 ? 'positive' : 
      avgSentiment < -0.3 ? 'negative' : 
      'neutral'
    
    keywords.push({
      keyword,
      frequency: data.count,
      sentiment,
      score: Math.round(avgSentiment * 100)
    })
  })
  
  // 빈도순 정렬
  return keywords
    .filter(k => k.frequency >= 2) // 최소 2회 이상 언급
    .sort((a, b) => b.frequency - a.frequency)
    .slice(0, 30) // 상위 30개
}

/**
 * 리뷰 감성 비율 계산
 */
export function calculateSentimentRatio(reviews: Review[]): {
  positive: number
  negative: number
  neutral: number
} {
  let positive = 0
  let negative = 0
  let neutral = 0
  
  reviews.forEach(review => {
    if (review.rating >= 4) {
      positive++
    } else if (review.rating <= 2) {
      negative++
    } else {
      neutral++
    }
  })
  
  const total = reviews.length
  return {
    positive: total > 0 ? Math.round((positive / total) * 100) : 0,
    negative: total > 0 ? Math.round((negative / total) * 100) : 0,
    neutral: total > 0 ? Math.round((neutral / total) * 100) : 0
  }
}
