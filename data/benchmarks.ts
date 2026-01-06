/**
 * 업계 벤치마킹 데이터베이스
 * Top 1%, Top 10%, Top 25%, 중앙값(50%), Bottom 25% 기준값
 */

export interface BenchmarkTier {
  tier: 'top1' | 'top10' | 'top25' | 'median' | 'bottom25'
  percentile: number
  value: number
  label: string
}

export interface ChannelBenchmark {
  [metricName: string]: BenchmarkTier[]
}

export const INDUSTRY_BENCHMARKS: Record<string, ChannelBenchmark> = {
  organic_search: {
    monthly_traffic: [
      { tier: 'top1', percentile: 99, value: 100000, label: '100,000 이상' },
      { tier: 'top10', percentile: 90, value: 50000, label: '50,000-100,000' },
      { tier: 'top25', percentile: 75, value: 20000, label: '20,000-50,000' },
      { tier: 'median', percentile: 50, value: 5000, label: '5,000-20,000 (중앙값)' },
      { tier: 'bottom25', percentile: 25, value: 1000, label: '1,000-5,000' }
    ],
    keyword_rankings: [
      { tier: 'top1', percentile: 99, value: 95, label: '평균 1-2위' },
      { tier: 'top10', percentile: 90, value: 85, label: '평균 3-5위' },
      { tier: 'top25', percentile: 75, value: 75, label: '평균 6-10위' },
      { tier: 'median', percentile: 50, value: 60, label: '평균 11-20위 (중앙값)' },
      { tier: 'bottom25', percentile: 25, value: 40, label: '평균 21-50위' }
    ],
    page_speed: [
      { tier: 'top1', percentile: 99, value: 95, label: '1초 이하' },
      { tier: 'top10', percentile: 90, value: 85, label: '1-2초' },
      { tier: 'top25', percentile: 75, value: 75, label: '2-3초' },
      { tier: 'median', percentile: 50, value: 60, label: '3-4초 (중앙값)' },
      { tier: 'bottom25', percentile: 25, value: 40, label: '4초 이상' }
    ],
    ctr: [
      { tier: 'top1', percentile: 99, value: 5.0, label: '5.0% 이상' },
      { tier: 'top10', percentile: 90, value: 3.0, label: '3.0-5.0%' },
      { tier: 'top25', percentile: 75, value: 2.0, label: '2.0-3.0%' },
      { tier: 'median', percentile: 50, value: 1.0, label: '1.0-2.0% (중앙값)' },
      { tier: 'bottom25', percentile: 25, value: 0.5, label: '0.5-1.0%' }
    ],
    conversion_rate: [
      { tier: 'top1', percentile: 99, value: 5.0, label: '5.0% 이상' },
      { tier: 'top10', percentile: 90, value: 3.0, label: '3.0-5.0%' },
      { tier: 'top25', percentile: 75, value: 2.0, label: '2.0-3.0%' },
      { tier: 'median', percentile: 50, value: 1.0, label: '1.0-2.0% (중앙값)' },
      { tier: 'bottom25', percentile: 25, value: 0.5, label: '0.5-1.0%' }
    ],
    backlinks: [
      { tier: 'top1', percentile: 99, value: 10000, label: '10,000 이상' },
      { tier: 'top10', percentile: 90, value: 5000, label: '5,000-10,000' },
      { tier: 'top25', percentile: 75, value: 2000, label: '2,000-5,000' },
      { tier: 'median', percentile: 50, value: 500, label: '500-2,000 (중앙값)' },
      { tier: 'bottom25', percentile: 25, value: 100, label: '100-500' }
    ],
    domain_authority: [
      { tier: 'top1', percentile: 99, value: 80, label: '80 이상' },
      { tier: 'top10', percentile: 90, value: 70, label: '70-80' },
      { tier: 'top25', percentile: 75, value: 60, label: '60-70' },
      { tier: 'median', percentile: 50, value: 50, label: '50-60 (중앙값)' },
      { tier: 'bottom25', percentile: 25, value: 40, label: '40-50' }
    ]
  },
  naver_place: {
    search_rankings: [
      { tier: 'top1', percentile: 99, value: 95, label: '평균 1위' },
      { tier: 'top10', percentile: 90, value: 85, label: '평균 2-3위' },
      { tier: 'top25', percentile: 75, value: 75, label: '평균 4-5위' },
      { tier: 'median', percentile: 50, value: 60, label: '평균 6-10위 (중앙값)' },
      { tier: 'bottom25', percentile: 25, value: 40, label: '평균 11-20위' }
    ],
    ctr: [
      { tier: 'top1', percentile: 99, value: 5.0, label: '5.0% 이상' },
      { tier: 'top10', percentile: 90, value: 3.0, label: '3.0-5.0%' },
      { tier: 'top25', percentile: 75, value: 2.0, label: '2.0-3.0%' },
      { tier: 'median', percentile: 50, value: 1.0, label: '1.0-2.0% (중앙값)' },
      { tier: 'bottom25', percentile: 25, value: 0.5, label: '0.5-1.0%' }
    ],
    photo_review_ratio: [
      { tier: 'top1', percentile: 99, value: 70, label: '70% 이상' },
      { tier: 'top10', percentile: 90, value: 50, label: '50-70%' },
      { tier: 'top25', percentile: 75, value: 30, label: '30-50%' },
      { tier: 'median', percentile: 50, value: 20, label: '20-30% (중앙값)' },
      { tier: 'bottom25', percentile: 25, value: 10, label: '10-20%' }
    ],
    reservation_rate: [
      { tier: 'top1', percentile: 99, value: 10.0, label: '10.0% 이상' },
      { tier: 'top10', percentile: 90, value: 7.0, label: '7.0-10.0%' },
      { tier: 'top25', percentile: 75, value: 5.0, label: '5.0-7.0%' },
      { tier: 'median', percentile: 50, value: 3.0, label: '3.0-5.0% (중앙값)' },
      { tier: 'bottom25', percentile: 25, value: 1.0, label: '1.0-3.0%' }
    ],
    review_count: [
      { tier: 'top1', percentile: 99, value: 500, label: '500개 이상' },
      { tier: 'top10', percentile: 90, value: 200, label: '200-500개' },
      { tier: 'top25', percentile: 75, value: 100, label: '100-200개' },
      { tier: 'median', percentile: 50, value: 50, label: '50-100개 (중앙값)' },
      { tier: 'bottom25', percentile: 25, value: 20, label: '20-50개' }
    ],
    review_rating: [
      { tier: 'top1', percentile: 99, value: 4.8, label: '4.8 이상' },
      { tier: 'top10', percentile: 90, value: 4.5, label: '4.5-4.8' },
      { tier: 'top25', percentile: 75, value: 4.3, label: '4.3-4.5' },
      { tier: 'median', percentile: 50, value: 4.0, label: '4.0-4.3 (중앙값)' },
      { tier: 'bottom25', percentile: 25, value: 3.5, label: '3.5-4.0' }
    ]
  },
  youtube: {
    monthly_views: [
      { tier: 'top1', percentile: 99, value: 1000000, label: '1,000,000 이상' },
      { tier: 'top10', percentile: 90, value: 500000, label: '500,000-1,000,000' },
      { tier: 'top25', percentile: 75, value: 200000, label: '200,000-500,000' },
      { tier: 'median', percentile: 50, value: 50000, label: '50,000-200,000 (중앙값)' },
      { tier: 'bottom25', percentile: 25, value: 10000, label: '10,000-50,000' }
    ],
    subscribers: [
      { tier: 'top1', percentile: 99, value: 100000, label: '100,000 이상' },
      { tier: 'top10', percentile: 90, value: 50000, label: '50,000-100,000' },
      { tier: 'top25', percentile: 75, value: 20000, label: '20,000-50,000' },
      { tier: 'median', percentile: 50, value: 5000, label: '5,000-20,000 (중앙값)' },
      { tier: 'bottom25', percentile: 25, value: 1000, label: '1,000-5,000' }
    ],
    engagement_rate: [
      { tier: 'top1', percentile: 99, value: 10.0, label: '10.0% 이상' },
      { tier: 'top10', percentile: 90, value: 7.0, label: '7.0-10.0%' },
      { tier: 'top25', percentile: 75, value: 5.0, label: '5.0-7.0%' },
      { tier: 'median', percentile: 50, value: 3.0, label: '3.0-5.0% (중앙값)' },
      { tier: 'bottom25', percentile: 25, value: 1.0, label: '1.0-3.0%' }
    ],
    avg_watch_time: [
      { tier: 'top1', percentile: 99, value: 80, label: '80% 이상' },
      { tier: 'top10', percentile: 90, value: 70, label: '70-80%' },
      { tier: 'top25', percentile: 75, value: 60, label: '60-70%' },
      { tier: 'median', percentile: 50, value: 50, label: '50-60% (중앙값)' },
      { tier: 'bottom25', percentile: 25, value: 40, label: '40-50%' }
    ],
    click_through_rate: [
      { tier: 'top1', percentile: 99, value: 5.0, label: '5.0% 이상' },
      { tier: 'top10', percentile: 90, value: 3.0, label: '3.0-5.0%' },
      { tier: 'top25', percentile: 75, value: 2.0, label: '2.0-3.0%' },
      { tier: 'median', percentile: 50, value: 1.0, label: '1.0-2.0% (중앙값)' },
      { tier: 'bottom25', percentile: 25, value: 0.5, label: '0.5-1.0%' }
    ]
  },
  meta_ads: {
    roas: [
      { tier: 'top1', percentile: 99, value: 4.0, label: '4.0 이상' },
      { tier: 'top10', percentile: 90, value: 3.0, label: '3.0-4.0' },
      { tier: 'top25', percentile: 75, value: 2.0, label: '2.0-3.0' },
      { tier: 'median', percentile: 50, value: 1.5, label: '1.5-2.0 (중앙값)' },
      { tier: 'bottom25', percentile: 25, value: 1.0, label: '1.0-1.5' }
    ],
    ctr: [
      { tier: 'top1', percentile: 99, value: 3.0, label: '3.0% 이상' },
      { tier: 'top10', percentile: 90, value: 2.0, label: '2.0-3.0%' },
      { tier: 'top25', percentile: 75, value: 1.5, label: '1.5-2.0%' },
      { tier: 'median', percentile: 50, value: 1.0, label: '1.0-1.5% (중앙값)' },
      { tier: 'bottom25', percentile: 25, value: 0.5, label: '0.5-1.0%' }
    ],
    cpm: [
      { tier: 'top1', percentile: 99, value: 2000, label: '2,000원 이하 (낮을수록 좋음)' },
      { tier: 'top10', percentile: 90, value: 3000, label: '2,000-3,000원' },
      { tier: 'top25', percentile: 75, value: 4000, label: '3,000-4,000원' },
      { tier: 'median', percentile: 50, value: 6000, label: '4,000-6,000원 (중앙값)' },
      { tier: 'bottom25', percentile: 25, value: 8000, label: '6,000-8,000원' }
    ],
    conversion_rate: [
      { tier: 'top1', percentile: 99, value: 4.0, label: '4.0% 이상' },
      { tier: 'top10', percentile: 90, value: 3.0, label: '3.0-4.0%' },
      { tier: 'top25', percentile: 75, value: 2.0, label: '2.0-3.0%' },
      { tier: 'median', percentile: 50, value: 1.0, label: '1.0-2.0% (중앙값)' },
      { tier: 'bottom25', percentile: 25, value: 0.5, label: '0.5-1.0%' }
    ]
  },
  ga4_funnel: {
    acquisition: [
      { tier: 'top1', percentile: 99, value: 100000, label: '100,000 이상' },
      { tier: 'top10', percentile: 90, value: 50000, label: '50,000-100,000' },
      { tier: 'top25', percentile: 75, value: 20000, label: '20,000-50,000' },
      { tier: 'median', percentile: 50, value: 5000, label: '5,000-20,000 (중앙값)' },
      { tier: 'bottom25', percentile: 25, value: 1000, label: '1,000-5,000' }
    ],
    engagement_rate: [
      { tier: 'top1', percentile: 99, value: 50.0, label: '50.0% 이상' },
      { tier: 'top10', percentile: 90, value: 40.0, label: '40.0-50.0%' },
      { tier: 'top25', percentile: 75, value: 30.0, label: '30.0-40.0%' },
      { tier: 'median', percentile: 50, value: 20.0, label: '20.0-30.0% (중앙값)' },
      { tier: 'bottom25', percentile: 25, value: 10.0, label: '10.0-20.0%' }
    ],
    conversion_rate: [
      { tier: 'top1', percentile: 99, value: 5.0, label: '5.0% 이상' },
      { tier: 'top10', percentile: 90, value: 3.0, label: '3.0-5.0%' },
      { tier: 'top25', percentile: 75, value: 2.0, label: '2.0-3.0%' },
      { tier: 'median', percentile: 50, value: 1.0, label: '1.0-2.0% (중앙값)' },
      { tier: 'bottom25', percentile: 25, value: 0.5, label: '0.5-1.0%' }
    ],
    bounce_rate: [
      { tier: 'top1', percentile: 99, value: 30.0, label: '30.0% 이하 (낮을수록 좋음)' },
      { tier: 'top10', percentile: 90, value: 40.0, label: '30.0-40.0%' },
      { tier: 'top25', percentile: 75, value: 50.0, label: '40.0-50.0%' },
      { tier: 'median', percentile: 50, value: 60.0, label: '50.0-60.0% (중앙값)' },
      { tier: 'bottom25', percentile: 25, value: 70.0, label: '60.0-70.0%' }
    ],
    avg_session_duration: [
      { tier: 'top1', percentile: 99, value: 300, label: '5분 이상' },
      { tier: 'top10', percentile: 90, value: 180, label: '3-5분' },
      { tier: 'top25', percentile: 75, value: 120, label: '2-3분' },
      { tier: 'median', percentile: 50, value: 60, label: '1-2분 (중앙값)' },
      { tier: 'bottom25', percentile: 25, value: 30, label: '30초-1분' }
    ]
  }
}

/**
 * 메트릭 값으로부터 벤치마크 티어 찾기
 */
export function findBenchmarkTier(
  channel: string,
  metricName: string,
  value: number
): BenchmarkTier | null {
  const channelBenchmarks = INDUSTRY_BENCHMARKS[channel]
  if (!channelBenchmarks || !channelBenchmarks[metricName]) {
    return null
  }
  
  const tiers = channelBenchmarks[metricName]
  
  // 값에 해당하는 티어 찾기
  for (const tier of tiers) {
    // 상위 티어부터 확인
    if (value >= tier.value) {
      return tier
    }
  }
  
  // 가장 낮은 티어 반환
  return tiers[tiers.length - 1]
}

/**
 * 메트릭 값으로부터 점수 계산 (0-100)
 */
export function calculateScoreFromBenchmark(
  channel: string,
  metricName: string,
  value: number
): number {
  const tier = findBenchmarkTier(channel, metricName, value)
  if (!tier) return 0
  
  // 티어별 점수 매핑
  const tierScores: Record<string, number> = {
    top1: 95,
    top10: 85,
    top25: 75,
    median: 60,
    bottom25: 40
  }
  
  return tierScores[tier.tier] || 0
}
