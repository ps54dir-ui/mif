/**
 * 벤치마킹 데이터 로더
 * 모든 채널의 벤치마크 데이터를 로드하고 관리
 */

import { INDUSTRY_BENCHMARKS, BenchmarkTier } from '../benchmarks'

export type ChannelName = 
  | 'organic_search'
  | 'naver_place'
  | 'youtube'
  | 'meta_ads'
  | 'ga4_funnel'
  | 'sem'
  | 'email'
  | 'social_media'

export interface ChannelBenchmarkData {
  channel: ChannelName
  metrics: Record<string, BenchmarkTier[]>
  dataSource: string
  lastUpdated: string
  description: string
}

/**
 * 채널별 벤치마크 데이터 로드
 */
export function loadBenchmarks(channel: ChannelName): ChannelBenchmarkData | null {
  const channelData = INDUSTRY_BENCHMARKS[channel]
  
  if (!channelData) {
    return null
  }
  
  // 데이터 출처 정보
  const dataSources: Record<ChannelName, string> = {
    organic_search: 'Google Search Console, Ahrefs, SEMrush 업계 리포트 (2024)',
    naver_place: '네이버 비즈니스 플랫폼 공식 데이터, 업계 벤치마크 (2024)',
    youtube: 'YouTube Analytics 공식 데이터, Social Blade 업계 리포트 (2024)',
    meta_ads: 'Meta Ads Manager 공식 데이터, 업계 벤치마크 (2024)',
    ga4_funnel: 'Google Analytics 4 공식 데이터, 업계 벤치마크 (2024)',
    sem: 'Google Ads 공식 데이터, 업계 벤치마크 (2024)',
    email: 'Mailchimp, SendGrid 업계 리포트 (2024)',
    social_media: 'Hootsuite, Sprout Social 업계 리포트 (2024)'
  }
  
  const descriptions: Record<ChannelName, string> = {
    organic_search: '유기 검색 트래픽 및 SEO 성과 벤치마크',
    naver_place: '네이버 플레이스 검색 노출 및 전환 벤치마크',
    youtube: 'YouTube 채널 성장 및 참여도 벤치마크',
    meta_ads: '메타 광고 성과 및 ROAS 벤치마크',
    ga4_funnel: 'GA4 퍼널 분석 및 전환 벤치마크',
    sem: '검색 광고 성과 및 CPC 벤치마크',
    email: '이메일 마케팅 오픈율 및 클릭률 벤치마크',
    social_media: '소셜 미디어 참여도 및 도달 벤치마크'
  }
  
  return {
    channel,
    metrics: channelData,
    dataSource: dataSources[channel] || '업계 벤치마크 데이터',
    lastUpdated: '2024-01-01',
    description: descriptions[channel] || ''
  }
}

/**
 * 모든 채널의 벤치마크 로드
 */
export function loadAllBenchmarks(): Record<ChannelName, ChannelBenchmarkData> {
  const channels: ChannelName[] = [
    'organic_search',
    'naver_place',
    'youtube',
    'meta_ads',
    'ga4_funnel',
    'sem',
    'email',
    'social_media'
  ]
  
  const result: Record<string, ChannelBenchmarkData> = {}
  
  channels.forEach(channel => {
    const data = loadBenchmarks(channel)
    if (data) {
      result[channel] = data
    }
  })
  
  return result as Record<ChannelName, ChannelBenchmarkData>
}

/**
 * 특정 메트릭의 벤치마크 티어 찾기
 */
export function findMetricBenchmark(
  channel: ChannelName,
  metricName: string,
  value: number
): {
  tier: BenchmarkTier | null
  score: number
  percentile: number
  gapToNext: number
} {
  const benchmarks = loadBenchmarks(channel)
  if (!benchmarks || !benchmarks.metrics[metricName]) {
    return { tier: null, score: 0, percentile: 0, gapToNext: 0 }
  }
  
  const tiers = benchmarks.metrics[metricName]
  
  // 값에 해당하는 티어 찾기
  for (let i = 0; i < tiers.length; i++) {
    const tier = tiers[i]
    if (typeof tier.value === 'number') {
      if (value >= tier.value) {
        const nextTier = i > 0 ? tiers[i - 1] : null
        const gapToNext = nextTier && typeof nextTier.value === 'number'
          ? nextTier.value - value
          : 0
        
        return {
          tier,
          score: tier.percentile, // percentile을 score로 사용
          percentile: tier.percentile,
          gapToNext
        }
      }
    }
  }
  
  // 가장 낮은 티어
  const lowestTier = tiers[tiers.length - 1]
  return {
    tier: lowestTier,
    score: lowestTier.percentile, // percentile을 score로 사용
    percentile: lowestTier.percentile,
    gapToNext: 0
  }
}
