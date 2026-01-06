/**
 * 업종별 마케팅 진단 설정
 * 각 업종의 특성에 맞는 지표, 가중치, 채널 우선순위 정의
 */

export type IndustryType =
  | 'ecommerce'
  | 'saas'
  | 'services'
  | 'healthcare'
  | 'food_beverage'
  | 'local_business'
  | 'creator_economy'
  | 'media'
  | 'non_profit'

export interface IndustryMetric {
  name: string
  weight: number // 0-100, 총합 100
  description: string
  benchmarkKey: string // benchmarks.ts의 메트릭 키
}

export interface IndustryChannelPriority {
  channel: string
  priority: number // 1-10, 높을수록 중요
  weight: number // 0-100, 총합 100
  description: string
}

export interface IndustryConfig {
  id: IndustryType
  name: string
  description: string
  primaryGoal: string // 주요 목표 (예: "전환율 최대화", "리드 생성")
  metrics: IndustryMetric[]
  channelPriorities: IndustryChannelPriority[]
  psychologyTriggers: {
    primary: string[] // 주요 심리 트리거
    secondary: string[]
    description: string
  }
  checklistCategories: {
    category: string
    weight: number // 0-100
    description: string
  }[]
}

/**
 * 업종별 설정
 */
export const INDUSTRY_CONFIGS: Record<IndustryType, IndustryConfig> = {
  // 1. 전자상거래/쇼핑
  ecommerce: {
    id: 'ecommerce',
    name: '전자상거래/쇼핑',
    description: '온라인 쇼핑몰, 마켓플레이스, 구매 최적화 중심',
    primaryGoal: '전환율(CVR) 최대화 및 평균 주문 금액(AOV) 향상',
    metrics: [
      {
        name: '전환율 (CVR)',
        weight: 30,
        description: '방문자 대비 구매 전환 비율',
        benchmarkKey: 'conversion_rate'
      },
      {
        name: '평균 주문 금액 (AOV)',
        weight: 20,
        description: '주문당 평균 결제 금액',
        benchmarkKey: 'aov'
      },
      {
        name: '장바구니 이탈률',
        weight: 15,
        description: '장바구니 추가 후 구매하지 않은 비율',
        benchmarkKey: 'cart_abandonment_rate'
      },
      {
        name: '재방문율',
        weight: 15,
        description: '재구매 고객 비율',
        benchmarkKey: 'return_visitor_rate'
      },
      {
        name: '유기 검색 트래픽',
        weight: 10,
        description: 'SEO를 통한 자연 유입',
        benchmarkKey: 'organic_traffic'
      },
      {
        name: '광고 ROAS',
        weight: 10,
        description: '광고 투자 대비 매출',
        benchmarkKey: 'roas'
      }
    ],
    channelPriorities: [
      {
        channel: 'meta_ads',
        priority: 10,
        weight: 25,
        description: 'Meta 광고는 전자상거래의 핵심 유입 채널'
      },
      {
        channel: 'ga4_funnel',
        priority: 9,
        weight: 20,
        description: 'GA4 퍼널 분석으로 전환 경로 최적화'
      },
      {
        channel: 'naver_place',
        priority: 8,
        weight: 15,
        description: '네이버 플레이스 (오프라인 연계)'
      },
      {
        channel: 'organic_search',
        priority: 7,
        weight: 15,
        description: 'SEO를 통한 자연 유입'
      },
      {
        channel: 'sem',
        priority: 6,
        weight: 10,
        description: '검색 광고 (Google Ads, Naver Ads)'
      },
      {
        channel: 'social_media',
        priority: 5,
        weight: 10,
        description: '소셜 미디어 마케팅'
      },
      {
        channel: 'email',
        priority: 4,
        weight: 5,
        description: '이메일 마케팅 (재구매 유도)'
      }
    ],
    psychologyTriggers: {
      primary: ['희소성', '사회적 증거', '가격 프레임', '즉시 구매 유도'],
      secondary: ['신뢰', '편의성', '보상 시스템'],
      description: '전자상거래는 희소성(재고 부족, 시간 제한)과 사회적 증거(리뷰, 판매량)가 핵심'
    },
    checklistCategories: [
      {
        category: '상품 페이지 최적화',
        weight: 30,
        description: '상품 설명, 이미지, 가격 표시, CTA 버튼'
      },
      {
        category: '전환 퍼널 최적화',
        weight: 25,
        description: '장바구니, 결제 프로세스, 이탈 방지'
      },
      {
        category: 'SEO & 스키마 마크업',
        weight: 20,
        description: '상품 스키마, 리뷰 스키마, 가격 마크업'
      },
      {
        category: '광고 최적화',
        weight: 15,
        description: 'Meta Ads, Google Ads 성과 최적화'
      },
      {
        category: '재구매 전략',
        weight: 10,
        description: '이메일 마케팅, 리타겟팅, 로열티 프로그램'
      }
    ]
  },

  // 2. SaaS/B2B Software
  saas: {
    id: 'saas',
    name: 'SaaS/B2B Software',
    description: '구독형 소프트웨어, 엔터프라이즈 솔루션, 리드 생성 중심',
    primaryGoal: '리드 생성 및 전환, LTV(고객 생애 가치) 최대화',
    metrics: [
      {
        name: '리드 생성률',
        weight: 25,
        description: '방문자 대비 리드(연락처) 획득 비율',
        benchmarkKey: 'lead_generation_rate'
      },
      {
        name: '리드 → 고객 전환율',
        weight: 20,
        description: '리드가 실제 고객으로 전환되는 비율',
        benchmarkKey: 'lead_to_customer_rate'
      },
      {
        name: '평균 고객 생애 가치 (LTV)',
        weight: 20,
        description: '고객이 평생 지불할 예상 금액',
        benchmarkKey: 'ltv'
      },
      {
        name: '체류 시간',
        weight: 15,
        description: '사용자가 사이트에 머무는 시간',
        benchmarkKey: 'avg_session_duration'
      },
      {
        name: '콘텐츠 다운로드율',
        weight: 10,
        description: '백서, 가이드 다운로드 비율',
        benchmarkKey: 'content_download_rate'
      },
      {
        name: '데모 예약률',
        weight: 10,
        description: '데모 예약 비율',
        benchmarkKey: 'demo_booking_rate'
      }
    ],
    channelPriorities: [
      {
        channel: 'organic_search',
        priority: 10,
        weight: 30,
        description: 'SEO는 SaaS의 핵심 채널 (문제 해결형 콘텐츠)'
      },
      {
        channel: 'sem',
        priority: 9,
        weight: 25,
        description: 'Google Ads, LinkedIn Ads (B2B 타겟팅)'
      },
      {
        channel: 'social_media',
        priority: 7,
        weight: 15,
        description: 'LinkedIn, Twitter (B2B 소셜)'
      },
      {
        channel: 'email',
        priority: 6,
        weight: 15,
        description: '이메일 마케팅 (리드 네어팅)'
      },
      {
        channel: 'ga4_funnel',
        priority: 8,
        weight: 10,
        description: 'GA4 퍼널 분석'
      },
      {
        channel: 'meta_ads',
        priority: 4,
        weight: 5,
        description: 'Meta Ads (B2C 타겟팅)'
      }
    ],
    psychologyTriggers: {
      primary: ['신뢰', '전문성', '복잡도 제거', '비교 우위'],
      secondary: ['사회적 증거', '무료 체험', 'ROI 명시'],
      description: 'SaaS는 신뢰와 전문성이 핵심. 복잡한 제품을 단순하게 설명하고 비교 우위를 강조'
    },
    checklistCategories: [
      {
        category: '문제 해결형 콘텐츠',
        weight: 30,
        description: '블로그, 가이드, 백서, 케이스 스터디'
      },
      {
        category: '랜딩 페이지 최적화',
        weight: 25,
        description: '리드 생성 폼, CTA, 가치 제안'
      },
      {
        category: 'SEO & 기술 문서',
        weight: 20,
        description: 'API 문서, 비교 문서, FAQ'
      },
      {
        category: '리드 네어팅',
        weight: 15,
        description: '이메일 시퀀스, 웨비나, 데모 예약'
      },
      {
        category: '사회적 증거',
        weight: 10,
        description: '고객 사례, 로고, 테스트모니얼'
      }
    ]
  },

  // 3. Services/전문서비스
  services: {
    id: 'services',
    name: 'Services/전문서비스',
    description: '법률, 회계, 컨설팅, 부동산, 금융 - 신뢰도 + 전문성 중심',
    primaryGoal: '신뢰도 구축 및 상담 예약 최대화',
    metrics: [
      {
        name: '상담 예약률',
        weight: 30,
        description: '방문자 대비 상담 예약 비율',
        benchmarkKey: 'consultation_booking_rate'
      },
      {
        name: '신뢰도 지수',
        weight: 25,
        description: '리뷰, 인증, 경력 기반 신뢰 점수',
        benchmarkKey: 'trust_score'
      },
      {
        name: '콘텐츠 참여도',
        weight: 20,
        description: '블로그, 가이드 읽기, 다운로드',
        benchmarkKey: 'content_engagement'
      },
      {
        name: '전화/문의 클릭률',
        weight: 15,
        description: '전화 걸기, 문의하기 버튼 클릭률',
        benchmarkKey: 'contact_click_rate'
      },
      {
        name: '재방문율',
        weight: 10,
        description: '재방문 고객 비율',
        benchmarkKey: 'return_visitor_rate'
      }
    ],
    channelPriorities: [
      {
        channel: 'organic_search',
        priority: 10,
        weight: 35,
        description: 'SEO는 전문서비스의 핵심 (지역 키워드)'
      },
      {
        channel: 'naver_place',
        priority: 9,
        weight: 25,
        description: '네이버 플레이스 (로컬 검색)'
      },
      {
        channel: 'sem',
        priority: 7,
        weight: 15,
        description: '검색 광고 (지역 타겟팅)'
      },
      {
        channel: 'social_media',
        priority: 5,
        weight: 10,
        description: 'LinkedIn, Facebook (전문성 강조)'
      },
      {
        channel: 'email',
        priority: 4,
        weight: 10,
        description: '뉴스레터, 전문 콘텐츠'
      },
      {
        channel: 'ga4_funnel',
        priority: 5,
        weight: 5,
        description: 'GA4 분석'
      }
    ],
    psychologyTriggers: {
      primary: ['신뢰', '전문성', '경력', '인증'],
      secondary: ['사회적 증거', '케이스 스터디', '명확한 가격'],
      description: '전문서비스는 신뢰와 전문성이 모든 것. 경력, 인증, 케이스 스터디가 핵심'
    },
    checklistCategories: [
      {
        category: '신뢰 구축 요소',
        weight: 35,
        description: '인증, 경력, 수상 내역, 고객 사례'
      },
      {
        category: '지역 SEO',
        weight: 25,
        description: '지역 키워드, Google My Business, 위치 페이지'
      },
      {
        category: '콘텐츠 마케팅',
        weight: 20,
        description: '전문 블로그, 가이드, FAQ'
      },
      {
        category: '상담 예약 최적화',
        weight: 15,
        description: '예약 폼, 전화 걸기, 문의하기 CTA'
      },
      {
        category: '리뷰 관리',
        weight: 5,
        description: '리뷰 수집, 답변, 평점 관리'
      }
    ]
  },

  // 4. Healthcare/건강
  healthcare: {
    id: 'healthcare',
    name: 'Healthcare/건강',
    description: '의료, 치과, 약국, 웰니스, 피트니스 - 신뢰도 + 정보 중심',
    primaryGoal: '예약/방문 최대화 및 신뢰도 구축',
    metrics: [
      {
        name: '예약/방문 전환율',
        weight: 30,
        description: '방문자 대비 예약/방문 비율',
        benchmarkKey: 'appointment_conversion_rate'
      },
      {
        name: '신뢰도 지수',
        weight: 25,
        description: '의료진 정보, 인증, 리뷰 기반 신뢰 점수',
        benchmarkKey: 'trust_score'
      },
      {
        name: '정보 콘텐츠 참여도',
        weight: 20,
        description: '건강 정보, FAQ 읽기',
        benchmarkKey: 'health_content_engagement'
      },
      {
        name: '전화/예약 클릭률',
        weight: 15,
        description: '전화 걸기, 예약하기 버튼 클릭률',
        benchmarkKey: 'appointment_click_rate'
      },
      {
        name: '재방문율',
        weight: 10,
        description: '재방문 환자 비율',
        benchmarkKey: 'return_visitor_rate'
      }
    ],
    channelPriorities: [
      {
        channel: 'naver_place',
        priority: 10,
        weight: 30,
        description: '네이버 플레이스 (의료기관 검색)'
      },
      {
        channel: 'organic_search',
        priority: 9,
        weight: 25,
        description: 'SEO (건강 정보, 증상 검색)'
      },
      {
        channel: 'sem',
        priority: 7,
        weight: 20,
        description: '검색 광고 (지역 타겟팅)'
      },
      {
        channel: 'social_media',
        priority: 5,
        weight: 15,
        description: 'Instagram, Facebook (웰니스 콘텐츠)'
      },
      {
        channel: 'ga4_funnel',
        priority: 5,
        weight: 10,
        description: 'GA4 분석'
      }
    ],
    psychologyTriggers: {
      primary: ['신뢰', '전문성', '안전성', '접근성'],
      secondary: ['사회적 증거', '명확한 정보', '편의성'],
      description: '의료는 신뢰와 안전성이 최우선. 의료진 정보, 인증, 명확한 정보 제공이 핵심'
    },
    checklistCategories: [
      {
        category: '의료진 & 시설 정보',
        weight: 30,
        description: '의료진 프로필, 시설 사진, 인증 표시'
      },
      {
        category: '건강 정보 콘텐츠',
        weight: 25,
        description: '건강 블로그, FAQ, 증상 가이드'
      },
      {
        category: '예약 시스템 최적화',
        weight: 20,
        description: '온라인 예약, 전화 걸기, 위치 안내'
      },
      {
        category: '지역 SEO',
        weight: 15,
        description: '지역 키워드, Google My Business, 네이버 플레이스'
      },
      {
        category: '리뷰 관리',
        weight: 10,
        description: '환자 리뷰 수집, 답변, 평점 관리'
      }
    ]
  },

  // 5. Food & Beverage/식음료
  food_beverage: {
    id: 'food_beverage',
    name: 'Food & Beverage/식음료',
    description: '음식점, 카페, 배달, 온라인 식품 판매 - 위치 기반 + 리뷰 중심',
    primaryGoal: '방문/주문 전환율 최대화 및 리뷰 관리',
    metrics: [
      {
        name: '방문/주문 전환율',
        weight: 30,
        description: '방문자 대비 실제 방문/주문 비율',
        benchmarkKey: 'visit_order_conversion_rate'
      },
      {
        name: '리뷰 평점',
        weight: 25,
        description: '평균 리뷰 평점 (4.5점 이상 목표)',
        benchmarkKey: 'review_rating'
      },
      {
        name: '리뷰 수',
        weight: 15,
        description: '총 리뷰 수 (신뢰도 지표)',
        benchmarkKey: 'review_count'
      },
      {
        name: '메뉴/상품 조회수',
        weight: 15,
        description: '메뉴, 상품 페이지 조회수',
        benchmarkKey: 'menu_view_count'
      },
      {
        name: '예약/주문 클릭률',
        weight: 10,
        description: '예약하기, 주문하기 버튼 클릭률',
        benchmarkKey: 'booking_order_click_rate'
      },
      {
        name: '재방문율',
        weight: 5,
        description: '재방문 고객 비율',
        benchmarkKey: 'return_visitor_rate'
      }
    ],
    channelPriorities: [
      {
        channel: 'naver_place',
        priority: 10,
        weight: 35,
        description: '네이버 플레이스 (음식점 검색)'
      },
      {
        channel: 'social_media',
        priority: 9,
        weight: 25,
        description: 'Instagram, Facebook (음식 사진, 메뉴)'
      },
      {
        channel: 'organic_search',
        priority: 7,
        weight: 15,
        description: 'SEO (지역 키워드, 메뉴 검색)'
      },
      {
        channel: 'sem',
        priority: 6,
        weight: 15,
        description: '검색 광고 (지역 타겟팅)'
      },
      {
        channel: 'ga4_funnel',
        priority: 5,
        weight: 10,
        description: 'GA4 분석'
      }
    ],
    psychologyTriggers: {
      primary: ['시각적 매력', '리뷰', '위치 근접성', '시간 긴급성'],
      secondary: ['메뉴 다양성', '가격', '분위기'],
      description: '식음료는 시각적 매력(음식 사진)과 리뷰가 핵심. 위치 근접성과 시간 긴급성(영업시간)도 중요'
    },
    checklistCategories: [
      {
        category: '음식 사진 & 메뉴',
        weight: 30,
        description: '고품질 음식 사진, 메뉴 설명, 가격 표시'
      },
      {
        category: '리뷰 관리',
        weight: 25,
        description: '리뷰 수집, 답변, 평점 관리, 사진 리뷰 유도'
      },
      {
        category: '지역 SEO',
        weight: 20,
        description: '지역 키워드, Google My Business, 네이버 플레이스'
      },
      {
        category: '소셜 미디어',
        weight: 15,
        description: 'Instagram, Facebook (음식 사진, 이벤트)'
      },
      {
        category: '예약/주문 시스템',
        weight: 10,
        description: '온라인 예약, 배달 주문, 전화 걸기'
      }
    ]
  },

  // 6. Local Business/로컬 비즈니스
  local_business: {
    id: 'local_business',
    name: 'Local Business/로컬 비즈니스',
    description: '미용실, 카페, 식당, 피트니스, 클리닉 - 지역 검색 최적화 중심',
    primaryGoal: '지역 검색 노출 최대화 및 방문 전환',
    metrics: [
      {
        name: '지역 검색 순위',
        weight: 35,
        description: '지역 키워드 검색 시 상위 노출 여부',
        benchmarkKey: 'local_search_ranking'
      },
      {
        name: '방문 전환율',
        weight: 25,
        description: '방문자 대비 실제 방문 비율',
        benchmarkKey: 'visit_conversion_rate'
      },
      {
        name: '리뷰 평점',
        weight: 20,
        description: '평균 리뷰 평점',
        benchmarkKey: 'review_rating'
      },
      {
        name: '전화/길찾기 클릭률',
        weight: 15,
        description: '전화 걸기, 길 찾기 버튼 클릭률',
        benchmarkKey: 'contact_directions_click_rate'
      },
      {
        name: '재방문율',
        weight: 5,
        description: '재방문 고객 비율',
        benchmarkKey: 'return_visitor_rate'
      }
    ],
    channelPriorities: [
      {
        channel: 'naver_place',
        priority: 10,
        weight: 40,
        description: '네이버 플레이스 (로컬 검색의 핵심)'
      },
      {
        channel: 'organic_search',
        priority: 9,
        weight: 30,
        description: 'SEO (지역 키워드 최적화)'
      },
      {
        channel: 'sem',
        priority: 6,
        weight: 15,
        description: '검색 광고 (지역 타겟팅)'
      },
      {
        channel: 'social_media',
        priority: 5,
        weight: 10,
        description: 'Instagram, Facebook (지역 커뮤니티)'
      },
      {
        channel: 'ga4_funnel',
        priority: 4,
        weight: 5,
        description: 'GA4 분석'
      }
    ],
    psychologyTriggers: {
      primary: ['위치 근접성', '리뷰', '시간 긴급성', '편의성'],
      secondary: ['신뢰', '가격', '접근성'],
      description: '로컬 비즈니스는 위치 근접성이 최우선. 리뷰와 시간 긴급성(영업시간)도 중요'
    },
    checklistCategories: [
      {
        category: '지역 SEO',
        weight: 40,
        description: '지역 키워드, Google My Business, 네이버 플레이스, 위치 페이지'
      },
      {
        category: '리뷰 관리',
        weight: 25,
        description: '리뷰 수집, 답변, 평점 관리'
      },
      {
        category: '위치 정보 최적화',
        weight: 20,
        description: '정확한 주소, 지도, 전화번호, 영업시간'
      },
      {
        category: '소셜 미디어',
        weight: 10,
        description: 'Instagram, Facebook (지역 이벤트, 프로모션)'
      },
      {
        category: '예약 시스템',
        weight: 5,
        description: '온라인 예약, 전화 걸기'
      }
    ]
  },

  // 7. Creator Economy/크리에이터
  creator_economy: {
    id: 'creator_economy',
    name: 'Creator Economy/크리에이터',
    description: '유튜버, 스트리머, 인플루언서, 블로거 - 팬덤 + 참여도 중심',
    primaryGoal: '팬덤 형성 및 참여도 최대화, 수익화',
    metrics: [
      {
        name: '구독자/팔로워 수',
        weight: 25,
        description: '총 구독자/팔로워 수',
        benchmarkKey: 'subscriber_count'
      },
      {
        name: '참여도 (Engagement Rate)',
        weight: 25,
        description: '좋아요, 댓글, 공유 비율',
        benchmarkKey: 'engagement_rate'
      },
      {
        name: '조회수/조회율',
        weight: 20,
        description: '영상/콘텐츠 조회수',
        benchmarkKey: 'view_count'
      },
      {
        name: '평균 시청 시간',
        weight: 15,
        description: '영상 평균 시청 시간',
        benchmarkKey: 'avg_watch_time'
      },
      {
        name: '수익화율',
        weight: 10,
        description: '구독자 대비 수익화 비율',
        benchmarkKey: 'monetization_rate'
      },
      {
        name: '커뮤니티 성장률',
        weight: 5,
        description: '구독자/팔로워 성장률',
        benchmarkKey: 'community_growth_rate'
      }
    ],
    channelPriorities: [
      {
        channel: 'youtube',
        priority: 10,
        weight: 35,
        description: 'YouTube (크리에이터의 핵심 플랫폼)'
      },
      {
        channel: 'social_media',
        priority: 9,
        weight: 30,
        description: 'TikTok, Instagram, Twitter (숏폼, 스토리)'
      },
      {
        channel: 'organic_search',
        priority: 6,
        weight: 15,
        description: 'SEO (블로그, 웹사이트)'
      },
      {
        channel: 'email',
        priority: 5,
        weight: 10,
        description: '뉴스레터, 팬 커뮤니티'
      },
      {
        channel: 'ga4_funnel',
        priority: 4,
        weight: 10,
        description: 'GA4 분석'
      }
    ],
    psychologyTriggers: {
      primary: ['도파민', '공감', '팬덤 형성', '참여 유도'],
      secondary: ['신뢰', '일관성', '독창성'],
      description: '크리에이터는 도파민 자극(재미, 감동)과 팬덤 형성이 핵심. 참여 유도(댓글, 좋아요)도 중요'
    },
    checklistCategories: [
      {
        category: '콘텐츠 전략',
        weight: 30,
        description: '썸네일, 제목, 후킹, 스토리텔링'
      },
      {
        category: '참여도 최적화',
        weight: 25,
        description: '댓글 유도, 좋아요, 공유, 구독 유도'
      },
      {
        category: '채널 다양화',
        weight: 20,
        description: 'YouTube, TikTok, Instagram 크로스 포스팅'
      },
      {
        category: '커뮤니티 구축',
        weight: 15,
        description: '디스코드, 텔레그램, 뉴스레터'
      },
      {
        category: '수익화 전략',
        weight: 10,
        description: '스폰서십, 멤버십, 굿즈 판매'
      }
    ]
  },

  // 8. Media/출판
  media: {
    id: 'media',
    name: 'Media/출판',
    description: '뉴스 매체, 팟캐스트, 온라인 교육, 코스 - 트래픽 + 체류시간 중심',
    primaryGoal: '트래픽 최대화 및 체류 시간 증가',
    metrics: [
      {
        name: '월간 트래픽',
        weight: 25,
        description: '월간 총 방문자 수',
        benchmarkKey: 'monthly_traffic'
      },
      {
        name: '평균 체류 시간',
        weight: 25,
        description: '사용자 평균 체류 시간',
        benchmarkKey: 'avg_session_duration'
      },
      {
        name: '페이지뷰/세션',
        weight: 20,
        description: '세션당 평균 페이지뷰',
        benchmarkKey: 'pages_per_session'
      },
      {
        name: '재방문율',
        weight: 15,
        description: '재방문 사용자 비율',
        benchmarkKey: 'return_visitor_rate'
      },
      {
        name: '구독/뉴스레터 가입률',
        weight: 10,
        description: '구독, 뉴스레터 가입 비율',
        benchmarkKey: 'subscription_rate'
      },
      {
        name: '콘텐츠 공유율',
        weight: 5,
        description: '콘텐츠 공유 비율',
        benchmarkKey: 'content_share_rate'
      }
    ],
    channelPriorities: [
      {
        channel: 'organic_search',
        priority: 10,
        weight: 35,
        description: 'SEO는 미디어의 핵심 (뉴스, 기사 검색)'
      },
      {
        channel: 'social_media',
        priority: 9,
        weight: 25,
        description: 'Twitter, Facebook (뉴스 공유)'
      },
      {
        channel: 'email',
        priority: 7,
        weight: 15,
        description: '뉴스레터, 이메일 마케팅'
      },
      {
        channel: 'sem',
        priority: 6,
        weight: 15,
        description: '검색 광고 (트렌딩 키워드)'
      },
      {
        channel: 'ga4_funnel',
        priority: 5,
        weight: 10,
        description: 'GA4 분석'
      }
    ],
    psychologyTriggers: {
      primary: ['호기심', '최신성', '신뢰', '독점성'],
      secondary: ['공유 가치', '논쟁성', '실용성'],
      description: '미디어는 호기심과 최신성이 핵심. 신뢰할 수 있는 정보와 독점성(특종)도 중요'
    },
    checklistCategories: [
      {
        category: '콘텐츠 SEO',
        weight: 30,
        description: '뉴스 SEO, 기사 최적화, 헤드라인, 메타 태그'
      },
      {
        category: '체류 시간 최적화',
        weight: 25,
        description: '관련 기사 추천, 인피니트 스크롤, 내부 링크'
      },
      {
        category: '소셜 공유 최적화',
        weight: 20,
        description: '소셜 공유 버튼, 오픈 그래프 태그'
      },
      {
        category: '뉴스레터 & 구독',
        weight: 15,
        description: '뉴스레터 가입, 구독 CTA'
      },
      {
        category: '모바일 최적화',
        weight: 10,
        description: '모바일 읽기 경험, AMP'
      }
    ]
  },

  // 9. Non-Profit/시민단체
  non_profit: {
    id: 'non_profit',
    name: 'Non-Profit/시민단체',
    description: 'NGO, 기부 플랫폼, 자선단체 - 인식 확대 + 참여 중심',
    primaryGoal: '인식 확대 및 기부/참여 전환',
    metrics: [
      {
        name: '인식 확대율',
        weight: 25,
        description: '브랜드 인지도, 도달 범위',
        benchmarkKey: 'awareness_reach'
      },
      {
        name: '기부/참여 전환율',
        weight: 25,
        description: '방문자 대비 기부/참여 비율',
        benchmarkKey: 'donation_participation_rate'
      },
      {
        name: '평균 기부 금액',
        weight: 20,
        description: '기부당 평균 금액',
        benchmarkKey: 'avg_donation_amount'
      },
      {
        name: '콘텐츠 공유율',
        weight: 15,
        description: '콘텐츠 공유 비율',
        benchmarkKey: 'content_share_rate'
      },
      {
        name: '뉴스레터 가입률',
        weight: 10,
        description: '뉴스레터 가입 비율',
        benchmarkKey: 'newsletter_signup_rate'
      },
      {
        name: '자원봉사 신청률',
        weight: 5,
        description: '자원봉사 신청 비율',
        benchmarkKey: 'volunteer_signup_rate'
      }
    ],
    channelPriorities: [
      {
        channel: 'social_media',
        priority: 10,
        weight: 35,
        description: 'Facebook, Instagram (이야기 공유, 캠페인)'
      },
      {
        channel: 'organic_search',
        priority: 8,
        weight: 25,
        description: 'SEO (이슈, 캠페인 검색)'
      },
      {
        channel: 'email',
        priority: 7,
        weight: 20,
        description: '뉴스레터, 기부자 커뮤니케이션'
      },
      {
        channel: 'sem',
        priority: 5,
        weight: 15,
        description: '검색 광고 (캠페인 홍보)'
      },
      {
        channel: 'ga4_funnel',
        priority: 4,
        weight: 5,
        description: 'GA4 분석'
      }
    ],
    psychologyTriggers: {
      primary: ['공감', '사회적 책임', '투명성', '임팩트'],
      secondary: ['신뢰', '긴급성', '공유 가치'],
      description: '비영리는 공감과 사회적 책임이 핵심. 투명성(기부금 사용 내역)과 임팩트(성과)도 중요'
    },
    checklistCategories: [
      {
        category: '이야기 & 임팩트',
        weight: 30,
        description: '이야기 스토리텔링, 성과 보고, 임팩트 시각화'
      },
      {
        category: '기부 프로세스 최적화',
        weight: 25,
        description: '기부 폼, 결제 프로세스, 감사 메시지'
      },
      {
        category: '소셜 공유 최적화',
        weight: 20,
        description: '소셜 공유 버튼, 캠페인 해시태그'
      },
      {
        category: '투명성 & 신뢰',
        weight: 15,
        description: '기부금 사용 내역, 인증, 연간 보고서'
      },
      {
        category: '뉴스레터 & 커뮤니티',
        weight: 10,
        description: '뉴스레터, 자원봉사 신청, 이벤트'
      }
    ]
  }
}

/**
 * 업종별 설정 가져오기
 */
export function getIndustryConfig(industry: IndustryType): IndustryConfig {
  return INDUSTRY_CONFIGS[industry]
}

/**
 * 모든 업종 목록
 */
export function getAllIndustries(): IndustryConfig[] {
  return Object.values(INDUSTRY_CONFIGS)
}

/**
 * 업종별 메트릭 가중치 정규화 (총합 100)
 */
export function normalizeMetricWeights(metrics: IndustryMetric[]): IndustryMetric[] {
  const total = metrics.reduce((sum, m) => sum + m.weight, 0)
  if (total === 0) return metrics
  
  return metrics.map(m => ({
    ...m,
    weight: Math.round((m.weight / total) * 100)
  }))
}

/**
 * 업종별 채널 가중치 정규화 (총합 100)
 */
export function normalizeChannelWeights(channels: IndustryChannelPriority[]): IndustryChannelPriority[] {
  const total = channels.reduce((sum, c) => sum + c.weight, 0)
  if (total === 0) return channels
  
  return channels.map(c => ({
    ...c,
    weight: Math.round((c.weight / total) * 100)
  }))
}
