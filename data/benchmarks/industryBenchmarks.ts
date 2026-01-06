/**
 * 업종별 벤치마크 데이터
 * 각 업종의 특성에 맞는 지표별 Top 1%, 10%, 25%, 중앙값, Bottom 25% 기준값
 */

import { IndustryType } from '../industries/industryConfig'

export interface IndustryBenchmarkTier {
  score: number
  min?: number
  max?: number
  percentile: number
  label: string
}

export interface IndustryBenchmarkData {
  industry: IndustryType
  metrics: Record<string, IndustryBenchmarkTier[]>
  dataSource: string
  lastUpdated: string
}

/**
 * 업종별 벤치마크 데이터
 */
export const INDUSTRY_BENCHMARKS: Record<IndustryType, IndustryBenchmarkData> = {
  // 1. 전자상거래/쇼핑
  ecommerce: {
    industry: 'ecommerce',
    metrics: {
      conversion_rate: [
        { score: 95, min: 0.05, percentile: 99, label: '5% 이상 (상위 1%)' },
        { score: 85, min: 0.03, max: 0.05, percentile: 90, label: '3-5% (상위 10%)' },
        { score: 75, min: 0.02, max: 0.03, percentile: 75, label: '2-3% (상위 25%)' },
        { score: 60, min: 0.01, max: 0.02, percentile: 50, label: '1-2% (중앙값)' },
        { score: 40, min: 0.005, max: 0.01, percentile: 25, label: '0.5-1% (하위 25%)' },
        { score: 20, max: 0.005, percentile: 10, label: '0.5% 미만 (하위 10%)' }
      ],
      aov: [
        { score: 95, min: 200, percentile: 99, label: '200,000원 이상 (상위 1%)' },
        { score: 85, min: 100, max: 200, percentile: 90, label: '100,000-200,000원 (상위 10%)' },
        { score: 75, min: 50, max: 100, percentile: 75, label: '50,000-100,000원 (상위 25%)' },
        { score: 60, min: 30, max: 50, percentile: 50, label: '30,000-50,000원 (중앙값)' },
        { score: 40, min: 15, max: 30, percentile: 25, label: '15,000-30,000원 (하위 25%)' },
        { score: 20, max: 15, percentile: 10, label: '15,000원 미만 (하위 10%)' }
      ],
      cart_abandonment_rate: [
        { score: 95, max: 0.60, percentile: 99, label: '60% 이하 (상위 1%)' },
        { score: 85, min: 0.60, max: 0.70, percentile: 90, label: '60-70% (상위 10%)' },
        { score: 75, min: 0.70, max: 0.75, percentile: 75, label: '70-75% (상위 25%)' },
        { score: 60, min: 0.75, max: 0.80, percentile: 50, label: '75-80% (중앙값)' },
        { score: 40, min: 0.80, max: 0.85, percentile: 25, label: '80-85% (하위 25%)' },
        { score: 20, min: 0.85, percentile: 10, label: '85% 이상 (하위 10%)' }
      ],
      return_visitor_rate: [
        { score: 95, min: 0.40, percentile: 99, label: '40% 이상 (상위 1%)' },
        { score: 85, min: 0.30, max: 0.40, percentile: 90, label: '30-40% (상위 10%)' },
        { score: 75, min: 0.20, max: 0.30, percentile: 75, label: '20-30% (상위 25%)' },
        { score: 60, min: 0.15, max: 0.20, percentile: 50, label: '15-20% (중앙값)' },
        { score: 40, min: 0.10, max: 0.15, percentile: 25, label: '10-15% (하위 25%)' },
        { score: 20, max: 0.10, percentile: 10, label: '10% 미만 (하위 10%)' }
      ],
      organic_traffic: [
        { score: 95, min: 100000, percentile: 99, label: '100,000 이상 (상위 1%)' },
        { score: 85, min: 50000, max: 100000, percentile: 90, label: '50,000-100,000 (상위 10%)' },
        { score: 75, min: 20000, max: 50000, percentile: 75, label: '20,000-50,000 (상위 25%)' },
        { score: 60, min: 5000, max: 20000, percentile: 50, label: '5,000-20,000 (중앙값)' },
        { score: 40, min: 1000, max: 5000, percentile: 25, label: '1,000-5,000 (하위 25%)' },
        { score: 20, max: 1000, percentile: 10, label: '1,000 미만 (하위 10%)' }
      ],
      roas: [
        { score: 95, min: 5.0, percentile: 99, label: '5.0 이상 (상위 1%)' },
        { score: 85, min: 3.0, max: 5.0, percentile: 90, label: '3.0-5.0 (상위 10%)' },
        { score: 75, min: 2.0, max: 3.0, percentile: 75, label: '2.0-3.0 (상위 25%)' },
        { score: 60, min: 1.5, max: 2.0, percentile: 50, label: '1.5-2.0 (중앙값)' },
        { score: 40, min: 1.0, max: 1.5, percentile: 25, label: '1.0-1.5 (하위 25%)' },
        { score: 20, max: 1.0, percentile: 10, label: '1.0 미만 (하위 10%)' }
      ]
    },
    dataSource: 'Shopify, WooCommerce 업계 리포트, Google Analytics 업계 벤치마크 (2024)',
    lastUpdated: '2024-01-01'
  },

  // 2. SaaS/B2B Software
  saas: {
    industry: 'saas',
    metrics: {
      lead_generation_rate: [
        { score: 95, min: 0.10, percentile: 99, label: '10% 이상 (상위 1%)' },
        { score: 85, min: 0.05, max: 0.10, percentile: 90, label: '5-10% (상위 10%)' },
        { score: 75, min: 0.03, max: 0.05, percentile: 75, label: '3-5% (상위 25%)' },
        { score: 60, min: 0.02, max: 0.03, percentile: 50, label: '2-3% (중앙값)' },
        { score: 40, min: 0.01, max: 0.02, percentile: 25, label: '1-2% (하위 25%)' },
        { score: 20, max: 0.01, percentile: 10, label: '1% 미만 (하위 10%)' }
      ],
      lead_to_customer_rate: [
        { score: 95, min: 0.25, percentile: 99, label: '25% 이상 (상위 1%)' },
        { score: 85, min: 0.15, max: 0.25, percentile: 90, label: '15-25% (상위 10%)' },
        { score: 75, min: 0.10, max: 0.15, percentile: 75, label: '10-15% (상위 25%)' },
        { score: 60, min: 0.05, max: 0.10, percentile: 50, label: '5-10% (중앙값)' },
        { score: 40, min: 0.03, max: 0.05, percentile: 25, label: '3-5% (하위 25%)' },
        { score: 20, max: 0.03, percentile: 10, label: '3% 미만 (하위 10%)' }
      ],
      ltv: [
        { score: 95, min: 10000, percentile: 99, label: '10,000,000원 이상 (상위 1%)' },
        { score: 85, min: 5000, max: 10000, percentile: 90, label: '5,000,000-10,000,000원 (상위 10%)' },
        { score: 75, min: 2000, max: 5000, percentile: 75, label: '2,000,000-5,000,000원 (상위 25%)' },
        { score: 60, min: 1000, max: 2000, percentile: 50, label: '1,000,000-2,000,000원 (중앙값)' },
        { score: 40, min: 500, max: 1000, percentile: 25, label: '500,000-1,000,000원 (하위 25%)' },
        { score: 20, max: 500, percentile: 10, label: '500,000원 미만 (하위 10%)' }
      ],
      avg_session_duration: [
        { score: 95, min: 600, percentile: 99, label: '10분 이상 (상위 1%)' },
        { score: 85, min: 300, max: 600, percentile: 90, label: '5-10분 (상위 10%)' },
        { score: 75, min: 180, max: 300, percentile: 75, label: '3-5분 (상위 25%)' },
        { score: 60, min: 120, max: 180, percentile: 50, label: '2-3분 (중앙값)' },
        { score: 40, min: 60, max: 120, percentile: 25, label: '1-2분 (하위 25%)' },
        { score: 20, max: 60, percentile: 10, label: '1분 미만 (하위 10%)' }
      ],
      content_download_rate: [
        { score: 95, min: 0.15, percentile: 99, label: '15% 이상 (상위 1%)' },
        { score: 85, min: 0.10, max: 0.15, percentile: 90, label: '10-15% (상위 10%)' },
        { score: 75, min: 0.05, max: 0.10, percentile: 75, label: '5-10% (상위 25%)' },
        { score: 60, min: 0.03, max: 0.05, percentile: 50, label: '3-5% (중앙값)' },
        { score: 40, min: 0.01, max: 0.03, percentile: 25, label: '1-3% (하위 25%)' },
        { score: 20, max: 0.01, percentile: 10, label: '1% 미만 (하위 10%)' }
      ],
      demo_booking_rate: [
        { score: 95, min: 0.05, percentile: 99, label: '5% 이상 (상위 1%)' },
        { score: 85, min: 0.03, max: 0.05, percentile: 90, label: '3-5% (상위 10%)' },
        { score: 75, min: 0.02, max: 0.03, percentile: 75, label: '2-3% (상위 25%)' },
        { score: 60, min: 0.01, max: 0.02, percentile: 50, label: '1-2% (중앙값)' },
        { score: 40, min: 0.005, max: 0.01, percentile: 25, label: '0.5-1% (하위 25%)' },
        { score: 20, max: 0.005, percentile: 10, label: '0.5% 미만 (하위 10%)' }
      ]
    },
    dataSource: 'HubSpot, Salesforce 업계 리포트, B2B SaaS 벤치마크 (2024)',
    lastUpdated: '2024-01-01'
  },

  // 3. Services/전문서비스
  services: {
    industry: 'services',
    metrics: {
      consultation_booking_rate: [
        { score: 95, min: 0.08, percentile: 99, label: '8% 이상 (상위 1%)' },
        { score: 85, min: 0.05, max: 0.08, percentile: 90, label: '5-8% (상위 10%)' },
        { score: 75, min: 0.03, max: 0.05, percentile: 75, label: '3-5% (상위 25%)' },
        { score: 60, min: 0.02, max: 0.03, percentile: 50, label: '2-3% (중앙값)' },
        { score: 40, min: 0.01, max: 0.02, percentile: 25, label: '1-2% (하위 25%)' },
        { score: 20, max: 0.01, percentile: 10, label: '1% 미만 (하위 10%)' }
      ],
      trust_score: [
        { score: 95, min: 9.0, percentile: 99, label: '9.0 이상 (상위 1%)' },
        { score: 85, min: 8.0, max: 9.0, percentile: 90, label: '8.0-9.0 (상위 10%)' },
        { score: 75, min: 7.0, max: 8.0, percentile: 75, label: '7.0-8.0 (상위 25%)' },
        { score: 60, min: 6.0, max: 7.0, percentile: 50, label: '6.0-7.0 (중앙값)' },
        { score: 40, min: 5.0, max: 6.0, percentile: 25, label: '5.0-6.0 (하위 25%)' },
        { score: 20, max: 5.0, percentile: 10, label: '5.0 미만 (하위 10%)' }
      ],
      content_engagement: [
        { score: 95, min: 0.40, percentile: 99, label: '40% 이상 (상위 1%)' },
        { score: 85, min: 0.30, max: 0.40, percentile: 90, label: '30-40% (상위 10%)' },
        { score: 75, min: 0.20, max: 0.30, percentile: 75, label: '20-30% (상위 25%)' },
        { score: 60, min: 0.15, max: 0.20, percentile: 50, label: '15-20% (중앙값)' },
        { score: 40, min: 0.10, max: 0.15, percentile: 25, label: '10-15% (하위 25%)' },
        { score: 20, max: 0.10, percentile: 10, label: '10% 미만 (하위 10%)' }
      ],
      contact_click_rate: [
        { score: 95, min: 0.15, percentile: 99, label: '15% 이상 (상위 1%)' },
        { score: 85, min: 0.10, max: 0.15, percentile: 90, label: '10-15% (상위 10%)' },
        { score: 75, min: 0.05, max: 0.10, percentile: 75, label: '5-10% (상위 25%)' },
        { score: 60, min: 0.03, max: 0.05, percentile: 50, label: '3-5% (중앙값)' },
        { score: 40, min: 0.01, max: 0.03, percentile: 25, label: '1-3% (하위 25%)' },
        { score: 20, max: 0.01, percentile: 10, label: '1% 미만 (하위 10%)' }
      ],
      return_visitor_rate: [
        { score: 95, min: 0.50, percentile: 99, label: '50% 이상 (상위 1%)' },
        { score: 85, min: 0.40, max: 0.50, percentile: 90, label: '40-50% (상위 10%)' },
        { score: 75, min: 0.30, max: 0.40, percentile: 75, label: '30-40% (상위 25%)' },
        { score: 60, min: 0.20, max: 0.30, percentile: 50, label: '20-30% (중앙값)' },
        { score: 40, min: 0.10, max: 0.20, percentile: 25, label: '10-20% (하위 25%)' },
        { score: 20, max: 0.10, percentile: 10, label: '10% 미만 (하위 10%)' }
      ]
    },
    dataSource: '전문서비스 업계 벤치마크, Google My Business 데이터 (2024)',
    lastUpdated: '2024-01-01'
  },

  // 4. Healthcare/건강
  healthcare: {
    industry: 'healthcare',
    metrics: {
      appointment_conversion_rate: [
        { score: 95, min: 0.10, percentile: 99, label: '10% 이상 (상위 1%)' },
        { score: 85, min: 0.07, max: 0.10, percentile: 90, label: '7-10% (상위 10%)' },
        { score: 75, min: 0.05, max: 0.07, percentile: 75, label: '5-7% (상위 25%)' },
        { score: 60, min: 0.03, max: 0.05, percentile: 50, label: '3-5% (중앙값)' },
        { score: 40, min: 0.02, max: 0.03, percentile: 25, label: '2-3% (하위 25%)' },
        { score: 20, max: 0.02, percentile: 10, label: '2% 미만 (하위 10%)' }
      ],
      trust_score: [
        { score: 95, min: 9.5, percentile: 99, label: '9.5 이상 (상위 1%)' },
        { score: 85, min: 9.0, max: 9.5, percentile: 90, label: '9.0-9.5 (상위 10%)' },
        { score: 75, min: 8.5, max: 9.0, percentile: 75, label: '8.5-9.0 (상위 25%)' },
        { score: 60, min: 8.0, max: 8.5, percentile: 50, label: '8.0-8.5 (중앙값)' },
        { score: 40, min: 7.0, max: 8.0, percentile: 25, label: '7.0-8.0 (하위 25%)' },
        { score: 20, max: 7.0, percentile: 10, label: '7.0 미만 (하위 10%)' }
      ],
      health_content_engagement: [
        { score: 95, min: 0.50, percentile: 99, label: '50% 이상 (상위 1%)' },
        { score: 85, min: 0.40, max: 0.50, percentile: 90, label: '40-50% (상위 10%)' },
        { score: 75, min: 0.30, max: 0.40, percentile: 75, label: '30-40% (상위 25%)' },
        { score: 60, min: 0.20, max: 0.30, percentile: 50, label: '20-30% (중앙값)' },
        { score: 40, min: 0.10, max: 0.20, percentile: 25, label: '10-20% (하위 25%)' },
        { score: 20, max: 0.10, percentile: 10, label: '10% 미만 (하위 10%)' }
      ],
      appointment_click_rate: [
        { score: 95, min: 0.20, percentile: 99, label: '20% 이상 (상위 1%)' },
        { score: 85, min: 0.15, max: 0.20, percentile: 90, label: '15-20% (상위 10%)' },
        { score: 75, min: 0.10, max: 0.15, percentile: 75, label: '10-15% (상위 25%)' },
        { score: 60, min: 0.05, max: 0.10, percentile: 50, label: '5-10% (중앙값)' },
        { score: 40, min: 0.03, max: 0.05, percentile: 25, label: '3-5% (하위 25%)' },
        { score: 20, max: 0.03, percentile: 10, label: '3% 미만 (하위 10%)' }
      ],
      return_visitor_rate: [
        { score: 95, min: 0.60, percentile: 99, label: '60% 이상 (상위 1%)' },
        { score: 85, min: 0.50, max: 0.60, percentile: 90, label: '50-60% (상위 10%)' },
        { score: 75, min: 0.40, max: 0.50, percentile: 75, label: '40-50% (상위 25%)' },
        { score: 60, min: 0.30, max: 0.40, percentile: 50, label: '30-40% (중앙값)' },
        { score: 40, min: 0.20, max: 0.30, percentile: 25, label: '20-30% (하위 25%)' },
        { score: 20, max: 0.20, percentile: 10, label: '20% 미만 (하위 10%)' }
      ]
    },
    dataSource: '의료기관 온라인 마케팅 벤치마크, 네이버 플레이스 데이터 (2024)',
    lastUpdated: '2024-01-01'
  },

  // 5. Food & Beverage/식음료
  food_beverage: {
    industry: 'food_beverage',
    metrics: {
      visit_order_conversion_rate: [
        { score: 95, min: 0.15, percentile: 99, label: '15% 이상 (상위 1%)' },
        { score: 85, min: 0.10, max: 0.15, percentile: 90, label: '10-15% (상위 10%)' },
        { score: 75, min: 0.07, max: 0.10, percentile: 75, label: '7-10% (상위 25%)' },
        { score: 60, min: 0.05, max: 0.07, percentile: 50, label: '5-7% (중앙값)' },
        { score: 40, min: 0.03, max: 0.05, percentile: 25, label: '3-5% (하위 25%)' },
        { score: 20, max: 0.03, percentile: 10, label: '3% 미만 (하위 10%)' }
      ],
      review_rating: [
        { score: 95, min: 4.8, percentile: 99, label: '4.8 이상 (상위 1%)' },
        { score: 85, min: 4.5, max: 4.8, percentile: 90, label: '4.5-4.8 (상위 10%)' },
        { score: 75, min: 4.3, max: 4.5, percentile: 75, label: '4.3-4.5 (상위 25%)' },
        { score: 60, min: 4.0, max: 4.3, percentile: 50, label: '4.0-4.3 (중앙값)' },
        { score: 40, min: 3.5, max: 4.0, percentile: 25, label: '3.5-4.0 (하위 25%)' },
        { score: 20, max: 3.5, percentile: 10, label: '3.5 미만 (하위 10%)' }
      ],
      review_count: [
        { score: 95, min: 1000, percentile: 99, label: '1,000개 이상 (상위 1%)' },
        { score: 85, min: 500, max: 1000, percentile: 90, label: '500-1,000개 (상위 10%)' },
        { score: 75, min: 200, max: 500, percentile: 75, label: '200-500개 (상위 25%)' },
        { score: 60, min: 100, max: 200, percentile: 50, label: '100-200개 (중앙값)' },
        { score: 40, min: 50, max: 100, percentile: 25, label: '50-100개 (하위 25%)' },
        { score: 20, max: 50, percentile: 10, label: '50개 미만 (하위 10%)' }
      ],
      menu_view_count: [
        { score: 95, min: 10000, percentile: 99, label: '10,000 이상 (상위 1%)' },
        { score: 85, min: 5000, max: 10000, percentile: 90, label: '5,000-10,000 (상위 10%)' },
        { score: 75, min: 2000, max: 5000, percentile: 75, label: '2,000-5,000 (상위 25%)' },
        { score: 60, min: 1000, max: 2000, percentile: 50, label: '1,000-2,000 (중앙값)' },
        { score: 40, min: 500, max: 1000, percentile: 25, label: '500-1,000 (하위 25%)' },
        { score: 20, max: 500, percentile: 10, label: '500 미만 (하위 10%)' }
      ],
      booking_order_click_rate: [
        { score: 95, min: 0.25, percentile: 99, label: '25% 이상 (상위 1%)' },
        { score: 85, min: 0.20, max: 0.25, percentile: 90, label: '20-25% (상위 10%)' },
        { score: 75, min: 0.15, max: 0.20, percentile: 75, label: '15-20% (상위 25%)' },
        { score: 60, min: 0.10, max: 0.15, percentile: 50, label: '10-15% (중앙값)' },
        { score: 40, min: 0.05, max: 0.10, percentile: 25, label: '5-10% (하위 25%)' },
        { score: 20, max: 0.05, percentile: 10, label: '5% 미만 (하위 10%)' }
      ],
      return_visitor_rate: [
        { score: 95, min: 0.50, percentile: 99, label: '50% 이상 (상위 1%)' },
        { score: 85, min: 0.40, max: 0.50, percentile: 90, label: '40-50% (상위 10%)' },
        { score: 75, min: 0.30, max: 0.40, percentile: 75, label: '30-40% (상위 25%)' },
        { score: 60, min: 0.20, max: 0.30, percentile: 50, label: '20-30% (중앙값)' },
        { score: 40, min: 0.10, max: 0.20, percentile: 25, label: '10-20% (하위 25%)' },
        { score: 20, max: 0.10, percentile: 10, label: '10% 미만 (하위 10%)' }
      ]
    },
    dataSource: '음식점 온라인 마케팅 벤치마크, 네이버 플레이스 데이터 (2024)',
    lastUpdated: '2024-01-01'
  },

  // 6. Local Business/로컬 비즈니스
  local_business: {
    industry: 'local_business',
    metrics: {
      local_search_ranking: [
        { score: 95, min: 1, max: 3, percentile: 99, label: '1-3위 (상위 1%)' },
        { score: 85, min: 3, max: 5, percentile: 90, label: '3-5위 (상위 10%)' },
        { score: 75, min: 5, max: 10, percentile: 75, label: '5-10위 (상위 25%)' },
        { score: 60, min: 10, max: 20, percentile: 50, label: '10-20위 (중앙값)' },
        { score: 40, min: 20, max: 50, percentile: 25, label: '20-50위 (하위 25%)' },
        { score: 20, min: 50, percentile: 10, label: '50위 이후 (하위 10%)' }
      ],
      visit_conversion_rate: [
        { score: 95, min: 0.12, percentile: 99, label: '12% 이상 (상위 1%)' },
        { score: 85, min: 0.08, max: 0.12, percentile: 90, label: '8-12% (상위 10%)' },
        { score: 75, min: 0.05, max: 0.08, percentile: 75, label: '5-8% (상위 25%)' },
        { score: 60, min: 0.03, max: 0.05, percentile: 50, label: '3-5% (중앙값)' },
        { score: 40, min: 0.02, max: 0.03, percentile: 25, label: '2-3% (하위 25%)' },
        { score: 20, max: 0.02, percentile: 10, label: '2% 미만 (하위 10%)' }
      ],
      review_rating: [
        { score: 95, min: 4.8, percentile: 99, label: '4.8 이상 (상위 1%)' },
        { score: 85, min: 4.5, max: 4.8, percentile: 90, label: '4.5-4.8 (상위 10%)' },
        { score: 75, min: 4.3, max: 4.5, percentile: 75, label: '4.3-4.5 (상위 25%)' },
        { score: 60, min: 4.0, max: 4.3, percentile: 50, label: '4.0-4.3 (중앙값)' },
        { score: 40, min: 3.5, max: 4.0, percentile: 25, label: '3.5-4.0 (하위 25%)' },
        { score: 20, max: 3.5, percentile: 10, label: '3.5 미만 (하위 10%)' }
      ],
      contact_directions_click_rate: [
        { score: 95, min: 0.30, percentile: 99, label: '30% 이상 (상위 1%)' },
        { score: 85, min: 0.20, max: 0.30, percentile: 90, label: '20-30% (상위 10%)' },
        { score: 75, min: 0.15, max: 0.20, percentile: 75, label: '15-20% (상위 25%)' },
        { score: 60, min: 0.10, max: 0.15, percentile: 50, label: '10-15% (중앙값)' },
        { score: 40, min: 0.05, max: 0.10, percentile: 25, label: '5-10% (하위 25%)' },
        { score: 20, max: 0.05, percentile: 10, label: '5% 미만 (하위 10%)' }
      ],
      return_visitor_rate: [
        { score: 95, min: 0.50, percentile: 99, label: '50% 이상 (상위 1%)' },
        { score: 85, min: 0.40, max: 0.50, percentile: 90, label: '40-50% (상위 10%)' },
        { score: 75, min: 0.30, max: 0.40, percentile: 75, label: '30-40% (상위 25%)' },
        { score: 60, min: 0.20, max: 0.30, percentile: 50, label: '20-30% (중앙값)' },
        { score: 40, min: 0.10, max: 0.20, percentile: 25, label: '10-20% (하위 25%)' },
        { score: 20, max: 0.10, percentile: 10, label: '10% 미만 (하위 10%)' }
      ]
    },
    dataSource: '로컬 비즈니스 온라인 마케팅 벤치마크, Google My Business 데이터 (2024)',
    lastUpdated: '2024-01-01'
  },

  // 7. Creator Economy/크리에이터
  creator_economy: {
    industry: 'creator_economy',
    metrics: {
      subscriber_count: [
        { score: 95, min: 1000000, percentile: 99, label: '100만 이상 (상위 1%)' },
        { score: 85, min: 500000, max: 1000000, percentile: 90, label: '50만-100만 (상위 10%)' },
        { score: 75, min: 100000, max: 500000, percentile: 75, label: '10만-50만 (상위 25%)' },
        { score: 60, min: 50000, max: 100000, percentile: 50, label: '5만-10만 (중앙값)' },
        { score: 40, min: 10000, max: 50000, percentile: 25, label: '1만-5만 (하위 25%)' },
        { score: 20, max: 10000, percentile: 10, label: '1만 미만 (하위 10%)' }
      ],
      engagement_rate: [
        { score: 95, min: 0.10, percentile: 99, label: '10% 이상 (상위 1%)' },
        { score: 85, min: 0.07, max: 0.10, percentile: 90, label: '7-10% (상위 10%)' },
        { score: 75, min: 0.05, max: 0.07, percentile: 75, label: '5-7% (상위 25%)' },
        { score: 60, min: 0.03, max: 0.05, percentile: 50, label: '3-5% (중앙값)' },
        { score: 40, min: 0.02, max: 0.03, percentile: 25, label: '2-3% (하위 25%)' },
        { score: 20, max: 0.02, percentile: 10, label: '2% 미만 (하위 10%)' }
      ],
      view_count: [
        { score: 95, min: 10000000, percentile: 99, label: '1,000만 이상 (상위 1%)' },
        { score: 85, min: 5000000, max: 10000000, percentile: 90, label: '500만-1,000만 (상위 10%)' },
        { score: 75, min: 1000000, max: 5000000, percentile: 75, label: '100만-500만 (상위 25%)' },
        { score: 60, min: 500000, max: 1000000, percentile: 50, label: '50만-100만 (중앙값)' },
        { score: 40, min: 100000, max: 500000, percentile: 25, label: '10만-50만 (하위 25%)' },
        { score: 20, max: 100000, percentile: 10, label: '10만 미만 (하위 10%)' }
      ],
      avg_watch_time: [
        { score: 95, min: 0.80, percentile: 99, label: '80% 이상 (상위 1%)' },
        { score: 85, min: 0.70, max: 0.80, percentile: 90, label: '70-80% (상위 10%)' },
        { score: 75, min: 0.60, max: 0.70, percentile: 75, label: '60-70% (상위 25%)' },
        { score: 60, min: 0.50, max: 0.60, percentile: 50, label: '50-60% (중앙값)' },
        { score: 40, min: 0.40, max: 0.50, percentile: 25, label: '40-50% (하위 25%)' },
        { score: 20, max: 0.40, percentile: 10, label: '40% 미만 (하위 10%)' }
      ],
      monetization_rate: [
        { score: 95, min: 0.05, percentile: 99, label: '5% 이상 (상위 1%)' },
        { score: 85, min: 0.03, max: 0.05, percentile: 90, label: '3-5% (상위 10%)' },
        { score: 75, min: 0.02, max: 0.03, percentile: 75, label: '2-3% (상위 25%)' },
        { score: 60, min: 0.01, max: 0.02, percentile: 50, label: '1-2% (중앙값)' },
        { score: 40, min: 0.005, max: 0.01, percentile: 25, label: '0.5-1% (하위 25%)' },
        { score: 20, max: 0.005, percentile: 10, label: '0.5% 미만 (하위 10%)' }
      ],
      community_growth_rate: [
        { score: 95, min: 0.20, percentile: 99, label: '20% 이상 (상위 1%)' },
        { score: 85, min: 0.15, max: 0.20, percentile: 90, label: '15-20% (상위 10%)' },
        { score: 75, min: 0.10, max: 0.15, percentile: 75, label: '10-15% (상위 25%)' },
        { score: 60, min: 0.05, max: 0.10, percentile: 50, label: '5-10% (중앙값)' },
        { score: 40, min: 0.02, max: 0.05, percentile: 25, label: '2-5% (하위 25%)' },
        { score: 20, max: 0.02, percentile: 10, label: '2% 미만 (하위 10%)' }
      ]
    },
    dataSource: 'YouTube, TikTok, Instagram 크리에이터 벤치마크 (2024)',
    lastUpdated: '2024-01-01'
  },

  // 8. Media/출판
  media: {
    industry: 'media',
    metrics: {
      monthly_traffic: [
        { score: 95, min: 10000000, percentile: 99, label: '1,000만 이상 (상위 1%)' },
        { score: 85, min: 5000000, max: 10000000, percentile: 90, label: '500만-1,000만 (상위 10%)' },
        { score: 75, min: 1000000, max: 5000000, percentile: 75, label: '100만-500만 (상위 25%)' },
        { score: 60, min: 500000, max: 1000000, percentile: 50, label: '50만-100만 (중앙값)' },
        { score: 40, min: 100000, max: 500000, percentile: 25, label: '10만-50만 (하위 25%)' },
        { score: 20, max: 100000, percentile: 10, label: '10만 미만 (하위 10%)' }
      ],
      avg_session_duration: [
        { score: 95, min: 600, percentile: 99, label: '10분 이상 (상위 1%)' },
        { score: 85, min: 300, max: 600, percentile: 90, label: '5-10분 (상위 10%)' },
        { score: 75, min: 180, max: 300, percentile: 75, label: '3-5분 (상위 25%)' },
        { score: 60, min: 120, max: 180, percentile: 50, label: '2-3분 (중앙값)' },
        { score: 40, min: 60, max: 120, percentile: 25, label: '1-2분 (하위 25%)' },
        { score: 20, max: 60, percentile: 10, label: '1분 미만 (하위 10%)' }
      ],
      pages_per_session: [
        { score: 95, min: 5.0, percentile: 99, label: '5.0 이상 (상위 1%)' },
        { score: 85, min: 3.5, max: 5.0, percentile: 90, label: '3.5-5.0 (상위 10%)' },
        { score: 75, min: 2.5, max: 3.5, percentile: 75, label: '2.5-3.5 (상위 25%)' },
        { score: 60, min: 2.0, max: 2.5, percentile: 50, label: '2.0-2.5 (중앙값)' },
        { score: 40, min: 1.5, max: 2.0, percentile: 25, label: '1.5-2.0 (하위 25%)' },
        { score: 20, max: 1.5, percentile: 10, label: '1.5 미만 (하위 10%)' }
      ],
      return_visitor_rate: [
        { score: 95, min: 0.60, percentile: 99, label: '60% 이상 (상위 1%)' },
        { score: 85, min: 0.50, max: 0.60, percentile: 90, label: '50-60% (상위 10%)' },
        { score: 75, min: 0.40, max: 0.50, percentile: 75, label: '40-50% (상위 25%)' },
        { score: 60, min: 0.30, max: 0.40, percentile: 50, label: '30-40% (중앙값)' },
        { score: 40, min: 0.20, max: 0.30, percentile: 25, label: '20-30% (하위 25%)' },
        { score: 20, max: 0.20, percentile: 10, label: '20% 미만 (하위 10%)' }
      ],
      subscription_rate: [
        { score: 95, min: 0.10, percentile: 99, label: '10% 이상 (상위 1%)' },
        { score: 85, min: 0.07, max: 0.10, percentile: 90, label: '7-10% (상위 10%)' },
        { score: 75, min: 0.05, max: 0.07, percentile: 75, label: '5-7% (상위 25%)' },
        { score: 60, min: 0.03, max: 0.05, percentile: 50, label: '3-5% (중앙값)' },
        { score: 40, min: 0.02, max: 0.03, percentile: 25, label: '2-3% (하위 25%)' },
        { score: 20, max: 0.02, percentile: 10, label: '2% 미만 (하위 10%)' }
      ],
      content_share_rate: [
        { score: 95, min: 0.15, percentile: 99, label: '15% 이상 (상위 1%)' },
        { score: 85, min: 0.10, max: 0.15, percentile: 90, label: '10-15% (상위 10%)' },
        { score: 75, min: 0.07, max: 0.10, percentile: 75, label: '7-10% (상위 25%)' },
        { score: 60, min: 0.05, max: 0.07, percentile: 50, label: '5-7% (중앙값)' },
        { score: 40, min: 0.03, max: 0.05, percentile: 25, label: '3-5% (하위 25%)' },
        { score: 20, max: 0.03, percentile: 10, label: '3% 미만 (하위 10%)' }
      ]
    },
    dataSource: '미디어 업계 벤치마크, Google Analytics 업계 리포트 (2024)',
    lastUpdated: '2024-01-01'
  },

  // 9. Non-Profit/시민단체
  non_profit: {
    industry: 'non_profit',
    metrics: {
      awareness_reach: [
        { score: 95, min: 1000000, percentile: 99, label: '100만 이상 (상위 1%)' },
        { score: 85, min: 500000, max: 1000000, percentile: 90, label: '50만-100만 (상위 10%)' },
        { score: 75, min: 100000, max: 500000, percentile: 75, label: '10만-50만 (상위 25%)' },
        { score: 60, min: 50000, max: 100000, percentile: 50, label: '5만-10만 (중앙값)' },
        { score: 40, min: 10000, max: 50000, percentile: 25, label: '1만-5만 (하위 25%)' },
        { score: 20, max: 10000, percentile: 10, label: '1만 미만 (하위 10%)' }
      ],
      donation_participation_rate: [
        { score: 95, min: 0.05, percentile: 99, label: '5% 이상 (상위 1%)' },
        { score: 85, min: 0.03, max: 0.05, percentile: 90, label: '3-5% (상위 10%)' },
        { score: 75, min: 0.02, max: 0.03, percentile: 75, label: '2-3% (상위 25%)' },
        { score: 60, min: 0.01, max: 0.02, percentile: 50, label: '1-2% (중앙값)' },
        { score: 40, min: 0.005, max: 0.01, percentile: 25, label: '0.5-1% (하위 25%)' },
        { score: 20, max: 0.005, percentile: 10, label: '0.5% 미만 (하위 10%)' }
      ],
      avg_donation_amount: [
        { score: 95, min: 100000, percentile: 99, label: '100,000원 이상 (상위 1%)' },
        { score: 85, min: 50000, max: 100000, percentile: 90, label: '50,000-100,000원 (상위 10%)' },
        { score: 75, min: 30000, max: 50000, percentile: 75, label: '30,000-50,000원 (상위 25%)' },
        { score: 60, min: 20000, max: 30000, percentile: 50, label: '20,000-30,000원 (중앙값)' },
        { score: 40, min: 10000, max: 20000, percentile: 25, label: '10,000-20,000원 (하위 25%)' },
        { score: 20, max: 10000, percentile: 10, label: '10,000원 미만 (하위 10%)' }
      ],
      content_share_rate: [
        { score: 95, min: 0.20, percentile: 99, label: '20% 이상 (상위 1%)' },
        { score: 85, min: 0.15, max: 0.20, percentile: 90, label: '15-20% (상위 10%)' },
        { score: 75, min: 0.10, max: 0.15, percentile: 75, label: '10-15% (상위 25%)' },
        { score: 60, min: 0.07, max: 0.10, percentile: 50, label: '7-10% (중앙값)' },
        { score: 40, min: 0.05, max: 0.07, percentile: 25, label: '5-7% (하위 25%)' },
        { score: 20, max: 0.05, percentile: 10, label: '5% 미만 (하위 10%)' }
      ],
      newsletter_signup_rate: [
        { score: 95, min: 0.15, percentile: 99, label: '15% 이상 (상위 1%)' },
        { score: 85, min: 0.10, max: 0.15, percentile: 90, label: '10-15% (상위 10%)' },
        { score: 75, min: 0.07, max: 0.10, percentile: 75, label: '7-10% (상위 25%)' },
        { score: 60, min: 0.05, max: 0.07, percentile: 50, label: '5-7% (중앙값)' },
        { score: 40, min: 0.03, max: 0.05, percentile: 25, label: '3-5% (하위 25%)' },
        { score: 20, max: 0.03, percentile: 10, label: '3% 미만 (하위 10%)' }
      ],
      volunteer_signup_rate: [
        { score: 95, min: 0.03, percentile: 99, label: '3% 이상 (상위 1%)' },
        { score: 85, min: 0.02, max: 0.03, percentile: 90, label: '2-3% (상위 10%)' },
        { score: 75, min: 0.01, max: 0.02, percentile: 75, label: '1-2% (상위 25%)' },
        { score: 60, min: 0.005, max: 0.01, percentile: 50, label: '0.5-1% (중앙값)' },
        { score: 40, min: 0.003, max: 0.005, percentile: 25, label: '0.3-0.5% (하위 25%)' },
        { score: 20, max: 0.003, percentile: 10, label: '0.3% 미만 (하위 10%)' }
      ]
    },
    dataSource: '비영리 조직 온라인 마케팅 벤치마크 (2024)',
    lastUpdated: '2024-01-01'
  }
}

/**
 * 업종별 벤치마크 가져오기
 */
export function getIndustryBenchmark(industry: IndustryType): IndustryBenchmarkData | null {
  return INDUSTRY_BENCHMARKS[industry] || null
}

/**
 * 업종별 메트릭 점수 계산
 */
export function calculateIndustryMetricScore(
  industry: IndustryType,
  metricName: string,
  value: number
): { score: number; tier: IndustryBenchmarkTier | null } {
  const benchmark = getIndustryBenchmark(industry)
  if (!benchmark || !benchmark.metrics[metricName]) {
    return { score: 0, tier: null }
  }

  const tiers = benchmark.metrics[metricName]
  
  // 값에 해당하는 티어 찾기
  for (const tier of tiers) {
    if (tier.min !== undefined && tier.max !== undefined) {
      if (value >= tier.min && value < tier.max) {
        return { score: tier.score, tier }
      }
    } else if (tier.min !== undefined) {
      if (value >= tier.min) {
        return { score: tier.score, tier }
      }
    } else if (tier.max !== undefined) {
      if (value <= tier.max) {
        return { score: tier.score, tier }
      }
    }
  }
  
  // 가장 낮은 티어
  const lowestTier = tiers[tiers.length - 1]
  return { score: lowestTier.score, tier: lowestTier }
}
