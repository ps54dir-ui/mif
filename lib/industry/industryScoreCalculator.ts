/**
 * 업종별 점수 계산 시스템
 * 업종별 메트릭 가중치를 적용하여 종합 점수 계산
 */

import { IndustryType, getIndustryConfig, normalizeMetricWeights, normalizeChannelWeights } from '@/data/industries/industryConfig'
import { calculateIndustryMetricScore } from '@/data/benchmarks/industryBenchmarks'

export interface IndustryMetricValue {
  metricName: string
  value: number
}

export interface IndustryScoreBreakdown {
  metric: string
  value: number
  score: number
  weight: number
  weightedScore: number
  tier: string | null
  percentile: number
}

export interface IndustryScoreResult {
  totalScore: number // 0-100
  breakdown: IndustryScoreBreakdown[]
  industry: IndustryType
  industryName: string
  primaryGoal: string
  topStrengths: Array<{ metric: string; score: number }>
  topWeaknesses: Array<{ metric: string; score: number }>
  recommendations: string[]
}

/**
 * 업종별 종합 점수 계산
 */
export function calculateIndustryScore(
  industry: IndustryType,
  metrics: IndustryMetricValue[]
): IndustryScoreResult {
  const config = getIndustryConfig(industry)
  if (!config) {
    throw new Error(`업종 설정을 찾을 수 없습니다: ${industry}`)
  }

  // 메트릭 가중치 정규화
  const normalizedMetrics = normalizeMetricWeights(config.metrics)
  
  // 각 메트릭의 점수 계산
  const breakdown: IndustryScoreBreakdown[] = []
  let totalWeightedScore = 0
  let totalWeight = 0

  metrics.forEach(metricValue => {
    const metricConfig = normalizedMetrics.find(m => m.benchmarkKey === metricValue.metricName)
    if (!metricConfig) return

    // 벤치마크로부터 점수 계산
    const { score, tier } = calculateIndustryMetricScore(
      industry,
      metricValue.metricName,
      metricValue.value
    )

    const weight = metricConfig.weight
    const weightedScore = (score * weight) / 100

    breakdown.push({
      metric: metricConfig.name,
      value: metricValue.value,
      score,
      weight,
      weightedScore,
      tier: tier?.label || null,
      percentile: tier?.percentile || 0
    })

    totalWeightedScore += weightedScore
    totalWeight += weight
  })

  // 종합 점수 계산 (가중 평균)
  const totalScore = totalWeight > 0 
    ? Math.round((totalWeightedScore / totalWeight) * 100)
    : 0

  // 강점/약점 분석
  const sortedBreakdown = [...breakdown].sort((a, b) => b.score - a.score)
  const topStrengths = sortedBreakdown
    .slice(0, 3)
    .map(item => ({ metric: item.metric, score: item.score }))
  const topWeaknesses = sortedBreakdown
    .slice(-3)
    .reverse()
    .map(item => ({ metric: item.metric, score: item.score }))

  // 추천사항 생성
  const recommendations = generateRecommendations(industry, breakdown, config)

  return {
    totalScore,
    breakdown,
    industry,
    industryName: config.name,
    primaryGoal: config.primaryGoal,
    topStrengths,
    topWeaknesses,
    recommendations
  }
}

/**
 * 업종별 추천사항 생성
 */
function generateRecommendations(
  industry: IndustryType,
  breakdown: IndustryScoreBreakdown[],
  config: ReturnType<typeof getIndustryConfig>
): string[] {
  const recommendations: string[] = []

  // 낮은 점수 메트릭에 대한 추천
  const lowScoreMetrics = breakdown
    .filter(item => item.score < 60)
    .sort((a, b) => a.score - b.score)
    .slice(0, 3)

  lowScoreMetrics.forEach(item => {
    const metricConfig = config.metrics.find(m => m.name === item.metric)
    if (metricConfig) {
      recommendations.push(
        `${item.metric} 점수가 낮습니다 (${item.score}점). ${metricConfig.description} 개선이 필요합니다.`
      )
    }
  })

  // 업종별 특화 추천
  switch (industry) {
    case 'ecommerce':
      const cvrMetric = breakdown.find(item => item.metric.includes('전환율'))
      if (cvrMetric && cvrMetric.score < 70) {
        recommendations.push(
          '전환율 개선을 위해 상품 페이지 최적화, 장바구니 이탈 방지 전략, A/B 테스트를 실시하세요.'
        )
      }
      break

    case 'saas':
      const leadMetric = breakdown.find(item => item.metric.includes('리드'))
      if (leadMetric && leadMetric.score < 70) {
        recommendations.push(
          '리드 생성률 개선을 위해 문제 해결형 콘텐츠, 랜딩 페이지 최적화, 무료 체험 강조를 실시하세요.'
        )
      }
      break

    case 'local_business':
      const rankingMetric = breakdown.find(item => item.metric.includes('순위'))
      if (rankingMetric && rankingMetric.score < 70) {
        recommendations.push(
          '지역 검색 순위 개선을 위해 Google My Business 최적화, 지역 키워드 콘텐츠, 리뷰 관리에 집중하세요.'
        )
      }
      break

    case 'food_beverage':
      const reviewMetric = breakdown.find(item => item.metric.includes('리뷰'))
      if (reviewMetric && reviewMetric.score < 70) {
        recommendations.push(
          '리뷰 관리 개선을 위해 고품질 음식 사진, 리뷰 수집 전략, 리뷰 답변을 강화하세요.'
        )
      }
      break
  }

  return recommendations.slice(0, 5) // 최대 5개
}

/**
 * 업종별 채널 점수 계산 (채널 우선순위 반영)
 */
export function calculateIndustryChannelScore(
  industry: IndustryType,
  channelScores: Record<string, number> // 채널명: 점수
): {
  totalChannelScore: number
  weightedChannelScore: number
  breakdown: Array<{
    channel: string
    score: number
    priority: number
    weight: number
    weightedScore: number
  }>
} {
  const config = getIndustryConfig(industry)
  if (!config) {
    throw new Error(`업종 설정을 찾을 수 없습니다: ${industry}`)
  }

  // 채널 가중치 정규화
  const normalizedChannels = normalizeChannelWeights(config.channelPriorities)

  const breakdown: Array<{
    channel: string
    score: number
    priority: number
    weight: number
    weightedScore: number
  }> = []

  let totalWeightedScore = 0
  let totalWeight = 0

  normalizedChannels.forEach(channelConfig => {
    const score = channelScores[channelConfig.channel] || 0
    const weight = channelConfig.weight
    const weightedScore = (score * weight) / 100

    breakdown.push({
      channel: channelConfig.channel,
      score,
      priority: channelConfig.priority,
      weight,
      weightedScore
    })

    totalWeightedScore += weightedScore
    totalWeight += weight
  })

  // 평균 점수
  const totalChannelScore = Object.values(channelScores).reduce((sum, score) => sum + score, 0) / Object.keys(channelScores).length

  // 가중 평균 점수
  const weightedChannelScore = totalWeight > 0
    ? Math.round((totalWeightedScore / totalWeight) * 100)
    : 0

  return {
    totalChannelScore: Math.round(totalChannelScore),
    weightedChannelScore,
    breakdown
  }
}

/**
 * 업종별 최적 채널 추천
 */
export function getRecommendedChannels(
  industry: IndustryType,
  limit: number = 5
): Array<{
  channel: string
  priority: number
  weight: number
  description: string
}> {
  const config = getIndustryConfig(industry)
  if (!config) return []

  return config.channelPriorities
    .sort((a, b) => b.priority - a.priority)
    .slice(0, limit)
    .map(channel => ({
      channel: channel.channel,
      priority: channel.priority,
      weight: channel.weight,
      description: channel.description
    }))
}
