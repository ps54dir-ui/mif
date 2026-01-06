/**
 * SNS 페르소나별 감정 맵
 * 인스타그램과 커뮤니티 텍스트 분석
 */

export interface Persona {
  id: string
  name: string
  ageRange: string
  interests: string[]
  characteristics: string[]
}

export interface PersonaEmotionMap {
  persona: Persona
  emotions: {
    trust: number
    anxiety: number
    enthusiasm: number
    skepticism: number
    loyalty: number
    frustration: number
    excitement: number
  }
  dominantEmotion: string
  sentiment: 'POSITIVE' | 'NEUTRAL' | 'NEGATIVE'
  sampleTexts: string[]
}

export interface SNSPost {
  id: string
  platform: 'instagram' | 'community' | 'twitter'
  text: string
  author: string
  likes: number
  comments: number
  date: string
}

/**
 * 페르소나 정의
 */
export const PERSONAS: Persona[] = [
  {
    id: 'genz_fashion',
    name: 'Z세대 패션러버',
    ageRange: '18-25',
    interests: ['패션', '트렌드', 'SNS', '인플루언서'],
    characteristics: ['트렌드 민감', '시각적 콘텐츠 선호', '바이럴 추구']
  },
  {
    id: 'millennial_athlete',
    name: '밀레니얼 운동족',
    ageRange: '26-35',
    interests: ['운동', '건강', '라이프스타일', '성과'],
    characteristics: ['성능 중시', '리뷰 신뢰', '가성비 추구']
  },
  {
    id: 'genx_quality',
    name: 'X세대 품질파',
    ageRange: '36-50',
    interests: ['품질', '내구성', '브랜드 신뢰', '전통'],
    characteristics: ['신뢰 중시', '장기적 관점', '보수적']
  },
  {
    id: 'boomer_value',
    name: '베이비붐 가치파',
    ageRange: '51+',
    interests: ['가격', '실용성', '서비스', '안정성'],
    characteristics: ['가격 민감', '실용성 중시', '고객 서비스 중요']
  }
]

/**
 * 텍스트에서 페르소나 감정 분석
 */
function analyzePersonaEmotion(text: string, persona: Persona): {
  trust: number
  anxiety: number
  enthusiasm: number
  skepticism: number
  loyalty: number
  frustration: number
  excitement: number
} {
  const lowerText = text.toLowerCase()
  
  // Z세대 패션러버
  if (persona.id === 'genz_fashion') {
    const trendKeywords = ['트렌드', '핫', '인싸', '스타일', '예쁘', '멋', 'trend', 'hot', 'style', 'cute', 'cool']
    const excitement = trendKeywords.filter(kw => lowerText.includes(kw)).length * 15
    
    const trust = lowerText.includes('인플루언서') || lowerText.includes('추천') ? 30 : 10
    const enthusiasm = excitement > 0 ? excitement : (lowerText.includes('사랑') ? 25 : 10)
    
    return {
      trust: Math.min(100, trust),
      anxiety: lowerText.includes('걱정') ? 20 : 5,
      enthusiasm: Math.min(100, enthusiasm),
      skepticism: lowerText.includes('의심') ? 15 : 5,
      loyalty: lowerText.includes('재구매') ? 25 : 10,
      frustration: lowerText.includes('실망') ? 15 : 5,
      excitement: Math.min(100, excitement)
    }
  }
  
  // 밀레니얼 운동족
  if (persona.id === 'millennial_athlete') {
    const performanceKeywords = ['성능', '기능', '효과', '만족', '좋아', 'performance', 'function', 'effective', 'satisfied']
    const trust = performanceKeywords.filter(kw => lowerText.includes(kw)).length * 12
    
    return {
      trust: Math.min(100, trust + (lowerText.includes('리뷰') ? 20 : 0)),
      anxiety: lowerText.includes('불안') ? 15 : 5,
      enthusiasm: performanceKeywords.filter(kw => lowerText.includes(kw)).length * 10,
      skepticism: lowerText.includes('의심') || lowerText.includes('불신') ? 20 : 5,
      loyalty: lowerText.includes('재구매') || lowerText.includes('추천') ? 30 : 10,
      frustration: lowerText.includes('불만') ? 20 : 5,
      excitement: lowerText.includes('대박') || lowerText.includes('최고') ? 25 : 10
    }
  }
  
  // X세대 품질파
  if (persona.id === 'genx_quality') {
    const qualityKeywords = ['품질', '내구성', '오래', '신뢰', '믿음', 'quality', 'durable', 'trust', 'reliable']
    const trust = qualityKeywords.filter(kw => lowerText.includes(kw)).length * 15
    
    return {
      trust: Math.min(100, trust),
      anxiety: lowerText.includes('불안') || lowerText.includes('우려') ? 25 : 5,
      enthusiasm: lowerText.includes('만족') ? 20 : 10,
      skepticism: lowerText.includes('의심') ? 30 : 10,
      loyalty: lowerText.includes('오래') || lowerText.includes('계속') ? 35 : 15,
      frustration: lowerText.includes('불만') ? 25 : 5,
      excitement: lowerText.includes('좋아') ? 15 : 5
    }
  }
  
  // 베이비붐 가치파
  if (persona.id === 'boomer_value') {
    const valueKeywords = ['가격', '저렴', '가성비', '실용', '편리', 'price', 'cheap', 'practical', 'convenient']
    const trust = valueKeywords.filter(kw => lowerText.includes(kw)).length * 10
    
    return {
      trust: Math.min(100, trust + (lowerText.includes('서비스') ? 25 : 0)),
      anxiety: lowerText.includes('비싸') || lowerText.includes('걱정') ? 30 : 5,
      enthusiasm: lowerText.includes('만족') ? 15 : 5,
      skepticism: lowerText.includes('의심') ? 30 : 10,
      loyalty: lowerText.includes('재구매') ? 40 : 10,
      frustration: lowerText.includes('불만') || lowerText.includes('문제') ? 25 : 5,
      excitement: lowerText.includes('좋아') ? 10 : 5
    }
  }
  
  // 기본값
  return {
    trust: 20,
    anxiety: 10,
    enthusiasm: 15,
    skepticism: 10,
    loyalty: 15,
    frustration: 10,
    excitement: 15
  }
}

/**
 * 페르소나별 감정 맵 생성
 */
export function generatePersonaEmotionMap(
  posts: SNSPost[],
  persona: Persona
): PersonaEmotionMap {
  const personaPosts = posts.filter(post => {
    // 간단한 페르소나 매칭 로직 (실제로는 더 정교한 분석 필요)
    const text = post.text.toLowerCase()
    const matches = persona.interests.some(interest => 
      text.includes(interest.toLowerCase())
    )
    return matches
  })
  
  if (personaPosts.length === 0) {
    // 매칭되는 포스트가 없으면 기본값 반환
    return {
      persona,
      emotions: {
        trust: 20,
        anxiety: 10,
        enthusiasm: 15,
        skepticism: 10,
        loyalty: 15,
        frustration: 10,
        excitement: 15
      },
      dominantEmotion: 'trust',
      sentiment: 'NEUTRAL',
      sampleTexts: []
    }
  }
  
  // 모든 포스트의 감정 집계
  const totalEmotions = personaPosts.reduce((acc, post) => {
    const emotions = analyzePersonaEmotion(post.text, persona)
    return {
      trust: acc.trust + emotions.trust,
      anxiety: acc.anxiety + emotions.anxiety,
      enthusiasm: acc.enthusiasm + emotions.enthusiasm,
      skepticism: acc.skepticism + emotions.skepticism,
      loyalty: acc.loyalty + emotions.loyalty,
      frustration: acc.frustration + emotions.frustration,
      excitement: acc.excitement + emotions.excitement
    }
  }, {
    trust: 0,
    anxiety: 0,
    enthusiasm: 0,
    skepticism: 0,
    loyalty: 0,
    frustration: 0,
    excitement: 0
  })
  
  // 평균 계산
  const count = personaPosts.length
  const avgEmotions = {
    trust: Math.round(totalEmotions.trust / count),
    anxiety: Math.round(totalEmotions.anxiety / count),
    enthusiasm: Math.round(totalEmotions.enthusiasm / count),
    skepticism: Math.round(totalEmotions.skepticism / count),
    loyalty: Math.round(totalEmotions.loyalty / count),
    frustration: Math.round(totalEmotions.frustration / count),
    excitement: Math.round(totalEmotions.excitement / count)
  }
  
  // 주요 감정 결정
  const emotionEntries = Object.entries(avgEmotions) as [string, number][]
  const dominantEmotion = emotionEntries.reduce((max, [emotion, value]) => 
    value > max[1] ? [emotion, value] : max
  )[0]
  
  // 감정 판단
  const positiveEmotions = avgEmotions.trust + avgEmotions.enthusiasm + avgEmotions.loyalty + avgEmotions.excitement
  const negativeEmotions = avgEmotions.anxiety + avgEmotions.skepticism + avgEmotions.frustration
  const sentiment = positiveEmotions > negativeEmotions ? 'POSITIVE' : 
                   negativeEmotions > positiveEmotions ? 'NEGATIVE' : 'NEUTRAL'
  
  return {
    persona,
    emotions: avgEmotions,
    dominantEmotion,
    sentiment,
    sampleTexts: personaPosts.slice(0, 3).map(p => p.text)
  }
}
