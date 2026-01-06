/**
 * 업종 감지 및 분류 시스템
 * 회사 데이터를 분석하여 업종을 자동으로 감지
 */

export type IndustryType =
  | 'ecommerce'
  | 'saas'
  | 'local_business'
  | 'creator_economy'
  | 'media'
  | 'healthcare'
  | 'services'
  | 'non_profit'
  | 'food_beverage'

export interface IndustryProfile {
  industry_type: IndustryType
  confidence: number // 0-100%
  sub_category?: string // "의류", "카페", "SaaS CRM" 등
  key_metrics: string[] // CVR, Leads, Visits 등
  priority_channels: string[]
  revenue_model: string // "구매", "구독", "예약", "광고" 등
  characteristics: string[] // 업종 특징
}

export interface CompanyData {
  website?: string
  description?: string
  traffic_sources?: string[]
  revenue_model?: string
  business_type?: string
  keywords?: string[]
  social_media?: {
    platform: string
    url: string
  }[]
  features?: string[] // "온라인 쇼핑", "예약 시스템", "구독 서비스" 등
}

/**
 * 업종 감지
 */
export async function detectIndustry(
  companyData: CompanyData
): Promise<IndustryProfile> {
  const scores: Record<IndustryType, number> = {
    ecommerce: 0,
    saas: 0,
    local_business: 0,
    creator_economy: 0,
    media: 0,
    healthcare: 0,
    services: 0,
    non_profit: 0,
    food_beverage: 0
  }

  const text = [
    companyData.description || '',
    companyData.business_type || '',
    ...(companyData.keywords || []),
    ...(companyData.features || [])
  ].join(' ').toLowerCase()

  // 키워드 기반 점수 계산
  const keywordPatterns: Record<IndustryType, string[]> = {
    ecommerce: [
      '쇼핑', '구매', '상품', '장바구니', '결제', '배송', '마켓플레이스',
      '온라인 쇼핑몰', '전자상거래', 'ecommerce', 'shopping', 'cart'
    ],
    saas: [
      '소프트웨어', '구독', '서비스', '플랫폼', 'api', '클라우드',
      'saas', 'software', 'subscription', 'enterprise', 'b2b'
    ],
    local_business: [
      '예약', '방문', '매장', '지역', '로컬', '근처', '위치',
      'local', 'reservation', 'booking', 'store', 'location'
    ],
    creator_economy: [
      '유튜브', '스트리머', '인플루언서', '크리에이터', '팬덤',
      'youtube', 'streamer', 'influencer', 'creator', 'content'
    ],
    media: [
      '뉴스', '기사', '매체', '출판', '팟캐스트', '교육',
      'news', 'media', 'publishing', 'podcast', 'education'
    ],
    healthcare: [
      '의료', '병원', '치과', '약국', '건강', '웰니스', '피트니스',
      'healthcare', 'medical', 'hospital', 'clinic', 'wellness'
    ],
    services: [
      '법률', '회계', '컨설팅', '부동산', '금융', '전문',
      'law', 'accounting', 'consulting', 'real estate', 'finance'
    ],
    non_profit: [
      '기부', '자선', 'ngo', '시민단체', '사회공헌',
      'donation', 'charity', 'nonprofit', 'ngo', 'social'
    ],
    food_beverage: [
      '음식', '식당', '카페', '배달', '음료', '맛집',
      'food', 'restaurant', 'cafe', 'delivery', 'beverage'
    ]
  }

  // 키워드 매칭 점수 계산
  Object.entries(keywordPatterns).forEach(([industry, keywords]) => {
    keywords.forEach(keyword => {
      if (text.includes(keyword)) {
        scores[industry as IndustryType] += 10
      }
    })
  })

  // 수익 모델 기반 점수
  if (companyData.revenue_model) {
    const revenueModel = companyData.revenue_model.toLowerCase()
    if (revenueModel.includes('구매') || revenueModel.includes('판매')) {
      scores.ecommerce += 30
    }
    if (revenueModel.includes('구독') || revenueModel.includes('subscription')) {
      scores.saas += 30
    }
    if (revenueModel.includes('예약') || revenueModel.includes('booking')) {
      scores.local_business += 30
      scores.food_beverage += 20
    }
    if (revenueModel.includes('광고') || revenueModel.includes('ad')) {
      scores.creator_economy += 30
      scores.media += 20
    }
  }

  // 트래픽 소스 기반 점수
  if (companyData.traffic_sources) {
    companyData.traffic_sources.forEach(source => {
      const s = source.toLowerCase()
      if (s.includes('naver place') || s.includes('google my business')) {
        scores.local_business += 20
        scores.food_beverage += 15
      }
      if (s.includes('youtube') || s.includes('tiktok')) {
        scores.creator_economy += 20
      }
      if (s.includes('linkedin')) {
        scores.saas += 20
        scores.services += 15
      }
      if (s.includes('meta ads') || s.includes('facebook ads')) {
        scores.ecommerce += 15
      }
    })
  }

  // 소셜 미디어 기반 점수
  if (companyData.social_media) {
    companyData.social_media.forEach(social => {
      const platform = social.platform.toLowerCase()
      if (platform.includes('youtube')) {
        scores.creator_economy += 15
      }
      if (platform.includes('instagram') || platform.includes('tiktok')) {
        scores.creator_economy += 10
        scores.food_beverage += 10
      }
      if (platform.includes('linkedin')) {
        scores.saas += 15
        scores.services += 10
      }
    })
  }

  // 특징 기반 점수
  if (companyData.features) {
    companyData.features.forEach(feature => {
      const f = feature.toLowerCase()
      if (f.includes('쇼핑') || f.includes('장바구니')) {
        scores.ecommerce += 20
      }
      if (f.includes('예약') || f.includes('booking')) {
        scores.local_business += 20
        scores.healthcare += 15
      }
      if (f.includes('구독') || f.includes('subscription')) {
        scores.saas += 20
      }
      if (f.includes('콘텐츠') || f.includes('영상')) {
        scores.creator_economy += 15
        scores.media += 10
      }
    })
  }

  // 최고 점수 업종 찾기
  const maxScore = Math.max(...Object.values(scores))
  const detectedIndustry = Object.entries(scores).find(
    ([, score]) => score === maxScore
  )?.[0] as IndustryType

  // 신뢰도 계산 (최고 점수 / 총 점수)
  const totalScore = Object.values(scores).reduce((a, b) => a + b, 0)
  const confidence = totalScore > 0
    ? Math.round((maxScore / totalScore) * 100)
    : 50

  // 서브 카테고리 감지
  const subCategory = detectSubCategory(detectedIndustry, text, companyData)

  // 주요 지표 및 채널 설정
  const { keyMetrics, priorityChannels } = getIndustryDefaults(detectedIndustry)

  return {
    industry_type: detectedIndustry,
    confidence: Math.min(confidence, 95), // 최대 95%
    sub_category: subCategory,
    key_metrics: keyMetrics,
    priority_channels: priorityChannels,
    revenue_model: companyData.revenue_model || getDefaultRevenueModel(detectedIndustry),
    characteristics: getIndustryCharacteristics(detectedIndustry)
  }
}

/**
 * 서브 카테고리 감지
 */
function detectSubCategory(
  industry: IndustryType,
  text: string,
  companyData: CompanyData
): string | undefined {
  const subCategories: Record<IndustryType, string[]> = {
    ecommerce: ['의류', '전자제품', '뷰티', '식품', '생활용품', '도서'],
    saas: ['CRM', '프로젝트 관리', '마케팅', '회계', 'HR'],
    local_business: ['미용실', '카페', '식당', '피트니스', '클리닉'],
    creator_economy: ['유튜버', '스트리머', '인플루언서', '블로거'],
    media: ['뉴스', '팟캐스트', '교육', '엔터테인먼트'],
    healthcare: ['의료', '치과', '약국', '웰니스', '피트니스'],
    services: ['법률', '회계', '컨설팅', '부동산', '금융'],
    non_profit: ['기부', '자선', '환경', '교육', '의료'],
    food_beverage: ['음식점', '카페', '배달', '베이커리', '주류']
  }

  const categories = subCategories[industry] || []
  for (const category of categories) {
    if (text.includes(category.toLowerCase())) {
      return category
    }
  }

  return undefined
}

/**
 * 업종별 기본 설정
 */
function getIndustryDefaults(industry: IndustryType): {
  keyMetrics: string[]
  priorityChannels: string[]
} {
  const defaults: Record<IndustryType, { keyMetrics: string[]; priorityChannels: string[] }> = {
    ecommerce: {
      keyMetrics: ['CVR', 'AOV', 'Cart Abandonment Rate', 'ROAS'],
      priorityChannels: ['meta_ads', 'ga4_funnel', 'naver_place', 'organic_search']
    },
    saas: {
      keyMetrics: ['Lead Generation Rate', 'Lead to Customer Rate', 'LTV', 'CAC'],
      priorityChannels: ['organic_search', 'sem', 'social_media', 'email']
    },
    local_business: {
      keyMetrics: ['Local Search Ranking', 'Visit Conversion Rate', 'Review Rating'],
      priorityChannels: ['naver_place', 'organic_search', 'sem']
    },
    creator_economy: {
      keyMetrics: ['Subscriber Count', 'Engagement Rate', 'View Count', 'Watch Time'],
      priorityChannels: ['youtube', 'social_media', 'organic_search']
    },
    media: {
      keyMetrics: ['Monthly Traffic', 'Avg Session Duration', 'Pages per Session'],
      priorityChannels: ['organic_search', 'social_media', 'email']
    },
    healthcare: {
      keyMetrics: ['Appointment Conversion Rate', 'Trust Score', 'Review Rating'],
      priorityChannels: ['naver_place', 'organic_search', 'sem']
    },
    services: {
      keyMetrics: ['Consultation Booking Rate', 'Trust Score', 'Content Engagement'],
      priorityChannels: ['organic_search', 'naver_place', 'sem']
    },
    non_profit: {
      keyMetrics: ['Awareness Reach', 'Donation Rate', 'Content Share Rate'],
      priorityChannels: ['social_media', 'organic_search', 'email']
    },
    food_beverage: {
      keyMetrics: ['Visit/Order Conversion Rate', 'Review Rating', 'Review Count'],
      priorityChannels: ['naver_place', 'social_media', 'organic_search']
    }
  }

  return defaults[industry] || { keyMetrics: [], priorityChannels: [] }
}

/**
 * 기본 수익 모델
 */
function getDefaultRevenueModel(industry: IndustryType): string {
  const models: Record<IndustryType, string> = {
    ecommerce: '구매',
    saas: '구독',
    local_business: '예약/방문',
    creator_economy: '광고/후원',
    media: '광고/구독',
    healthcare: '예약/진료',
    services: '상담/서비스',
    non_profit: '기부',
    food_beverage: '예약/주문'
  }

  return models[industry] || '기타'
}

/**
 * 업종별 특징
 */
function getIndustryCharacteristics(industry: IndustryType): string[] {
  const characteristics: Record<IndustryType, string[]> = {
    ecommerce: ['구매 최적화', '전환율', '장바구니', '리뷰'],
    saas: ['리드 생성', '구독', 'LTV', '전문성'],
    local_business: ['지역 검색', '예약', '리뷰', '위치'],
    creator_economy: ['팬덤', '참여도', '콘텐츠', '구독자'],
    media: ['트래픽', '체류 시간', '구독', '공유'],
    healthcare: ['신뢰', '예약', '정보', '안전성'],
    services: ['신뢰', '전문성', '상담', '경력'],
    non_profit: ['인식', '기부', '투명성', '임팩트'],
    food_beverage: ['리뷰', '위치', '메뉴', '예약']
  }

  return characteristics[industry] || []
}

/**
 * 수동 업종 선택
 */
export function selectIndustryManually(industry: IndustryType): IndustryProfile {
  const { keyMetrics, priorityChannels } = getIndustryDefaults(industry)

  return {
    industry_type: industry,
    confidence: 100,
    key_metrics: keyMetrics,
    priority_channels: priorityChannels,
    revenue_model: getDefaultRevenueModel(industry),
    characteristics: getIndustryCharacteristics(industry)
  }
}
