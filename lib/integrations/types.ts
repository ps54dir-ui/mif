/**
 * 데이터 통합 레이어 - 타입 정의
 */

export interface DateRange {
  startDate: string // YYYY-MM-DD
  endDate: string // YYYY-MM-DD
}

// ========== GA4 데이터 타입 ==========

export interface GA4Config {
  propertyId: string
  credentialsPath?: string
  refreshInterval: number // ms
}

export interface SessionMetrics {
  sessions: number
  users: number
  bounce_rate: number
  avg_session_duration: number // seconds
  returning_user_rate: number
}

export interface PagePerformance {
  pageviews: number
  unique_pageviews: number
  scroll_depth_25: number // %
  scroll_depth_50: number
  scroll_depth_75: number
  scroll_depth_100: number
  avg_time_on_page: number // seconds
  bounce_rate: number
}

export interface PagePerformanceMap {
  [pagePath: string]: PagePerformance
}

export interface FunnelMetrics {
  step_1_view_item: number
  step_2_add_to_cart: number
  step_3_begin_checkout: number
  step_4_purchase: number
  cart_add_rate: number // (add_to_cart / view_item)%
  checkout_rate: number // (begin_checkout / add_to_cart)%
  purchase_rate: number // (purchase / begin_checkout)%
  overall_cvr: number // (purchase / view_item)%
}

export interface ChannelMetrics {
  sessions: number
  users: number
  cvr: number
  avg_order_value: number
  revenue: number
}

export interface ChannelMetricsMap {
  [channel: string]: ChannelMetrics
}

export interface EventFlow {
  view_item: number
  add_to_cart: number
  begin_checkout: number
  purchase: number
  refund: number
}

export interface CartAbandonmentAnalysis {
  add_to_cart_events: number
  checkout_events: number
  abandonment_rate: number // (add_to_cart - checkout) / add_to_cart
}

export interface RefundAnalysis {
  purchases: number
  refunds: number
  refund_rate: number
}

export interface WebVitals {
  lcp_avg: number // ms
  fid_avg: number // ms
  cls_avg: number
}

export interface GA4Data {
  sessionMetrics: SessionMetrics
  pagePerformance: PagePerformanceMap
  funnelAnalysis: FunnelMetrics
  byChannel: ChannelMetricsMap
  eventFlow: EventFlow
  cartAbandonmentAnalysis: CartAbandonmentAnalysis
  refundAnalysis: RefundAnalysis
  webVitals: WebVitals
}

// ========== 네이버 스마트스토어 데이터 타입 ==========

export interface NaverConfig {
  accessToken: string
  refreshToken: string
  storeId: string
  refreshInterval: number // ms
}

export interface ProductSales {
  product_id: string
  product_name: string
  sales: number
  quantity: number
  return_rate: number
}

export interface SalesData {
  total_revenue: number
  order_count: number
  avg_order_value: number
  product_count: number
  by_product: ProductSales[]
}

export interface RatingDistribution {
  "5": number
  "4": number
  "3": number
  "2": number
  "1": number
}

export interface Review {
  rating: number
  content: string
  created_date: string
  helpful_count: number
}

export interface ReviewMetrics {
  total_reviews: number
  average_rating: number // 5점 만점
  rating_distribution: RatingDistribution
  helpful_rate: number // 도움이 되었어요 비율
  recent_reviews: Review[]
  sentiment_scores?: {
    positive: number
    neutral: number
    negative: number
  }
}

export interface SearchKeyword {
  keyword: string
  search_count: number
  click_count: number
  ctr: number // (click/search)%
  order_count: number
  revenue: number
  cvr: number // (order/click)%
}

export interface RankingInfo {
  category_rank: number
  search_rank: number
  best_rank: number
}

export interface CancellationAndReturns {
  cancellation_count: number
  cancellation_rate: number
  return_count: number
  return_rate: number
  avg_return_reason: string
}

export interface CategoryMetrics {
  category: string
  sales: number
  order_count: number
  avg_rating: number
  review_count: number
}

export interface NaverData {
  salesData: SalesData
  reviews: ReviewMetrics
  searchKeywords: SearchKeyword[]
  ranking: RankingInfo
  cancellationAndReturns: CancellationAndReturns
  byCategory: CategoryMetrics[]
}

// ========== 쿠팡 데이터 타입 ==========

export interface CoupangConfig {
  accessKey: string
  secretKey: string
  vendorId: string
  refreshInterval: number // ms
}

export interface CoupangSales {
  total_revenue: number
  order_count: number
  avg_order_value: number
  cancellation_count: number
  cancellation_rate: number
}

export interface ReturnReason {
  reason: string
  count: number
}

export interface CoupangReturns {
  return_count: number
  return_rate: number
  return_reasons: ReturnReason[]
}

export interface ShippingMetrics {
  avg_delivery_time: number // 일
  on_time_rate: number
  return_shipping_time: number // 일
}

export interface CoupangSatisfaction {
  rating: number
  review_count: number
  rating_distribution: RatingDistribution
}

export interface CoupangRanking {
  category_rank: number
  search_rank: number
}

export interface CoupangKeyword {
  keyword: string
  search_count: number
  click_count: number
  order_count: number
}

export interface CoupangData {
  sales: CoupangSales
  returns: CoupangReturns
  shipping: ShippingMetrics
  satisfaction: CoupangSatisfaction
  ranking: CoupangRanking
  keywords: CoupangKeyword[]
}

// ========== 통합 데이터 타입 ==========

export interface IntegratedData {
  ga4: GA4Data
  naver: NaverData
  coupang: CoupangData
  timestamp: Date
  dateRange: DateRange
}

export interface ChannelComparison {
  ga4: {
    traffic: number
    cvr: number
    aov: number
    revenue: number
  }
  naver: {
    traffic: number
    cvr: number
    aov: number
    revenue: number
  }
  coupang: {
    traffic: number
    cvr: number
    aov: number
    revenue: number
  }
}

export interface CustomerJourney {
  discovery: {
    channel: string
    timestamp: Date
    source: string
  }
  consideration: {
    searches: number
    pageviews: number
    time_spent: number
  }
  purchase: {
    channel: string
    amount: number
    timestamp: Date
  }
  post_purchase: {
    return_rate: number
    satisfaction: number
    repeat_purchase: boolean
  }
}

export interface CustomerSegments {
  new_customers: number
  loyal_customers: number
  at_risk: number
  high_value: number
}

export interface IntegratedDashboardData {
  summary: {
    total_sessions: number
    total_revenue: number
    overall_cvr: number
    avg_satisfaction: number
    return_rate: number
  }
  channelComparison: ChannelComparison
  detailedPageScore: {
    first_impression: number
    trust_credibility: number
    persuasion: number
    structure_ux: number
    conversion: number
    technical: number
    engagement: number
    overall_score: number
  }
  cvrPrediction: {
    current_cvr: number
    projected_cvr: number
    confidence: number
  }
  customerJourney: CustomerJourney
  customerSegments: CustomerSegments
  timestamp: Date
}

// ========== 설정 타입 ==========

export interface IntegrationConfig {
  ga4: GA4Config
  naver: NaverConfig
  coupang: CoupangConfig
}
