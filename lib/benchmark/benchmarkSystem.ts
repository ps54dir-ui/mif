/**
 * 100점 벤치마킹 시스템
 * 각 채널별 업계 Top 1%, Top 10%, Top 25%, 중앙값(50%), Bottom 25% 기준값 정의
 */

export type MarketingChannel = 
  | 'SEO' 
  | 'SEM' 
  | 'SOCIAL_MEDIA' 
  | 'EMAIL' 
  | 'CONTENT' 
  | 'PAID_ADS'
  | 'YOUTUBE'
  | 'INSTAGRAM'
  | 'TIKTOK'
  | 'NAVER_PLACE'
  | 'BLOG'
  | 'GA4_FUNNEL'
  | 'META_ADS'
  | 'SNS_COMMUNITY'

export interface BenchmarkTiers {
  top1Percent: number    // Top 1% 기준값
  top10Percent: number   // Top 10% 기준값
  top25Percent: number  // Top 25% 기준값
  median: number         // 중앙값 (50%)
  bottom25Percent: number // Bottom 25% 기준값
}

export interface ChannelBenchmark {
  channel: MarketingChannel
  tiers: BenchmarkTiers
  metrics: {
    reach?: BenchmarkTiers
    engagement?: BenchmarkTiers
    conversion?: BenchmarkTiers
    roi?: BenchmarkTiers
    cac?: BenchmarkTiers
  }
}

export interface BenchmarkComparison {
  channel: MarketingChannel
  currentScore: number
  benchmarkTier: 'top1' | 'top10' | 'top25' | 'median' | 'bottom25' | 'below_bottom'
  percentile: number // 0-100
  gapToNextTier: number // 다음 티어까지의 점수 차이
  industryAverage: number // 업계 평균
  recommendation: string
}

/**
 * 채널별 벤치마크 기준값 정의
 * 실제 업계 데이터 기반으로 설정 (향후 실제 데이터로 업데이트 필요)
 */
export const CHANNEL_BENCHMARKS: Record<MarketingChannel, BenchmarkTiers> = {
  SEO: {
    top1Percent: 95,
    top10Percent: 85,
    top25Percent: 75,
    median: 65,
    bottom25Percent: 50
  },
  SEM: {
    top1Percent: 90,
    top10Percent: 80,
    top25Percent: 70,
    median: 60,
    bottom25Percent: 45
  },
  SOCIAL_MEDIA: {
    top1Percent: 92,
    top10Percent: 82,
    top25Percent: 72,
    median: 62,
    bottom25Percent: 48
  },
  EMAIL: {
    top1Percent: 88,
    top10Percent: 78,
    top25Percent: 68,
    median: 58,
    bottom25Percent: 45
  },
  CONTENT: {
    top1Percent: 90,
    top10Percent: 80,
    top25Percent: 70,
    median: 60,
    bottom25Percent: 48
  },
  PAID_ADS: {
    top1Percent: 88,
    top10Percent: 78,
    top25Percent: 68,
    median: 58,
    bottom25Percent: 45
  },
  YOUTUBE: {
    top1Percent: 95,
    top10Percent: 85,
    top25Percent: 75,
    median: 65,
    bottom25Percent: 50
  },
  INSTAGRAM: {
    top1Percent: 92,
    top10Percent: 82,
    top25Percent: 72,
    median: 62,
    bottom25Percent: 48
  },
  TIKTOK: {
    top1Percent: 90,
    top10Percent: 80,
    top25Percent: 70,
    median: 60,
    bottom25Percent: 45
  },
  NAVER_PLACE: {
    top1Percent: 88,
    top10Percent: 78,
    top25Percent: 68,
    median: 58,
    bottom25Percent: 45
  },
  BLOG: {
    top1Percent: 85,
    top10Percent: 75,
    top25Percent: 65,
    median: 55,
    bottom25Percent: 42
  },
  GA4_FUNNEL: {
    top1Percent: 90,
    top10Percent: 80,
    top25Percent: 70,
    median: 60,
    bottom25Percent: 45
  },
  META_ADS: {
    top1Percent: 88,
    top10Percent: 78,
    top25Percent: 68,
    median: 58,
    bottom25Percent: 45
  },
  SNS_COMMUNITY: {
    top1Percent: 85,
    top10Percent: 75,
    top25Percent: 65,
    median: 55,
    bottom25Percent: 42
  }
}

/**
 * 현재 점수를 벤치마크 티어와 비교
 */
export function compareWithBenchmark(
  channel: MarketingChannel,
  currentScore: number
): BenchmarkComparison {
  const benchmark = CHANNEL_BENCHMARKS[channel]
  
  // 현재 점수가 어느 티어에 속하는지 판단
  let benchmarkTier: BenchmarkComparison['benchmarkTier']
  let percentile: number
  let gapToNextTier: number
  let recommendation: string
  
  if (currentScore >= benchmark.top1Percent) {
    benchmarkTier = 'top1'
    percentile = 99
    gapToNextTier = 0
    recommendation = `축하합니다! ${channel} 채널이 업계 Top 1%에 속합니다. 이 수준을 유지하고 경쟁사 대비 우위를 확보하세요.`
  } else if (currentScore >= benchmark.top10Percent) {
    benchmarkTier = 'top10'
    percentile = 90
    gapToNextTier = benchmark.top1Percent - currentScore
    recommendation = `${channel} 채널이 업계 Top 10%에 속합니다. Top 1% 달성을 위해 ${gapToNextTier.toFixed(1)}점 더 개선이 필요합니다.`
  } else if (currentScore >= benchmark.top25Percent) {
    benchmarkTier = 'top25'
    percentile = 75
    gapToNextTier = benchmark.top10Percent - currentScore
    recommendation = `${channel} 채널이 업계 Top 25%에 속합니다. Top 10% 달성을 위해 ${gapToNextTier.toFixed(1)}점 더 개선이 필요합니다.`
  } else if (currentScore >= benchmark.median) {
    benchmarkTier = 'median'
    percentile = 50
    gapToNextTier = benchmark.top25Percent - currentScore
    recommendation = `${channel} 채널이 업계 중앙값 수준입니다. Top 25% 달성을 위해 ${gapToNextTier.toFixed(1)}점 더 개선이 필요합니다.`
  } else if (currentScore >= benchmark.bottom25Percent) {
    benchmarkTier = 'bottom25'
    percentile = 25
    gapToNextTier = benchmark.median - currentScore
    recommendation = `${channel} 채널이 업계 하위 25%에 속합니다. 중앙값 달성을 위해 ${gapToNextTier.toFixed(1)}점 더 개선이 필요합니다.`
  } else {
    benchmarkTier = 'below_bottom'
    percentile = 10
    gapToNextTier = benchmark.bottom25Percent - currentScore
    recommendation = `${channel} 채널이 업계 하위 10%에 속합니다. 즉시 개선이 필요합니다. 최소한 하위 25% 수준(${benchmark.bottom25Percent}점)까지 ${gapToNextTier.toFixed(1)}점 더 개선하세요.`
  }
  
  // 업계 평균 계산 (중앙값 사용)
  const industryAverage = benchmark.median
  
  return {
    channel,
    currentScore,
    benchmarkTier,
    percentile,
    gapToNextTier: Math.max(0, gapToNextTier),
    industryAverage,
    recommendation
  }
}

/**
 * 여러 채널의 벤치마크 비교 결과를 종합
 */
export function compareMultipleChannels(
  channelScores: Record<MarketingChannel, number>
): {
  comparisons: BenchmarkComparison[]
  overallPercentile: number
  weakestChannel: BenchmarkComparison | null
  strongestChannel: BenchmarkComparison | null
  summary: string
} {
  const comparisons: BenchmarkComparison[] = []
  
  for (const [channel, score] of Object.entries(channelScores)) {
    comparisons.push(compareWithBenchmark(channel as MarketingChannel, score))
  }
  
  // 전체 평균 백분위수
  const overallPercentile = comparisons.reduce((sum, c) => sum + c.percentile, 0) / comparisons.length
  
  // 가장 약한 채널
  const weakestChannel = comparisons.reduce((min, c) => 
    c.percentile < min.percentile ? c : min
  )
  
  // 가장 강한 채널
  const strongestChannel = comparisons.reduce((max, c) => 
    c.percentile > max.percentile ? c : max
  )
  
  // 요약 생성
  const summary = `전체 평균 백분위수: ${overallPercentile.toFixed(1)}% | 
    최강 채널: ${strongestChannel.channel} (${strongestChannel.percentile.toFixed(1)}%) | 
    최약 채널: ${weakestChannel.channel} (${weakestChannel.percentile.toFixed(1)}%)`
  
  return {
    comparisons,
    overallPercentile: Math.round(overallPercentile),
    weakestChannel,
    strongestChannel,
    summary
  }
}

/**
 * 벤치마크 기반 점수 계산
 * 실제 메트릭 값을 벤치마크 티어 기준으로 정규화하여 0-100점으로 변환
 */
export function calculateScoreFromMetrics(
  channel: MarketingChannel,
  metrics: {
    reach?: number
    engagement?: number
    conversion?: number
    roi?: number
    cac?: number
  }
): number {
  const benchmark = CHANNEL_BENCHMARKS[channel]
  
  // 각 메트릭을 0-100점으로 정규화 (벤치마크 기준)
  let totalScore = 0
  let weightSum = 0
  
  // Reach (30% 가중치)
  if (metrics.reach !== undefined) {
    const reachScore = normalizeMetric(metrics.reach, benchmark)
    totalScore += reachScore * 0.3
    weightSum += 0.3
  }
  
  // Engagement (25% 가중치)
  if (metrics.engagement !== undefined) {
    const engagementScore = normalizeMetric(metrics.engagement, benchmark)
    totalScore += engagementScore * 0.25
    weightSum += 0.25
  }
  
  // Conversion (25% 가중치)
  if (metrics.conversion !== undefined) {
    const conversionScore = normalizeMetric(metrics.conversion, benchmark)
    totalScore += conversionScore * 0.25
    weightSum += 0.25
  }
  
  // ROI (10% 가중치)
  if (metrics.roi !== undefined) {
    const roiScore = normalizeMetric(metrics.roi, benchmark)
    totalScore += roiScore * 0.1
    weightSum += 0.1
  }
  
  // CAC (10% 가중치, 낮을수록 좋으므로 역수)
  if (metrics.cac !== undefined) {
    const cacScore = normalizeMetric(metrics.cac, benchmark, true) // 역수 적용
    totalScore += cacScore * 0.1
    weightSum += 0.1
  }
  
  // 가중치 합으로 나누어 정규화
  return weightSum > 0 ? Math.round(totalScore / weightSum) : 0
}

/**
 * 메트릭 값 범위별 점수 정의
 * 실제 업계 데이터 기반으로 설정
 */
export interface MetricScoreRange {
  score: number
  min: number | null // null이면 무한대 (최소값)
  max: number | null // null이면 무한대 (최대값)
  label: string // 설명
}

export interface ChannelMetricRanges {
  organicTraffic?: MetricScoreRange[] // SEO: 월간 유기 검색 트래픽
  paidTraffic?: MetricScoreRange[] // SEM: 월간 유료 검색 트래픽
  ctr?: MetricScoreRange[] // 클릭률 (%)
  conversionRate?: MetricScoreRange[] // 전환율 (%)
  engagementRate?: MetricScoreRange[] // 참여율 (%)
  engagement?: MetricScoreRange[] // 참여 (GA4_FUNNEL 등)
  acquisition?: MetricScoreRange[] // 획득 (GA4_FUNNEL 등)
  bounceRate?: MetricScoreRange[] // 이탈률 (%, 낮을수록 좋음)
  avgSessionDuration?: MetricScoreRange[] // 평균 세션 지속 시간 (초)
  openRate?: MetricScoreRange[] // 이메일 오픈율 (%)
  clickRate?: MetricScoreRange[] // 이메일 클릭률 (%)
  reach?: MetricScoreRange[] // 도달 수
  shares?: MetricScoreRange[] // 공유 수
  views?: MetricScoreRange[] // 조회수
  subscribers?: MetricScoreRange[] // 구독자 수
  cpc?: MetricScoreRange[] // 클릭당 비용 (원, 낮을수록 좋음)
  cpm?: MetricScoreRange[] // 노출당 비용 (원, 낮을수록 좋음)
  roas?: MetricScoreRange[] // 광고 수익률
  sentimentScore?: MetricScoreRange[] // 감정 점수 (SNS_COMMUNITY 등)
  [key: string]: MetricScoreRange[] | undefined // 동적 속성 허용
}

/**
 * 채널별 메트릭 범위 정의
 */
export const CHANNEL_METRIC_RANGES: Record<MarketingChannel, ChannelMetricRanges> = {
  SEO: {
    organicTraffic: [
      { score: 95, min: 100000, max: null, label: '100,000 이상' },
      { score: 85, min: 50000, max: 100000, label: '50,000-100,000' },
      { score: 75, min: 20000, max: 50000, label: '20,000-50,000' },
      { score: 60, min: 5000, max: 20000, label: '5,000-20,000 (중앙값)' },
      { score: 40, min: 1000, max: 5000, label: '1,000-5,000' },
      { score: 20, min: null, max: 1000, label: '1,000 미만' }
    ],
    ctr: [
      { score: 95, min: 5.0, max: null, label: '5.0% 이상' },
      { score: 85, min: 3.0, max: 5.0, label: '3.0-5.0%' },
      { score: 75, min: 2.0, max: 3.0, label: '2.0-3.0%' },
      { score: 60, min: 1.0, max: 2.0, label: '1.0-2.0% (중앙값)' },
      { score: 40, min: 0.5, max: 1.0, label: '0.5-1.0%' },
      { score: 20, min: null, max: 0.5, label: '0.5% 미만' }
    ],
    conversionRate: [
      { score: 95, min: 5.0, max: null, label: '5.0% 이상' },
      { score: 85, min: 3.0, max: 5.0, label: '3.0-5.0%' },
      { score: 75, min: 2.0, max: 3.0, label: '2.0-3.0%' },
      { score: 60, min: 1.0, max: 2.0, label: '1.0-2.0% (중앙값)' },
      { score: 40, min: 0.5, max: 1.0, label: '0.5-1.0%' },
      { score: 20, min: null, max: 0.5, label: '0.5% 미만' }
    ]
  },
  SEM: {
    paidTraffic: [
      { score: 95, min: 50000, max: null, label: '50,000 이상' },
      { score: 85, min: 25000, max: 50000, label: '25,000-50,000' },
      { score: 75, min: 10000, max: 25000, label: '10,000-25,000' },
      { score: 60, min: 3000, max: 10000, label: '3,000-10,000 (중앙값)' },
      { score: 40, min: 1000, max: 3000, label: '1,000-3,000' },
      { score: 20, min: null, max: 1000, label: '1,000 미만' }
    ],
    ctr: [
      { score: 95, min: 8.0, max: null, label: '8.0% 이상' },
      { score: 85, min: 5.0, max: 8.0, label: '5.0-8.0%' },
      { score: 75, min: 3.0, max: 5.0, label: '3.0-5.0%' },
      { score: 60, min: 2.0, max: 3.0, label: '2.0-3.0% (중앙값)' },
      { score: 40, min: 1.0, max: 2.0, label: '1.0-2.0%' },
      { score: 20, min: null, max: 1.0, label: '1.0% 미만' }
    ],
    cpc: [
      { score: 95, min: null, max: 500, label: '500원 이하 (낮을수록 좋음)' },
      { score: 85, min: 500, max: 1000, label: '500-1,000원' },
      { score: 75, min: 1000, max: 2000, label: '1,000-2,000원' },
      { score: 60, min: 2000, max: 3000, label: '2,000-3,000원 (중앙값)' },
      { score: 40, min: 3000, max: 5000, label: '3,000-5,000원' },
      { score: 20, min: 5000, max: null, label: '5,000원 이상' }
    ],
    roas: [
      { score: 95, min: 5.0, max: null, label: '5.0 이상' },
      { score: 85, min: 3.0, max: 5.0, label: '3.0-5.0' },
      { score: 75, min: 2.0, max: 3.0, label: '2.0-3.0' },
      { score: 60, min: 1.5, max: 2.0, label: '1.5-2.0 (중앙값)' },
      { score: 40, min: 1.0, max: 1.5, label: '1.0-1.5' },
      { score: 20, min: null, max: 1.0, label: '1.0 미만' }
    ]
  },
  SOCIAL_MEDIA: {
    engagementRate: [
      { score: 95, min: 8.0, max: null, label: '8.0% 이상' },
      { score: 85, min: 5.0, max: 8.0, label: '5.0-8.0%' },
      { score: 75, min: 3.0, max: 5.0, label: '3.0-5.0%' },
      { score: 60, min: 2.0, max: 3.0, label: '2.0-3.0% (중앙값)' },
      { score: 40, min: 1.0, max: 2.0, label: '1.0-2.0%' },
      { score: 20, min: null, max: 1.0, label: '1.0% 미만' }
    ],
    reach: [
      { score: 95, min: 100000, max: null, label: '100,000 이상' },
      { score: 85, min: 50000, max: 100000, label: '50,000-100,000' },
      { score: 75, min: 20000, max: 50000, label: '20,000-50,000' },
      { score: 60, min: 5000, max: 20000, label: '5,000-20,000 (중앙값)' },
      { score: 40, min: 1000, max: 5000, label: '1,000-5,000' },
      { score: 20, min: null, max: 1000, label: '1,000 미만' }
    ],
    shares: [
      { score: 95, min: 1000, max: null, label: '1,000 이상' },
      { score: 85, min: 500, max: 1000, label: '500-1,000' },
      { score: 75, min: 200, max: 500, label: '200-500' },
      { score: 60, min: 50, max: 200, label: '50-200 (중앙값)' },
      { score: 40, min: 20, max: 50, label: '20-50' },
      { score: 20, min: null, max: 20, label: '20 미만' }
    ]
  },
  EMAIL: {
    openRate: [
      { score: 95, min: 30.0, max: null, label: '30.0% 이상' },
      { score: 85, min: 25.0, max: 30.0, label: '25.0-30.0%' },
      { score: 75, min: 20.0, max: 25.0, label: '20.0-25.0%' },
      { score: 60, min: 15.0, max: 20.0, label: '15.0-20.0% (중앙값)' },
      { score: 40, min: 10.0, max: 15.0, label: '10.0-15.0%' },
      { score: 20, min: null, max: 10.0, label: '10.0% 미만' }
    ],
    clickRate: [
      { score: 95, min: 5.0, max: null, label: '5.0% 이상' },
      { score: 85, min: 3.0, max: 5.0, label: '3.0-5.0%' },
      { score: 75, min: 2.0, max: 3.0, label: '2.0-3.0%' },
      { score: 60, min: 1.0, max: 2.0, label: '1.0-2.0% (중앙값)' },
      { score: 40, min: 0.5, max: 1.0, label: '0.5-1.0%' },
      { score: 20, min: null, max: 0.5, label: '0.5% 미만' }
    ]
  },
  CONTENT: {
    views: [
      { score: 95, min: 50000, max: null, label: '50,000 이상' },
      { score: 85, min: 25000, max: 50000, label: '25,000-50,000' },
      { score: 75, min: 10000, max: 25000, label: '10,000-25,000' },
      { score: 60, min: 3000, max: 10000, label: '3,000-10,000 (중앙값)' },
      { score: 40, min: 1000, max: 3000, label: '1,000-3,000' },
      { score: 20, min: null, max: 1000, label: '1,000 미만' }
    ],
    engagementRate: [
      { score: 95, min: 10.0, max: null, label: '10.0% 이상' },
      { score: 85, min: 7.0, max: 10.0, label: '7.0-10.0%' },
      { score: 75, min: 5.0, max: 7.0, label: '5.0-7.0%' },
      { score: 60, min: 3.0, max: 5.0, label: '3.0-5.0% (중앙값)' },
      { score: 40, min: 1.0, max: 3.0, label: '1.0-3.0%' },
      { score: 20, min: null, max: 1.0, label: '1.0% 미만' }
    ]
  },
  PAID_ADS: {
    roas: [
      { score: 95, min: 4.0, max: null, label: '4.0 이상' },
      { score: 85, min: 3.0, max: 4.0, label: '3.0-4.0' },
      { score: 75, min: 2.0, max: 3.0, label: '2.0-3.0' },
      { score: 60, min: 1.5, max: 2.0, label: '1.5-2.0 (중앙값)' },
      { score: 40, min: 1.0, max: 1.5, label: '1.0-1.5' },
      { score: 20, min: null, max: 1.0, label: '1.0 미만' }
    ],
    cpm: [
      { score: 95, min: null, max: 1000, label: '1,000원 이하 (낮을수록 좋음)' },
      { score: 85, min: 1000, max: 2000, label: '1,000-2,000원' },
      { score: 75, min: 2000, max: 3000, label: '2,000-3,000원' },
      { score: 60, min: 3000, max: 5000, label: '3,000-5,000원 (중앙값)' },
      { score: 40, min: 5000, max: 8000, label: '5,000-8,000원' },
      { score: 20, min: 8000, max: null, label: '8,000원 이상' }
    ]
  },
  YOUTUBE: {
    views: [
      { score: 95, min: 1000000, max: null, label: '1,000,000 이상' },
      { score: 85, min: 500000, max: 1000000, label: '500,000-1,000,000' },
      { score: 75, min: 200000, max: 500000, label: '200,000-500,000' },
      { score: 60, min: 50000, max: 200000, label: '50,000-200,000 (중앙값)' },
      { score: 40, min: 10000, max: 50000, label: '10,000-50,000' },
      { score: 20, min: null, max: 10000, label: '10,000 미만' }
    ],
    subscribers: [
      { score: 95, min: 100000, max: null, label: '100,000 이상' },
      { score: 85, min: 50000, max: 100000, label: '50,000-100,000' },
      { score: 75, min: 20000, max: 50000, label: '20,000-50,000' },
      { score: 60, min: 5000, max: 20000, label: '5,000-20,000 (중앙값)' },
      { score: 40, min: 1000, max: 5000, label: '1,000-5,000' },
      { score: 20, min: null, max: 1000, label: '1,000 미만' }
    ],
    engagementRate: [
      { score: 95, min: 10.0, max: null, label: '10.0% 이상' },
      { score: 85, min: 7.0, max: 10.0, label: '7.0-10.0%' },
      { score: 75, min: 5.0, max: 7.0, label: '5.0-7.0%' },
      { score: 60, min: 3.0, max: 5.0, label: '3.0-5.0% (중앙값)' },
      { score: 40, min: 1.0, max: 3.0, label: '1.0-3.0%' },
      { score: 20, min: null, max: 1.0, label: '1.0% 미만' }
    ]
  },
  INSTAGRAM: {
    reach: [
      { score: 95, min: 50000, max: null, label: '50,000 이상' },
      { score: 85, min: 25000, max: 50000, label: '25,000-50,000' },
      { score: 75, min: 10000, max: 25000, label: '10,000-25,000' },
      { score: 60, min: 3000, max: 10000, label: '3,000-10,000 (중앙값)' },
      { score: 40, min: 1000, max: 3000, label: '1,000-3,000' },
      { score: 20, min: null, max: 1000, label: '1,000 미만' }
    ],
    engagementRate: [
      { score: 95, min: 6.0, max: null, label: '6.0% 이상' },
      { score: 85, min: 4.0, max: 6.0, label: '4.0-6.0%' },
      { score: 75, min: 2.5, max: 4.0, label: '2.5-4.0%' },
      { score: 60, min: 1.5, max: 2.5, label: '1.5-2.5% (중앙값)' },
      { score: 40, min: 0.8, max: 1.5, label: '0.8-1.5%' },
      { score: 20, min: null, max: 0.8, label: '0.8% 미만' }
    ]
  },
  TIKTOK: {
    views: [
      { score: 95, min: 500000, max: null, label: '500,000 이상' },
      { score: 85, min: 200000, max: 500000, label: '200,000-500,000' },
      { score: 75, min: 100000, max: 200000, label: '100,000-200,000' },
      { score: 60, min: 30000, max: 100000, label: '30,000-100,000 (중앙값)' },
      { score: 40, min: 10000, max: 30000, label: '10,000-30,000' },
      { score: 20, min: null, max: 10000, label: '10,000 미만' }
    ],
    engagementRate: [
      { score: 95, min: 15.0, max: null, label: '15.0% 이상' },
      { score: 85, min: 10.0, max: 15.0, label: '10.0-15.0%' },
      { score: 75, min: 7.0, max: 10.0, label: '7.0-10.0%' },
      { score: 60, min: 4.0, max: 7.0, label: '4.0-7.0% (중앙값)' },
      { score: 40, min: 2.0, max: 4.0, label: '2.0-4.0%' },
      { score: 20, min: null, max: 2.0, label: '2.0% 미만' }
    ]
  },
  NAVER_PLACE: {
    views: [
      { score: 95, min: 50000, max: null, label: '50,000 이상' },
      { score: 85, min: 25000, max: 50000, label: '25,000-50,000' },
      { score: 75, min: 10000, max: 25000, label: '10,000-25,000' },
      { score: 60, min: 3000, max: 10000, label: '3,000-10,000 (중앙값)' },
      { score: 40, min: 1000, max: 3000, label: '1,000-3,000' },
      { score: 20, min: null, max: 1000, label: '1,000 미만' }
    ],
    conversionRate: [
      { score: 95, min: 10.0, max: null, label: '10.0% 이상' },
      { score: 85, min: 7.0, max: 10.0, label: '7.0-10.0%' },
      { score: 75, min: 5.0, max: 7.0, label: '5.0-7.0%' },
      { score: 60, min: 3.0, max: 5.0, label: '3.0-5.0% (중앙값)' },
      { score: 40, min: 1.0, max: 3.0, label: '1.0-3.0%' },
      { score: 20, min: null, max: 1.0, label: '1.0% 미만' }
    ]
  },
  BLOG: {
    views: [
      { score: 95, min: 20000, max: null, label: '20,000 이상' },
      { score: 85, min: 10000, max: 20000, label: '10,000-20,000' },
      { score: 75, min: 5000, max: 10000, label: '5,000-10,000' },
      { score: 60, min: 2000, max: 5000, label: '2,000-5,000 (중앙값)' },
      { score: 40, min: 500, max: 2000, label: '500-2,000' },
      { score: 20, min: null, max: 500, label: '500 미만' }
    ],
    engagementRate: [
      { score: 95, min: 8.0, max: null, label: '8.0% 이상' },
      { score: 85, min: 5.0, max: 8.0, label: '5.0-8.0%' },
      { score: 75, min: 3.0, max: 5.0, label: '3.0-5.0%' },
      { score: 60, min: 1.5, max: 3.0, label: '1.5-3.0% (중앙값)' },
      { score: 40, min: 0.5, max: 1.5, label: '0.5-1.5%' },
      { score: 20, min: null, max: 0.5, label: '0.5% 미만' }
    ]
  },
  GA4_FUNNEL: {
    acquisition: [
      { score: 95, min: 100000, max: null, label: '100,000 이상' },
      { score: 85, min: 50000, max: 100000, label: '50,000-100,000' },
      { score: 75, min: 20000, max: 50000, label: '20,000-50,000' },
      { score: 60, min: 5000, max: 20000, label: '5,000-20,000 (중앙값)' },
      { score: 40, min: 1000, max: 5000, label: '1,000-5,000' },
      { score: 20, min: null, max: 1000, label: '1,000 미만' }
    ],
    engagement: [
      { score: 95, min: 50.0, max: null, label: '50.0% 이상' },
      { score: 85, min: 40.0, max: 50.0, label: '40.0-50.0%' },
      { score: 75, min: 30.0, max: 40.0, label: '30.0-40.0%' },
      { score: 60, min: 20.0, max: 30.0, label: '20.0-30.0% (중앙값)' },
      { score: 40, min: 10.0, max: 20.0, label: '10.0-20.0%' },
      { score: 20, min: null, max: 10.0, label: '10.0% 미만' }
    ],
    conversionRate: [
      { score: 95, min: 5.0, max: null, label: '5.0% 이상' },
      { score: 85, min: 3.0, max: 5.0, label: '3.0-5.0%' },
      { score: 75, min: 2.0, max: 3.0, label: '2.0-3.0%' },
      { score: 60, min: 1.0, max: 2.0, label: '1.0-2.0% (중앙값)' },
      { score: 40, min: 0.5, max: 1.0, label: '0.5-1.0%' },
      { score: 20, min: null, max: 0.5, label: '0.5% 미만' }
    ],
    bounceRate: [
      { score: 95, min: null, max: 30.0, label: '30.0% 이하 (낮을수록 좋음)' },
      { score: 85, min: 30.0, max: 40.0, label: '30.0-40.0%' },
      { score: 75, min: 40.0, max: 50.0, label: '40.0-50.0%' },
      { score: 60, min: 50.0, max: 60.0, label: '50.0-60.0% (중앙값)' },
      { score: 40, min: 60.0, max: 70.0, label: '60.0-70.0%' },
      { score: 20, min: 70.0, max: null, label: '70.0% 이상' }
    ],
    avgSessionDuration: [
      { score: 95, min: 300, max: null, label: '5분 이상' },
      { score: 85, min: 180, max: 300, label: '3-5분' },
      { score: 75, min: 120, max: 180, label: '2-3분' },
      { score: 60, min: 60, max: 120, label: '1-2분 (중앙값)' },
      { score: 40, min: 30, max: 60, label: '30초-1분' },
      { score: 20, min: null, max: 30, label: '30초 미만' }
    ]
  },
  META_ADS: {
    roas: [
      { score: 95, min: 4.0, max: null, label: '4.0 이상' },
      { score: 85, min: 3.0, max: 4.0, label: '3.0-4.0' },
      { score: 75, min: 2.0, max: 3.0, label: '2.0-3.0' },
      { score: 60, min: 1.5, max: 2.0, label: '1.5-2.0 (중앙값)' },
      { score: 40, min: 1.0, max: 1.5, label: '1.0-1.5' },
      { score: 20, min: null, max: 1.0, label: '1.0 미만' }
    ],
    ctr: [
      { score: 95, min: 3.0, max: null, label: '3.0% 이상' },
      { score: 85, min: 2.0, max: 3.0, label: '2.0-3.0%' },
      { score: 75, min: 1.5, max: 2.0, label: '1.5-2.0%' },
      { score: 60, min: 1.0, max: 1.5, label: '1.0-1.5% (중앙값)' },
      { score: 40, min: 0.5, max: 1.0, label: '0.5-1.0%' },
      { score: 20, min: null, max: 0.5, label: '0.5% 미만' }
    ],
    cpm: [
      { score: 95, min: null, max: 2000, label: '2,000원 이하 (낮을수록 좋음)' },
      { score: 85, min: 2000, max: 3000, label: '2,000-3,000원' },
      { score: 75, min: 3000, max: 4000, label: '3,000-4,000원' },
      { score: 60, min: 4000, max: 6000, label: '4,000-6,000원 (중앙값)' },
      { score: 40, min: 6000, max: 8000, label: '6,000-8,000원' },
      { score: 20, min: 8000, max: null, label: '8,000원 이상' }
    ],
    conversionRate: [
      { score: 95, min: 4.0, max: null, label: '4.0% 이상' },
      { score: 85, min: 3.0, max: 4.0, label: '3.0-4.0%' },
      { score: 75, min: 2.0, max: 3.0, label: '2.0-3.0%' },
      { score: 60, min: 1.0, max: 2.0, label: '1.0-2.0% (중앙값)' },
      { score: 40, min: 0.5, max: 1.0, label: '0.5-1.0%' },
      { score: 20, min: null, max: 0.5, label: '0.5% 미만' }
    ]
  },
  SNS_COMMUNITY: {
    engagementRate: [
      { score: 95, min: 10.0, max: null, label: '10.0% 이상' },
      { score: 85, min: 7.0, max: 10.0, label: '7.0-10.0%' },
      { score: 75, min: 5.0, max: 7.0, label: '5.0-7.0%' },
      { score: 60, min: 3.0, max: 5.0, label: '3.0-5.0% (중앙값)' },
      { score: 40, min: 1.5, max: 3.0, label: '1.5-3.0%' },
      { score: 20, min: null, max: 1.5, label: '1.5% 미만' }
    ],
    reach: [
      { score: 95, min: 50000, max: null, label: '50,000 이상' },
      { score: 85, min: 25000, max: 50000, label: '25,000-50,000' },
      { score: 75, min: 10000, max: 25000, label: '10,000-25,000' },
      { score: 60, min: 3000, max: 10000, label: '3,000-10,000 (중앙값)' },
      { score: 40, min: 1000, max: 3000, label: '1,000-3,000' },
      { score: 20, min: null, max: 1000, label: '1,000 미만' }
    ],
    sentimentScore: [
      { score: 95, min: 0.8, max: null, label: '0.8 이상 (매우 긍정적)' },
      { score: 85, min: 0.6, max: 0.8, label: '0.6-0.8' },
      { score: 75, min: 0.4, max: 0.6, label: '0.4-0.6' },
      { score: 60, min: 0.2, max: 0.4, label: '0.2-0.4 (중앙값)' },
      { score: 40, min: 0.0, max: 0.2, label: '0.0-0.2' },
      { score: 20, min: null, max: 0.0, label: '0.0 미만 (부정적)' }
    ]
  }
}

/**
 * 실제 메트릭 값으로부터 점수 계산
 */
export function calculateScoreFromMetricValue(
  channel: MarketingChannel,
  metricType: keyof ChannelMetricRanges,
  value: number
): {
  score: number
  range: MetricScoreRange | null
  nextTier: MetricScoreRange | null
} {
  const ranges = CHANNEL_METRIC_RANGES[channel]?.[metricType]
  
  if (!ranges || ranges.length === 0) {
    return { score: 0, range: null, nextTier: null }
  }
  
  // 값에 해당하는 범위 찾기
  let matchedRange: MetricScoreRange | null = null
  let nextTier: MetricScoreRange | null = null
  
  for (let i = 0; i < ranges.length; i++) {
    const range = ranges[i]
    const inRange = 
      (range.min === null || value >= range.min) &&
      (range.max === null || value <= range.max)
    
    if (inRange) {
      matchedRange = range
      // 다음 티어 찾기 (더 높은 점수)
      if (i > 0) {
        nextTier = ranges[i - 1]
      }
      break
    }
  }
  
  // 범위를 찾지 못한 경우 (최소값보다 작거나 최대값보다 큰 경우)
  if (!matchedRange) {
    if (value < (ranges[ranges.length - 1].max || 0)) {
      // 최소 범위보다 작음
      matchedRange = ranges[ranges.length - 1]
      nextTier = ranges[ranges.length - 2] || null
    } else {
      // 최대 범위보다 큼
      matchedRange = ranges[0]
      nextTier = null
    }
  }
  
  return {
    score: matchedRange?.score || 0,
    range: matchedRange,
    nextTier
  }
}

/**
 * 여러 메트릭을 종합하여 채널 점수 계산
 */
export function calculateChannelScoreFromMetrics(
  channel: MarketingChannel,
  metrics: {
    organicTraffic?: number
    paidTraffic?: number
    ctr?: number
    conversionRate?: number
    engagementRate?: number
    openRate?: number
    clickRate?: number
    reach?: number
    shares?: number
    views?: number
    subscribers?: number
    cpc?: number
    cpm?: number
    roas?: number
    acquisition?: number
    engagement?: number
    bounceRate?: number
    avgSessionDuration?: number
    sentimentScore?: number
  }
): {
  totalScore: number
  metricScores: Array<{
    metricType: string
    value: number
    score: number
    range: MetricScoreRange | null
  }>
  breakdown: string
} {
  const metricScores: Array<{
    metricType: string
    value: number
    score: number
    range: MetricScoreRange | null
  }> = []
  
  // 각 메트릭에 대해 점수 계산
  for (const [metricType, value] of Object.entries(metrics)) {
    if (value !== undefined && value !== null) {
      const result = calculateScoreFromMetricValue(
        channel,
        metricType as keyof ChannelMetricRanges,
        value
      )
      metricScores.push({
        metricType,
        value,
        score: result.score,
        range: result.range
      })
    }
  }
  
  // 가중 평균 계산 (각 메트릭의 중요도에 따라)
  let totalScore = 0
  let totalWeight = 0
  
  // 채널별 가중치 정의
  const weights: Record<MarketingChannel, Record<string, number>> = {
    SEO: { organicTraffic: 0.4, ctr: 0.3, conversionRate: 0.3 },
    SEM: { paidTraffic: 0.3, ctr: 0.25, cpc: 0.2, roas: 0.25 },
    SOCIAL_MEDIA: { engagementRate: 0.4, reach: 0.3, shares: 0.3 },
    EMAIL: { openRate: 0.5, clickRate: 0.5 },
    CONTENT: { views: 0.5, engagementRate: 0.5 },
    PAID_ADS: { roas: 0.5, cpm: 0.3, conversionRate: 0.2 },
    YOUTUBE: { views: 0.4, subscribers: 0.3, engagementRate: 0.3 },
    INSTAGRAM: { reach: 0.5, engagementRate: 0.5 },
    TIKTOK: { views: 0.5, engagementRate: 0.5 },
    NAVER_PLACE: { views: 0.5, conversionRate: 0.5 },
    BLOG: { views: 0.5, engagementRate: 0.5 },
    GA4_FUNNEL: { acquisition: 0.25, engagement: 0.25, conversionRate: 0.3, bounceRate: 0.1, avgSessionDuration: 0.1 },
    META_ADS: { roas: 0.4, ctr: 0.25, cpm: 0.15, conversionRate: 0.2 },
    SNS_COMMUNITY: { engagementRate: 0.4, reach: 0.3, sentimentScore: 0.3 }
  }
  
  const channelWeights = weights[channel] || {}
  
  for (const metricScore of metricScores) {
    const weight = channelWeights[metricScore.metricType] || 1.0 / metricScores.length
    totalScore += metricScore.score * weight
    totalWeight += weight
  }
  
  const finalScore = totalWeight > 0 ? Math.round(totalScore / totalWeight) : 0
  
  // 상세 내역 생성
  const breakdown = metricScores
    .map(m => `${m.metricType}: ${m.value} → ${m.score}점 (${m.range?.label || 'N/A'})`)
    .join(' | ')
  
  return {
    totalScore: finalScore,
    metricScores,
    breakdown
  }
}

/**
 * 메트릭 값을 벤치마크 기준으로 정규화 (0-100점)
 * @deprecated 실제 메트릭 값 기반 계산을 위해 calculateScoreFromMetricValue 사용 권장
 */
function normalizeMetric(
  value: number,
  benchmark: BenchmarkTiers,
  inverse: boolean = false
): number {
  // 실제 구현에서는 각 메트릭별 최대값/최소값 기준으로 정규화
  // 여기서는 간단히 벤치마크 티어 기준으로 선형 보간
  
  if (inverse) {
    // CAC 같은 경우 낮을수록 좋음
    // 값이 낮으면 점수가 높아야 함
    const normalized = 100 - ((value / benchmark.top1Percent) * 100)
    return Math.max(0, Math.min(100, normalized))
  }
  
  // 일반 메트릭: 값이 높으면 점수가 높음
  const normalized = (value / benchmark.top1Percent) * 100
  return Math.max(0, Math.min(100, normalized))
}
